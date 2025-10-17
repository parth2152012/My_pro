# TODO: Connect Frontend to AI/ML SOC API with Authentication

## 1. Add Login Form to Frontend
- [x] Modify `frontend/index.html` to include a login form with username/password inputs and login button
- [x] Add a logout button and display current user status

## 2. Implement Authentication Logic in app.js
- [x] Add `login()` function to fetch from `/token` endpoint and store access token in localStorage
- [x] Add `logout()` function to clear token and reset UI
- [x] Add `getAuthHeaders()` function to return Authorization header if token exists
- [x] Update all fetch functions to include auth headers using `getAuthHeaders()`
- [x] Add token validation and redirect to login if invalid/expired

## 3. Update UI for Authentication State
- [x] Show/hide login form based on authentication status
- [x] Display user info when logged in
- [x] Handle login errors and display messages

## 4. Test Full Connection
- [x] Run `docker-compose up` to start services
- [x] Test login with admin/admin123 credentials
- [x] Verify API calls work and UI updates with real data
- [x] Debug any CORS or auth issues

## 5. After everything
- [x] 🧹 Tighten container resources (start with ES + Kafka)

- [x] 🐳 Set up a proper docker-compose.override.yml for dev mode:
    Disable heavy services unless testing them

- [x] 🧪 Write load test scripts (e.g., with Locust or K6) to find your machine’s breaking point

- [] ☁️ Experiment with moving Elasticsearch to a managed service (you can get free tiers)

- [] 🔸 Add simple auto-scaling logic for ML Workers (or manual scaling via docker-compose scale)
