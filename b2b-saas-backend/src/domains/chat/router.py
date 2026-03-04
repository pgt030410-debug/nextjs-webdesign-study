import asyncio
from fastapi import APIRouter, Depends
from sqlmodel import Session
from ...database import get_session
from .models import ChatRequest, ChatResponse
from .service import generate_marketing_insight

#
# [Phase 11] Chat Domain Router (RAG LLM Integration)
# - 사용자의 질문과 DB 조회 캠페인 데이터를 묶어 Gemini AI가 마케팅 인사이트를 반환하는 진짜 API
#

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/ask", response_model=ChatResponse)
async def ask_marketing_bot(
    request: ChatRequest,
    session: Session = Depends(get_session)
):
    """
    사용자의 질문을 기반으로 DB와 연동하여 AI 마케팅 분석 실시간 답변을 반환합니다.
    """
    # 1. RAG 서비스 모듈 호출 (Session, Org ID, Question, History 전달)
    reply = await generate_marketing_insight(
        session=session,
        organization_id=request.organization_id,
        user_question=request.message,
        user_history=request.history
    )
    
    return ChatResponse(reply=reply)
