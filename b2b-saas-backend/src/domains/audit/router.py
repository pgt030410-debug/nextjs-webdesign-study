from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, desc
from src.database import get_session
from src.domains.audit.models import AuditLog, AuditLogRead

router = APIRouter(prefix="/audit", tags=["Audit"])

@router.get("/logs", response_model=List[AuditLogRead])
def get_audit_logs(
    organization_id: int = 12, # Hardcoded tenant for now as per project state
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session)
):
    """
    Retrieve audit logs for a specific organization, ordered by newest first.
    """
    statement = select(AuditLog).where(AuditLog.organization_id == organization_id).order_by(desc(AuditLog.created_at)).offset(skip).limit(limit)
    result = session.execute(statement)
    logs = result.scalars().all()
    return logs

