# 🚀 B2B SaaS 대시보드 배포 가이드 (Cloudflare & Render)

성공적인 로컬 테스트를 마치고 프로덕션(Production) 환경에 배포하기 위한 가이드입니다. 프론트엔드(Next.js)는 Cloudflare Pages에, 백엔드(FastAPI)는 Render에 배포하는 것을 상정하여 설정 및 환경 변수(Environment Variables) 목록을 정리했습니다.

---

## 🌎 1. 백엔드 배포 (Render.com + FastAPI)

Render에 FastAPI를 배포할 때, 프로젝트 설정과 환경 변수가 중요합니다.

### ✅ 환경 변수 (Environment Variables) 목록

Render 대시보드의 **Environment** 탭에 다음 변수들을 추가해주세요:

| Key | Value (예시) | 설명 |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres...supabase.com:6543/postgres` | Supabase 프로젝트의 **Connection String (Transaction Pooler)**. `supabase.com` 키워드가 URL에 포함되어 있으면 `database.py`에서 자동으로 SSL 모드(`sslmode=require`)를 활성화합니다. (로컬 테스트용 SQLite나 로컬 PostgresURL을 넣으면 SSL 모드는 꺼집니다) |
| `JWT_SECRET_KEY` | `강력한_랜덤_시크릿_키` | 인증(Auth) 토큰을 생성할 때 사용되는 비밀키입니다. 로컬(`.env`)에서는 단순한 문자열을 썼지만, 프로덕션에서는 해킹 방지를 위해 복잡한 키를 넣으세요. (`openssl rand -hex 32` 등으로 생성 추천) |
| `ALGORITHM` | `HS256` | JWT 생성 알고리즘 (기본값 추천) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | 토큰 만료 시간 (분) |
| `PYTHON_VERSION` | `3.11.x` | (선택사항) Render가 사용할 파이썬 버전을 명시해 호환성을 높일 수 있습니다. |

### ✅ 백엔드 DB 설정 (database.py) 로컬/배포 구분 확인
이미 `database.py`에는 아래와 같이 **자동 판단 로직**이 탑재되어 있습니다. 
따라서 로컬과 배포 환경에서 **코드를 수정할 필요 없이 `DATABASE_URL` 환경 변수만 바꿔끼우면** 알아서 SSL 모드를 토글(Toggle)합니다.
```python
connect_args = {}
if "supabase" in SQLALCHEMY_DATABASE_URL:
    connect_args = {"sslmode": "require"} # 배포용: Supabase면 SSL 강제 
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=False, connect_args=connect_args) # 로컬이면 빈 딕셔너리가 들어감
```

---

## ⚡ 2. 프론트엔드 배포 (Cloudflare Pages + Next.js)

Next.js 프론트엔드를 Cloudflare Pages 또는 Vercel에 배포할 때는 백엔드 API 서버를 바라보도록 설정해야 합니다.

### ✅ 환경 변수 (Environment Variables) 목록

Cloudflare Pages 대시보드의 **Settings > Environment variables** 탭에 다음 변수를 추가해주세요:

| Key | Value (예시) | 설명 |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://my-backend-app.onrender.com` | Render에 배포된 백엔드의 **루트(Root) 접속 도메인**입니다. 끝에 `/` 슬래시를 빼고 입력하세요. (이 변수가 없으면 기본값인 `http://127.0.0.1:8000`을 바라보게 됩니다) |
| `NODE_VERSION` | `20` | (선택사항) Cloudflare 환경이 Next.js 빌드를 성공적으로 수행할 수 있게 Node 버전을 명시해줍니다. |

### ✅ 클라이언트 & 서버 사이드 라우팅 동작 원리
- `next.config.ts` 및 `page.tsx(SSR fetch)`에서 `process.env.NEXT_PUBLIC_API_URL`을 바라보도록 동적 수정되었습니다.
- 클라이언트 컴포넌트(Client Component)는 `/api/campaigns`로 호출하고, Next.js 서버(Cloudflare)가 이를 투명하게 Render 백엔드(예: `https://my-backend-app.onrender.com/campaigns`)로 프록시(Proxy)합니다. CORS 이슈와 엔드포인트 노출을 완벽하게 방어하는 핵심 설정입니다.

---

### 🎉 배포 성공을 위한 팁
1. **순서:** 항상 **백엔드(Render)를 먼저 배포**하고 DB 연결을 확인한 뒤, 생성된 Render 도메인을 복사해서 프론트엔드(Cloudflare)의 환경 변수로 설정하여 배포하세요.
2. **빌드 커맨드:** 
   - Backend: `pip install -r requirements.txt` (Build) / `uvicorn src.main:app --host 0.0.0.0 --port 10000` (Start)
   - Frontend: `npm run build` (Build) / Cloudflare는 Next.js 프리셋 자동 인식

준비가 완료되었습니다! 건투를 빕니다! 🫡
