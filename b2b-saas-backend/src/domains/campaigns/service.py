from typing import List, Optional, Sequence
from sqlmodel import select, Session
from sqlalchemy import func
from .models import Campaign, CampaignCreate
from ..auth.models import User
from ..audit.models import AuditLog
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
    """새로운 캠페인 생성 (트랜잭션 관리 및 구독 한도 체크)"""
    try:
        # 1. 구독 플랜 체크
        user_stmt = select(User).where(User.organization_id == organization_id)
        user = session.execute(user_stmt).scalars().first()
        tier = user.subscription_tier if user else "starter"
        
        if tier == "starter":
            # 캠페인 개수 체크
            count_stmt = select(func.count(Campaign.id)).where(Campaign.organization_id == organization_id)
            count = session.execute(count_stmt).scalar()
            if count and count >= 3:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Starter 플랜은 최대 3개의 캠페인만 생성할 수 있습니다. 결제 플랜을 업그레이드 해주세요."
                )

        db_obj = Campaign.model_validate(obj_in)
        db_obj.organization_id = organization_id  # 매개변수로 받은 ID 강제 적용
        
        session.add(db_obj)
        session.commit() # 먼저 생성되어야 ID를 얻습니다.
        session.refresh(db_obj) 
        
        # 감사 로그 작성 (성공 시)
        # Auth 연동 전이므로 user_id는 임시로 1 할당
        audit_log = AuditLog(
            organization_id=organization_id,
            user_id=1, 
            action="CREATE",
            resource=f"Campaign: {db_obj.name}"
        )
        session.add(audit_log)
        session.commit()

        return db_obj
    except HTTPException as he:
        # HTTP 에러는 그대로 넘김
        raise he
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
        campaign_name = campaign.name
        session.delete(campaign) # await 제거

        # 감사 로그 작성
        audit_log = AuditLog(
            organization_id=organization_id,
            user_id=1,
            action="DELETE",
            resource=f"Campaign: {campaign_name}"
        )
        session.add(audit_log)

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

def update_status(session: Session, campaign_id: int, organization_id: int, new_status: str) -> Campaign:
    """캠페인의 상태를 변경 (Approval Workflow)"""
    campaign = get_by_id(session, campaign_id, organization_id)
    try:
        from .models import CampaignStatus
        campaign.status = CampaignStatus(new_status)
        session.add(campaign)
        
        # Add Audit log
        audit_log = AuditLog(
            organization_id=organization_id,
            user_id=1,
            action="UPDATE_STATUS",
            resource=f"Campaign: {campaign.name} -> {new_status}"
        )
        session.add(audit_log)
        
        session.commit()
        session.refresh(campaign)
        return campaign
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid status value")
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))

from .models import CampaignComment, CampaignCommentCreate
def add_comment(session: Session, campaign_id: int, user_email: str, comment_in: CampaignCommentCreate) -> CampaignComment:
    """캠페인 코멘트 추가"""
    try:
        new_comment = CampaignComment(
            campaign_id=campaign_id,
            user_email=user_email,
            content=comment_in.content
        )
        session.add(new_comment)
        session.commit()
        session.refresh(new_comment)
        return new_comment
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))

def get_comments(session: Session, campaign_id: int) -> Sequence[CampaignComment]:
    """캠페인 코멘트 목록 조회"""
    try:
        statement = select(CampaignComment).where(CampaignComment.campaign_id == campaign_id).order_by(CampaignComment.created_at.asc())
        results = session.execute(statement)
        return results.scalars().all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))