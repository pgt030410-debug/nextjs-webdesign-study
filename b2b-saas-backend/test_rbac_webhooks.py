import httpx
import uuid

API_BASE = "http://localhost:8000"

def test_flow():
    with httpx.Client(base_url=API_BASE) as client:
        print("=== 1. Testing Viewer RBAC ===")
        # Create viewer user
        viewer_email = f"viewer_{uuid.uuid4().hex[:6]}@test.com"
        viewer_pw = "password123"
        reg_resp = client.post("/auth/signup", json={
            "email": viewer_email,
            "password": viewer_pw,
            "organization_id": 1,
            "role": "viewer",
            "subscription_tier": "starter"
        })
        print(f"Register Viewer: {reg_resp.status_code}")

        # Login viewer
        login_resp = client.post("/auth/login", data={
            "username": viewer_email,
            "password": viewer_pw
        })
        print(f"Login Viewer: {login_resp.status_code}")
        viewer_token = login_resp.json()["access_token"]
        viewer_headers = {"Authorization": f"Bearer {viewer_token}"}

        # Try to read campaigns (Should work for viewer)
        read_resp = client.get(f"/campaigns/?organization_id=1", headers=viewer_headers)
        print(f"Viewer Read Campaigns: {read_resp.status_code}")
        assert read_resp.status_code == 200

        # Try to delete campaign (Should fail 403)
        delete_resp = client.delete(f"/campaigns/999?organization_id=1", headers=viewer_headers)
        print(f"Viewer Delete Campaign: {delete_resp.status_code}")
        assert delete_resp.status_code == 403

        print("\n=== 2. Testing Admin & Webhooks ===")
        # Create admin user
        admin_email = f"admin_{uuid.uuid4().hex[:6]}@test.com"
        admin_pw = "password123"
        client.post("/auth/signup", json={
            "email": admin_email,
            "password": admin_pw,
            "organization_id": 1,
            "role": "admin",
            "subscription_tier": "starter"
        })

        # Login admin
        admin_login = client.post("/auth/login", data={
            "username": admin_email,
            "password": admin_pw
        })
        admin_token = admin_login.json()["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}

        # Save Webhook
        webhook_resp = client.post("/settings/webhooks", json={
            "slack_webhook_url": "https://httpbin.org/post", 
            "kakao_host_key": "MOCK_KAKAO_KEY"
        }, headers=admin_headers)
        print(f"Admin Set Webhook: {webhook_resp.status_code}")
        assert webhook_resp.status_code == 200

        # Create Campaign
        create_resp = client.post(f"/campaigns/?organization_id=1", json={
            "name": "Webhook Test Campaign",
            "advertiser": "Test Corp",
            "budget": 1000000,
            "roas": 250.0,
            "status": "active"
        }, headers=admin_headers)
        print(f"Admin Create Campaign: {create_resp.status_code}")
        assert create_resp.status_code == 200
        camp_id = create_resp.json()["id"]

        # Optimize Campaign (Should trigger webhook)
        opt_resp = client.post(f"/campaigns/{camp_id}/optimize?organization_id=1", headers=admin_headers)
        print(f"Admin Optimize Campaign: {opt_resp.status_code}")
        assert opt_resp.status_code == 200

        print("\nAll tests passed locally!")

if __name__ == "__main__":
    test_flow()
