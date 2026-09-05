# Supabase 연결 준비 안내

## 현재 준비 완료 범위

- 브라우저 공개 환경변수 템플릿: `.env.example`
- 공식 `@supabase/supabase-js` 브라우저 클라이언트: `src/services/supabaseClient.js`
- UI와 실제 API의 경계: `src/services/mockApi.js` → 향후 `supabaseApi.js`
- 데이터·권한·미디어 원칙: `architecture.md`, `api-contract.md`, `service-design-rule.md`

## 실제 연결에 필요한 사용자 제공 항목

1. Supabase 프로젝트 URL (`https://<project-ref>.supabase.co`) — 제공됨
2. 브라우저용 Publishable key 또는 Anon key — 제공됨
3. 운영 도메인과 로컬 개발 URL의 Auth Redirect Allow List 등록 권한
4. DB·Storage·Edge Function을 만들 수 있는 프로젝트 소유자 또는 관리자 권한

`service_role` 키, 개인 접근 토큰, 지갑 키는 브라우저·Git·대화에 공유하거나 `.env` 외부에 기록하지 않는다.

## 연결 순서

1. 사용자가 Supabase 프로젝트를 생성하고 위 공개 연결 정보를 로컬 `.env`에 설정한다.
2. Codex가 Supabase SDK·연결 검증·마이그레이션·RLS를 추가한다.
3. 실제 Auth부터 연결하고, Post·Vote·Media·Moderation을 순서대로 서버화한다.
4. 실제 계정·사진을 쓰기 전에 RLS·감사 로그·삭제·동의 흐름을 함께 검증한다.
