# FACt.Smack 90일 Cash Loop 실행 계획

> 최상위 기준: [Product Philosophy](./product-philosophy.md) · 수익화 기준: [Monetization](./monetization.md) · 세부 기능 목록: [Feature Backlog](./feature-backlog.md)
>
> 목표는 기능이 많은 SNS 출시가 아니라 **90일 안에 실제 결제와 재결제 가능성을 증명하는 것**이다.

## 1. 제품 루프

**FACt.Smack = First Impression Data Platform**

`Feed → Vote → Upload → Result → Share → Guest Vote → Signup → Upload`

`Result → Boost → Report → FACS+ → 재방문`

## 2. 90일 성공 정의

1. FACt.Smack를 처음 접한 사용자가 자기 돈으로 Boost 또는 Report를 구매한다.
2. 한 번 결제한 사용자가 재구매하거나 FACS+를 구독한다.

두 조건이 충족되면 Cash Loop를 검증한 것이다. 이후 CAC, LTV, 유료 획득 확대를 검토한다.

## 3. 우선순위

| 등급 | 범위 | 이유 |
| --- | --- | --- |
| P0 | Signup/Auth, Feed, BINARY YES/NO·NUMERIC_AGE, Upload, Category, Result, Result Share, Guest Vote, Analytics, Boost, Payment | 유입·참여·데이터·결제·추천의 닫힌 루프 |
| P1 | Profile, Comments, Ranking Top 5, Notification | Cash Loop 검증 뒤 전환·재방문 보강 |
| P2 | Follow, Relationship, 24시간 Chat, Advanced AI Analysis, Visual Commerce/Affiliate, 광고 | 트래픽·신뢰 데이터 축적 후 확장 |

## 4. 90일 일정

| 기간 | 목표 | 완료해야 할 Vertical Slice | Gate |
| --- | --- | --- | --- |
| Day 1–14 | Core MVP | Signup/Auth, Feed, BINARY YES/NO·NUMERIC_AGE, Upload, Category, 기본 Result | 가입 → Vote → Upload → Result를 30초 내 경험 |
| Day 15–30 | Closed Beta | 실제 DB·Storage·투표 집계, 초기 Analytics, Seed Group 운영 | 실제 사용자 100명+, Vote → Upload → Result 발생 |
| Day 31–45 | Growth Loop | Result Card, Share URL, Guest Vote, Signup 전환 | Share → Guest Vote → Signup 실제 유입 |
| Day 46–60 | First Revenue | Boost Paywall·결제·표본 증가 처리 | 관계없는 사용자의 첫 Boost 결제 |
| Day 61–75 | ARPPU 검증 | First Impression Report·가격 A/B 테스트 | Report 전환·가격 데이터 |
| Day 76–90 | Recurring Revenue | FACS+·구독·갱신 측정 | 첫 MRR·재구매·구독 갱신 |

## 5. 기간별 상세 실행

### Day 1–14 — Product Core와 Core UX

- 카테고리 5~7개를 Traffic Potential, Repeat Usage, Result Curiosity, Virality, Boost Purchase Intent, Report Expandability, Global Scalability, Safety/Risk로 평가해 확정한다. 현재 후보는 Outfit, **Perceived Age**, Date, Travel, Fitness, Work, Profile 7개다.
- Perceived Age는 `Upload → 숫자 나이 평가 → 평균 예상 나이 Result → 더 큰 표본 Boost → Report/A·B 비교 → Share`의 별도 Cash Loop 가설로 측정한다. 실제 나이 비교는 업로더 선택 기능이며 평가자에게 비공개다.
- 기본 Feed·Vote·Upload·기본 Result의 무료 경계를 확정한다.
- 유효 표본·긍정률·표본 부족 안내로 Result 계약을 정의한다.
- `Splash → Feed → Vote → Upload → Result` 한 개의 흐름을 최우선으로 완성한다.

### Day 15–30 — Working MVP와 Closed Beta

- Supabase Auth, Postgres, Storage, RLS, 게시물·투표·집계 모델을 구축한다.
- 실제 이미지/영상 업로드, 검토 상태, 1인 1표, 서버 집계, 결과 확인을 구현한다.
- 20~30대 패션·데이트·SNS 프로필 관심자를 Seed Group으로 모집한다.
- Visitor → Result 확인까지의 퍼널을 Analytics로 수집한다.

### Day 31–45 — Result Share Growth Loop

- 결과 카드 이미지와 공유 URL을 생성한다.
- 공유 링크에서 Guest Vote를 허용하고, 투표 뒤 Signup·Upload를 제안한다.
- 공유율, Guest Vote → Signup, Referral을 측정한다.

### Day 46–60 — Boost 첫 결제

- 표본 조건에서 “100명의 첫인상을 확인해 볼까요?”를 제안한다.
- Boost ₩1,000 가설과 가격 후보를 A/B 테스트한다.
- Boost는 노출·응답 속도·표본만 바꾸며, 결과·랭킹·신뢰도를 바꾸지 않는다.

### Day 61–75 — Report 상품화

- 실제 표본이 충분한 사용자에게만 카테고리·사진 A/B·기간별 Report를 제안한다.
- Report ₩5,900 가설과 구성·가격을 A/B 테스트한다.
- 인구통계 분석은 동의·최소 표본이 충족될 때만 제공한다.

### Day 76–90 — FACS+와 반복 매출

- FACS+ ₩7,900/월 가설을 출시한다.
- 월 Boost, Premium Report, 변화 추적, 카테고리 분석, Premium Profile, 광고 제거 조합을 실험한다.
- 재구매율, 구독 전환, 갱신, MRR을 측정한다.

## 6. 운영·자동화

AI는 사용자가 억지로 인지해야 하는 기능이 아니라 **1인 운영을 돕는 내부 도구**다.

- 자동화: 인증, 미디어 저장, 집계, Result/Result Card 생성, Email·Push, 결제, Analytics, 일일 KPI, FAQ·CS 초안
- 사람 검토: 신고, 성적 콘텐츠, 미성년자, 괴롭힘, 개인정보, 불법 콘텐츠의 예외 판단
- North Star: **Weekly Valid Votes**

## 7. 주간 의사결정 규칙

> 이 기능이 Acquisition → Engagement → Data → Monetization → Referral 중 무엇을 개선하는가?

어느 단계도 개선하지 않으면 90일 범위에서 개발하지 않는다.
