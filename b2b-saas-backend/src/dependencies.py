from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from .database import get_session
from .domains.auth.service import verify_token
from .domains.auth.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = await verify_token(token)
    if token_data is None:
        raise credentials_exception
        
    statement = select(User).where(User.email == token_data.email)
    user = session.exec(statement).first()
    if user is None:
        raise credentials_exception
    return user
