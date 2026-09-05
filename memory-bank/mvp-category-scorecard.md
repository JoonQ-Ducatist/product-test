# FACt.Smack MVP Category Scorecard

> 기준일: 2026-09-04  
> 상위 원칙: [Product Philosophy](./product-philosophy.md) · [90-day Cash Loop Plan](./90-day-cash-loop-plan.md) · [Monetization](./monetization.md)

## 목적

MVP의 카테고리는 화면을 채우기 위한 분류가 아니라 `Upload → Evaluation → Result Curiosity → Boost → Share`를 검증하는 단위다. 점수는 출시 후 실제 지표로 다시 검증하며, 긍정 결과를 구매하게 하거나 열등감을 자극하는 목적에는 사용하지 않는다.

## 평가 기준

각 항목은 1~5점이며, **Safety / Risk는 높을수록 운영 가능한 안전성**을 의미한다.

1. Traffic Potential — 처음 보고 참여할 가능성
2. Repeat Usage — 다른 사진·상황으로 재시도할 가능성
3. Result Curiosity — 결과를 다시 확인하고 싶은 강도
4. Virality — 결과 공유와 외부 유입 가능성
5. Boost Purchase Intent — 더 큰 표본을 원하는 자연스러운 이유
6. Report Expandability — A/B·기간 변화·심화 분석 가능성
7. Global Scalability — 지역 밖에서도 이해되는 보편성
8. Safety / Risk — 개인정보·괴롭힘·오해를 통제할 수 있는 정도

## 2026-09-04 초기 가설 점수와 승인된 우선순위

| 카테고리 | Traffic | Repeat | Curiosity | Virality | Boost | Report | Global | Safety | 합계 / 40 | 베타 운용 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| **핵심 1 — 몇 살로 보여?** (`PERCEIVED_AGE`) | 4 | 5 | 5 | 4 | 5 | 5 | 4 | 2 | **34** | 범위 입력·실제 나이 비공개·주관적 첫인상 안내 필수. 수익화 핵심이지만 안전 통제형으로 운용 |
| **핵심 2 — 오늘의 룩** | 5 | 4 | 3 | 4 | 3 | 4 | 4 | 4 | **31** | 반복 업로드와 인정·칭찬 루프의 대표 진입 카테고리 |
| **핵심 3 — SNS 프로필** | 5 | 4 | 4 | 5 | 4 | 4 | 5 | 3 | **34** | Result Share → 외부 유입 → 가입을 검증하는 대표 카테고리 |
| **핵심 4 — 데이트** | 4 | 4 | 4 | 4 | 4 | 4 | 3 | 3 | **30** | 존중형 첫인상 질문으로 관계 맥락의 평가 수요를 검증 |
| **비교군 1 — 운동** | 4 | 4 | 3 | 3 | 3 | 3 | 4 | 3 | **27** | 반복성 대비 신체 평가·성적 대상화 위험을 함께 검증 |
| **비교군 2 — 출근** | 3 | 3 | 3 | 2 | 2 | 3 | 3 | 4 | **23** | 실용적 질문의 안정적 재방문과 낮은 공유성을 비교 |

## MVP 운용 결정

- 프로토타입은 현재의 **6개 카테고리**를 유지한다. 이는 동일 UI·평가 구조가 카테고리별로 재사용되는지 검증하기 위함이다.
- Closed Beta의 우선 모집·노출 순서는 **`PERCEIVED_AGE` → `오늘의 룩` → `SNS 프로필` → `데이트`**로 확정한다.
- `운동`, `출근`은 위 순서의 비교군으로 유지하며, Weekly Valid Votes·Upload→Result 완료율·Share율이 낮으면 Paid/Boost 노출 대상에서 제외한다. `여행`은 초기 MVP에서 제외한다.
- `PERCEIVED_AGE`의 `NUMERIC_AGE`는 BINARY 평가 모델에 맞추지 않는다. 숫자 선택과 범위 검증을 별도 Evaluation Type으로 유지한다.
- 모든 카테고리에서 Boost는 결과를 바꾸지 않고 **추가 노출·응답 속도·표본 수만** 바꾼다.

## CL-01 완료 기준과 다음 검증

- [x] 6개 MVP 카테고리의 질문·평가 방식·초기 Cash Loop 가설 기록
- [x] 실시간 SNS·커뮤니티 리서치와 8개 기준 점수에 따른 베타 우선순위 승인
- [ ] 실제 Closed Beta에서 카테고리별 `Visitor → Vote → Upload → Result → Share` 전환을 측정해 점수를 재평가

### 외부 시장 근거

- 한국의 인터넷 사용자 중 소셜미디어 이용 비율은 97.2%이며, 사진·자기표현 기반의 유입·공유 루프를 검증할 시장 기반이 있다. [DataReportal, Digital 2025: South Korea](https://datareportal.com/reports/digital-2025-south-korea)
- 2025년 한국 조사에서 Instagram 이용률은 20대 80.9%, 30대 70.7%였다. 이에 따라 프로필·룩·첫인상 중심의 사진 평가를 핵심군으로 둔다. [연합뉴스](https://www.yna.co.kr/amp/view/AKR20250206077200005)
- 이미지 기반 플랫폼의 외모 비교 부담을 고려해 `PERCEIVED_AGE`와 `운동`은 결과 조작·열등감 유발 없이 안전 통제형으로 검증한다. [한국생활과학회 연구](https://kjhe.or.kr/_common/do.php?a=full&aidx=45524&b=12&bidx=4124)

다음 단위 업무는 **CL-02: 무료 Result의 표본 경계·표본 부족 문구·Boost 전환 계약**을 문서와 UI 상태로 확정하는 것이다.
