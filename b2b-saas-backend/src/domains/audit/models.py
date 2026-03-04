from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import BaseModel

class AuditLogBase(SQLModel):
    organization_id: int
    user_id: int # Or string depend on your auth system, sticking to int for now.
    action: str # CREATE, UPDATE, DELETE, etc.
    resource: str # e.g., 'campaign: 123 (My Campaign)'
    ip_address: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AuditLog(AuditLogBase, table=True):
    __tablename__ = "audit_logs" # type: ignore
    id: Optional[int] = Field(default=None, primary_key=True)

class AuditLogRead(AuditLogBase):
    id: int

class AuditLogCreate(AuditLogBase):
    pass
