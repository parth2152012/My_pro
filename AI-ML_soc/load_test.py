#!/usr/bin/env python3
"""
Simple load test script using Locust for the AI/ML SOC API.
Run with: locust -f load_test.py --host=http://localhost:8000
Then open http://localhost:8089 to start the test.
"""

from locust import HttpUser, task, between
import json


class SOCUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        # Login to get token
        response = self.client.post("/token", data={
            "username": "admin",
            "password": "admin123"
        })
        if response.status_code == 200:
            self.token = response.json()["access_token"]
            self.headers = {"Authorization": f"Bearer {self.token}"}
        else:
            self.token = None
            self.headers = {}

    @task(3)
    def get_status(self):
        self.client.get("/status", headers=self.headers)

    @task(2)
    def get_stats(self):
        self.client.get("/stats", headers=self.headers)

    @task(1)
    def get_alerts(self):
        self.client.get("/alerts?is_anomaly=true", headers=self.headers)

    @task(1)
    def get_logs(self):
        self.client.get("/alerts?is_anomaly=false", headers=self.headers)

    @task(1)
    def get_whitelist(self):
        self.client.get("/whitelist", headers=self.headers)

    @task(1)
    def get_blocklist(self):
        self.client.get("/blocklist", headers=self.headers)
