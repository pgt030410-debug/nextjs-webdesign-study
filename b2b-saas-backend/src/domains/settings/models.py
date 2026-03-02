from typing import Optional
from sqlmodel import SQLModel, Field

class WebhookSettingsBase(SQLModel):
    slack_webhook_url: Optional[str] = None
    kakao_host_key: Optional[str] = None

class WebhookSettings(WebhookSettingsBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    organization_id: int = Field(unique=True, index=True)

class WebhookSettingsUpdate(WebhookSettingsBase):
    pass
