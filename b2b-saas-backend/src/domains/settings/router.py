from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from ...database import get_session
from ..auth.dependencies import RoleChecker
from ..auth.models import TokenData
from .models import WebhookSettings, WebhookSettingsUpdate

router = APIRouter(prefix="/settings", tags=["settings"])

@router.get("/webhooks", response_model=WebhookSettingsUpdate)
def get_webhooks(
    session: Session = Depends(get_session),
    token_data: TokenData = Depends(RoleChecker(["admin", "editor", "viewer"]))
):
    statement = select(WebhookSettings).where(WebhookSettings.organization_id == token_data.organization_id)
    settings = session.exec(statement).first()
    if not settings:
        return WebhookSettingsUpdate()
    return settings

@router.post("/webhooks", response_model=WebhookSettingsUpdate)
def update_webhooks(
    settings_in: WebhookSettingsUpdate,
    session: Session = Depends(get_session),
    token_data: TokenData = Depends(RoleChecker(["admin", "editor"]))
):
    statement = select(WebhookSettings).where(WebhookSettings.organization_id == token_data.organization_id)
    settings_db = session.exec(statement).first()
    
    if settings_db:
        settings_db.slack_webhook_url = settings_in.slack_webhook_url
        settings_db.kakao_host_key = settings_in.kakao_host_key
    else:
        settings_db = WebhookSettings(
            slack_webhook_url=settings_in.slack_webhook_url,
            kakao_host_key=settings_in.kakao_host_key,
            organization_id=token_data.organization_id
        )
        
    session.add(settings_db)
    session.commit()
    session.refresh(settings_db)
    return settings_db
