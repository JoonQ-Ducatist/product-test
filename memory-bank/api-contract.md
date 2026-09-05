# FACt.Smack 목업 API 계약

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
- `category`와 `evaluationType`을 분리한다. 기본 6개 카테고리는 `BINARY`, `PERCEIVED_AGE`는 `NUMERIC_AGE`를 사용한다.
- `PERCEIVED_AGE`의 실제 나이(`actualAge`)는 선택 입력이며 평가자·공개 피드·프로필에는 절대 포함하지 않는다. 결과 비교를 선택한 업로더에게만 권한 있는 결과 API로 제공한다.

### Vote

`POST /posts/{postId}/votes`

```json
{ "value": "yes" }
```

`PERCEIVED_AGE`의 숫자 평가 요청은 다음 계약을 사용한다.

```json
{ "type": "age", "value": 28 }
```

- `(postId, voterId)`는 한 번만 허용한다.
- 기본 정책은 수정·취소 불가다.
- 성공 결과에는 갱신된 `aggregate`를 포함한다.
- `NUMERIC_AGE` 값은 업로더가 지정한 `ageMin`~`ageMax`(각각 18~99)의 정수로 검증하며, 평가 UI는 같은 범위의 슬라이더와 ± 1세 조정을 제공한다. 결과는 참여자의 주관적 첫인상이라는 설명을 함께 제공한다.

### Aggregate

`GET /posts/{postId}/aggregate`

```json
{
  "yesCount": 184,
  "noCount": 39,
  "totalVotes": 223,
  "approvalRate": 83,
  "sampleStatus": "BASE_RESULT"
}
```

- `sampleStatus`는 `INSUFFICIENT`(0–9), `EARLY_SIGNAL`(10–29), `BASE_RESULT`(30–99), `EXPANDED_SAMPLE`(100+) 중 하나다. 수치는 Closed Beta에서 재검증하는 초기 가설이며, 상태는 결과의 절대적 품질을 보장하지 않는다.
- `INSUFFICIENT` 상태에서는 결과값·긍정률·평균 나이를 확정적으로 노출하지 않으며 Boost를 제안하지 않는다.
- `EARLY_SIGNAL`과 `BASE_RESULT`에서만 Boost를 제안할 수 있다. Boost는 추가 노출·응답 기회·표본만 바꾸고 결과를 보장하거나 조정하지 않는다.
- `NUMERIC_AGE` Aggregate는 `averageAge`, `totalVotes`, `sampleStatus`를 반환하며 YES/NO 집계 필드를 사용하지 않는다.

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
/** @typedef {'INSUFFICIENT'|'EARLY_SIGNAL'|'BASE_RESULT'|'EXPANDED_SAMPLE'} SampleStatus */
/** @typedef {{ postId: string, yesCount: number, noCount: number, totalVotes: number, approvalRate: number, sampleStatus: SampleStatus }} Aggregate */
```

## Supabase 전환 경계

- `src/services/mockApi.js`는 이 계약을 재현하는 개발용 어댑터다.
- 향후 `supabaseApi.js`가 같은 함수 시그니처를 구현한다.
- UI 컴포넌트는 Supabase SDK·테이블명·Storage 키를 직접 알지 못한다.
