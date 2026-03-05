from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from src.database import get_session
from src.domains.auth.dependencies import RoleChecker
from src.domains.auth.models import TokenData
from .predictive_service import generate_mock_timeseries

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"]
)

@router.get("/timeseries")
def get_analytics_timeseries(
    organization_id: int, 
    days: int = 30,
    session: Session = Depends(get_session),
    token_data: TokenData = Depends(RoleChecker(["admin", "editor", "viewer"]))
):
    """
    Returns historical data, trend predictions, and anomaly alerts.
    """
    if token_data.organization_id != organization_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this organization's analytics.")
        
    data = generate_mock_timeseries(days=days)
    return data

@router.get("/anomalies")
def get_analytics_anomalies(
    organization_id: int,
    session: Session = Depends(get_session),
    token_data: TokenData = Depends(RoleChecker(["admin", "editor", "viewer"]))
):
    """
    Returns an array of detected anomalies from the recent history.
    """
    if token_data.organization_id != organization_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this organization's analytics.")
        
    data = generate_mock_timeseries(days=30)
    return data.get("anomalies", [])
