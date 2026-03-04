from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from ...database import get_session
from .models import User, UserCreate, Token, UserRead
from . import service
from ...config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=UserRead)
async def signup(user_in: UserCreate, session: Session = Depends(get_session)):
    # 1. 중복 이메일 체크
    statement = select(User).where(User.email == user_in.email)
    user = session.exec(statement).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 2. 비밀번호 해싱 후 저장
    hashed_password = service.get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email, 
        organization_id=user_in.organization_id, 
        role=user_in.role,
        subscription_tier=user_in.subscription_tier,
        hashed_password=hashed_password
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    statement = select(User).where(User.email == form_data.username)
    user = session.exec(statement).first()
    if not user or not service.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = service.create_access_token(
        data={"sub": user.email, "org_id": user.organization_id, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
