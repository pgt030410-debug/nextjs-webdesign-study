# 📝 작업 로그 (Work Log)

이 문서는 사용자의 요청 사항과 AI 에이전트가 실행한 작업 내역을 순차적으로 기록하는 로그 파일입니다. 모든 주요 작업은 이 곳에 기록됩니다.

---

## 📅 2026-02-27 (Phase 1 시작)

### 👤 사용자 요청 사항 (User Request)
> "phase 1부터 실행하자. 이제부터 모든 작업을 할 때마다, 내 요청사항이랑 네가 실행한 것들을 내가 만들어둔 '작업-log.md' 파일에 순차적으로 업로드해"

### 🤖 AI 실행 내역 (AI Actions)
1.  **로그 시스템 세팅 완료:** 요청하신 대로 `작업-log.md` 파일을 생성/초기화하였고, 향후 모든 작업 기록을 이곳에 최상단(또는 순차적)으로 업데이트할 준비를 마쳤습니다.
2.  **Phase 1 (인증 및 멀티테넌시 기반 공사) 기획:** 백엔드(FastAPI)의 Auth 도메인 구조를 먼저 파악하고 프론트엔드 로그인 페이지 구현 계획(Implementation Plan)을 수립하여 보고했습니다.

### 👤 사용자 요청 사항 (User Request)
> "Continue (진행해)" - Implementation Plan 승인

### 🤖 AI 실행 내역 (AI Actions)
3.  **로그인/회원가입 UI 및 인증 유틸리티 구현 시작:** 승인된 계획에 따라 `src/app/login/page.tsx`, `src/app/register/page.tsx`, 그리고 쿠키 관리를 위한 서버 액션(`src/app/actions/auth.ts`) 작성을 완료했습니다.
4.  **헤더(Header) 및 대시보드(Page) 인증 연동:** 
    - `Header.tsx`를 접속한 사용자의 이메일과 소속 조직(Org)을 보여주고 로그아웃이 가능하도록 서버 컴포넌트로 개편했습니다.
    - `page.tsx`에 Route Protection을 걸어 비로그인 시 `/login`으로 리다이렉트 시키고, API 호출 시 하드코딩된 `12`가 아닌 JWT 토큰의 실제 `organization_id`를 사용하도록 연결(Multi-Tenancy 기초)했습니다.
5.  **API 프록시(Proxy) 보안 및 토큰 연동 강화:** 
    - 프론트엔드에서 쿼리 파라미터(`?organization_id=12`)로 넘기던 취약한 방식을 버리고, `src/app/api/campaigns/route.ts` 등의 서버 API 엔드포인트 자체적으로 쿠키를 읽어 `organization_id`를 파싱하여 백엔드로 넘기도록 수정했습니다.

---

## 📅 2026-02-27 (환경 이관 및 마이그레이션)

### 👤 사용자 요청 사항 (User Request)
> "너가 로컬로 돌아가게 바꾼거 아니야? Firebase Studio에서 작업하던걸 Antigravity로 가져왔는데, md 파일들이 엉망이면 할루시네이션 나잖아. 파일들을 수정해줘."

### 🤖 AI 실행 내역 (AI Actions)
1. **환경 인지 오류 파악:** 프로젝트 루트의 `GEMINI.md` 파일에 종속된 Firebase Studio / Nix 컨테이너 기반 프롬프트로 인해 로컬 PC에서의 서버 구동 관련 할루시네이션(환각)이 발생했음을 인지했습니다.
2. **가이드라인(`GEMINI.md`) 전면 개편:** Nix, IDE 내장 Web Preview, Firebase MCP 관련 지시 사항을 완전 삭제하고, **"로컬 Windows + Antigravity 개발 환경"**을 기준으로 터미널을 통한 `npm run dev` 수동 구동 지침으로 시스템 프롬프트를 재작성했습니다.
3. **분석 보고서(`docs/project_analysis_report.md`) 최신화:** 프로젝트 생태계가 클라우드에서 로컬 PC 환경으로 마이그레이션 되었음을 명시하여 향후 AI가 환경에 대해 오판하지 않도록 안전장치를 마련했습니다.
