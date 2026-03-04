from typing import Optional
from sqlmodel import SQLModel, Field

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    organization_id: int
    role: str = Field(default="viewer")
    subscription_tier: str = Field(default="starter")

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int

class Token(SQLModel):
    access_token: str
    token_type: str

class TokenData(SQLModel):
    email: Optional[str] = None
    organization_id: Optional[int] = None
    role: Optional[str] = None
