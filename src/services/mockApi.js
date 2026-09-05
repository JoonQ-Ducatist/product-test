/**
 * 정의: memory-bank/api-contract.md의 응답·오류 형식을 재현하는 개발용 API 어댑터.
 * 실제 네트워크 호출은 하지 않으며 memory-bank/api-contract.md의 응답 형식을 재현한다.
 */

/** @typedef {'yes'|'no'} VoteValue */
/** @typedef {{ type: 'age', value: number }} AgeVoteValue */

/** 정의: Result의 표본 상태를 UI와 API에서 동일하게 해석하기 위한 고정 enum이다. */
export const SAMPLE_STATUS = {
  INSUFFICIENT: 'INSUFFICIENT',
  EARLY_SIGNAL: 'EARLY_SIGNAL',
  BASE_RESULT: 'BASE_RESULT',
  EXPANDED_SAMPLE: 'EXPANDED_SAMPLE',
};

/** 정의: 유효 투표 수를 Cash Loop Result 계약의 네 표본 상태로 변환한다. */
export function getSampleStatus(totalVotes = 0) {
  if (totalVotes < 10) return SAMPLE_STATUS.INSUFFICIENT;
  if (totalVotes < 30) return SAMPLE_STATUS.EARLY_SIGNAL;
  if (totalVotes < 100) return SAMPLE_STATUS.BASE_RESULT;
  return SAMPLE_STATUS.EXPANDED_SAMPLE;
}

/** 정의: UI가 기능별로 임의 해석하지 않도록 고정한 목업 API 오류 코드 집합이다. */
export const API_ERROR = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_VOTED: 'ALREADY_VOTED',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};

/** 정의: 공통 성공 응답 envelope를 생성한다. @param {unknown} data 응답 본문 @param {Record<string, unknown>} [meta] 부가 메타데이터 */
export function apiSuccess(data, meta = {}) {
  return { data, meta: { requestId: `mock_${Date.now()}`, ...meta } };
}

/** 정의: 공통 실패 응답 envelope를 생성한다. @param {string} code 오류 코드 @param {string} message 사용자 안내 @param {Record<string, string>} [fieldErrors] 필드별 오류 */
export function apiFailure(code, message, fieldErrors = {}) {
  return { error: { code, message, fieldErrors }, meta: { requestId: `mock_${Date.now()}` } };
}

/** 정의: 카드의 YES/NO 수를 API Aggregate 계약 형태로 변환한다. @param {{ yesVotes: number, noVotes: number }} post 대상 카드 */
export function toAggregate(post) {
  if (post.evaluationType === 'NUMERIC_AGE') {
    const totalVotes = post.ageVoteCount ?? 0;
    return {
      evaluationType: 'NUMERIC_AGE',
      averageAge: post.ageEstimate ?? null,
      totalVotes,
      sampleStatus: getSampleStatus(totalVotes),
    };
  }
  const yesCount = post.yesVotes ?? 0;
  const noCount = post.noVotes ?? 0;
  const totalVotes = yesCount + noCount;
  return {
    yesCount,
    noCount,
    totalVotes,
    approvalRate: totalVotes ? Math.round((yesCount / totalVotes) * 100) : 0,
    sampleStatus: getSampleStatus(totalVotes),
  };
}

/** 정의: 카테고리·페이지 크기 기준의 Post 목록 조회를 목업한다. @param {Array<object>} cards 카드 원본 @param {{ category?: string, cursor?: string, limit?: number }} [query] 조회 조건 */
export async function listPosts(cards, query = {}) {
  const filtered = query.category && query.category !== 'ALL' ? cards.filter((card) => card.category === query.category) : cards;
  const limit = Math.min(Math.max(query.limit ?? 20, 1), 50);
  return apiSuccess(filtered.slice(0, limit), { nextCursor: filtered.length > limit ? String(limit) : null });
}

/** 정의: 하나의 카드에 대한 Aggregate 조회를 목업한다. @param {{ yesVotes: number, noVotes: number } | undefined} post 대상 카드 */
export async function getAggregate(post) {
  if (!post) return apiFailure(API_ERROR.NOT_FOUND, '게시물을 찾을 수 없어요.');
  return apiSuccess(toAggregate(post));
}

/** 정의: 단일 사용자·단일 게시물 투표 제약을 적용하며 BINARY와 NUMERIC_AGE 평가를 분리하는 Vote 쓰기 목업이다. @param {object | undefined} post 대상 카드 @param {VoteValue|AgeVoteValue} value 선택값 @param {Set<string>} votedIds 이미 투표한 카드 ID */
export async function submitVote(post, value, votedIds) {
  if (!post) return apiFailure(API_ERROR.NOT_FOUND, '게시물을 찾을 수 없어요.');
  if (votedIds.has(post.id)) return apiFailure(API_ERROR.ALREADY_VOTED, '이미 의견을 남긴 게시물이에요.');
  if (post.evaluationType === 'NUMERIC_AGE') {
    const min = post.ageMin ?? 18;
    const max = post.ageMax ?? 99;
    if (value?.type !== 'age' || !Number.isInteger(value.value) || value.value < min || value.value > max) return apiFailure(API_ERROR.VALIDATION_FAILED, `${min}세부터 ${max}세 사이의 예상 나이를 선택해 주세요.`, { value: 'invalid_age_vote' });
    const previousCount = post.ageVoteCount ?? 0;
    const previousAverage = post.ageEstimate ?? value.value;
    const nextCount = previousCount + 1;
    const nextPost = { ...post, ageVoteCount: nextCount, ageEstimate: Number(((previousAverage * previousCount + value.value) / nextCount).toFixed(1)) };
    return apiSuccess({ vote: { postId: post.id, value }, aggregate: toAggregate(nextPost), post: nextPost });
  }
  if (value !== 'yes' && value !== 'no') return apiFailure(API_ERROR.VALIDATION_FAILED, 'YES 또는 NO를 선택해 주세요.', { value: 'invalid_vote' });
  const nextPost = { ...post, yesVotes: post.yesVotes + (value === 'yes' ? 1 : 0), noVotes: post.noVotes + (value === 'no' ? 1 : 0) };
  return apiSuccess({ vote: { postId: post.id, value }, aggregate: toAggregate(nextPost), post: nextPost });
}

/** 정의: 허용된 신고 사유만 접수하는 Report 쓰기를 목업한다. @param {{ targetType: 'post'|'comment', targetId: string, reason: string, detail?: string }} report 신고 입력 */
export async function createReport(report) {
  const allowedReasons = new Set(['spam', 'hate', 'harassment', 'sexual_content', 'privacy', 'defamation', 'social_norm_violation', 'other']);
  if (!report?.targetId || !allowedReasons.has(report.reason)) return apiFailure(API_ERROR.VALIDATION_FAILED, '신고 대상과 사유를 확인해 주세요.', { reason: 'invalid_report_reason' });
  return apiSuccess({ id: `report_${Date.now()}`, ...report, status: 'received' });
}
