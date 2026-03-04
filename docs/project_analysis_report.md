# 📊 프로젝트 분석 보고서 (Project Analysis Report)

본 보고서는 현재 작업 경로에 있는 파일들을 역설계하여 파악한 프로젝트의 구조, 스택 및 핵심 도메인에 대한 분석 결과를 담고 있습니다.

## 🎯 1. 프로젝트 개요 (Overview)
이 프로젝트는 **B2B SaaS 형태의 AI 마케팅 퍼포먼스 플랫폼**입니다. 사용자는 이 플랫폼을 통해 광고 지출(Ad Spend), 평균 클릭률(Avg. CTR), 총 전환수(Total Conversions) 등의 핵심 성과 지표를 대시보드에서 실시간으로 확인하고 마케팅 캠페인을 관리(생성/조회/삭제)할 수 있습니다.

본 프로젝트는 초기에 클라우드(Firebase Studio) 환경에서 부트스트랩 되었으나, 현재는 **사용자의 로컬 Windows 환경 및 Antigravity AI** 환경으로 이관되어 개발이 진행되고 있습니다. 프론트엔드는 Next.js 기반으로 풍부한 UI/UX를 제공하며, 백엔드는 Python FastAPI와 SQLModel을 사용하여 빠르고 안정적인 API를 제공하는 분리된(Full-Stack) 구조를 가지고 있습니다.

---

## 💻 2. 기술 스택 (Tech Stack)

### 🎨 프론트엔드 (Frontend)
- **프레임워크:** Next.js (App Router, v16.1.6), React 19
- **스타일링:** Tailwind CSS (v4), `tw-animate-css` (애니메이션 효과)
- **UI 컴포넌트:** Radix UI, Shadcn UI (`@/components/ui`)
- **아이콘 및 차트:** Lucide React (아이콘), Recharts (데이터 시각화)
- **특징:** 클라이언트 컴포넌트(`"use client"`)를 적극 활용하여 차트 및 모달 창과 같은 대화형(Interactive) 대시보드 UI를 구현했습니다.

### ⚙️ 백엔드 (Backend - `b2b-saas-backend` 폴더)
- **프레임워크:** FastAPI, Uvicorn (비동기 ASGI 서버)
- **데이터베이스/ORM:** SQLite (`database.db`), SQLModel, SQLAlchemy (동기식 DB 연결 사용)
- **인증 및 보안:** `bcrypt` (비밀번호 해싱), `python-jose` (JWT 토큰 발급 및 검증)
- **아키텍처:** 도메인 주도 설계(DDD - Domain Driven Design) 패턴을 차용하여 `src/domains/` 하위에 각 비즈니스 로직을 분리했습니다.

---

## 📂 3. 핵심 도메인 및 구조 분석

### 🅰️ 프론트엔드 주요 기능 (`src/app/`, `src/components/`)
1. **대시보드 페이지 (`src/app/page.tsx`)**
   - **상단 요약 카드:** 총 광고비용, 평균 CTR, 총 전환수 등의 KPI를 보여줍니다.
   - **중앙 섹션:** 최근 7일간의 클릭/전환 퍼포먼스 트렌드를 시각화하는 차트(`PerformanceChart`)와 인사이트 카드(`InsightCard`)를 배치했습니다.
   - **하단 섹션:** 현재 진행 중인 캠페인 목록(`CampaignTable`)을 보여주고, 모달(`CampaignModal`)을 통해 새 캠페인을 추가하거나 기존 캠페인을 삭제하는 기능이 구현되어 있습니다.
   - Next.js의 API 라우트 또는 직접 백엔드 API(`/api/campaigns?organization_id=12`)와 통신하여 데이터를 가져옵니다.

### 🅱️ 백엔드 주요 도메인 (`b2b-saas-backend/src/domains/`)
1. **Auth (인증 도메인)**
   - 사용자 가입, 로그인, JWT 발급 등 시스템의 인증/인가를 담당하는 부분입니다. (보안과 접근 제어 로직 포함)
2. **Campaigns (캠페인 도메인)**
   - 프론트엔드에서 보여주는 광고 캠페인 데이터를 실질적으로 관리(CRUD)하는 핵심 비즈니스 로직입니다.
   - 조직(Organization) 단위로 캠페인 데이터가 필터링되도록 설계되어 B2B SaaS의 기본적인 멀티 테넌시(Multi-tenancy) 구조를 지원합니다.

---

## 📝 4. 결론
이 프로젝트는 **사용자 인증이 포함된 캠페인 데이터 관리용 B2B SaaS 플랫폼**의 핵심 구조를 잘 갖추고 있는 상태입니다. 프론트엔드는 현대적인 시각화 도구(Recharts)와 컴포넌트(Shadcn)를 활용해 뛰어난 대시보드 UI를 보여주고 있으며, 백엔드는 확장이 용이한 구조 분할(DDD)을 통해 유지보수가 쉽도록 설계되어 있습니다.

## 🤖 5. AI Agent & MCP
*   해당 문서에는 현재 설정된 MCP 서버 연동(SQLite) 내역과 에이전트의 로컬 실행 권한이 명시되어 있습니다.
