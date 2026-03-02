from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from ...database import get_session
from ..auth.models import User
from ...dependencies import get_current_user
from .models import WebhookSettings, WebhookSettingsUpdate

router = APIRouter(prefix="/settings", tags=["settings"])

@router.get("/webhooks", response_model=WebhookSettingsUpdate)
async def get_webhooks(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(WebhookSettings).where(WebhookSettings.organization_id == current_user.organization_id)
    settings = session.exec(statement).first()
    if not settings:
        return WebhookSettingsUpdate()
    return settings

@router.post("/webhooks", response_model=WebhookSettingsUpdate)
async def update_webhooks(
    settings_in: WebhookSettingsUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(WebhookSettings).where(WebhookSettings.organization_id == current_user.organization_id)
    settings_db = session.exec(statement).first()
    
    if settings_db:
        settings_db.slack_webhook_url = settings_in.slack_webhook_url
        settings_db.kakao_host_key = settings_in.kakao_host_key
    else:
        settings_db = WebhookSettings(
            slack_webhook_url=settings_in.slack_webhook_url,
            kakao_host_key=settings_in.kakao_host_key,
            organization_id=current_user.organization_id
        )
        
    session.add(settings_db)
    session.commit()
    session.refresh(settings_db)
    return settings_db
