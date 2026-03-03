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
2. **가이드라인(`GEMINI.md`) 전면 개편:** Nix, IDE 내장 Web Preview, Firebase MCP 관련 지시 사항을 완전 삭제하고, **"로컬 Windows + Antigravity 개발 환경"**을 기준으로 터미널을 통한 `npm run 기dev` 수동 구동 지침으로 시스템 프롬프트를 재작성했습니다.
3. **분석 보고서(`docs/project_analysis_report.md`) 최신화:** 프로젝트 생태계가 클라우드에서 로컬 PC 환경으로 마이그레이션 되었음을 명시하여 향후 AI가 환경에 대해 오판하지 않도록 안전장치를 마련했습니다.
4. **회원가입 "Failed to fetch" 백엔드 종속성 버그 해결 (Hotfix):**
   - **증상:** 프론트엔드에서 회원가입 시도 시 크롬에 `Failed to fetch` 에러가 발생. 실제로는 백엔드(FastAPI)가 에러 처리 도중 터져서 `500 Internal Server Error`를 반환하고 있었습니다.
   - **원인 (알기 쉬운 설명):** 
     파이썬 백엔드에서 비밀번호를 안전하게 암호화하기 위해 `passlib`이라는 좀 오래된 도우미 라이브러리와 `bcrypt`라는 최신 핵심 암호화 라이브러리를 함께 쓰고 있었습니다. 
     그런데 최신 버전을 쓰는 `bcrypt(v5.0.0)` 내부 구조가 업데이트되었는데, 지원이 끊긴 구형 `passlib`이 이를 제대로 인식하지 못하고 **"비밀번호 길이가 72바이트를 넘었어!"** 라며 엉뚱한 착각(버그)을 일으키며 서버 전체를 다운시켜 버린 것입니다.
   - **해결책 (영구 조치):**
     버전을 내리는 임시방편(다운그레이드)을 쓰는 대신, **문제를 일으키는 중간 다리 역할인 `passlib` 모듈을 아예 코드에서 완전히 삭제(Bypass)했습니다.** 그리고 최신 `bcrypt` 라이브러리의 오리지널 함수(`hashpw`, `checkpw`)만 직접 사용하도록 백엔드 핵심 인증 로직(`src/domains/auth/service.py`)을 전면 재작성하여 영구적인 호환성과 안정성을 확보했습니다. (이 수정본이 Render 클라우드에 성공적으로 재배포되어 가입 정상화 완료)
5. **Cloudflare Pages Edge Runtime 빌드 오류 해결 (Hotfix):**
   - **증상:** 프론트엔드를 Cloudflare Pages에 무료 호스팅(Deploy) 하려는 과정에서 `/_not-found`, `/login`, `/register` 라우트들이 빌드에 실패(오류 코드 1)하는 현상 발생.
   - **원인:** Cloudflare 환경은 일반적인 Node.js 서버가 아니라 무거운 연산이 불가능한 가벼운 엣지 네트워크(Edge Platform) 기반이라, 동적 렌더링이 들어가는 페이지(서버 컴포넌트, 서버 액션 등)는 명시적으로 "나는 엣지 환경에서 돌아갑니다"라고 `export const runtime = 'edge';` 선언을 해두어야만 빌드 단계를 통과시킬 수 있습니다.
   - **해결책:** 문제가 된 `/login`, `/register` 페이지 최상단, 그리고 명시적으로 존재하지 않아 에러를 일으키던 `/_not-found` 페이지를 새로 만들고 최상단에 `export const runtime = 'edge';` 구문을 일괄 추가하여 GitHub에 푸시 완료, 정상 빌드 되도록 조치했습니다.
6. **배포 환경 변경 (Cloudflare Pages -> Vercel):**
   - **경과:** Cloudflare Pages의 제한적인 Edge Runtime 제약으로 인해 서버 컴포넌트 구동의 불안정함이 지속됨을 확인. Next.js와 100% 호환되는 Vercel로 프론트엔드 호스팅을 이관하기로 결정했습니다.
   - **조치:** Cloudflare 빌드 통과를 위해 임시로 끼워 넣었던 모든 `export const runtime = 'edge';` 설정 코드(`/login`, `/register`, `/_not-found`)를 삭제하여 코드를 순정 상태로 되돌리고 깃허브에 푸시 배포 준비를 완료했습니다.

### 🏃 Phase 2: 서브 페이지 및 상태 관리 연동 시작
7. **대시보드 Route Group 바탕 공사 및 서브 페이지 생성:**
   - **문제:** 기존 루트 레이아웃(`src/app/layout.tsx`)에 사이드바와 헤더가 박혀 있어서 로그인/회원가입 화면에서도 비정상적으로 사이드바가 노출되는 UI 결함 존재.
   - **해결:** Next.js의 `(dashboard)` Route Group 폴더를 신설하여 대시보드 안쪽에서만 렌더링될 전용 레이아웃 분리 적용 완료.
   - **페이지 추가:** 사이드바 메뉴에 매핑되도록 `/users` (팀 유저 관리) 및 `/settings` (계정 세팅) 라우트에 반응형 Skeleton UI 화면을 신규 생성하여 클릭 시 즉시 화면이 전환되도록 구현.

8. **Render 백엔드 콜드 스타트 지연(무한 로딩) 현상 원인 규명 및 꼼수 가이드 제공:**
   - **증상:** 배포된 Vercel 첫 로그인 시 시간이 30초 이상 무한 로딩처럼 매우 오래 걸리는 현상 발생.
   - **원인:** Render 호스팅 무료 요금제 정책 (15분간 트래픽이 없으면 백엔드 서버가 강제 수면 상태로 전환됨). 첫 요청 시 서버가 재부팅되면서 DB 커넥션을 맺고 파이썬을 가동하느라 긴 딜레이가 발생하는 '콜드 스타트(Cold Start)' 현상.
   - **조치:** 버그나 코드 결함이 아님을 규명. `cron-job.org`를 이용하여 10분마다 지속적으로 프록시 요청을 날려 서버 수면을 방지하는 꼼수 우회책(Workaround)을 사용자에게 제안하고 메뉴얼을 제공함.

9. **Next.js Server Actions 도입 및 실시간 상태 갱신(Revalidation) 연동:**
   - **배경:** 대시보드 리스트에서 새로운 캠페인을 생성하거나 기존 캠페인을 삭제했을 때, 화면을 수동으로 새로고침(F5)하지 않으면 데이터가 반영되지 않는 원초적인 상태 관리 부재 문제 해결 필요.
   - **해결 (`actions/campaigns.ts` 신설):** 프론트엔드와 백엔드를 이어주는 그물망 API 프록시 구조(`route.ts`)를 제거하고, Next.js의 최신 문법인 **Server Actions**(`createCampaign`, `deleteCampaign`)로 전면 개편했습니다.
   - **효과:** 데이터 변이(Mutation) 성공 직후 즉시 `revalidatePath('/')` 함수를 강제 호출하여, 서버 쪽에 캐싱되어 있던 낡은 캠페인 목록을 폐기하고 즉각적으로 백엔드 DB의 최신값을 다시 읽어와 화면 전체(상단 통계 숫자 및 하단 목록)를 알아서 리렌더링(Refresh) 하도록 구현 완료.

10. **대시보드 상단 요약 위젯 실제 데이터 연동:**
    - **조치:** "₩28,500,000", "1,284" 등 하드코딩 되어 있던 목업 숫자들을 모조리 걷어내고, 백엔드에서 불러온 `campaigns` 배열을 `reduce` 하여 실제 현재 활성화된 "총 광고 예산(Total Spend)"과 "평균 ROAS(Avg. ROAS)"를 실시간 자동 수식 계산을 통해 화면에 그려주도록 전환 완료.

11. **Performance Chart (차트 UI) 데이터 스케일링 버그 수정:**
    - **증상:** 클릭수(Clicks, 약 2000 단위)와 전환수(Conversions, 약 50 단위)가 하나의 Y축(세로축)을 바라보고 있어 전환수 그래프가 바닥에 일직선으로 붙어버리는 스케일(Scale) 불일치 문제 확인.
    - **조치:** Recharts 라이브러리의 다중 Y축(Dual Y-Axis) 기능을 활용하여, 왼쪽에는 클릭수 전용 Y축을 만들고 오른쪽에는 전환수 전용 Y축을 분리 배치(`yAxisId="right"`). 두 지표 모두 시각적으로 변동폭이 뚜렷하게 보이도록 UI/UX 수정 완료.

12. **Performance Chart (차트 UI) 하드코딩 제거 및 실데이터 기반 트렌드 산출:**
    - **배경:** 차트를 채우고 있던 `mockData`가 백엔드 데이터와 무관하게 멈춰있었음.
    - **해결 (`PerformanceChart.tsx`):** 고정된 날짜 배열을 지우고, 백엔드에서 불러온 현재 활성화된 캠페인들의 "총 예산"과 "평균 ROAS"를 기준으로 최근 7일간의 우상향 트렌드 라인(추정 클릭수/전환수)을 **동적으로 계산**하여 그리도록 유도 로직 추가.
    - **적용된 추정 수식(Formula):**
      1. `오늘의 기준 클릭수` = 전체 캠페인 총 예산(Total Budget) / 800 (1클릭당 800원 가정)
      2. `오늘의 기준 전환수` = 유효 클릭수 * (평균 ROAS / 100)
      3. `7일간의 트렌드 변화량 (Volatility)` = 과거로 갈수록 하루당 약 12%씩 수치 차감 (`1 - (과거 일수 * 0.12)`) + 매일 약 -2% ~ +3%의 자연스러운 무작위 노이즈 추가.
    - **효과:** 앞으로 캠페인을 새로 추가하거나 삭제할 때마다 대시보드의 메인 차트 그래프 선형이 즉각적으로 변동하여 움직이는 진짜 라이브 대시보드(Live Dashboard) 경험 제공.

---
 
### 🏃 Phase 3 진행 완료 (UX/UI 폴리싱 및 안정성 확보)

13. **모바일 반응형 완벽 대응 (Mobile Responsiveness):**
    - **조치 (`layout.tsx`, `Sidebar.tsx`, `Header.tsx`):** 모바일 기기(작은 화면) 접속 시 사이드바를 기본적으로 숨기고, 헤더 좌측 상단에 햄버거 메뉴(Hamburger Icon) 버튼을 배치하여 슬라이드 열기/닫기(Slide-in Overlay) 모드로 전환되도록 구현. 레이아웃 붕괴 현상 수정 완료.
    - **조치 (`CampaignTable.tsx`):** 테이블 컬럼 데이터가 많아 모바일 화면 밖으로 넘치는 현상을 방지하기 위해 컨테이너에 `overflow-x-auto`를 명시하여 모바일 환경에서만 부드러운 가로 스와이프 스크롤링이 가능하도록 개선.

14. **글로벌 에러 복원력 및 로딩 스켈레톤 상태 추가:**
    - **조치 (`loading.tsx`):** Next.js의 Suspense 기능을 이용, 서버 연동이나 API 통신으로 인해 화면 로딩이 지연될 때 사용자에게 `Lucide` 스피너와 함께 "데이터를 실시간으로 가져오는 중..." 안내를 띄우는 네이티브 로딩 UI 적용.
    - **조치 (`error.tsx`):** API 호출 에러 등 런타임 오류가 발생하더라도 프론트엔드가 하얗게 죽는 현상을 방지하고, 에러 바운더리(Error Boundary)를 통해 "다시 로드하기" 버튼을 제공하는 사용자 복구 UI 장착.

100. **투박한 브라우저 `alert()` 퇴출 및 Toast 팝업 도입:**
    - **조치 (`package.json`, `layout.tsx`):** `react-hot-toast` 라이브러리를 설치 및 루트 레이아웃에 주입.
    - **조치 (`CampaignList.tsx`, `CampaignModal.tsx`):** 캠페인 추가 및 삭제 성공/실패 시 촌스러운 기본 브라우저 브라우저 다이얼로그(`alert()`)를 완전히 제거하고, 우측 하단에서 우아하게 팝업되는 `toast.success`와 `toast.error` 알림 메시지로 UX 대폭 업그레이드.

---

## 📅 2026-02-28 (Vercel 배포 디버깅 및 UI/UX 폴리싱)

### 👤 사용자 요청 사항 (User Request)
> "반응형 웹 디자인을 살펴봤을때, 위젯 카드들의 크기가 달라. 이렇게 만든 이유가 있는거야? 아니면 이게 최선이야?"
> "여기서 users랑 settings 밑에 있는 주석들의 가시성을 좀 더 좋게 만들어줘. 버튼이랑 너무 붙어있어"

### 🤖 AI 실행 내역 (AI Actions)
16. **대시보드 반응형 그리드 밸런스 완전 개편:**
    - **증상:** 태블릿/모바일(중간폭 화면) 등에서 상단 아이콘 요약 카드는 작고 귀엽게 나열되나, 바로 밑의 [AI Insight] 카드가 무작정 100% 가로 전체를 점유하여 수직으로 늘어나 심미성이 깨지는 현상 발견 (CSS Grid 분할 한계).
    - **조치 1 (`page.tsx`):** 누락되어 있던 **`Active Campaigns`** 통계 카드를 되살려 넣어 총 4개의 위젯이 1줄 4칸(`lg:grid-cols-4`) 또는 2줄 2칸(`sm:grid-cols-2`)으로 직관적이고 안정감 있게 딱 맞아떨어지는 완벽한 사각 구도로 배치되도록 레이아웃 재편.
    - **조치 2 (`InsightCard.tsx`):** 좁은 화면으로 밀려날 때, 한 개의 카드가 줄을 다 차지하지 않게 서로 반반 크기로 나란히 공존하는(`grid-cols-2`) 반응형 클래스를 직접 주입하여 **상단 위젯 영역과 하단 AI 영역의 크기 불균형 및 투박함을 100% 소거** 완료.

17. **헤더(Header) 모바일 텍스트 가시성 향상 및 여백 분리:**
    - **증상:** `/users`, `/settings` 페이지 접근 시 화면 너비가 좁아지면 설명글(Description) 텍스트가 좌측 영역을 벗어나 우측의 [Invite User] 같은 파란 액션 버튼 밑으로 숨을 못 쉬고 바짝 짓눌리는(`flex items-center` 찌그러짐 현상) 문제 수정.
    - **조치:** 모바일 뷰어(`sm` 미만)에서는 타이틀/설명 영역이 상단에 가고, 버튼 영역이 여유 있게 아래 단락으로 시원하게 분리되도록 반응형 스택 구조(`flex-col sm:flex-row`)로 변경 및 버튼 압착 방지(`shrink-0`) 처리 완료.

### 👤 사용자 요청 사항 (User Request)
> "캠페인 생성이 안되네. Vercel에서 An error occurred in the Server Components render. 발생"
> "렌더 로그 보니까 POST /campaigns/ HTTP/1.1 422 Unprocessable Entity 에러가 나"

### 🤖 AI 실행 내역 (AI Actions)
18. **Vercel Edge 런타임 제약(Server Render 에러) 제거:**
    - **원인:** Cloudflare 배포용으로 대시보드 최상단에 부착해 둔 `export const runtime = 'edge';` 구문이, Next.js Server Actions(`createCampaign`)의 Vercel 프로덕션 기반 재검증(캐시 갱신, `revalidatePath`) API 스펙과 강력하게 충돌하여 Vercel 컴포넌트 전체가 붕괴되는 현상.
    - **조치 (`page.tsx`):** Vercel은 표준 Node.js 환경에서 최적화되므로 더 이상 필요 없어진 `edge` 런타임 명시 구문을 아예 통째로 삭제하여 기본 렌더링 성능 및 최신 캐싱 문법이 온전히 발휘되도록 조치. 

19. **Form Submit HTTP 422 (Unprocessable Entity) 치명적 에러 영구 해결:**
    - **원인:** 프론트엔드 모달창(`<CampaignModal>`) 내에서 텍스트 입력을 담당하는 4개의 `<input>` 요소들에 HTML 식별자인 `name="..."` 속성이 통째로 누락된 상태였음. 이로 인해 '추가하기' 버튼 클릭 시 `new FormData()` 자바스크립트 객체가 입력된 값들을 빈 공기(`null`)로 포장해서 백엔드로 던졌고, 깐깐한 타입 검증기(Pydantic)를 쓰는 FastAPI 백엔드가 "필수 항목(이름, 광고주, 예산)이 안 들어왔잖아!" 라며 422 Validation Error 로 가차 없이 튕겨냈던 것임.
    - **해결 (`CampaignModal.tsx`):** `<input id="name" name="name">`, `<input name="budget">` 등 모든 인풋 폼 구조에 속성 라벨표를 명확하게 매핑(부착)하여 폼 추출기가 데이터를 정상적으로 읽어내 백엔드 JSON 페이로드로 무사히 변형해 전송할 수 있도록 완벽 복구 달성. 생성이 즉각 성공함.

20. **프로젝트 중장기 로드맵 기획 갱신 (`2026-02-28`):**
    - 기존 1~3주차 계획(Phase 1,2,3)이 전량 조기 달성 및 Vercel 안정화 됨에 따라 향후 고도화 목표를 구상함.
    - **Phase 4 (다크 모드 연동), Phase 5 (Framer Motion 프레임워크 기반 마이크로 인터랙션), Phase 6 (고도화된 차트 및 다이나믹 권한 롤백 시스템)** 을 수립하여 `future_roadmap_report.md` 에 전면 기록하고 저장함.

---

### 🏃 Phase 4 진행 완료 (다크 모드 및 테마 시스템)

21. **다크 모드 글로벌 설정 및 Hydration 버그 해결:**
    - **조치 (`ThemeProvider.tsx`, `layout.tsx`):** `next-themes`를 도입하여 전역 테마 프로바이더를 설치하고 시스템 환경 및 스토리지 연동을 지원하도록 구성.
    - **버그 해결 (`ThemeToggle.tsx`):** 서버(SSR)와 클라이언트(CSR) 간 렌더링 불일치로 인한 Hydration Mismatch와 토글 오작동 이슈를 인지, `useEffect` 마운팅 시점을 분리하여 깜빡임 없는 안정적인 해/달 아이콘 토글 컴포넌트 완성.
22. **UI 컴포넌트 및 서브 페이지 다크 모드 클래스 페어링 적용:**
    - **조치:** `Sidebar.tsx`, `Header.tsx`, `page.tsx` 내부 위젯 등 모든 컨테이너와 텍스트 요소에 Tailwind `dark:` 변수 추가 (`bg-gray-900`, `text-white`, `border-white/10` 등).
    - **추가 보완 (`users/page.tsx`, `settings/page.tsx`):** 메인 대시보드뿐만 아니라 서브 페이지들까지 색상 페어링을 완벽하게 맞춤.
    - **그림자 교정 (`CampaignList.tsx`):** '새 캠페인 추가' 버튼의 과도한 파란색 그림자(`shadow-blue-200`)가 다크 모드 시 어색하게 붕 뜨는 현상을 제거(`dark:shadow-none`).
23. **차트 데이터 비주얼라이제이션 동적 다크 모드 (Recharts):**
    - **조치 (`PerformanceChart.tsx`):** 백엔드 지표가 시각화된 차트의 축(Axis) 텍스트와 그리드 선 색상이 라이트/다크 테마 환경에 따라 대비를 이루며 능동적으로 변환되도록 `useTheme()` 훅 연동.

---

### 🏃 Phase 5 진행 완료 (애니메이션 및 인터랙션 최적화)

24. **Framer Motion 페이지 전환(Page Transitions) 및 Layout 래핑 개편:**
    - **조치 (`PageTransition.tsx`, `template.tsx`):** 처음에는 `AnimatePresence`를 루트 레이아웃(`layout.tsx`)에 넣었으나, Next.js App Router 특성상 페이지 전환 시 이전 DOM과 겹쳐 애니메이션 버그가 발생하는 것을 확인했습니다. 이를 해결하기 위해 `template.tsx` 파일로 트랜지션 로직을 이관하여, 라우트 이동 시마다 깨끗하게 새 컴포넌트가 부드러운 Apple 스타일의 스케일 앤 슬라이드(`scale: 0.98 -> 1`, 0.7s) 효과로 등장하도록 개선했습니다.
    
25. **대시보드 하이드레이션(Hydration) FOUC(깜빡임) 및 스크롤 점핑 해결:**
    - **증상:** 새로고침(F5) 시 클라이언트 애니메이션이 적용되기 전, 서버에서 넘겨준 날 것의 HTML 요소들(FOUC)이 0.1초간 번쩍거리며 렌더링되거나 차트가 높이를 잡는 과정에서 레이아웃 점핑(Layout Shift)이 발생하는 불쾌한 경험 확인.
    - **해결 (`DashboardContent.tsx`):** React가 DOM을 완전히 장악(Hydration 완료)하기 전까진 컨테이너 전체를 화면에서 가려두는 **CSS 투명도 전환 해킹(`opacity-0` -> `opacity-100 duration-700`)**을 최초 도입하여 초기 깜빡임 및 점핑 현상을 원천 차단했습니다.

26. **중첩 스태거(Staggered Children) 연산 충돌에 의한 뚝뚝 끊김(Stuttering) 해결:**
    - **원인:** 초기에는 `DashboardContent` 부모 영역에서 4개의 작은 위젯뿐만 아니라, 하단의 무거운 `CampaignTable` 로우(Row) 수십 개까지 한 번에 물리 엔진(`spring`) 기반으로 묶어 폭포수 애니메이션(Stagger)을 연속계산토록 설계했습니다. 하지만 이 다중 중첩 연산이 브라우저 메인 스레드(JS)를 잠식하여 정작 애니메이션 재생 도중에 화면이 멈추거나 프레임이 뚝뚝 떨어지는 치명적 버그가 발생했습니다.
    - **해결 (`CampaignTable.tsx`, `DashboardContent.tsx`):** 성능 저하의 주범인 대규모 묶음(Stagger) 래퍼를 완전히 제거하고, 무거운 탄성(`spring`) 물리 엔진을 가벼운 등속도(`tween`) 효과로 전부 다운그레이드 했습니다. 추가로 애니메이션 대상 엘리먼트마다 `will-change: transform, opacity` 속성을 하드코딩 부여하여 브라우저 전용 그래픽 메모리(GPU) 레벨에서 가속되도록 최적화했습니다.

27. **반응형 차트(Recharts) 사이즈 계산 병목 제거 연기(Delay) 처리:**
    - **원인:** 중앙의 `PerformanceChart` 내부 `ResponsiveContainer`가 처음 마운트 될 때 뿜어내는 수천 줄의 복잡한 SVG 리사이징 계산 연산이, 하필이면 `framer-motion`이 한창 애니메이션 프레임을 열심히 그리고 있는 0.5초 경에 동시 다발적으로 터지면서 프레임 드랍(Stutter)의 직접적 요인이 되었습니다.
    - **해결 (`PerformanceChart.tsx`):** 전체 페이지 전환과 대시보드 페이드 인(Fade-in) 애니메이션이 안정적으로 100% 종료될 때까지 그래프 자체의 렌더링을 900ms 뒤로 늦추는(Delay) 기법을 사용했습니다. 그동안 빈자리는 텍스트나 `animate-pulse`(반짝임 스켈레톤)로 예쁘게 채워두어 사용자 시각을 부드럽게 분산시켰습니다.

28. **글로벌 애니메이션 속도 및 우아함 튜닝 (사용자 피드백 수용):**
    - **조치:** "애니메이션을 쪼오금만 느리게 해줄래?" 라는 사용자 최종 피드백에 맞춰 전체 속도감을 하향(Down-tune) 조정.
    - 전체 바탕 페이지 등장 시간: `0.4초` -> `0.7초` (여유롭게 스케일 업)
    - 내부 대시보드 컨텐츠 투명도 등장 시간: `300ms` -> `700ms` (스르륵 차오름)
    - 그래프 차트 지연 렌더링 등장 시간: `600ms` -> `900ms` (애니메이션 완료 후 등판토록 맞춤)

---

### 🏃 Phase 6 진행 완료 (한국형 실무 분석 대시보드 고도화)

29. **매체별 퍼포먼스 비교 차트(Media Compare Chart) 도입:**
    - **배경:** 하나의 통합 지표만으로는 광고 매체(구글, 메타, 네이버 등)별 효율을 파악하기 힘들다는 로드맵 의제를 반영.
    - **조치 (`MediaCompareChart.tsx`):** 활성화된 캠페인 데이터를 실시간으로 그룹화(Group-by Advertiser)하여, 총 예산(Total Budget)과 평균 ROAS를 이중 Y축 막대 그래프(Bar Chart)로 시각화했습니다. 하이드레이션 병목을 막기 위해 900ms 지연 렌더링 방식을 차용하여 대시보드 중앙 하단에 안착시켰습니다.

30. **한국 기준 KST 달력 필터(Date Picker) 및 프리셋 컨트롤:**
    - **배경:** 대시보드 데이터 조회 시 가장 빈번하게 쓰이는 '오늘', '어제', '최근 7일', '이번 달' 등의 퀵 필터(Quick Filters) 필요.
    - **조치 (`date-range-picker.tsx`):** 외부 라이브러리(Day.js 등) 패키지 설치 없이 브라우저 내장 KST(한국 표준시) 연산 훅과 Native HTML5 `type="date"` 인풋을 조합해 속도와 안정성이 보장되는 초경량 데이트 피커를 직접 구현했습니다.
    - **효과:** 대시보드 최상단 우측에 퀵 필터 칩(Chip) 메뉴를 달아두어 직관성을 극대화했으며 향후 백엔드 API와의 즉각적인 쿼리 커플링이 가능하도록 상태 처리를 완료했습니다.

31. **조직 롤(Role) 및 멤버 관리 페이지 리모델링 (`/users`):**
    - **배경:** 존재하지 않았던 팀원 초대 권한 체계(RBAC) UI 구현.
    - **조치 (`UserTable.tsx`, `InviteUserModal.tsx`):** 텅 비어있던 유저 목록 페이지에 Mock 데이터를 동원한 명단 테이블(관리자, 편집자, 뷰어 배지)을 박아 넣고, `Invite User` 버튼 클릭 시 `framer-motion`과 흡사한 커스텀 Tailwind 팝업 애니메이션(`animate-in zoom-in-95`)으로 사용자 초대 이메일 발송 모달을 구현했습니다.

---

### 🏃 Phase 7 진행 완료 (로컬 통합 및 내보내기 / Local Integration & Exports)

32. **원화(KRW) 전역 포맷팅 유틸리티 도입:**
    - `src/lib/utils/currency.ts` 유틸리티 함수를 신설하여 `Intl.NumberFormat`을 기반으로 한 ₩ 단위 및 천 단위 콤마 포맷팅을 적용했습니다.
    - 대시보드 위젯의 "Total Ad Spend"와 `CampaignTable.tsx`의 "Budget" 컬럼에 일관된 원화 기호 표시 연동을 완료했습니다.

33. **EUC-KR(한국어 엑셀) 호환 CSV 다운로드 기능 구현:**
    - 서버 부하를 유발하는 외부 패키지(예: xlsx) 없이 브라우저 Native `Blob` API를 활용해 CSV 내보내기 로직을 구현했습니다.
    - 한글(캠페인 명, 매체 명 등)이 MS Excel에서 깨지지 않도록 `\uFEFF` (UTF-8 BOM) 헤더 처리를 진행하여 국내 실무자의 편의성과 다운로드 정확성을 극대화했습니다. 
    - `CampaignList.tsx` 영역 우측 상단에 "CSV 다운로드" 액션 버튼을 신규 배치했습니다.

34. **조직 알림 연동(Integration) 설정 UI 개발:**
    - `WebhookSettings.tsx` 독립 컴포넌트를 신규 제작하고 설정(`/settings`) 페이지 하단에 배치했습니다.
    - 내부 프레임워크 패키지 의존성 충돌(UI 컴포넌트 Import Error)을 감지하고, 즉각적으로 Tailwind 스타일링이 가미된 순수 Native HTML5 `input`, `button` 요소로 코드를 안전하게 치환하여 빌드 다운타임 및 에러를 제거했습니다.
    - Slack Incoming Webhook 및 카카오 비즈메시지 알림톡 Host Key를 입력받고 저장하는 프론트엔드 모의 동작(Toast 애니메이션) 검증을 마쳤습니다.

---

## 📅 2026-03-03 (Phase 8 진행 완료 - AI Budget Optimizer)

### 👤 사용자 요청 사항 (User Request)
> "phase 8 개발 시작해줘."

### 🤖 AI 실행 내역 (AI Actions)
35. **백엔드 AI 분석 및 최적화 엔진 기본 설계 (Mock):**
    - **조치 (`campaigns/router.py`, `service.py`):** `/optimize` 엔드포인트를 신규 생성하고, LLM 연동 전 임시로 캠페인의 성과(ROAS)를 룰 기반(150 미만 시 삭감, 300 초과 시 증액)으로 평가하여 예산을 10% 자동 조정 및 DB 갱신하는 비즈니스 로직 적용.

36. **백엔드 마케팅 AI 챗봇(Chatbot) 엔드포인트 구현:**
    - **조치 (`chat/router.py`, `models.py`, `main.py`):** Chat 도메인을 신설하여 사용자의 질의(Message)를 받고 키워드를 파악해(Mock) 데이터 인사이트 텍스트를 응답하는 `/chat/ask` API를 생성하고 메인 라우터에 통합.

37. **프론트엔드 AI 챗봇 전역 위젯(Widget) 및 프록시 연동:**
    - **조치 (`MarketingChatbot.tsx`, `api/chat/route.ts`, `layout.tsx`):** Shadcn UI를 활용해 대시보드 우측 하단에서 팝업으로 열리는 채팅창 위젯을 제작하고 전역 레이아웃에 주입. CORS 통신 문제를 방지하기 위한 Next.js 서버사이드 API Proxy 엔드포인트를 구성하여 통신 연결 완료.

38. **프론트엔드 캠페인 AI 최적화 원클릭 액션(Action) 연동:**
    - **조치 (`CampaignTable.tsx`, `actions/campaigns.ts`, `CampaignList.tsx`):** 기존 캠페인 테이블에 로봇 봇(Bot) 아이콘을 부착. 클릭 시 서버 액션(`optimizeCampaign`)을 호출해 즉각 예산 조정을 트리거하고 `revalidatePath('/')`로 지연 없이 최신 상태를 대시보드 화면 전체에 리렌더링하도록 구조 확립.
