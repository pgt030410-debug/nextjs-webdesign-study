from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from ...config import settings
from .models import TokenData

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Ensure plain and hashed passwords are bytes before checking
    plain_pw_bytes = plain_password.encode('utf-8')
    hashed_pw_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_pw_bytes, hashed_pw_bytes)

def get_password_hash(password: str) -> str:
    # Hash the password using raw bcrypt and return it as a string
    pw_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pw_bytes, salt)
    return hashed_password.decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def verify_token(token: str) -> Optional[TokenData]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        org_id: int = payload.get("org_id")
        role: str = payload.get("role")
        if email is None or org_id is None:
            return None
        return TokenData(email=email, organization_id=org_id, role=role)
    except JWTError:
        return None
