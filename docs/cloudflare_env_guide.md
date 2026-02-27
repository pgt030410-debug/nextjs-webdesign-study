# Cloudflare 환경 변수(Environment Variables) 설정 가이드

Cloudflare Pages 대시보드에서 `NEXT_PUBLIC_API_URL`과 같은 백엔드 주소를 환경 변수로 설정해 두는 것은 서비스 운영에 있어 **가장 중요한 베스트 프랙티스(Best Practice)** 중 하나입니다.

이 문서에서는 왜 하드코딩(Hardcoding) 대신 **환경 변수(Environment Variables)**를 사용해야 하는지 그 이유 3가지를 정리합니다.

## 1. 보안 (Security) 🔒
코드 내부에 백엔드 서버 URL이나 중요 키 값들이 하드코딩되어 있으면, GitHub 저장소 코드를 볼 수 있는 누구나 우리 백엔드의 주소나 민감한 정보를 알 수 있게 됩니다.
* 현재 백엔드 URL 정도는 노출되어도 치명적이지 않지만, DB 비밀번호(예: `DATABASE_URL`)나 API 인증 키(예: `JWT_SECRET_KEY`) 같은 정보는 **절대로 소스 코드에 남기면 안 됩니다.**
* 환경 변수를 사용하면 소스 코드 자체는 안전하게 익명 상태로 유지하면서, 코드가 실행되는 서버(Cloudflare) 환경에서만 안전하게 실제 값을 주입하여 사용할 수 있습니다.

## 2. 배포 환경 분리의 유연성 (Flexibility) 🔄
실제 상용 서비스는 규모가 커질수록 개발-테스트-운영 환경이 물리적으로 분리됩니다:
* **로컬 개발 환경:** `http://127.0.0.1:8000`
* **스테이징 / 테스트 환경:** `https://staging-backend.onrender.com`
* **프로덕션 / 실제 운영 환경:** `https://nextjs-webdesign-study.onrender.com`

**만약 코드로 주소를 직접 박아두었다면(하드코딩)?**
각 환경(로컬, 스테이징, 프로덕션)에 배포할 때마다 코드를 일일이 찾아 주소를 수정한 뒤 다시 커밋(Commit)하고 푸시(Push)해야 하는 번거로운 상황에 직면합니다.

**환경 변수를 사용한다면?**
코드는 단 한 줄도 수정할 필요가 없습니다. 소스코드는 언제나 투명한 `process.env.NEXT_PUBLIC_API_URL`을 바라보며, 각 환경(Cloudflare 대시보드, 로컬 `.env` 파일 등)에서 옵션 값만 쓱 바꿔주면 각 환경에 맞는 백엔드를 **자동으로** 바라보게 됩니다.

## 3. 깨끗하고 안전한 코드 유지 (Clean Code) ✨
서비스 규모가 커질수록 외부 API나 백엔드를 호출하는 코드가 애플리케이션 곳곳(수십 개의 파일)에 흩어지게 됩니다.
* 만약 백엔드 주소가 Render에서 AWS로 이사하게 되어 도메인이 변경되었다고 가정해 보겠습니다.
* 하드코딩된 주소를 사용할 경우, 프로젝트 전체를 검색해서 주소가 쓰인 모든 파일을 직접 찾아 수정해야 하며, 이 과정에서 치명적인 실수가 발생할 확률이 높습니다.
* 반면, 환경 변수를 쓴다면 Cloudflare 대시보드의 값 딱 하나만 변경하면 모든 프론트엔드 코드에 즉시 반영됩니다.

---

### 💡 (결론) 권장 액션 가이드
방금 전 적용한 코드 릴리스에는 만약을 대비해(데이터가 안 뜨는 오류를 막기 위해) `page.tsx`에 `https://nextjs-webdesign-study.onrender.com` 프로덕션 주소가 안전장치(Fallback)로 하드코딩되어 있습니다.

하지만 완벽하고 깔끔한 프론트엔드-백엔드 아키텍처 연동을 위해, 지금 바로 **Cloudflare Pages 대시보드의 [Settings] -> [Environment variables] 탭**으로 가셔서 다음 항목을 추가해 두시는 것을 강력히 권장합니다.

| Variable name | Value |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://nextjs-webdesign-study.onrender.com` |
