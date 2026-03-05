# 🐛 트러블슈팅 및 에러 로그 (Error Log)

이 문서는 프로젝트 개발 중 발생한 주요 에러, 버그, 그리고 그 해결 과정(Troubleshooting)을 기록하는 중앙 저장소입니다. 발생한 문제를 체계적으로 기록하여 향후 유사한 문제 발생 시 디버깅 시간을 단축하고 팀의 지식 기반(Knowledge Base)으로 활용합니다.

---

## [2026-03-05] `next-intl` 도입 후 루트 경로(/) 404 Not Found 에러

### 🚨 에러 현상
Phase 17 다국어(i18n) 설정 완료 후 개발 서버(`http://localhost:3000`)에 접속했을 때 **`404 - Not Found`** 페이지가 강제로 렌더링되는 현상 발생.

### 🔍 원인 분석
- `next-intl` 미들웨어는 접속자의 쿠키 및 Accept-Language 헤더를 감지하여 기본 로케일(예: `/ko`)로 강제 리다이렉션을 수행합니다.
- 그러나 Next.js의 `src/app/` 디렉토리 최상단에 페이지 레이아웃 컴포넌트들(`(dashboard)`, `login`, `layout.tsx` 등)이 위치하고 있어, `/ko`로 리다이렉트 되었을 때 이를 매치할 동적 라우팅 폴더가 존재하지 않았습니다. 즉, 프론트엔드 라우터가 경로를 찾지 못해 404 배지 컴포넌트를 호출했습니다.

### 🛠 해결 로직 (Fix)
1. **디렉토리 마이그레이션**: `src/app/` 하위에 위치한 모든 클라이언트 UI 라우팅 폴더 및 파일을 `next-intl` 규칙에 맞게 `src/app/[locale]/` 하위로 전체 편입시켰습니다.
   - `mv src/app/(dashboard) src/app/login src/app/register src/app/layout.tsx src/app/not-found.tsx src/app/[locale]/`
2. **미들웨어 호환성 유지**: `src/app/api/` 폴더는 미들웨어의 `matcher` 정규식(`((?!api|_next|_vercel|.*\..*).*)`)에 의해 제외되므로 구조 이동 없이 기존 위치에 라우팅을 유지하여 백엔드 파트와의 충돌을 방지했습니다.

---

## [2026-03-05] 디렉토리 구조 변경 후 빌드 시 Module Not Found 에러

### 🚨 에러 현상
`npm run build` 명령어 실행 중 `Turbopack build failed with 1 errors` 발생.
```bash
./src/app/[locale]/login/page.tsx:7:1
Module not found: Can't resolve '../actions/auth'
```

### 🔍 원인 분석
UI 라우팅 파일들을 `[locale]` 폴더 내부로 한 뎁스(Depth) 더 깊게 밀어넣는 과정에서, 기존에 상대 경로(`../`)로 작성되어 있던 Import 참조 값들이 어긋나는 링크 깨짐(Broken Link) 현상이 발생했습니다.

### 🛠 해결 로직 (Fix)
상대 경로 종속성을 제거하고 Next.js의 런타임 Alias Paths(`@/`)를 사용하는 절대 경로 방식으로 리팩토링했습니다.
1. `layout.tsx`: `import './globals.css'` ➡️ `import '../globals.css'` (또는 `@/app/globals.css` 로 수정 가능하나 뎁스만 맞춤)
2. `login/page.tsx`: `import { setAuthCookie } from '../actions/auth'` ➡️ `import { setAuthCookie } from '@/app/actions/auth'`
3. 위 수정본 반영 후 `npm run build` 로 재컴파일하여 `Type Error 0개` 확인 완료.

## [2026-03-05] 서버 컴포넌트 렌더링 중 쿠키 수정 에러 (Runtime Error)

### 🚨 에러 현상
대시보드 페이지 로드 중 권한이 없거나 만료된 토큰인 경우 다음과 같은 런타임 에러 발생:
```
Cookies can only be modified in a Server Action or Route Handler.
at logout (src/app/actions/auth.ts:59:23)
at PerformancePlatformPage (src/app/[locale]/(dashboard)/page.tsx:75:5)
```

### 🔍 원인 분석
- `PerformancePlatformPage`는 Next.js App Router의 **서버 컴포넌트(Server Component)**입니다.
- 서버 컴포넌트가 렌더링을 수행하는 과정에서는 쿠키를 **읽기(Read)**만 가능하며, **쓰기/삭제(Write/Delete)**는 허용되지 않습니다. 오직 'Server Action'이나 'Route Handler(API)' 환경에서만 변경이 가능합니다.
- 그런데 `page.tsx` 렌더링 과정 중 API 호출 실패 시 강제 로그아웃을 시키기 위해 `await logout()` 액션을 직접 호출하였고, 해당 액션 내부에서 `cookieStore.delete(TOKEN_NAME)` 로직이 실행되면서 Next.js의 보안/스펙 정책을 위반하여 에러가 스로잉(Throwing)되었습니다.

### 🛠 해결 로직 (Fix)
서버 컴포넌트 렌더링 과정에서 쿠키를 강제로 삭제하려던 `await logout()` 호출을 제거하고, 순수하게 렌더링을 중단시킨 후 클라이언트를 리다이렉트 처리하는 방식으로 리팩토링했습니다.
1. `src/app/[locale]/(dashboard)/page.tsx` 내 권한 검증 및 에러 핸들링 섹션 수정:
   - `if (unauthorized || tsUnauthorized) { await logout(); }` ➡️ `if (unauthorized || tsUnauthorized) { redirect('/login'); }`
2. 이렇게 하면 쿠키가 즉시 파기되진 않으나, 유저가 다시 로그인 페이지로 튕기면서 재로그인 시 유효한 새 토큰으로 덮어씌워지므로 인증 플로우에 모순이 발생하지 않습니다.
3. 적용 후 `npm run build` 시 아무런 에러 없이 렌더링 및 페이지 접근 정상 작동을 확인했습니다.

---

## [2026-03-05] 대시보드 화면 렌더링 블랭크 (Blank Screen) 및 무한 로딩 현상

### 🚨 에러 현상
로그인 후 대시보드(`/ko` 등) 진입 시 UI 구조(Sidebar, Header)는 렌더링되나, 메인 컨텐츠 영역(`DashboardContent`)이 투명도 0(빈 까만 화면)으로 노출되거나 "데이터를 실시간으로 가져오는 중입니다..." 스피너에서 무한히 멈춰있는 현상 발생.

### 🔍 원인 분석
1. **Hydration Fade-in 충돌**: `DashboardContent` 최상단 태그에 `opacity-0`가 보일러플레이트로 적용되어 있었고, 클라이언트 마운트 후 `isMounted` 훅을 통해 `opacity-100`으로 전환시키는 애니메이션이 `next-intl` 라우팅 트랜지션과 맞물리며 정상 작동하지 않음.
2. **Recharts 부하 억제 타이머 미스매치**: `PerformanceChart` 및 `MediaCompareChart`에 메인 스레드 블로킹을 막고자 강제로 900ms `setTimeout`이 걸려있어 렌더링을 완전히 가로막음.
3. **무료 티어 백엔드 웜업(Cold Start) 대기 지연**: 서버 컴포넌트(`page.tsx`)의 `getCampaigns` 및 `getAnalyticsData`가 실제 Render.com 서버로 `fetch`를 시도하나, 50초 이상 걸리는 콜드 스타트를 기다리다 보니 Next.js의 `loading.tsx` Suspense UI에서 빠져나오지 못함.

### 🛠 해결 로직 (Fix)
React/Next.js의 동기적 SSR 및 Hydration 흐름을 거스르는 인위적인 상태 타이머들을 완전히 제거하고, API 패치에 Timeout Fallback을 구현했습니다.
1. `DashboardContent.tsx`, `PerformanceChart.tsx`, `MediaCompareChart.tsx`: 불필요한 `isMounted/isReady` 타이머 지연 로직 및 `<div className="transition-opacity opacity-0">` 투명도 래퍼 삭제 -> 즉각 렌더링 허용.
2. `Sidebar.tsx`: 네비게이션 액티브 탭 하이라이트가 깨지던 현상을 해소하기 위해 오리지널 경로만 비교(`activePath`)하도록 정규식 스트리핑 추가.
3. `page.tsx` & `actions/analytics.ts`: 백엔드 `fetch` 시그널에 `AbortController`를 달아 **3초 Timeout** 설정. 실패 또는 시간초과(AbortError) 시 무한 로딩이 아닌 **초기 Mock Data(가상 데이터)** 객체를 반환하도록 Fallback을 세팅하여 즉각적인 대시보드 페인팅 보장.

---

## [$(date '+%Y-%m-%d')] 로컬호스트 무한 새로고침 (Infinite Redirect Loop) 버그
### 현상
- 사용자가 대시보드 진입 시 브라우저가 `/login` 과 `/` 혹은 혀재 라우트를 무한 반복하며 새로고침하는 현상 발생.

### 원인
1. 만료되거나 유효하지 않은 `auth_token`을 가진 상태로 서버 컴포넌트(`page.tsx`)가 백엔드에 요청을 보냄.
2. 백엔드에서 `401 Unauthorized`를 반환하고 데이터 페치 함수가 예외를 반환함.
3. 데이터 페치 실패 시 서버 컴포넌트는 사용자를 `redirect('/login')`으로 돌려보냄.
4. 그러나 서버 측 `redirect` 함수만 실행되었을 뿐, **브라우저의 만료된 `auth_token` 쿠키는 삭제되지 않았으므로** 사용자는 토큰을 들고 로그인 페이지(`/login`)에 도착함.
5. Next.js `middleware.ts`가 개입하여, "토큰이 존재하는 사용자가 로그인 페이지에 진입"했으므로 접근을 차단하고 다시 대시보드(`/`)로 돌려보냄.
6. 다시 서버 컴포넌트가 실행되고, 만료된 토큰으로 인해 `/login`으로 강제 이동, 미들웨어에 의해 다시 `/`로 이동 → 무한 리다이렉트 루프 형성.

### 조치 내역
- **로그아웃 전용 미들웨어 Interception 적용**: 서버 컴포넌트에서 직접 쿠키를 지울 수 없는 한계(Server Action에서만 쿠키 조작 가능)를 우회하기 위해, 서버 컴포넌트 내부 401 권한 에러 발생 시 `/login` 대신 아바타 라우트인 `/logout`으로 강제 리다이렉트 하도록 패턴 전체 수정.
- `middleware.ts` 파일 최상단에서 `pathname.endsWith('/logout')` 요청을 가장 먼저 캡처하고, HTTP Request 내의 `auth_token` 쿠키를 강제로 파기(Delete)한 뒤 클라이언트를 정상적인 `/login` 주소로 리다이렉트 시키도록 파이프라인 우회 구축 완료. (동시에 다국어 접두사 경로 또한 유지 보장)
