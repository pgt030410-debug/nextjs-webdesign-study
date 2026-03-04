from google import genai
from sqlmodel import Session, select
from ..campaigns.models import Campaign
from ...config import settings

def _get_api_key():
    return settings.GEMINI_API_KEY

async def generate_marketing_insight(
    session: Session, 
    organization_id: int, 
    user_question: str,
    user_history: list = None
) -> str:
    """
    RAG(Retrieval-Augmented Generation) 로직:
    1. 데이터 색인: 사용자 조직의 모든 캠페인 데이터를 DB에서 조회
    2. 컨텍스트 구성: LLM이 이해하기 쉬운 텍스트/표 형태로 데이터 변환
    3. 프롬프트 결합 및 생성: 과거 대화 내역 + 시스템 지시어 + 데이터 + 사용자 질문으로 Gemini 추론 수행
    """
    api_key = _get_api_key()
    if not api_key:
        return "죄송합니다. 백엔드에 GEMINI_API_KEY가 설정되지 않아 AI 응답을 제공할 수 없습니다. 시스템 관리자에게 문의하여 환경변수를 확인해주세요."
        
    client = genai.Client(api_key=api_key)

    # 1. Retrieval (DB 조회)
    statement = select(Campaign).where(Campaign.organization_id == organization_id)
    result = session.exec(statement)
    campaigns = result.all()

    if not campaigns:
        return "현재 조직에 등록된 캠페인 데이터가 없습니다. 캠페인을 먼저 추가해주세요."

    # 2. Context Construction (데이터 포맷팅)
    context_lines = []
    context_lines.append("현재 진행 중인 캠페인 데이터 목록입니다:")
    context_lines.append("| ID | 이름 | 매체 | 예산(KRW) | 최근성과(ROAS) | 상태 |")
    context_lines.append("|---|---|---|---|---|---|")
    
    for c in campaigns:
        status_text = "활성" if c.status == "active" else "일시중지"
        roas_value = f"{c.roas}%" if c.roas else "N/A"
        budget_value = f"{c.budget:,}원"
        context_lines.append(f"| {c.id} | {c.name} | {c.advertiser} | {budget_value} | {roas_value} | {status_text} |")
    
    db_context_str = "\n".join(context_lines)

    # [NEW] 대화 내역 파싱 (최대 10개)
    history_str = ""
    if user_history and isinstance(user_history, list):
        history_str = "### 과거 대화 내역 (Conversation History)\n"
        for msg in user_history[-10:]:
            role_name = "User" if msg.get("role") == "user" else "AI"
            history_str += f"{role_name}: {msg.get('content')}\n"
        history_str += "\n"

    # 3. Prompt 구성
    prompt = f"""
당신은 B2B SaaS 캠페인 관리 시스템 데이터베이스와 완벽히 연동된 지능형 '퍼포먼스 마케팅 AI 어시스턴트'입니다.
오로지 제공된 [데이터베이스] 컨텍스트 정보와 [과거 대화 내역]만을 바탕으로 사용자의 질문에 정확, 간결, 친절하게 대답하세요.

{history_str}### 데이터베이스 컨텍스트 (실제 캠페인 현황)
{db_context_str}

[사용자 질문]
{user_question}
"""

    # 4. LLM Call (Gemini-2.5-flash 모델 사용)
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return f"죄송합니다. AI 추론 중 오류가 발생했습니다. (오류 내용: {str(e)})"
