from elasticsearch import AsyncElasticsearch
from confluent_kafka import Consumer, Producer, schema_registry
from confluent_kafka.avro import SerializerError
from confluent_kafka.schema_registry.avro import AvroDeserializer
from confluent_kafka import Producer
import json
import os
import re
from redis.asyncio import Redis
import logging
import asyncio, time
from typing import Optional, Dict, Any
import numpy as np
import joblib
from datetime import datetime, timedelta
import geoip2.database
from sklearn.ensemble import IsolationForest # type: ignore
from sklearn.preprocessing import StandardScaler
import pandas as pd
import shap

# --- Logging Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
# Silence the noisy elasticsearch connection logs during startup retries
logging.getLogger("elastic_transport.node_pool").setLevel(logging.WARNING)
logging.getLogger("elastic_transport.transport").setLevel(logging.WARNING)

# A simple regex to find the first IP address in a string
IP_REGEX = re.compile(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b')
MODEL_PATH = os.environ.get("MODEL_PATH", "/app/isolation_forest.joblib")
SCHEMA_REGISTRY_URL = os.environ.get("SCHEMA_REGISTRY_URL", "http://localhost:8081")
GEOIP_DB_PATH = os.environ.get("GEOIP_DB_PATH", "/app/GeoLite2-City.mmdb")

# --- Configuration ---
KAFKA_BROKER = os.environ.get("KAFKA_BROKER", "localhost:9092")
ELASTICSEARCH_URL = os.environ.get("ELASTICSEARCH_URL", "http://localhost:9200")
KAFKA_LOGS_TOPIC = "logs"
KAFKA_ALERTS_TOPIC = "high-priority-alerts"
REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379")
ES_INDEX_NAME = "processed_logs"
CONFIG_UPDATES_TOPIC = "config-updates"

# --- Model and GeoIP ---
model = None
geoip_reader = None
explainer = None

# Load configurable values from environment variables
ANOMALY_KEYWORDS = os.environ.get("ANOMALY_KEYWORDS", "error,failed,denied,exception,attack,unauthorized").split(',')
WHITELISTED_IPS = set(os.environ.get("WHITELISTED_IPS", "192.168.1.100,10.0.0.1").split(','))
ENABLE_SHAP = os.environ.get("ENABLE_SHAP", "false").lower() == "true"

# Define which anomaly reasons are considered high-priority enough to send a real-time alert
HIGH_PRIORITY_REASON_PREFIXES = [
    "Threat Intelligence Hit",
    "High Anomaly Score",
    "Log from blocked IP",
]

def load_model():
    """Loads the trained Isolation Forest model from disk."""
    global model
    try:
        if os.path.exists(MODEL_PATH):
            model = joblib.load(MODEL_PATH)
            logger.info(f"Successfully loaded model from {MODEL_PATH}")
        else:
            logger.warning(f"Model file not found at {MODEL_PATH}. Anomaly detection will be degraded.")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")

def load_geoip_db():
    """Loads the GeoIP2 database from disk."""
    global geoip_reader
    try:
        if os.path.exists(GEOIP_DB_PATH):
            geoip_reader = geoip2.database.Reader(GEOIP_DB_PATH)
            logger.info(f"Successfully loaded GeoIP database from {GEOIP_DB_PATH}")
        else:
            logger.warning(f"GeoIP DB not found at {GEOIP_DB_PATH}. IP enrichment will be disabled.")
    except Exception as e:
        logger.error(f"Failed to load GeoIP database: {e}")

def handle_config_update(log_data: dict):
    """Updates the in-memory IP whitelist based on a config message."""
    update_action = log_data.get("action")
    ip_to_update = log_data.get("ip")
    if update_action == "add" and ip_to_update:
        WHITELISTED_IPS.add(ip_to_update)
        logger.info(f"Added '{ip_to_update}' to whitelist. Current whitelist size: {len(WHITELISTED_IPS)}")
    elif update_action == "remove" and ip_to_update in WHITELISTED_IPS:
        WHITELISTED_IPS.remove(ip_to_update)
        logger.info(f"Removed '{ip_to_update}' from whitelist. Current whitelist size: {len(WHITELISTED_IPS)}")

def extract_features(log: Dict[str, Any]) -> np.ndarray:
    """
    Extracts features from a log entry for ML prediction.
    """
    message = log.get("message", "")
    timestamp = log.get("timestamp", int(time.time()))

    # Basic features
    message_length = len(message)
    hour_of_day = datetime.fromtimestamp(timestamp).hour
    day_of_week = datetime.fromtimestamp(timestamp).weekday()
    is_weekend = 1 if day_of_week >= 5 else 0
    payload_size = message_length  # Approximate payload size

    # Simplified event rate (placeholder, can be enhanced with Redis query)
    event_rate_5min = 1.0  # Default, in real implementation query Redis for recent counts

    # Additional features (can be expanded)
    has_ip = 1 if IP_REGEX.search(message) else 0
    keyword_count = sum(1 for keyword in ANOMALY_KEYWORDS if keyword in message.lower())

    features = np.array([
        message_length,
        hour_of_day,
        day_of_week,
        is_weekend,
        payload_size,
        event_rate_5min,
        has_ip,
        keyword_count
    ]).reshape(1, -1)

    return features

async def analyze_log(log: Dict[str, Any], redis_client: Redis) -> dict:
    """
    Analyzes a log message for anomalies and returns an analysis dictionary.
    """
    message = log.get("message", "")
    ip_match = IP_REGEX.search(message)
    ip_address = ip_match.group(0) if ip_match else None

    # --- Threat Intelligence & Whitelist Overrides ---
    if ip_address and await redis_client.sismember("blocked_ips", ip_address):
        logger.warning(f"Log received from a blocked IP: {ip_address}. Flagging as anomaly.")
        return {"is_anomaly": True, "reason": f"Threat Intelligence Hit: Log from known bad IP {ip_address}.", "source_ip": ip_address, "geo": None}

    if ip_address and ip_address in WHITELISTED_IPS:
        logger.info(f"IP {ip_address} is whitelisted. Ignoring anomaly check.")
        return {"is_anomaly": False, "reason": f"IP {ip_address} is whitelisted.", "source_ip": ip_address, "geo": None}

    # --- GeoIP Enrichment ---
    geo_info = None
    if geoip_reader and ip_address:
        try:
            response = geoip_reader.city(ip_address)
            geo_info = {
                "city": response.city.name,
                "country": response.country.name,
            }
        except Exception:
            pass # Ignore if IP is not in the database

    # --- ML-based Anomaly Detection ---
    if not model:
        # Fallback to keyword detection if model is not loaded
        is_keyword_anomaly = any(keyword in message.lower() for keyword in ANOMALY_KEYWORDS)
        if is_keyword_anomaly:
            logger.warning("ML model not loaded, falling back to keyword detection. Found anomaly.")
            return {"is_anomaly": True, "reason": "Keyword Detected (ML model not loaded)", "source_ip": ip_address, "geo": geo_info}
        else:
            return {"is_anomaly": False, "reason": "Normal (ML model not loaded)", "source_ip": ip_address, "geo": geo_info}

    # Extract features and predict with Isolation Forest
    features = extract_features(log)
    try:
        score = model.decision_function(features)[0]  # Anomaly score: negative = anomaly
        prediction = model.predict(features)[0]  # -1 = anomaly, 1 = normal
        is_anomaly = prediction == -1

        # Add SHAP explanation if enabled
        if ENABLE_SHAP and explainer and is_anomaly:
            try:
                shap_values = explainer.shap_values(features)
                feature_names = ['message_length', 'hour_of_day', 'day_of_week', 'is_weekend', 'payload_size', 'event_rate_5min', 'has_ip', 'keyword_count']
                top_features = sorted(zip(feature_names, shap_values[0]), key=lambda x: abs(x[1]), reverse=True)[:3]
                explanation = "; ".join([f"{name}: {val:.2f}" for name, val in top_features])
                reason = f"High Anomaly Score ({score:.2f}) - Key factors: {explanation}"
            except Exception as shap_e:
                logger.warning(f"SHAP explanation failed: {shap_e}")
                reason = f"High Anomaly Score ({score:.2f})"
        else:
            reason = f"High Anomaly Score ({score:.2f})" if is_anomaly else f"Normal Score ({score:.2f})"
    except Exception as e:
        logger.error(f"Error during ML prediction: {e}")
        is_anomaly = False
        reason = "ML Prediction Error"

    return {
        "is_anomaly": is_anomaly,
        "reason": reason,
        "source_ip": ip_address,
        "geo": geo_info
    }

async def train_model(es_client: AsyncElasticsearch):
    """
    Trains the Isolation Forest model using historical logs from Elasticsearch.
    """
    global model
    try:
        # Query historical logs (last 30 days, up to 10,000)
        query = {
            "query": {
                "range": {
                    "timestamp": {
                        "gte": int((datetime.now() - timedelta(days=30)).timestamp()),
                        "lte": int(time.time())
                    }
                }
            },
            "size": 10000,
            "sort": [{"timestamp": "desc"}]
        }
        response = await es_client.search(index=ES_INDEX_NAME, body=query)
        logs = [hit["_source"] for hit in response["hits"]["hits"]]

        if len(logs) < 100:
            logger.warning(f"Insufficient data for training: {len(logs)} logs. Skipping training.")
            return

        # Extract features
        features_list = []
        for log in logs:
            features = extract_features(log)
            features_list.append(features.flatten())

        X = np.array(features_list)

        # Train Isolation Forest
        contamination = min(0.1, len([l for l in logs if l.get("is_anomaly", False)]) / len(logs))  # Estimate contamination
        model = IsolationForest(n_estimators=100, contamination=contamination, random_state=42)
        model.fit(X)

        # Create SHAP explainer if enabled
        global explainer
        if ENABLE_SHAP:
            try:
                explainer = shap.TreeExplainer(model)
                logger.info("SHAP explainer created successfully.")
            except Exception as e:
                logger.warning(f"Failed to create SHAP explainer: {e}")

        # Save model
        joblib.dump(model, MODEL_PATH)
        logger.info(f"Model trained on {len(logs)} logs with contamination {contamination:.2f}. Saved to {MODEL_PATH}.")

    except Exception as e:
        logger.error(f"Error training model: {e}")

async def periodic_training(es_client: AsyncElasticsearch):
    """
    Runs model training periodically (daily at midnight).
    """
    while True:
        now = datetime.now()
        midnight = now.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
        seconds_until_midnight = (midnight - now).total_seconds()
        await asyncio.sleep(seconds_until_midnight)
        logger.info("Starting daily model retraining...")
        await train_model(es_client)

async def connect_with_retry(connect_func, service_name, max_retries=15, delay=5):
    """Tries to connect to a service with an async retry mechanism."""
    for i in range(max_retries):
        try:
            logger.info(f"Attempting to connect to {service_name}...")
            connection = await connect_func()
            logger.info(f"Successfully connected to {service_name}.")
            return connection
        except Exception as e:
            logger.warning(f"Failed to connect to {service_name}: {e}. Retrying in {delay}s... ({i+1}/{max_retries})")
            await asyncio.sleep(delay)
    logger.error(f"Could not connect to {service_name} after {max_retries} retries. Exiting.")
    exit(1)

logger.info("ML Worker starting...")
load_model() # Load the model on startup
load_geoip_db() # Load the GeoIP database on startup

async def main():
    # Define async connection functions
    async def connect_es():
        es_client = AsyncElasticsearch(hosts=[ELASTICSEARCH_URL])
        await es_client.ping()
        return es_client

    async def connect_redis():
        redis_client = Redis.from_url(REDIS_URL, decode_responses=True)
        await redis_client.ping()
        return redis_client

    def connect_kafka_consumer():
        topics = [KAFKA_LOGS_TOPIC, CONFIG_UPDATES_TOPIC]
        consumer_conf = {
            'bootstrap.servers': KAFKA_BROKER,
            'group.id': 'ml-group',
            'auto.offset.reset': 'earliest'
        }
        # Use a standard Consumer to handle mixed message formats (Avro and JSON)
        consumer = Consumer(consumer_conf)
        consumer.subscribe(topics)
        return consumer

    def connect_kafka_producer():
        producer_conf = {
            'bootstrap.servers': KAFKA_BROKER
        }
        # Use a standard Producer for sending JSON messages
        return Producer(producer_conf)

    # Wrap all connections and setup in a single retry block for robustness
    async def connect_and_setup_kafka():
        # Establish connections first
        es = await connect_es()
        redis_cli = await connect_redis()
        
        # Now perform setup that depends on connections
        consumer_conn = await asyncio.to_thread(connect_kafka_consumer)
        producer_conn = await asyncio.to_thread(connect_kafka_producer)
        return es, redis_cli, consumer_conn, producer_conn

    es, redis_client, consumer, producer = await connect_with_retry(connect_and_setup_kafka, "All Services")

    # Create an Avro deserializer for the 'logs' topic
    schema_registry_conf = {'url': SCHEMA_REGISTRY_URL}
    schema_registry_client = schema_registry.SchemaRegistryClient(schema_registry_conf)
    avro_deserializer = AvroDeserializer(schema_registry_client)

    # Start periodic training task
    asyncio.create_task(periodic_training(es))

    logger.info("ML Worker connected to all services. Waiting for messages...")

    try:
        while True:
            msg = await asyncio.to_thread(consumer.poll, 1.0)
            if msg is None:
                continue
            if msg.error():
                logger.error(f"AvroConsumer error: {msg.error()}")
                continue

            try:
                topic = msg.topic()
                log_data = None

                if topic == KAFKA_LOGS_TOPIC:
                    try:
                        log_data = avro_deserializer(msg.value(), None)
                    except SerializerError as e:
                        logger.error(f"Avro deserialization failed for topic {topic}: {e}")
                        continue
                elif topic == CONFIG_UPDATES_TOPIC:
                    try:
                        log_data = json.loads(msg.value().decode('utf-8'))
                    except (json.JSONDecodeError, AttributeError, UnicodeDecodeError):
                        logger.warning(f"Could not decode JSON from config-updates topic. Value: {msg.value()}")
                        continue

                if topic == CONFIG_UPDATES_TOPIC and log_data:
                    handle_config_update(log_data)
                elif topic == KAFKA_LOGS_TOPIC and log_data and log_data.get("message"):
                    analysis = await analyze_log(log_data, redis_client)

                    # Create the document for Elasticsearch, preserving the original message
                    processed_document = {
                        "message": log_data.get("message"),
                        "timestamp": int(time.time()),
                        "status": "new",
                        "is_anomaly": analysis["is_anomaly"],
                        "reason": analysis["reason"],
                        "source_ip": analysis["source_ip"],
                        "user_id": log_data.get("user_id"),
                        "event_type": log_data.get("event_type"),
                        "geo": analysis.get("geo")
                    }

                    # Index the document in Elasticsearch
                    await es.index(index=ES_INDEX_NAME, document=processed_document)
                    logger.info(f"Processed log. Anomaly: {analysis['is_anomaly']}. Reason: {analysis['reason']}")

                    # If it's a high-priority alert, publish it to the alerts topic
                    is_high_priority = any(analysis["reason"].startswith(prefix) for prefix in HIGH_PRIORITY_REASON_PREFIXES)

                    if analysis["is_anomaly"] and is_high_priority:
                        # The producer is sync, so we run it in a thread
                        await asyncio.to_thread(producer.produce, topic=KAFKA_ALERTS_TOPIC, value=json.dumps(processed_document).encode('utf-8'))
                        logger.warning(f"Published high-priority alert to '{KAFKA_ALERTS_TOPIC}' topic. Reason: {analysis['reason']}")
            except Exception as e:
                logger.error(f"Error processing message. Topic: {topic}. Error: {e}", exc_info=True)
    finally:
        logger.info("ML Worker shutting down. Closing connections...")
        if 'consumer' in locals() and consumer: consumer.close()
        if 'producer' in locals() and producer: producer.flush()
        await asyncio.gather(
            es.close() if 'es' in locals() and es else asyncio.sleep(0)
        )
        if 'redis_client' in locals() and redis_client:
            await redis_client.aclose() # Use the async close method

        logger.info("ML Worker shutdown complete.")

if __name__ == "__main__":
    asyncio.run(main())
