from typing import List
from fastapi import Request, HTTPException, status
from .service import verify_token

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    async def __call__(self, request: Request):
        # Extract JWT from Authorization header or cookies if possible
        # Currently, FastAPI usually gets it from the header.
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            # Allow fallback to cookies if configured
            token = request.cookies.get("auth_token")
            if not token:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
        else:
            token = auth_header.split(" ")[1]

        token_data = await verify_token(token)
        if not token_data:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

        # Check if user role is in the allowed list
        # We assume if token_data.role is None, they have minimum privileges (viewer)
        user_role = token_data.role or "viewer"
        
        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required roles: {', '.join(self.allowed_roles)}"
            )
            
        return token_data
