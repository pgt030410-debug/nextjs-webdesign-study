from sqlmodel import create_engine, Session, SQLModel
from .config import settings

#
# Database Connection Logic: PostgreSQL (Synchronous)
# - 에러의 주범이었던 asyncpg와 sslmode를 완벽 제거
# - 가장 안정적인 동기식(psycopg2) 통신으로 전환
#

def get_sync_url(url: str) -> str:
    """DATABASE_URL을 SQLAlchemy 표준 포맷으로 강제 변환합니다."""
    # postgres:// 또는 비동기 주소가 섞여있다면 표준 postgresql:// 로 변경
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    elif url.startswith("postgresql+asyncpg://"):
        url = url.replace("postgresql+asyncpg://", "postgresql://", 1)
    
    return url

SQLALCHEMY_DATABASE_URL = get_sync_url(settings.DATABASE_URL)

# Supabase 연결 시 필수적인 sslmode=require를 명시적으로 전달합니다.
connect_args = {}
if "supabase" in SQLALCHEMY_DATABASE_URL:
    connect_args = {"sslmode": "require"}

# 단순하고 강력한 동기식 엔진 생성 (connect_args 포함)
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=False, connect_args=connect_args)

def init_db() -> None:
    """서버 시작 시 테이블을 자동 생성합니다 (동기식)."""
    try:
        SQLModel.metadata.create_all(engine)
        print("INFO: Database initialized and tables verified.")
    except Exception as e:
        print(f"ERROR: Database initialization failed: {e}")

def get_session():
    """FastAPI Depends용 동기식 세션 제너레이터"""
    with Session(engine) as session:
        yield session