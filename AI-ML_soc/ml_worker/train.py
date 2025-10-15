import os
import time
import json
import logging
import numpy as np
import re
from sklearn.ensemble import IsolationForest
import joblib
from elasticsearch import Elasticsearch

# --- Configuration ---
ELASTICSEARCH_URL = os.environ.get("ELASTICSEARCH_URL", "http://localhost:9200")
ES_INDEX_NAME = "processed_logs"
MODEL_PATH = os.environ.get("MODEL_PATH", "/app/isolation_forest.joblib")

# --- Logging Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
ANOMALY_KEYWORDS = os.environ.get("ANOMALY_KEYWORDS", "error,failed,denied,exception,attack,unauthorized").split(',')

def feature_engineering(log):
    """
    Transforms a raw log from Elasticsearch into a feature vector.
    This MUST be identical to the feature engineering in model.py.
    """
    message = log.get("message", "").lower()
    timestamp = log.get("timestamp", time.time())
    dt_object = time.gmtime(timestamp)

    log_length = len(message)
    keyword_count = sum(1 for keyword in ANOMALY_KEYWORDS if keyword in message)
    hour_of_day = dt_object.tm_hour
    is_weekend = dt_object.tm_wday >= 5
    numerical_count = len(re.findall(r'\d+', message))
    has_ip = 1 if log.get("source_ip") else 0

    return [log_length, keyword_count, hour_of_day, is_weekend, numerical_count, has_ip]

def train_model():
    """
    Fetches data from Elasticsearch, trains an Isolation Forest model,
    and saves it to disk.
    """
    logger.info("Starting model training process...")
    try:
        es = Elasticsearch(hosts=[ELASTICSEARCH_URL])
        if not es.ping():
            logger.error("Could not connect to Elasticsearch. Aborting training.")
            return

        # Fetch a sample of recent logs to train on (e.g., last 10,000)
        res = es.search(
            index=ES_INDEX_NAME,
            query={"match_all": {}},
            size=10000,
            sort=[{"timestamp": {"order": "desc"}}]
        )
        logs = [hit["_source"] for hit in res["hits"]["hits"]]

        if len(logs) < 100:
            logger.warning(f"Not enough data to train model (found {len(logs)} logs). Need at least 100.")
            return

        logger.info(f"Fetched {len(logs)} logs for training.")

        # Create feature matrix
        X_train = np.array([feature_engineering(log) for log in logs])

        # Train the Isolation Forest model
        model = IsolationForest(contamination='auto', random_state=42)
        model.fit(X_train)

        # Save the trained model
        joblib.dump(model, MODEL_PATH)
        logger.info(f"Successfully trained and saved model to {MODEL_PATH}")

    except Exception as e:
        logger.error(f"An error occurred during model training: {e}", exc_info=True)

if __name__ == "__main__":
    train_model()