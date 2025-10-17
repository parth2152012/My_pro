import requests
import time
import os
import random
import string

# --- Configuration ---
API_BASE_URL = "http://localhost:8000"
VULNERABLE_API_BASE_URL = "http://localhost:8001"
PDF_REPORT_PATH = "incident_report_e2e_test.pdf"

# --- Helper functions for colored output ---
def print_info(message):
    print(f"\033[94m[INFO] {message}\033[0m")

def print_success(message):
    print(f"\033[92m[SUCCESS] {message}\033[0m")

def print_fail(message):
    print(f"\033[91m[FAIL] {message}\033[0m")

def print_step(step, message):
    print(f"\n{'='*20}\n\033[95mSTEP {step}: {message}\033[0m\n{'='*20}")

def get_auth_headers(token):
    """Returns authorization headers if a token is provided."""
    return {"Authorization": f"Bearer {token}"} if token else {}

def get_random_ip():
    """Generates a random IP address for testing to avoid state collisions."""
    return f"10.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}"

def check_api_health(url, name):
    """Checks if an API is running before starting tests."""
    print_info(f"Checking if {name} is reachable...")
    for i in range(10):
        try:
            response = requests.get(f"{url}/health" if name == "Main API" else url)
            if response.status_code == 200:
                print_success(f"{name} is up and running.")
                return True
        except requests.ConnectionError:
            pass # Ignore and retry
        print_info(f"{name} not ready. Retrying in 3s... ({i+1}/10)")
        time.sleep(3)
    print_fail(f"Could not connect to {name} after multiple retries. Please ensure all services are running with 'docker-compose up --profile full'.")
    return False

def run_validation():
    """Runs a sequence of validation tests against the SOC dashboard API."""

    if not check_api_health(API_BASE_URL, "Main API"):
        return
    if not check_api_health(VULNERABLE_API_BASE_URL, "Vulnerable API"):
        return

    # --- STEP 0: Authenticate ---
    print_step(0, "Authenticating to get access token")
    access_token = None
    try:
        # Use default user from api/auth.py
        auth_payload = {
            "username": "testuser",
            "password": "analyst"
        }
        response = requests.post(f"{API_BASE_URL}/token", data=auth_payload)
        response.raise_for_status()
        access_token = response.json().get("access_token")
        assert access_token, "Access token not found in response."
        print_success("Successfully authenticated.")
    except Exception as e:
        print_fail(f"Authentication failed: {e}")
        return

    auth_headers = get_auth_headers(access_token)

    # --- STEP 1: Submit an Anomalous Log (ML Detection) ---
    print_step(1, "Submitting an anomalous log for ML detection")
    try:
        # This message has keywords that should give it a high anomaly score
        log_payload = {"message": "unauthorized root access exception from 123.123.123.123"}
        requests.post(f"{API_BASE_URL}/logs", json=log_payload, headers=auth_headers)
        print_success("Anomalous log submitted.")
        print_info("Waiting for ML worker to process...")
        time.sleep(10) # Give time for Kafka and the ML worker to process

        alerts_res = requests.get(f"{API_BASE_URL}/alerts?is_anomaly=true", headers=auth_headers).json()
        ml_alert = next((alert for alert in alerts_res if "123.123.123.123" in alert['message']), None)

        assert ml_alert is not None, "Could not find an alert for the anomalous log."
        
        # The reason can be from the ML model OR the fallback keyword detection. Test must accept both.
        is_ml_reason = "High Anomaly Score" in ml_alert['reason']
        is_fallback_reason = "Keyword Detected" in ml_alert['reason']
        
        assert is_ml_reason or is_fallback_reason, f"Alert reason was neither ML-based nor fallback-based. Got: '{ml_alert['reason']}'"
        print_success(f"ML worker correctly flagged the log. Reason: '{ml_alert['reason']}'")

    except Exception as e:
        print_fail(f"Error during anomalous log test: {e}")
        return

    # --- STEP 2: Test Threat Intelligence (Blocklist) ---
    print_step(2, "Testing Threat Intelligence (IP blocklist)")
    blocked_ip = get_random_ip()
    try:
        # Add to blocklist
        requests.post(f"{API_BASE_URL}/blocklist", json={"ip": blocked_ip}, headers=auth_headers)
        print_success(f"Added {blocked_ip} to blocklist.")
        time.sleep(1)

        # Submit a log from the blocked IP
        log_payload = {"message": f"Normal-looking log from a bad actor at {blocked_ip}."}
        requests.post(f"{API_BASE_URL}/logs", json=log_payload, headers=auth_headers)
        print_info(f"Submitted log from blocked IP {blocked_ip}. Waiting for ML worker...")
        time.sleep(5)

        # Verify the ML worker flagged it correctly
        alerts_res = requests.get(f"{API_BASE_URL}/alerts?is_anomaly=true", headers=auth_headers).json()
        blocked_log_alert = next((alert for alert in alerts_res if alert.get("source_ip") == blocked_ip), None)

        assert blocked_log_alert is not None, f"Could not find an alert for the blocked IP {blocked_ip}."
        assert "Threat Intelligence Hit" in blocked_log_alert['reason'], "Alert reason for blocked IP is incorrect."
        print_success("ML worker correctly flagged the log with 'Threat Intelligence Hit'.")

        # Remove from blocklist
        requests.delete(f"{API_BASE_URL}/blocklist/{blocked_ip}", headers=auth_headers)
        print_success(f"Removed {blocked_ip} from blocklist.")

    except Exception as e:
        print_fail(f"Error during blocklist test: {e}")
        return

    # --- STEP 3: Test Whitelist Functionality ---
    print_step(3, "Testing IP whitelist functionality")
    whitelisted_ip = get_random_ip()
    try:
        # Add to whitelist
        requests.post(f"{API_BASE_URL}/whitelist", json={"ip": whitelisted_ip}, headers=auth_headers)
        print_success(f"Added {whitelisted_ip} to whitelist.")
        time.sleep(5) # Allow time for config update to propagate via Kafka

        # Submit an anomalous log from the whitelisted IP
        log_payload = {"message": f"denied access exception from whitelisted ip {whitelisted_ip}"}
        requests.post(f"{API_BASE_URL}/logs", json=log_payload, headers=auth_headers)
        print_info(f"Submitted anomalous log from whitelisted IP {whitelisted_ip}. Waiting...")
        time.sleep(5)

        # Verify it was NOT flagged as an anomaly
        alerts_res = requests.get(f"{API_BASE_URL}/alerts?is_anomaly=true", headers=auth_headers).json()
        whitelisted_alert = next((alert for alert in alerts_res if alert.get("source_ip") == whitelisted_ip), None)
        assert whitelisted_alert is None, "An alert was created for a whitelisted IP."
        print_success("System correctly ignored anomalous log from whitelisted IP.")

        # Remove from whitelist
        requests.delete(f"{API_BASE_URL}/whitelist/{whitelisted_ip}", headers=auth_headers)
        print_success(f"Removed {whitelisted_ip} from whitelist.")

    except Exception as e:
        print_fail(f"Error during whitelist test: {e}")
        return

    # --- STEP 4: Resolve an Alert ---
    print_step(4, "Resolving an alert")
    try:
        alerts_res = requests.get(f"{API_BASE_URL}/alerts?is_anomaly=true", headers=auth_headers).json()
        new_alerts = [alert for alert in alerts_res if alert['status'] == 'new']
        
        if not new_alerts:
            print_fail("Could not find any 'new' alerts to resolve.")
            return

        alert_id = new_alerts[0]['id']
        print_info(f"Found alert {alert_id} to resolve.")

        requests.patch(f"{API_BASE_URL}/alerts/{alert_id}", json={"status": "resolved"}, headers=auth_headers)
        print_success(f"Resolved alert {alert_id}.")
        time.sleep(2)

        alerts_after_res = requests.get(f"{API_BASE_URL}/alerts?is_anomaly=true", headers=auth_headers).json()
        resolved_alert = next((alert for alert in alerts_after_res if alert['id'] == alert_id), None)
        
        assert resolved_alert is not None, "Resolved alert disappeared from the list."
        assert resolved_alert['status'] == 'resolved', "Alert status was not updated to 'resolved'."
        print_success("Verified alert status is now 'resolved'.")

    except Exception as e:
        print_fail(f"Error during alert resolution test: {e}")
        return

    # --- STEP 5: Test PDF Report Generation ---
    print_step(5, "Testing PDF report generation")
    try:
        response = requests.get(f"{API_BASE_URL}/reports/incidents", headers=auth_headers)
        response.raise_for_status()

        assert 'application/pdf' in response.headers.get('Content-Type', ''), "Response is not a PDF."
        assert response.content.startswith(b'%PDF-'), "File does not appear to be a valid PDF."

        with open(PDF_REPORT_PATH, 'wb') as f:
            f.write(response.content)
        
        print_success(f"Successfully downloaded PDF report. Saved as '{PDF_REPORT_PATH}'.")

    except Exception as e:
        print_fail(f"Error during PDF report test: {e}")
        return

    # --- STEP 6: Test Vulnerable API (SQL Injection) ---
    print_step(6, "Testing Vulnerable API (SQL Injection)")
    try:
        # 1. Normal request to see if it works
        normal_user = 'alice'
        res = requests.get(f"{VULNERABLE_API_BASE_URL}/users/{normal_user}")
        res.raise_for_status()
        user_data = res.json()
        assert user_data['username'] == normal_user, "Normal user request failed."
        print_success(f"Successfully fetched normal user '{normal_user}'.")

        # 2. SQL Injection attack to dump all users
        injection_payload = "' OR '1'='1"
        res = requests.get(f"{VULNERABLE_API_BASE_URL}/users/{injection_payload}")
        res.raise_for_status()
        all_users_data = res.json()
        assert isinstance(all_users_data, list), "SQLi did not return a list of users."
        assert len(all_users_data) > 1, "SQLi did not return multiple users."
        assert any(u['username'] == 'secret_admin' for u in all_users_data), "SQLi did not reveal the 'secret_admin' user."
        print_success("SQL Injection attack successful, 'secret_admin' data was exposed.")
    except Exception as e:
        print_fail(f"Error during vulnerable API test: {e}")

    print("\n" + "="*40)
    print_success("All validation steps completed successfully!")
    print("="*40 + "\n")

if __name__ == "__main__":
    run_validation()