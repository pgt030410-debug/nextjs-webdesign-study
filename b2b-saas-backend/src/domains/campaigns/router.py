from typing import List
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlmodel import Session, select
from ...database import get_session
from .models import CampaignRead, CampaignCreate
from . import service
from ..auth.dependencies import RoleChecker
from ..auth.models import TokenData
from ..settings.models import WebhookSettings
from ..settings.service import dispatch_webhooks

router = APIRouter(prefix="/campaigns", tags=["campaigns"])

@router.get("/", response_model=List[CampaignRead])
def read_campaigns(
    organization_id: int,
    session: Session = Depends(get_session),
    token_data: TokenData = Depends(RoleChecker(["admin", "editor", "viewer"]))
):
    return service.get_multi(session, organization_id)

@router.post("/", response_model=CampaignRead)
def create_campaign(
    campaign_in: CampaignCreate,
    organization_id: int,
    session: Session = Depends(get_session),
    token_data: TokenData = Depends(RoleChecker(["admin", "editor"]))
):
    return service.create(session, campaign_in, organization_id)

@router.delete("/{campaign_id}", response_model=bool)
def delete_campaign(
    campaign_id: int,
    organization_id: int,
    session: Session = Depends(get_session),
    token_data: TokenData = Depends(RoleChecker(["admin", "editor"]))
):
    return service.delete(session, campaign_id, organization_id)

@router.post("/{campaign_id}/optimize", response_model=CampaignRead)
def optimize_campaign(
    campaign_id: int,
    organization_id: int,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
    token_data: TokenData = Depends(RoleChecker(["admin", "editor"]))
):
    """
    [Phase 8] AI Budget Optimizer
    ROAS에 따라 예산을 10% 증액/삭감하고 Webhook 알림을 발송합니다.
    """
    optimized_campaign = service.optimize(session, campaign_id, organization_id)
    
    # Send Webhooks if settings exist
    statement = select(WebhookSettings).where(WebhookSettings.organization_id == organization_id)
    settings_db = session.exec(statement).first()
    
    if settings_db:
        # We format a nice message based on new state
        title = "🚀 AI Budget Optimization Completed"
        message = f"Campaign '{optimized_campaign.name}' has been optimized.\n" \
                  f"New Budget: {optimized_campaign.budget} KRW\nCurrent ROAS: {optimized_campaign.roas}x"
                  
        background_tasks.add_task(
            dispatch_webhooks,
            slack_url=settings_db.slack_webhook_url,
            kakao_key=settings_db.kakao_host_key,
            title=title,
            message=message
        )
        
    return optimized_campaign

from .models import CampaignCommentRead, CampaignCommentCreate
from pydantic import BaseModel
class StatusUpdate(BaseModel):
    status: str

@router.put("/{campaign_id}/status", response_model=CampaignRead)
def update_campaign_status(
    campaign_id: int,
    organization_id: int,
    status_update: StatusUpdate,
    session: Session = Depends(get_session),
    token_data: TokenData = Depends(RoleChecker(["admin", "editor"]))
):
    """
    [Phase 14] 결재 프로세스 및 상태 변경 (Approve/Reject 등)
    Admin/Editor만 상태를 변경할 수 있습니다.
    """
    return service.update_status(session, campaign_id, organization_id, status_update.status)

@router.post("/{campaign_id}/comments", response_model=CampaignCommentRead)
def create_campaign_comment(
    campaign_id: int,
    comment_in: CampaignCommentCreate,
    session: Session = Depends(get_session),
    token_data: TokenData = Depends(RoleChecker(["admin", "editor", "viewer"]))
):
    """
    [Phase 14] 캠페인 코멘트 추가
    모든 권한(Viewer 포함)이 코멘트를 남길 수 있습니다.
    """
    return service.add_comment(session, campaign_id, token_data.email, comment_in)

@router.get("/{campaign_id}/comments", response_model=List[CampaignCommentRead])
def read_campaign_comments(
    campaign_id: int,
    session: Session = Depends(get_session),
    token_data: TokenData = Depends(RoleChecker(["admin", "editor", "viewer"]))
):
    """
    [Phase 14] 캠페인 코멘트 목록 조회
    """
    return service.get_comments(session, campaign_id)