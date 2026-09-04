# xCubus 수익화 전략: 90일 Cash Loop

> 이 문서는 [Product Philosophy](./product-philosophy.md)를 수익화·Growth·실행 계획으로 구체화한 기준 문서다. 제품 기능의 우선순위와 가격 실험은 이 문서를 따른다.

## 1. 90일 사업 목표

목표는 완성도 높은 SNS를 만드는 것이 아니다.

> **90일 안에 xCubus를 모르는 사용자가 실제 돈을 지불하고, 그 결제의 반복 가능성을 증명한다.**

검증 대상은 매출 규모가 아니라 Cash Loop다. 광고는 초기 핵심 수익원이 아니다.

## 2. First Impression Data Platform

xCubus가 판매하는 것은 사진이나 YES/NO 자체가 아니라, **다른 사람이 나를 어떻게 보는지 알고 싶은 욕구를 실제 인간 평가 데이터로 해소하는 경험**이다.

`Feed → Vote → Upload → Result → Share → Boost → Report → Subscription`

이 루프는 `Acquisition → Engagement → Data → Monetization → Referral`을 닫는 제품 구조다.

## 3. 상품 구조와 가격 가설

| 순서 | 상품 | 가격 가설 | 고객이 얻는 가치 | 절대 제공하지 않는 것 |
| --- | --- | ---: | --- | --- |
| 1 | FREE | ₩0 | Feed, YES/NO, 사진·영상 Upload, 기본 Result | 결과를 숨기는 과도한 Paywall |
| 2 | Boost | ₩1,900 | 노출 증가, 빠른 응답, 더 큰 유효 표본 | 긍정 결과·랭킹·신뢰도 구매 |
| 3 | First Impression Report | ₩5,900 | 카테고리·사진 A/B·기간별 심화 분석 | 실제 표본 없는 AI식 분석 |
| 4 | xCubus+ | ₩7,900/월 | 월 Boost, Premium Report, 변화 추적, Premium Profile, 광고 제거 | 구독 강제·기본 기능 차단 |

- Boost 가격은 ₩1,500·₩1,900·₩2,900·₩3,900의 A/B 테스트 후보로 둔다.
- Report는 ₩4,900~₩9,900 범위에서 가격과 구성의 적합성을 검증한다.
- 구독은 **무료 → Boost → Report → 반복 구매 → xCubus+** 순으로만 제안한다.

## 4. Growth와 고객 획득

### Result Share Growth Loop

`Upload → Vote → Result → Share → Guest Vote → Signup → Upload`

결과 카드에는 카테고리·유효 표본·결과를 담고 Instagram, TikTok, KakaoTalk, X 등으로 공유한다. 공유 링크를 연 사용자는 가입 전에도 Guest Vote를 할 수 있으며, 투표 뒤에 Upload를 제안한다.

### 초기 Seed Group

- 20~30대, 패션·데이트·SNS 프로필에 관심이 높고 사진·SNS 사용 빈도가 높은 사용자
- 대규모 광고보다 평가 밀도가 높은 작은 집단을 우선한다.
- TikTok, Instagram Reels, YouTube Shorts에서 결과·A/B 비교 자체를 콘텐츠로 활용한다.

## 5. 신뢰·안전 원칙

- 실제 인간 평가 데이터가 충분할 때만 세부 분석을 제공한다.
- Boost는 표본·속도·도달만 바꾸며 결과를 바꾸지 않는다.
- 가짜 칭찬, 결과 조작, 열등감 자극, Dark Pattern, 강제 구독을 금지한다.
- 신고·성적 콘텐츠·미성년자·괴롭힘·개인정보·불법 콘텐츠는 AI 1차 분류와 사람의 예외 검토를 병행한다.

## 6. North Star와 검증 지표

**North Star Metric: Weekly Valid Votes**

| 퍼널 | 지표 |
| --- | --- |
| Acquisition | Visitor → Signup, Result Share → Guest Vote |
| Engagement | Signup → First Vote, Vote → Upload, Upload → Result 확인 |
| Monetization | Result → Boost Paywall, Paywall → Purchase, Free → Paid, ARPPU, MRR |
| Retention | D1, D7, 첫 결제 → 두 번째 결제·구독 갱신 |

## 7. 장기 Revenue Stack

Cash Loop이 검증된 뒤에만 다음을 확장한다.

`Subscription + Boost + Report + Ads + Visual Commerce / Affiliate`

Visual Commerce는 Outfit 사진의 의류·신발·가방·소품을 인식해 유사 상품과 판매처를 연결하는 후속 수익원이다. Follow, 관계 기능, 24시간 Chat, 고급 AI 분석과 함께 P2 이후 검토한다.
