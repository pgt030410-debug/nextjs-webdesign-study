from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database import init_db
from .domains.campaigns.router import router as campaigns_router
from .domains.auth.router import router as auth_router
from .domains.users.router import router as users_router
from .domains.settings.router import router as settings_router

# Main Entry Point: 안정적인 동기식(Sync) DB 연결로 원복

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 수정됨: init_db()가 이제 동기식이므로 await를 뺍니다!
    init_db()
    yield

app = FastAPI(
    title="B2B SaaS API",
    description="FastAPI Backend with DDD (Sync Database)",
    version="0.1.0",
    lifespan=lifespan
)

# CORS 설정 강화
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False, 
    allow_methods=["*"],
    allow_headers=["*"],
)

# 도메인 라우터 통합
app.include_router(auth_router)
app.include_router(campaigns_router)
app.include_router(users_router)
app.include_router(settings_router)

# 수정됨: 단순 상태 체크 API이므로 굳이 async를 쓸 필요가 없습니다.
@app.get("/")
def root(): 
    return {
        "status": "online",
        "message": "B2B SaaS API is running (Sync Database)",
        "docs": "/docs"
    }