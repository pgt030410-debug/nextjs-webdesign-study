from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from ...database import get_session
from ..auth.models import User, UserRead
from ...dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[UserRead])
async def read_users(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(User).where(User.organization_id == current_user.organization_id)
    users = session.exec(statement).all()
    return users
