import httpx
import uuid

API_BASE = "http://localhost:8000"

def test_phase14():
    with httpx.Client(base_url=API_BASE) as client:
        print("=== Phase 14 Tests ===")
        # Create users
        admin_email = f"admin_{uuid.uuid4().hex[:6]}@test.com"
        viewer_email = f"viewer_{uuid.uuid4().hex[:6]}@test.com"
        pw = "password123"

        client.post("/auth/signup", json={
            "email": admin_email, "password": pw, "organization_id": 1, "role": "admin", "subscription_tier": "starter"
        })
        client.post("/auth/signup", json={
            "email": viewer_email, "password": pw, "organization_id": 1, "role": "viewer", "subscription_tier": "starter"
        })

        admin_token = client.post("/auth/login", data={"username": admin_email, "password": pw}).json()["access_token"]
        viewer_token = client.post("/auth/login", data={"username": viewer_email, "password": pw}).json()["access_token"]

        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        viewer_headers = {"Authorization": f"Bearer {viewer_token}"}

        # 1. Admin creates a campaign
        create_resp = client.post("/campaigns/?organization_id=1", json={
            "name": "Phase 14 Test Campaign",
            "advertiser": "Test Corp",
            "budget": 1000000,
            "roas": 250.0,
            "status": "draft"
        }, headers=admin_headers)
        assert create_resp.status_code == 200, f"Campaign creation failed: {create_resp.text}"
        camp_id = create_resp.json()["id"]
        print(f"Created Campaign ID: {camp_id}")

        # 2. Viewer tries to approve campaign (Should fail with 403 Forbidden)
        status_update_req = {"status": "active"}
        viewer_status_resp = client.put(f"/campaigns/{camp_id}/status?organization_id=1", json=status_update_req, headers=viewer_headers)
        print(f"Viewer status update response: {viewer_status_resp.status_code}")
        assert viewer_status_resp.status_code == 403

        # 3. Admin approves campaign
        admin_status_resp = client.put(f"/campaigns/{camp_id}/status?organization_id=1", json=status_update_req, headers=admin_headers)
        print(f"Admin status update response: {admin_status_resp.status_code}")
        assert admin_status_resp.status_code == 200
        assert admin_status_resp.json()["status"] == "active"

        # 4. Viewer posts a comment
        comment_req = {"content": "This is a viewer comment"}
        viewer_comment_resp = client.post(f"/campaigns/{camp_id}/comments", json=comment_req, headers=viewer_headers)
        print(f"Viewer comment response: {viewer_comment_resp.status_code}")
        assert viewer_comment_resp.status_code == 200

        # 5. Admin lists comments
        comments_resp = client.get(f"/campaigns/{camp_id}/comments", headers=admin_headers)
        print(f"Admin get comments response: {comments_resp.status_code}")
        assert comments_resp.status_code == 200
        comments = comments_resp.json()
        assert len(comments) == 1
        assert comments[0]["content"] == "This is a viewer comment"
        assert comments[0]["user_email"] == viewer_email

        print("\nAll Phase 14 backend RBAC tests passed successfully!")

if __name__ == "__main__":
    test_phase14()
