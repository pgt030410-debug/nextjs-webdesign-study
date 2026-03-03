from typing import List
from fastapi import APIRouter, Depends
# AsyncSession 대신 동기식 Session(SQLModel 또는 SQLAlchemy)을 가져옵니다.
from sqlmodel import Session 
from ...database import get_session
from .models import CampaignRead, CampaignCreate
from . import service

router = APIRouter(prefix="/campaigns", tags=["campaigns"])

@router.get("/", response_model=List[CampaignRead])
def read_campaigns( # async 제거
    organization_id: int,
    session: Session = Depends(get_session) # AsyncSession -> Session으로 변경
):
    return service.get_multi(session, organization_id) # await 제거

@router.post("/", response_model=CampaignRead)
def create_campaign( # async 제거
    campaign_in: CampaignCreate,
    organization_id: int,
    session: Session = Depends(get_session)
):
    return service.create(session, campaign_in, organization_id) # await 제거

@router.delete("/{campaign_id}", response_model=bool)
def delete_campaign( # async 제거
    campaign_id: int,
    organization_id: int,
    session: Session = Depends(get_session)
):
    return service.delete(session, campaign_id, organization_id) # await 제거

@router.post("/{campaign_id}/optimize", response_model=CampaignRead)
def optimize_campaign(
    campaign_id: int,
    organization_id: int,
    session: Session = Depends(get_session)
):
    """
    [Phase 8] AI Budget Optimizer (Mock)
    현재는 LLM 대신 rule-based logic으로 ROAS에 따라 예산을 10% 증액/삭감합니다.
    """
    return service.optimize(session, campaign_id, organization_id)