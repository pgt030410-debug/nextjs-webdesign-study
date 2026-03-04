from typing import Optional, List
from datetime import datetime
from enum import Enum
from sqlmodel import SQLModel, Field

#
# Campaigns Domain Models: SQLModel을 활용한 DB 스키마 및 Pydantic 데이터 모델 정의
#

class CampaignStatus(str, Enum):
    DRAFT = "draft"
    PENDING_APPROVAL = "pending_approval"
    ACTIVE = "active"
    PAUSED = "paused"
    ENDED = "ended"
    REJECTED = "rejected"

class CampaignBase(SQLModel):
    name: str = Field(index=True)
    advertiser: str
    budget: float
    roas: float = Field(default=0.0)
    status: CampaignStatus = Field(default=CampaignStatus.DRAFT)
    organization_id: Optional[int] = Field(default=None, index=True)

class Campaign(CampaignBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class CampaignCreate(CampaignBase):
    pass

class CampaignRead(CampaignBase):
    id: int

class CampaignUpdate(SQLModel):
    name: Optional[str] = None
    budget: Optional[float] = None
    status: Optional[CampaignStatus] = None

class CampaignCommentBase(SQLModel):
    campaign_id: int = Field(index=True)
    user_email: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CampaignComment(CampaignCommentBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class CampaignCommentCreate(SQLModel):
    content: str

class CampaignCommentRead(CampaignCommentBase):
    id: int
