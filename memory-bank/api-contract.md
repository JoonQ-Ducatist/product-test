# xCubus 목업 API 계약

> UX-04 단계의 프론트엔드·Supabase 전환 경계 문서다. 실제 API 구현 전에도 화면은 이 계약의 요청·응답·오류 형식만 사용한다.

## 공통 규칙

- Base URL: `/api/v1` (Supabase Edge Function 도입 후에도 외부 계약은 유지)
- 모든 시간: ISO 8601 UTC 문자열
- 쓰기 요청: `Idempotency-Key` 헤더 필수
- 성공 응답: `{ "data": ..., "meta": { "requestId": "..." } }`
- 실패 응답: `{ "error": { "code": "...", "message": "...", "fieldErrors": {} }, "meta": { "requestId": "..." } }`
- 목록 응답은 cursor 기반 페이지네이션: `meta: { nextCursor, total? }`
- 브라우저 목업은 네트워크를 호출하지 않으며 이 형식의 Promise 결과만 재현한다.

## 공통 오류 코드

| HTTP | 코드 | 사용자 처리 |
| --- | --- | --- |
| 400 | `VALIDATION_FAILED` | 문제 필드와 입력 기준 표시 |
| 401 | `AUTH_REQUIRED` | 로그인 진입점 제공 |
| 403 | `FORBIDDEN` | 권한·공개 범위 제한 안내 |
| 404 | `NOT_FOUND` | 삭제되었거나 없는 콘텐츠 안내 |
| 409 | `ALREADY_VOTED` / `DUPLICATE_REQUEST` | 기존 결과를 유지하고 중복 동작 안내 |
| 413 | `MEDIA_LIMIT_EXCEEDED` | 이미지 5개·동영상 1개·15MB·10초 기준 안내 |
| 422 | `MEDIA_REJECTED` | 형식·안전·검토 사유 안내 |
| 429 | `RATE_LIMITED` | 잠시 후 재시도 안내 |
| 500 | `INTERNAL_ERROR` | 재시도 버튼과 요청 ID 제공 |

## 리소스

### Post

`GET /posts?category&cursor&limit&sort`

- 공개 범위와 차단 관계를 서버가 먼저 검사한다.
- `sort`는 `recent` 또는 `ranking`만 허용한다.

`POST /posts`

```json
{
  "category": "Outfit",
  "question": "오늘 이 룩, 괜찮아 보여요?",
  "visibility": "public",
  "commentsAllowed": true,
  "media": [{ "assetId": "asset_01", "position": 0 }]
}
```

- 생성 결과는 `draft` 또는 `under_review` 상태이며, 게시 승인 API와 분리한다.
- `media`는 서명 URL 업로드와 검사 완료 뒤에 발급된 `assetId`만 참조한다.

### Vote

`POST /posts/{postId}/votes`

```json
{ "value": "yes" }
```

- `(postId, voterId)`는 한 번만 허용한다.
- 기본 정책은 수정·취소 불가다.
- 성공 결과에는 갱신된 `aggregate`를 포함한다.

### Aggregate

`GET /posts/{postId}/aggregate`

```json
{
  "yesCount": 184,
  "noCount": 39,
  "totalVotes": 223,
  "approvalRate": 83,
  "sampleStatus": "sufficient"
}
```

- 표본 기준은 아직 운영 수치가 확정되지 않았으므로 `sampleStatus`로만 표현하고 확정적 품질 판단을 하지 않는다.

### Report

`POST /reports`

```json
{
  "targetType": "post",
  "targetId": "post_01",
  "reason": "harassment",
  "detail": "선택 입력"
}
```

- 사유는 `spam`, `hate`, `harassment`, `sexual_content`, `privacy`, `defamation`, `social_norm_violation`, `other`만 허용한다.
- 접수 뒤 일반 사용자에게는 처리 상태를 노출하지 않는다. 운영자·관리자용 ModerationCase는 별도 API로 분리한다.

## 핵심 데이터 형태

```js
/** @typedef {'public'|'followers'} Visibility */
/** @typedef {'draft'|'submitted'|'under_review'|'published'|'archived'|'deleted'} PostStatus */
/** @typedef {'yes'|'no'} VoteValue */
/** @typedef {{ id: string, author: string, category: string, question: string, visibility: Visibility, status: PostStatus, media: Array<{ assetId: string, position: number }>, createdAt: string, updatedAt: string }} Post */
/** @typedef {{ postId: string, yesCount: number, noCount: number, totalVotes: number, approvalRate: number, sampleStatus: 'insufficient'|'sufficient' }} Aggregate */
```

## Supabase 전환 경계

- `src/services/mockApi.js`는 이 계약을 재현하는 개발용 어댑터다.
- 향후 `supabaseApi.js`가 같은 함수 시그니처를 구현한다.
- UI 컴포넌트는 Supabase SDK·테이블명·Storage 키를 직접 알지 못한다.
