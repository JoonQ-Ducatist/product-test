# FirstLook 아키텍처

> 기준 문서: service-design-rule.md, TECH-AGENTS.md, plan.md, progress.md

## 1. 현재 실행 구조

현재 검증을 통과한 실행 화면은 Vite가 제공하는 기존 프로토타입이다. index.html이 app.js와 styles.css를 직접 로드하며, 브라우저의 localStorage는 샘플 데이터와 프로토타입 상호작용을 유지하는 용도다.

~~~
브라우저
  └─ index.html
      ├─ styles.css                 # 기존 프로토타입 전역 스타일·애니메이션
      ├─ app.js                     # 카드 데이터·피드·투표·업로드·랭킹·프로필 동작
      └─ assets/images/             # 검증 기준 샘플 이미지
~~~

### 현재 핵심 파일 역할

| 파일·디렉터리 | 역할 | 주의점 |
| --- | --- | --- |
| index.html | 활성 화면의 DOM 구조와 Tailwind CDN 설정 | 현재 UI 기준의 실제 엔트리 포인트다. |
| app.js | localStorage 기반 카드 상태, 화면 전환, 필터, 투표, 업로드 미리보기 | 실서비스 데이터·권한의 원본으로 사용하지 않는다. |
| styles.css | 활성 프로토타입의 공통 스타일과 카드 전환 효과 | UI 기준 변경은 사용자 요청 후에만 한다. |
| assets/images/ | 기존 샘플 카드 이미지 | 사용자 사진이나 비밀 정보를 넣지 않는다. |
| dist/ | Vite 빌드 산출물 | 소스가 아니라 빌드 결과이며, 현재 활성 HTML과 다를 수 있다. |
| memory-bank/ | 서비스·기술·계획·진행 기준 문서 | 구현과 같은 변경 흐름에서 최신화한다. |

## 2. 현재 UI 규칙

- 메인 카드 헤더는 좌측 카테고리, 우측 사용자 ID, 그 아래 질문 순서다.
- 카테고리 색상은 피드 헤더·배지·탐색 제어·YES/NO 버튼·YES 결과 막대에 연결한다.
- YES는 카테고리 색상의 채움형 주 동작, NO는 같은 색상의 윤곽선형 보조 동작이다.
- 메인 피드 카드의 외곽선은 rounded-xl 수준의 작은 라운드를 사용한다.
- 수동 테스트 결과는 2026-08-23 기준 **적합**이다.

## 3. 준비된 React 전환 구조

React 의존성과 기능별 화면 초안은 저장소에 존재하지만, 현재 index.html에서는 활성화하지 않았다. React 전환은 기존 프로토타입과의 화면·동작 동등성을 확인한 후에만 진행한다.

~~~
src/
├─ main.jsx                   # React 진입점
├─ App.jsx                    # 앱 조합
├─ data/cards.js              # 목업 카드 데이터
├─ services/cardStore.js      # 개발용 카드 저장 어댑터
├─ features/
│  ├─ feed/FeedView.jsx       # 피드 화면 초안
│  ├─ upload/UploadView.jsx   # 업로드 화면 초안
│  ├─ ranking/RankingView.jsx # 랭킹 화면 초안
│  └─ profile/ProfileView.jsx # 프로필 화면 초안
└─ styles/global.css          # React 전용 전역 스타일 초안
~~~

## 4. 목표 구조와 경계

~~~
React UI → 서비스 어댑터 → 인증된 API → DB / 이미지 저장소 / 비동기 작업
~~~

- React 화면은 표시·입력·상태 표현에 집중한다.
- 서비스 어댑터만 API 통신을 담당한다.
- API가 인증·인가·입력 검증·중복 투표 방지·집계를 책임진다.
- 이미지 저장소와 DB는 브라우저에서 직접 접근하지 않는다.
- 실제 백엔드 도입은 service-design-rule.md의 P1 정책 네 건이 확정된 후에만 시작한다.

## 5. 다음 작업 시작 기준

1. 이 문서와 progress.md의 ‘적합’ 검증 기록을 확인한다.
2. React 엔트리 포인트 전환 범위와 기존 UI 동등성 기준을 합의한다.
3. Feed, Upload, Ranking, Profile을 한 화면씩 전환하고 수동 테스트·빌드·테스트 도구 검증을 기록한다.
4. P1 정책이 미결정인 동안 실제 인증·이미지 업로드·공개 피드·투표 API는 구현하지 않는다.

## 6. 변경 기록

| 날짜 | 변경 | 이유 |
| --- | --- | --- |
| 2026-08-23 | architecture.md 생성 | 수동 테스트 ‘적합’ 후 현재 실행 구조와 목표 React 구조, 다음 전환 경계를 명확히 하기 위해 |
