from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class ChatRequest(BaseModel):
    message: str
    organization_id: Optional[int] = None
    history: Optional[List[Dict[str, Any]]] = None

class ChatResponse(BaseModel):
    reply: str
