# FACt.Smack Monetization & Cash Flow Memory Bank

> Status: Working Strategy / MVP validation hypothesis  
> Goal: **90일 안에 제3자의 첫 실제 결제와 반복 가능한 현금흐름을 검증한다.**

---

## 1. Monetization Principle

FACt.Smack의 초기 목표는 광고 트래픽을 크게 만든 뒤 수익화하는 것이 아니다.

핵심은 사용자의 자연스러운 행동 흐름 안에 결제 이유를 만드는 것이다.

```text
Feed → Vote → Upload → Result → Share → Boost → Report → FACS+ → Return
```

무료 사용자는 첫인상 데이터를 경험할 수 있고, 유료 사용자는 **더 많은 표본, 더 빠른 응답, 더 깊은 분석, 변화 추적 및 편의성**에 비용을 지불한다.

### 절대 원칙

- 돈을 내고 YES/긍정 평가를 살 수 없다.
- 결제가 평가 결과 자체를 유리하게 조작해서는 안 된다.
- 유료 노출도 평가자 선택이나 결과 왜곡으로 이어지지 않도록 설계한다.
- Boost 구매 게시물은 독립 사용자에게 우선·다빈도 노출되지만, 동일 사용자 중복 노출 상한·카테고리 적합성·차단·공개 범위를 적용하고 모든 배분을 감사 가능하게 기록한다.
- 데이터 신뢰성은 단기 매출보다 우선한다.
- 모든 가격은 확정 가격이 아니라 실제 결제 데이터로 검증할 가설이다.

---

## 2. Revenue Stack

| Layer | Product | Initial Price Hypothesis | Customer Value | Business Role |
|---|---|---:|---|---|
| FREE | 기본 Feed / Vote / Upload / Result | ₩0 | 첫인상 결과 경험 | Acquisition |
| BOOST | 추가 노출 / 더 많은 평가 표본 | ₩1,500~3,900/회 | 더 빠르고 많은 응답 | First Purchase |
| BOOST Test | 우선 가격 테스트 | **₩1,000/회** | 1회 저마찰 결제 | First Revenue |
| REPORT | First Impression 상세 Report | ₩4,900~9,900/회 | 충분한 표본 기반 심화 분석 | ARPPU Expansion |
| REPORT Test | 우선 가격 테스트 | **₩5,900/회** | 고급 결과/비교 | Second Purchase |
| FACS+ | 반복 사용자 Subscription | ₩6,900~9,900/월 | 반복 Boost/Report 혜택 및 Premium 기능 | MRR |
| FACS+ Test | 우선 가격 테스트 | **₩7,900/월** | 지속적 분석/혜택 | Recurring Revenue |

장기 Revenue Stack:

```text
Subscription
+ Boost
+ Premium Report
+ Ads
+ Visual Commerce / Affiliate
```

광고는 초기 핵심 수익모델로 사용하지 않는다. 트래픽과 사용시간이 충분히 커진 뒤 보조 수익원으로 검토한다.

---

## 3. FREE

무료 경험은 결제를 강제하기 위한 불완전한 제품이 아니라 FACt.Smack의 핵심 가치를 실제로 경험하게 해야 한다.

초기 후보:

- Feed 탐색
- YES / NO 평가
- 사진/짧은 영상 Upload
- 기본 First Impression Result
- 기본 프로필
- Result Share

무료 사용자가 `다른 사람 평가 → 나도 궁금함 → Upload → Result 확인`까지 도달하는 것이 핵심이다.

---

## 4. BOOST — First Purchase Engine

Boost는 FACt.Smack의 첫 번째 유료상품으로 우선 검증한다.

### Concept

사용자가 결과를 확인한 순간 다음 궁금증을 만든다.

> “현재 23명이 평가했습니다. 100명의 첫인상을 확인해볼까요?”

사용자는 긍정 결과가 아니라 **추가 노출과 더 큰 평가 표본**을 구매한다.

### Perceived Age 적용

`PERCEIVED_AGE`에서는 무료 평균 예상 나이·유효 표본을 보여 준 뒤, “더 많은 사람이 보면 평균은 어떻게 달라질까요?”라는 **표본 호기심**을 Boost로 연결한다. Boost는 나이 결과를 조작하거나 더 어려 보이는 결과를 보장하지 않으며 노출·평가 표본만 늘린다. 실제 나이는 선택 입력·본인 결과 비교 전용이며 평가자와 공개 화면에 노출하지 않는다.

### Initial Hypothesis

- Price test: ₩1,000
- 영어권 최초 100명 목표 Boost는 US$1.00으로 시작하고, 기타 지원 국가는 세금·수수료를 투명하게 반영한 동등 가치의 현지 통화로 제시한다. Bitcoin은 규제·보안 검토 뒤 결제 제공자를 통해서만 제공한다.
- 초기 가격은 사용자가 늘기 전까지 유지한다. 가격 인상은 단순 트래픽 증가가 아니라, 충분한 유효 평가 밀도·목표 표본 달성률·낮은 불만/환불률·재구매 의향이 함께 확인된 뒤에만 검토한다.
- 향후 ₩1,000 / ₩1,500 / ₩1,900 / ₩2,900 / ₩3,900 등 가격 실험 가능
- 평가 목표 표본 기반 패키지 테스트 가능
- 구매 전 예상 추가 노출/표본 범위를 명확하게 표시

### Measurement

- Result View → Boost Paywall View
- Paywall → Purchase Conversion
- Boost 구매자 재구매율
- 구매 후 목표 표본 달성 속도
- Refund / Complaint rate

---

## 5. FIRST IMPRESSION REPORT — ARPPU Expansion

충분한 평가 데이터가 쌓인 콘텐츠/사용자에게 더 깊은 분석을 제공한다.

### Report Candidate Data

- 전체 긍정 응답률
- 평가 표본 수
- 카테고리별 결과
- 여러 게시물 간 결과 비교
- 기간별 변화 추이
- 사진 A/B 비교
- Perceived Age 결과/변화 (해당 카테고리)

성별, 연령대 등 세그먼트 분석은 **해당 정보가 합법적·적절하게 수집되고 충분한 표본이 확보된 경우에만** 제공한다. 작은 표본으로 개인을 추론할 수 있는 형태의 결과를 제공하지 않는다.

### Initial Price Hypothesis

- ₩4,900~9,900/회
- First test: **₩5,900**

Report는 단순히 무료 숫자를 가리는 Paywall이 아니라 사용자가 실제 의사결정에 활용할 추가 가치를 제공해야 한다.

---

## 6. FACS+ — Recurring Revenue Engine

일회성 Boost/Report 구매 경험이 있는 반복 사용자를 Subscription으로 전환한다.

### Initial Price Hypothesis

**₩7,900/month** 우선 테스트

### Benefit Candidates

- 일정량의 Boost 혜택
- Premium Report
- 카테고리별 변화 추적
- 과거 결과 비교
- A/B Photo comparison
- Premium Profile / Ranking 기능
- 광고 도입 이후 광고 제거
- 고급 Result history

혜택은 실제 사용자 행동 데이터를 보고 확정하며, 구독을 위해 핵심 무료 경험을 의도적으로 훼손하지 않는다.

---

## 7. Result Share = Acquisition Engine

Result Share는 부가기능이 아니라 현금흐름을 확대하는 Growth Loop의 일부다.

```text
Upload
  ↓
Vote
  ↓
Result
  ↓
Share Card / URL
  ↓
External SNS
  ↓
New Visitor
  ↓
Guest Vote
  ↓
Signup
  ↓
Upload
```

공유 결과를 본 신규 사용자가 가입 전에 가능한 범위에서 해당 콘텐츠를 평가할 수 있도록 Guest Vote UX를 우선 검토한다.

목표는 Paid Acquisition 이전에 **사용자가 사용자를 데려오는 구조**를 만드는 것이다.

---

## 8. Perceived Age Monetization Candidate

신규 후보 카테고리 `몇 살로 보여? / How Old Do I Look? / PERCEIVED_AGE`는 높은 수익화 잠재력을 가진 후보로 관리한다.

기본 결과 후보:

- 참여자들이 판단한 평균 Perceived Age
- 평가 분포
- 표본 수

유료 확장 후보:

- 더 많은 표본을 위한 Boost
- 사진 A/B 비교
- 헤어/메이크업/스타일 변경 전후 비교
- 과거 대비 변화
- 충분한 데이터가 있을 경우 적절한 세그먼트 비교

실제 나이는 사용자가 비교를 원할 경우에만 입력하는 방향을 검토하고 공개 프로필에 자동 노출하지 않는다. 성인 사용자 대상으로 제한하는 방향 및 개인정보/스토어 정책을 별도 검토한다.

---

## 9. Visual Commerce / Affiliate — Later Stage

트래픽과 콘텐츠가 충분히 확보된 이후 다음 Commerce Loop를 검토한다.

```text
Photo
→ Long Press item
→ AI background removal / feature extraction
→ My Items
→ Same / Similar Product Visual Search
→ Merchant
→ Affiliate Conversion
```

대상:

- 의류
- 신발
- 가방
- 액세서리/소품

초기 Affiliate 후보로 쿠팡 파트너스를 검토하되 특정 판매처에 종속되지 않는 구조로 설계한다. 실제 구현 전 최신 수수료율, 구매 인정 조건/기간, API/상품정보 사용조건, 이미지/링크 표시 규칙 및 경제적 이해관계/광고 표시 의무를 공식 정책에서 재검증한다.

글로벌 확장 시 판매처/Affiliate Network를 교체·추가할 수 있어야 한다.

---

## 10. 90-Day Revenue Validation

| Period | Revenue Objective | Validation Gate |
|---|---|---|
| D1–14 | Cash Loop 기반 Product Core | Signup → Vote → Upload → Result 작동 |
| D15–30 | Closed Beta | 실제 사용자 100명+ / 평가 데이터 발생 |
| D31–45 | Retention + Share | Vote → Upload → Result 재방문 / Share 유입 검증 |
| D46–60 | **Boost Launch** | **제3자의 첫 실제 결제** |
| D61–75 | **Report Launch** | 가격/구매전환 A/B Test |
| D76–90 | **FACS+ Launch** | 첫 MRR + 반복결제 검증 |

### 90-Day Success Definition

90일 성공은 높은 총매출을 약속하는 것이 아니다.

성공은 다음 두 사건을 실제로 확인하는 것이다.

1. **서비스 운영자와 관계없는 사용자가 자기 돈으로 FACt.Smack 상품을 구매한다.**
2. **동일 사용자 또는 동일 Cohort에서 두 번째 결제/구독 유지가 발생한다.**

---

## 11. Monetization Funnel Metrics

반드시 측정:

- Visitor → Signup
- Signup → First Vote
- Vote → Upload
- Upload → Result View
- Result View → Share
- Result View → Boost Paywall
- Paywall → Purchase
- First Purchase → Second Purchase
- Free → Paid Conversion
- ARPPU
- MRR
- Subscription Retention / Churn
- D1 / D7 Retention

North Star Metric 후보:

> **Weekly Valid Votes**

평가 데이터가 충분하지 않으면 Result도, Boost도, Report도 가치가 떨어지므로 평가 밀도를 수익화의 선행지표로 관리한다.

---

## 12. Product Priority by Revenue Impact

### P0 — Build Now

`Signup/Auth → Feed → YES/NO → Upload → Result → Share → Analytics → Boost/Payment`

### P1 — After Cash Loop Works

`Profile → Comments → Ranking Top5 → Notification`

### P2 — Expansion

`Follow → Relationship/24h Chat → Advanced Analysis → Visual Commerce/Affiliate`

기존 기능이 Cash Loop 출시를 지연시키는 경우 후순위로 이동한다.

---

## 13. Decision Rule

앞으로 신규 기능/디자인/기술 투자/마케팅 아이디어를 검토할 때 다음 순서로 판단한다.

1. Acquisition을 높이는가?
2. Engagement 또는 유효 평가 수를 높이는가?
3. 더 가치 있는 First Impression Data를 만드는가?
4. Paid Conversion / ARPPU / MRR을 높이는가?
5. Referral/Growth Loop를 강화하는가?
6. Trust, Safety, Data Integrity를 훼손하지 않는가?
7. 1인 운영 구조에서 자동화 가능한가?

위 항목에 의미 있는 기여가 없으면 MVP에서는 개발하지 않는다.

---

## 14. Operating Principle

FACt.Smack는 초기 DAU가 증가하더라도 가능한 한 1인 운영 가능한 구조를 지향한다.

자동화 우선 영역:

- Auth
- Media Storage
- Vote aggregation
- Result generation
- Result Share Card
- Email / Push
- Payment events
- Analytics
- Daily KPI reporting

사람의 검토가 필요한 영역:

- 신고
- 미성년자 보호
- 성적/유해 콘텐츠
- Abuse/Fraud
- 결제 분쟁
- Trust & Safety 예외처리

AI는 사용자에게 보여주기 위한 기능 자체보다 개발, 운영, 분석 및 CS 보조를 위한 내부 자동화 도구로 우선 활용한다.

---

## Next Monetization Action

1. MVP 카테고리 7개를 Cash Loop 관점에서 최종 평가/압축한다.
2. 무료 Result와 Boost/Report 사이의 정확한 Paywall 경계를 정의한다.
3. Boost 상품의 표본 단위와 ₩1,000 가격 가설을 설계한다.
4. Result Share → Guest Vote → Signup Funnel을 UX에 반영한다.
5. Analytics Event Schema를 결제 Funnel 중심으로 정의한다.

이 문서는 FACt.Smack의 수익화 전략이 변경될 때 지속적으로 업데이트하는 **Monetization Memory Bank**로 사용한다.
