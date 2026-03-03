from typing import List, Optional, Sequence
from sqlmodel import select, Session # AsyncSession 대신 동기식 Session 임포트
from .models import Campaign, CampaignCreate
from fastapi import HTTPException, status

#
# Campaigns Domain Service: 동기 세션(Sync)을 사용하는 비즈니스 로직
# - PostgreSQL 환경에서의 트랜잭션 무결성 보장 (commit, rollback)
# - Supabase 6543 포트와의 완벽한 호환을 위한 동기식 전환
#

def get_multi(session: Session, organization_id: int) -> Sequence[Campaign]:
    """특정 조직의 모든 캠페인 목록 조회"""
    try:
        statement = select(Campaign).where(Campaign.organization_id == organization_id)
        # await 제거: 동기식으로 바로 실행하고 결과를 받습니다.
        results = session.execute(statement)
        return results.scalars().all()
    except Exception as e:
        print(f"Error in campaign list: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error during campaign listing: {str(e)}"
        )

def get_by_id(session: Session, campaign_id: int, organization_id: int) -> Campaign:
    """특정 ID의 캠페인 상세 조회 (권한 검증 포함)"""
    statement = select(Campaign).where(
        Campaign.id == campaign_id, 
        Campaign.organization_id == organization_id
    )
    # await 제거
    result = session.execute(statement)
    campaign: Optional[Campaign] = result.scalar_one_or_none()
    
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found or access denied"
        )
    return campaign

def create(session: Session, obj_in: CampaignCreate, organization_id: int) -> Campaign:
    """새로운 캠페인 생성 (트랜잭션 관리)"""
    try:
        db_obj = Campaign.model_validate(obj_in)
        db_obj.organization_id = organization_id  # 매개변수로 받은 ID 강제 적용
        
        session.add(db_obj)
        session.commit() # await 제거
        session.refresh(db_obj) # await 제거
        return db_obj
    except Exception as e:
        session.rollback() # await 제거
        print(f"Error in campaign create: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error during campaign creation: {str(e)}"
        )

def delete(session: Session, campaign_id: int, organization_id: int) -> bool:
    """기존 캠페인 삭제 (트랜잭션 관리)"""
    # await 제거
    campaign = get_by_id(session, campaign_id, organization_id)
    
    try:
        session.delete(campaign) # await 제거
        session.commit() # await 제거
        return True
    except Exception as e:
        session.rollback() # await 제거
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete campaign: {str(e)}"
        )

def optimize(session: Session, campaign_id: int, organization_id: int) -> Campaign:
    """
    [Phase 8] AI Budget Optimizer (Mock Logic)
    캠페인을 조회하여 ROAS를 평가한 뒤,
    ROAS가 300 보다 크면 예산 10% 증액
    ROAS가 150 보다 작으면 예산 10% 삭감
    """
    campaign = get_by_id(session, campaign_id, organization_id)
    
    try:
        # Mock Optimization Logic
        target_roas = 200.0  # 임시 타겟 ROAS
        if campaign.roas > target_roas * 1.5:
            campaign.budget = campaign.budget * 1.10 # 10% 증액
        elif campaign.roas < target_roas * 0.75:
            campaign.budget = campaign.budget * 0.90 # 10% 삭감
            
        session.add(campaign)
        session.commit()
        session.refresh(campaign)
        return campaign
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to optimize campaign: {str(e)}"
        )