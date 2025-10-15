# Technical Additions Roadmap for AI Security Platform

Based on the current microservices architecture, these are the highest-impact additions to validate the "AI" claim and demonstrate enterprise readiness.

## 1. Validating the ML Core (High Priority)
The ML Worker must immediately move from a concept to a functional component to eliminate the "rule-based" perception.

| Addition | Rationale | Component(s) |
|---|---|---|
| **Working Isolation Forest Model** | Replace the old rule-based logic. The ML Worker must generate an `Anomaly Score` based on features derived from the logs (e.g., event rate, time-of-day, payload size). | `ml_worker` |
| **Model Persistence** | Implement logic to train the model periodically (e.g., daily) and save it to disk (or S3) using `pickle` or `joblib`. The worker should load the latest model on startup. | `ml_worker` |
| **Feature Store (Mock)** | Define the exact features used by the ML model (e.g., `user_activity_rate_5min`, `is_weekend`). This demonstrates formal ML engineering. | `ml_worker` |

## 2. Data Integrity and Enterprise Scale
Enterprise clients care deeply about data consistency and validation.

| Addition | Rationale | Component(s) |
|---|---|---|
| **Avro/Protobuf Serialization** | Move log data on Kafka from generic JSON strings to a structured format like Avro. This mandates a Schema Registry to prevent services from sending malformed data, proving data integrity. | `api`, `kafka`, `ml_worker` |
| **Structured Logging Standard** | Enforce a strict log format (e.g., a Pydantic model in FastAPI) for every log ingested. Ensure logs contain `timestamp`, `source_ip`, `user_id`, and `event_type`. | `api` |

## 3. Security Context and Enrichment
A raw log is useless; a security alert needs context. This is where you add immediate value for the analyst.

| Addition | Rationale | Component(s) |
|---|---|---|
| **GeoIP Enrichment** | Implement a GeoIP lookup (e.g., using a MaxMind database) in the ML Worker. This enriches every alert with location data before it hits Elasticsearch. | `ml_worker` |
| **Threat Intelligence Lookup** | Integrate a check against a known malicious IP list (e.g., a Redis set of known bad IPs). If an event's source IP matches, the anomaly score should spike immediately. | `ml_worker`, `redis` |

## 4. Operational Excellence and Polish
These details make the system feel production-ready and professional.

| Addition | Rationale | Component(s) |
|---|---|---|
| **Service Health Checks** | Add `healthcheck` directives to `docker-compose.yml` for all services (FastAPI, ES, Kafka) to ensure reliable startup order and monitor operational status. | `docker-compose.yml` |
| **Storage Optimization** | Document a plan for Elasticsearch Index Lifecycle Management (ILM). This shows you're managing costs and performance by automatically rotating indices and deleting old data. | `docs` |
| **API Rate Limiting** | Implement basic rate limiting on the ingestion endpoint (`POST /logs`) in FastAPI to protect the API from being overwhelmed by a burst of traffic. | `api` |
