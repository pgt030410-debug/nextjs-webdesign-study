import asyncio
from fastapi import APIRouter, Depends
from sqlmodel import Session
from ...database import get_session
from .models import ChatRequest, ChatResponse

#
# [Phase 8] Chat Domain Router (Mock LLM)
# - 사용자의 질문을 받아 마케팅 인사이트를 반환하는 API
#

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/ask", response_model=ChatResponse)
async def ask_marketing_bot(
    request: ChatRequest,
    session: Session = Depends(get_session)
):
    """
    사용자의 질문을 기반으로 AI 마케팅 분석 답변을 반환합니다.
    (현재는 진짜 LLM 연동 전이므로 키워드 기반의 하드코딩된 Mock 답변을 제공합니다)
    """
    # 임의의 봇 처리 시간(Think time) 모방
    await asyncio.sleep(1.5)
    
    question = request.message.lower()
    
    if "예산" in question or "소진" in question:
        reply = "현재 분석 결과, 'Google Search-Brand' 캠페인의 예산 소진 속도가 목표치보다 20% 빠릅니다. 타겟팅 최적화를 위해 예산의 10%를 'Meta Retargeting' 쪽으로 옮기는 것을 고려해보세요."
    elif "roas" in question or "효율" in question:
        reply = "가장 높은 ROAS를 기록 중인 캠페인은 'Instagram Conversion_Spring' (320%) 입니다. 전반적인 캠페인 효율은 전주 대비 15% 상승했습니다."
    elif "최적화" in question:
        reply = "현재 캠페인 목록 중 ROAS가 150 미만인 캠페인이 2개 발견되었습니다. 해당 캠페인들은 'AI 최적화' 버튼을 눌러 예산을 조정하시는 것을 추천드립니다."
    else:
        reply = "안녕하세요! 마케팅 분석 AI 챗봇입니다. 캠페인 예산 소진 현황, ROAS 성과 분석, 최적화 조언 등에 대해 자유롭게 질문해주세요. (추후 LLM과 연동될 예정입니다.)"
        
    return ChatResponse(reply=reply)
