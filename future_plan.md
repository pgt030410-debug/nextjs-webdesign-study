# B2B SaaS Dashboard - Future Plan (Phase 18 ~ 22)

현재 Phase 17 (다국어 및 다중 통화 지원)이 완벽히 마무리되었습니다. 향후 추가적인 확장을 위해 기획된 Phase 18부터 Phase 22까지의 로드맵입니다.

## Phase 18: 리포트 내보내기 & 자동화 스케줄링 (Report & Export)
- **PDF/CSV/Excel 내보내기**: 대시보드의 차트와 캠페인 테이블 데이터를 픽셀 퍼펙트한 PDF 문서나 엑셀 파일로 다운로드하는 기능 구현 (`jspdf`, `html2canvas`, `xlsx` 등 활용).
- **자동화 리포트 이메일**: 매월 또는 매주 단위로 요약된 리포트를 이메일로 자동 전송하는 크론 탭(Cronjob) 또는 백그라운드 워커 통합 (Resend, SendGrid 연동).
- **공유 링크 생성**: 클라이언트에게 즉각적으로 대시보드 스냅샷을 보여줄 수 있는 Magic Link (만료 시간 포함) 생성 기능.

## Phase 19: 조직도 & 팀 멤버 권한 관리 (RBAC & Team Management)
- **역할 기반 접근 제어 (RBAC)**: Owner, Admin, Editor, Viewer 등 4단계 권한 트리 설계. 권한에 따른 메뉴 접근 및 쓰기/읽기 컴포넌트 동적 렌더링.
- **초대 시스템 (Invites)**: 이메일 링크를 통한 워크스페이스 팀원 초대 로직 (토큰 기반 초대 메일 발송).
- **활동 로그 (Activity Audit Log)**: 누가 언제 어떤 캠페인의 예산을 변경하고 상태를 변경했는지 추적하는 어드민 로그 뷰어 통합.

## Phase 20: 실시간 알림 센터 & 웹소켓 연동 (Notifications & WebSockets)
- **인앱 푸시 알림**: 상단 헤더의 종소리 아이콘을 통한 드롭다운 알림창 설계 (안 읽은 알림 필터링).
- **웹소켓(Socket.io / Supabase Realtime)**: 백엔드 모델이 AI 최적화를 끝내거나, 캠페인 예산이 소진되었을 때 즉각적인 클라이언트 푸시 알림 수신.
- **모바일/슬랙(Slack) 연동 웹훅**: 주요 알림 발생 시 연결된 기업의 커뮤니케이션 채널에 메세지를 직접 쏘는 연동 구현.

## Phase 21: 실제 결제 게이트웨이 및 구독 인프라 연동 (Payment Integration)
- **Stripe 또는 일반 PG 연동**: 모의용이었던 Billing 페이지에 실제 Stripe Checkout을 띄우고 월결제 / 연결제 카드 등록 스크립트 연결.
- **Webhook 처리 (Subcription)**: Stripe 포털로부터 결제 성공, 결제 실패, 구독 취소 여부를 수신받아 DB 상의 유저 권한 및 Plan 레벨을 강등/승급시키는 라이프사이클 처리.
- **Invoices 뷰어**: 매달 청구된 영수증 내역을 UI에서 직접 확인 및 다운로드.

## Phase 22: 고급 분석 & 코호트 뷰 (Advanced Analytics & Deep Insights)
- **다이내믹 필터링 & 코호트 차트**: 퍼포먼스 마케팅에 필수적인 코호트 분석 히트맵 및 기간 비교(YoY, MoM) Recharts 구현.
- **커스텀 대시보드 드래그앤드롭**: 유저가 원하는 위젯(Table, Chart, Metric)들을 직접 Drag-and-Drop (Dnd-kit)으로 커스터마이징 배치할 수 있는 대시보드 개인화 기능.
- **예측형 AI Insight**: 과거 데이터를 기반으로 다음 달 예산이 얼마나 소진될 지 트렌드 곡선과 예측 범위(Confidence Interval)를 그려주는 시각화.
