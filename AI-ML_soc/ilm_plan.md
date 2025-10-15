# Elasticsearch Index Lifecycle Management (ILM) Plan

This document outlines a strategy for managing the `processed_logs` index in Elasticsearch to control storage costs, maintain performance, and comply with data retention policies.

## The Problem

Log data grows indefinitely. Without a management plan, an Elasticsearch cluster can face several issues:
- **Performance Degradation**: Large indices become slow to search and aggregate.
- **Rising Storage Costs**: Storing vast amounts of historical data is expensive.
- **Operational Overhead**: Manual cleanup is error-prone and time-consuming.

## The Solution: Index Lifecycle Management (ILM)

ILM is an Elasticsearch feature that automates the management of indices over their lifetime. We will define a policy that transitions our `processed_logs` index through several phases.

### Proposed ILM Policy: `soc_logs_policy`

This policy will be applied to a rolling set of indices (e.g., `processed_logs-YYYY.MM.DD`).

#### 1. Hot Phase (Active Ingestion & Querying)
- **Duration**: 7 days
- **Action**: New logs are written to the hot index. This index is optimized for fast writes and queries.
- **Rollover**: When the index reaches **30 days** or **50GB** in size, a new "hot" index is created, and the old one moves to the "warm" phase.

#### 2. Warm Phase (Less Frequent Access)
- **Duration**: After 30 days (from rollover)
- **Action**: The index is made read-only. The number of shards can be reduced (`shrink` action) to save resources, as data is accessed less frequently.

#### 3. Cold Phase (Archival)
- **Duration**: After 90 days
- **Action**: The index is moved to less expensive "cold" storage nodes. It remains searchable but with higher latency.

#### 4. Delete Phase (Data Deletion)
- **Duration**: After 365 days
- **Action**: The index and its data are permanently deleted from the cluster to comply with a one-year data retention policy.

### Implementation Steps

1.  **Create an Index Template**: An index template will be created in Elasticsearch to automatically apply the `soc_logs_policy` to any new index matching the pattern `processed_logs-*`.
2.  **Modify Application Logic**: The `api` and `ml_worker` services will be updated to write to a rolling index alias (e.g., `processed_logs-write`) instead of the static `processed_logs` index name.
3.  **Create the ILM Policy**: The `soc_logs_policy` will be defined in Kibana or via the Elasticsearch API.

This automated approach ensures the system remains performant and cost-effective as it scales, demonstrating a commitment to enterprise-grade operational excellence.