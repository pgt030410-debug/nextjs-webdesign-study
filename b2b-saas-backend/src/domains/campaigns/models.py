from typing import Optional
from enum import Enum
from sqlmodel import SQLModel, Field

#
# Campaigns Domain Models: SQLModel을 활용한 DB 스키마 및 Pydantic 데이터 모델 정의


class CampaignStatus(str, Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    ENDED = "ended"

class CampaignBase(SQLModel):
    name: str = Field(index=True)
    advertiser: str
    budget: float
    roas: float = Field(default=0.0)
    status: CampaignStatus = Field(default=CampaignStatus.ACTIVE)
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
