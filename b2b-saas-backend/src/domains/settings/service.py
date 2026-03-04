import httpx
import json

async def send_slack_webhook(url: str, title: str, message: str):
    payload = {
        "text": f"*{title}*\n{message}"
    }
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            print(f"✅ Slack Webhook sent successfully: {title}")
    except Exception as e:
        print(f"❌ Failed to send Slack Webhook: {str(e)}")

async def send_kakao_webhook(host_key: str, message: str):
    # This is a mock since Kakao Alimtalk requires heavy template approval
    # Normally we do auth -> get token -> send bizmessage
    print(f"🗨️ (Mock) Kakao Alimtalk sent using HostKey={host_key[:4]}***: {message}")

async def dispatch_webhooks(slack_url: str | None, kakao_key: str | None, title: str, message: str):
    if slack_url:
        await send_slack_webhook(slack_url, title, message)
    if kakao_key:
        await send_kakao_webhook(kakao_key, message)
