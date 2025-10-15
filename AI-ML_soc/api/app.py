from fastapi import FastAPI, HTTPException, Depends, Request
from confluent_kafka.avro import AvroProducer
from confluent_kafka import Producer as JsonProducer
from elasticsearch import AsyncElasticsearch
import redis.asyncio as redis
import json
import os
import asyncio, time
from pydantic import BaseModel, Field, validator
from datetime import datetime
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse, StreamingResponse
from typing import List, Optional, Dict
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
import io
import base64
import matplotlib.pyplot as plt
import matplotlib

# --- Configuration ---
KAFKA_BROKER = os.environ.get("KAFKA_BROKER", "localhost:9092")
REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379")
SCHEMA_REGISTRY_URL = os.environ.get("SCHEMA_REGISTRY_URL", "http://localhost:8081")
ELASTICSEARCH_URL = os.environ.get("ELASTICSEARCH_URL", "http://localhost:9200")
FRONTEND_ORIGINS = os.environ.get("FRONTEND_ORIGIN", "http://localhost:3000").split(',')
KAFKA_LOGS_TOPIC = "logs"
ES_INDEX_NAME = "processed_logs"
CONFIG_UPDATES_TOPIC = "config-updates"
KAFKA_ALERTER_CONFIG_TOPIC = "alerter-config-updates"
INITIAL_WHITELISTED_IPS = set(os.environ.get("WHITELISTED_IPS", "192.168.1.100,10.0.0.1").split(','))

# --- Global Connection Handlers --- (Note: AvroProducer is synchronous)
avro_kafka_producer: Optional[AvroProducer] = None
json_kafka_producer: Optional[JsonProducer] = None
es_client: Optional[AsyncElasticsearch] = None
redis_client: Optional[redis.Redis] = None
whitelisted_ips: set = INITIAL_WHITELISTED_IPS

# --- Get the absolute path of the current script's directory ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# --- Matplotlib configuration for headless server ---
matplotlib.use('Agg')

# --- Rate Limiter ---
limiter = Limiter(key_func=get_remote_address)


BLOCKLIST_REDIS_KEY = "blocked_ips"
WEBHOOK_CONFIG_REDIS_KEY = "webhook_config"

def get_avro_kafka_producer() -> AvroProducer:
    if avro_kafka_producer is None:
        raise HTTPException(status_code=503, detail="Avro Kafka producer is not available.")
    return avro_kafka_producer

def get_json_kafka_producer() -> JsonProducer:
    if json_kafka_producer is None:
        raise HTTPException(status_code=503, detail="JSON Kafka producer is not available.")
    return json_kafka_producer

async def get_es_client() -> AsyncElasticsearch:
    if es_client is None:
        raise HTTPException(status_code=503, detail="Elasticsearch client is not available.")
    return es_client

async def get_redis_client() -> redis.Redis:
    if redis_client is None:
        raise HTTPException(status_code=503, detail="Redis client is not available.")
    return redis_client

# --- FastAPI App Setup ---

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True, # Allows cookies to be included in cross-origin requests
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

@app.middleware("http")
async def block_ip_middleware(request: Request, call_next):
    """Middleware to block requests from IPs in the Redis blocklist."""
    client_ip = request.client.host
    if redis_client and await redis_client.sismember(BLOCKLIST_REDIS_KEY, client_ip):
        print(f"API: Denying request from blocked IP: {client_ip}")
        return JSONResponse(status_code=403, content={"detail": f"IP address {client_ip} is blocked."})
    
    response = await call_next(request)
    return response

async def ensure_es_index_exists(client: AsyncElasticsearch, index_name: str):
    """Checks if an Elasticsearch index exists and creates it if it doesn't."""
    try:
        if not await client.indices.exists(index=index_name):
            print(f"API: Index '{index_name}' not found. Creating it with mappings...")
            mappings = {
                "properties": {
                    "message": {"type": "text"},
                    "timestamp": {"type": "date", "format": "epoch_second"},
                    "status": {"type": "keyword"},
                    "is_anomaly": {"type": "boolean"},
                    "reason": {
                        "type": "text",
                        "fields": {
                            "keyword": {
                                "type": "keyword",
                                "ignore_above": 256
                            }
                        }
                    },
                    "source_ip": {"type": "ip"},
                    "user_id": {"type": "keyword"},
                    "event_type": {"type": "keyword"},
                    "geo": {
                        "properties": {
                            "city": {"type": "keyword"},
                            "country": {"type": "keyword"}
                        }
                    }
                }
            }
            await client.indices.create(index=index_name, mappings=mappings)
            print(f"API: Index '{index_name}' created with explicit mappings.")
    except Exception as e:
        print(f"API: Error checking or creating index '{index_name}': {e}")

async def connect_with_retry(connect_func, service_name, max_retries=15, delay=5):
    """Tries to connect to a service with an async retry mechanism."""
    for i in range(max_retries):
        try:
            print(f"API: Attempting to connect to {service_name}...")
            return await connect_func()
        except Exception as e:
            print(f"API: Failed to connect to {service_name}: {e}. Retrying in {delay}s... ({i+1}/{max_retries})")
            await asyncio.sleep(delay)
    print(f"API: Could not connect to {service_name} after {max_retries} retries. Exiting.")
    exit(1)

@app.on_event("startup")
async def startup_event():
    global avro_kafka_producer, json_kafka_producer, es_client, redis_client
    print("API: Initializing connections...")

    def connect_kafka():
        # Load Avro schema
        schema_path = os.path.join(BASE_DIR, '..', 'common', 'schemas', 'log_schema.avsc')
        with open(schema_path, 'r') as f:
            value_schema = f.read()

        producer_conf = {
            'bootstrap.servers': KAFKA_BROKER,
            'schema.registry.url': SCHEMA_REGISTRY_URL
        }
        producer = AvroProducer(producer_conf, default_value_schema=value_schema)
        return producer

    async def connect_json_kafka():
        producer = JsonProducer({'bootstrap.servers': KAFKA_BROKER})
        return producer

    async def connect_es():
        client = AsyncElasticsearch(hosts=[ELASTICSEARCH_URL])
        await client.ping()
        return client

    async def connect_redis():
        client = redis.from_url(REDIS_URL, decode_responses=True)
        await client.ping()
        return client

    # Note: AvroProducer connection is synchronous and lazy, so we don't need async retry here.
    # We will wrap it in an async function to fit the pattern.
    avro_kafka_producer = await connect_with_retry(lambda: asyncio.to_thread(connect_kafka), "Avro Kafka Producer")
    json_kafka_producer = await connect_with_retry(connect_json_kafka, "JSON Kafka Producer")

    es_client = await connect_with_retry(connect_es, "Elasticsearch")
    redis_client = await connect_with_retry(connect_redis, "Redis")

    # Ensure the index exists after connecting to Elasticsearch
    await ensure_es_index_exists(es_client, ES_INDEX_NAME)

    print("API: Connections established successfully.")

@app.on_event("shutdown")
async def shutdown_event():
    print("API: Closing connections...")
    if avro_kafka_producer: avro_kafka_producer.flush()
    if json_kafka_producer: json_kafka_producer.flush()

    await asyncio.gather(
        redis_client.close() if redis_client else asyncio.sleep(0)
    )
    print("API: Connections closed.")

# --- Pydantic Models ---
class StructuredLog(BaseModel):
    message: str
    user_id: Optional[str] = None
    event_type: Optional[str] = None
    source_ip: Optional[str] = None
    timestamp: int = Field(default_factory=lambda: int(time.time()))

class Alert(BaseModel):
    id: str = Field(..., alias='_id')
    message: str
    is_anomaly: bool
    timestamp: int
    status: str

class AlertStatusUpdate(BaseModel):
    status: str

class WhitelistIP(BaseModel):
    ip: str

class WhitelistResponse(BaseModel):
    whitelisted_ips: List[str]

class BlocklistItem(BaseModel):
    ip: str

class BlocklistResponse(BaseModel):
    blocklisted_ips: List[str]

class WebhookConfig(BaseModel):
    type: str # 'slack' or 'discord'
    url: str

class StatsResponse(BaseModel):
    attempts_blocked: int
    recent_incidents_24h: int
    uptime_pct: float = 99.9

class StatusResponse(BaseModel):
    status: str # "ALL_GOOD", "SUSPICIOUS", "INCIDENT"
    details: Dict = {}

# --- API Endpoints ---
@app.get("/")
async def read_root():
    return {"message": "SOC API is running"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/logs")
@limiter.limit("100/minute")
async def submit_log(log: StructuredLog, request: Request, producer: AvroProducer = Depends(get_avro_kafka_producer)):
    try:
        # The AvroProducer's produce method is not async
        producer.produce(topic=KAFKA_LOGS_TOPIC, value=log.dict())
        return {"status": "Log submitted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send log to Kafka: {e}")

@app.get("/alerts")
async def get_alerts(is_anomaly: bool = True, es: AsyncElasticsearch = Depends(get_es_client)):
    try:
        res = await es.search(
            index=ES_INDEX_NAME,
            query={"match": {"is_anomaly": is_anomaly}},
            ignore_unavailable=True,
            sort=[{"timestamp": {"order": "desc"}}] # Sort by most recent
        )
        results = [{"id": hit["_id"], **hit["_source"]} for hit in res["hits"]["hits"]]
        return JSONResponse(content=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to query Elasticsearch: {e}")

@app.patch("/alerts/{alert_id}")
async def update_alert_status(alert_id: str, update: AlertStatusUpdate, es: AsyncElasticsearch = Depends(get_es_client)):
    try:
        await es.update(
            index=ES_INDEX_NAME,
            id=alert_id,
            doc={"status": update.status}
        )
        return {"status": "Alert status updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update alert status: {e}")

@app.post("/alerts/resolve-all", status_code=200)
async def resolve_all_alerts(es: AsyncElasticsearch = Depends(get_es_client)):
    """Resolves all 'new' alerts by updating their status to 'resolved'."""
    try:
        query = {
            "bool": {
                "must": [
                    {"term": {"status.keyword": "new"}},
                    {"term": {"is_anomaly": True}}
                ]
            }
        }
        script = {
            "source": "ctx._source.status = 'resolved'",
            "lang": "painless"
        }
        response = await es.update_by_query(
            index=ES_INDEX_NAME, query=query, script=script
        )
        return {"status": "success", "updated_count": response.get('updated', 0)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to resolve all alerts: {e}")

@app.get("/whitelist", response_model=WhitelistResponse)
async def get_whitelist():
    return {"whitelisted_ips": sorted(list(whitelisted_ips))}

@app.post("/whitelist", status_code=201)
async def add_to_whitelist(item: WhitelistIP, producer: JsonProducer = Depends(get_json_kafka_producer)):
    if item.ip in whitelisted_ips:
        return {"status": "IP already in whitelist"}
    
    whitelisted_ips.add(item.ip)
    try:
        producer.produce(CONFIG_UPDATES_TOPIC, json.dumps({"action": "add", "ip": item.ip}).encode('utf-8'))
        return {"status": "IP added to whitelist"}
    except Exception as e:
        whitelisted_ips.remove(item.ip) # Rollback change on failure
        raise HTTPException(status_code=500, detail=f"Failed to update whitelist: {e}")

@app.delete("/whitelist/{ip}", status_code=200)
async def remove_from_whitelist(ip: str, producer: JsonProducer = Depends(get_json_kafka_producer)):
    if ip not in whitelisted_ips:
        raise HTTPException(status_code=404, detail="IP not found in whitelist")
    
    whitelisted_ips.remove(ip)
    producer.produce(CONFIG_UPDATES_TOPIC, json.dumps({"action": "remove", "ip": ip}).encode('utf-8'))
    return {"status": "IP removed from whitelist"}

@app.get("/blocklist", response_model=BlocklistResponse)
async def get_blocklist(redis: redis.Redis = Depends(get_redis_client)):
    blocked_ips = await redis.smembers(BLOCKLIST_REDIS_KEY)
    return {"blocklisted_ips": sorted(list(blocked_ips))}

@app.post("/blocklist", status_code=201)
async def add_to_blocklist(item: BlocklistItem, redis: redis.Redis = Depends(get_redis_client)):
    added_count = await redis.sadd(BLOCKLIST_REDIS_KEY, item.ip)
    if added_count == 0:
        return {"status": "IP already in blocklist"}
    print(f"API: Added IP {item.ip} to blocklist.")
    return {"status": "IP added to blocklist"}

@app.delete("/blocklist/{ip}", status_code=200)
async def remove_from_blocklist(ip: str, redis: redis.Redis = Depends(get_redis_client)):
    removed_count = await redis.srem(BLOCKLIST_REDIS_KEY, ip)
    if removed_count == 0:
        raise HTTPException(status_code=404, detail="IP not found in blocklist")
    print(f"API: Removed IP {ip} from blocklist.")
    return {"status": "IP removed from blocklist"}

@app.post("/config/webhook", status_code=200)
async def update_webhook_config(config: WebhookConfig, producer: JsonProducer = Depends(get_json_kafka_producer)):
    """Updates the webhook config, saves it to Redis, and notifies the alerter via Kafka."""
    try:
        # Save to Redis
        await redis_client.hset(WEBHOOK_CONFIG_REDIS_KEY, mapping={"type": config.type, "url": config.url})

        # Notify alerter service
        producer.produce(KAFKA_ALERTER_CONFIG_TOPIC, json.dumps({"type": "webhook_update", "webhook_type": config.type, "url": config.url}).encode('utf-8'))
        
        return {"status": "Webhook configuration update sent"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send webhook config update: {e}")

@app.get("/config/webhook", response_model=Optional[WebhookConfig])
async def get_webhook_config(redis: redis.Redis = Depends(get_redis_client)):
    """Retrieves the current webhook config from Redis."""
    config = await redis.hgetall(WEBHOOK_CONFIG_REDIS_KEY)
    if not config:
        return None # Return null if not set
    return config

@app.get("/stats", response_model=StatsResponse)
async def get_stats(es: AsyncElasticsearch = Depends(get_es_client)):
    try:
        # Calculate the Unix timestamp for 24 hours ago
        timestamp_24h_ago = int(time.time()) - (24 * 60 * 60)

        # Aggregation query for Elasticsearch
        query = {
            "size": 0,
            "aggs": {
                "attempts_blocked": {
                    "filter": { "term": { "reason.keyword": "Threat Intelligence Hit" } }
                },
                "recent_incidents_24h": {
                    "filter": {
                        "bool": {
                            "must": [
                                { "term": { "is_anomaly": True } },
                                { "range": { "timestamp": { "gte": timestamp_24h_ago } } }
                            ]
                        }
                    }
                }
            }
        }
        res = await es.search(index=ES_INDEX_NAME, **query, ignore_unavailable=True)
        
        aggregations = res.get("aggregations", {})
        attempts_blocked = aggregations.get("attempts_blocked", {}).get("doc_count", 0) 
        recent_incidents = aggregations.get("recent_incidents_24h", {}).get("doc_count", 0)

        return {
            "attempts_blocked": attempts_blocked,
            "recent_incidents_24h": recent_incidents,
            "uptime_pct": 99.9 # Static for now
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {e}")

@app.get("/status", response_model=StatusResponse)
async def get_system_status(es: AsyncElasticsearch = Depends(get_es_client)):
    try:
        query = {
            "bool": { "must": [ { "term": { "status.keyword": "new" } }, { "term": { "is_anomaly": True } } ] }
        }
        # Check for any "new" high-priority incidents (e.g., brute-force)
        res = await es.count(index=ES_INDEX_NAME, query=query, ignore_unavailable=True)
        new_incident_count = res.get('count', 0)
        return {"status": "INCIDENT" if new_incident_count > 0 else "ALL_GOOD"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get system status: {e}")

@app.get("/reports/incidents")
async def generate_incident_report(es: AsyncElasticsearch = Depends(get_es_client)):
    """
    Generates a PDF report of all 'new' incidents.
    """
    # --- Initialize Jinja2 Template Environment on-demand ---
    template_env = Environment(loader=FileSystemLoader(searchpath=BASE_DIR))

    try:
        # 1. Fetch incident details from Elasticsearch
        thirty_days_ago = int(time.time()) - (30 * 24 * 60 * 60)
        query = {
            "bool": {
                "must": [
                    { "term": { "status.keyword": "new" } },
                    { "term": { "is_anomaly": True } }
                ]
            }
        }
        res = await es.search(
            index=ES_INDEX_NAME,
            query=query,
            size=1000, # Limit report size
            sort=[{"timestamp": {"order": "desc"}}]
        )
        incidents = [hit["_source"] for hit in res["hits"]["hits"]]

        # 2. Fetch data for the chart (Top 5 incident reasons)
        chart_query = {
            "size": 0,
            "aggs": {
                "top_reasons": {
                    "terms": {
                        "field": "reason.keyword",
                        "size": 5 # Get top 5 reasons
                    }
                }
            }
        }
        chart_res = await es.search(index=ES_INDEX_NAME, **chart_query)
        # Safely get buckets to prevent KeyError if no aggregations are returned
        buckets = chart_res.get('aggregations', {}).get('top_reasons', {}).get('buckets', [])
        
        # NEW: Fetch data for top attacked IPs chart
        ip_chart_query = {
            "size": 0,
            "query": {
                "bool": {
                    "must": [
                        {"term": {"is_anomaly": True}},
                        {"exists": {"field": "source_ip"}}
                    ]
                }
            },
            "aggs": {
                "top_ips": {
                    "terms": {"field": "source_ip.keyword", "size": 5}
                }
            }
        }
        ip_chart_res = await es.search(index=ES_INDEX_NAME, **ip_chart_query)
        ip_buckets = ip_chart_res.get('aggregations', {}).get('top_ips', {}).get('buckets', [])

        # 3. Generate chart image for top reasons (pie chart)
        reason_chart_image_base64 = None
        if buckets:
            labels = [b['key'] for b in buckets]
            sizes = [b['doc_count'] for b in buckets]
            fig, ax = plt.subplots(figsize=(8, 6))
            ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90)
            ax.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.
            ax.set_title('Top 5 Incident Reasons')
            plt.tight_layout()

            buf = io.BytesIO()
            plt.savefig(buf, format='png')
            buf.seek(0)
            reason_chart_image_base64 = base64.b64encode(buf.read()).decode('utf-8')
            plt.close(fig)

        # NEW: Generate chart image for top IPs (bar chart)
        ip_chart_image_base64 = None
        if ip_buckets:
            ip_labels = [b['key'] for b in ip_buckets]
            ip_counts = [b['doc_count'] for b in ip_buckets]
            
            fig, ax = plt.subplots(figsize=(8, 6))
            ax.barh(ip_labels, ip_counts, color='skyblue')
            ax.set_xlabel('Number of Incidents')
            ax.set_title('Top 5 Attacked IPs')
            ax.invert_yaxis() # Display top item at the top
            plt.tight_layout()

            buf = io.BytesIO()
            plt.savefig(buf, format='png')
            buf.seek(0)
            ip_chart_image_base64 = base64.b64encode(buf.read()).decode('utf-8')
            plt.close(fig)

        # 4. Prepare data for the template and render HTML
        def format_timestamp(ts):
            return datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

        template_env.filters['format_timestamp'] = format_timestamp
        
        template = template_env.get_template("report_template.html")
        report_context = {
            "incidents": incidents,
            "total_incidents": len(incidents),
            "generation_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC'),
            "reason_chart_image": reason_chart_image_base64,
            "ip_chart_image": ip_chart_image_base64
        }

        # 5. Render HTML from template
        html_out = template.render(report_context)

        # 6. Convert HTML to PDF in memory
        pdf_bytes = HTML(string=html_out).write_pdf()
        
        return StreamingResponse(io.BytesIO(pdf_bytes), media_type="application/pdf", headers={"Content-Disposition": "attachment;filename=incident_report.pdf"})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF report: {e}")
