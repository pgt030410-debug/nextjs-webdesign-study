import httpx
import uuid

API_BASE = "http://localhost:8000"

def test_phase15():
    with httpx.Client(base_url=API_BASE) as client:
        print("=== Phase 15 Tests ===")
        # Create user
        email = f"user_{uuid.uuid4().hex[:6]}@test.com"
        pw = "password123"

        client.post("/auth/signup", json={
            "email": email, "password": pw, "organization_id": 1, "role": "admin", "subscription_tier": "starter"
        })

        token = client.post("/auth/login", data={"username": email, "password": pw}).json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Test timeseries & predictions
        ts_resp = client.get("/analytics/timeseries?organization_id=1&days=30", headers=headers)
        assert ts_resp.status_code == 200, f"Timeseries fetch failed: {ts_resp.text}"
        data = ts_resp.json()
        print("Keys returned:", data.keys())
        assert "historical" in data
        assert "predictions" in data
        assert "anomalies" in data
        assert len(data["historical"]["spend"]) == 30
        assert len(data["predictions"]["spend"]) == 7

        # 2. Test anomalies endpoint alone
        an_resp = client.get("/analytics/anomalies?organization_id=1", headers=headers)
        assert an_resp.status_code == 200
        anomalies = an_resp.json()
        print(f"Detected {len(anomalies)} anomalies")
        # We injected one hardcoded anomaly into the generator
        assert len(anomalies) >= 1

        print("\nAll Phase 15 backend tests passed successfully!")

if __name__ == "__main__":
    test_phase15()
