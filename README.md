# xCubus (퍼스트룩) - Quantitative Intuition & Impression Analytics

> **"첫인상을 직관에서 데이터로"**  
> AI와 실시간 집단 지성을 활용한 첫인상 분석 및 피드백 플랫폼

![xCubus Preview](assets/images/card1_business.jpg)

---

## 🚀 주요 기능 (Key Features)

1. **실시간 인터랙티브 피드 (Live Feed & Gesture Engine)**
   - **터치/마우스 스와이프 & 휠 스크롤**: 화면을 위/아래로 스와이프하거나 마우스 휠을 스크롤하여 다음 사용자의 사진을 자연스럽게 넘겨볼 수 있습니다.
   - **인물 중심 최적화 프레이밍 (`object-position`)**: 얼굴과 상반신 착장이 텍스트에 가려지지 않고 선명하게 노출됩니다.
   - **카테고리별 다이내믹 컬러 테마**:
     - 💖 **소개팅 / 데이트 (`Dating`)**: 러블리 핑크 테마 & `LIVE DATING`
     - 🔥 **운동 / 피트니스 (`Workout`)**: 정열의 레드 테마 & `LIVE FITNESS`
     - ⚡ **비즈니스 / 출근 (`Business`)**: 일렉트릭 사이언 테마 & `LIVE BUSINESS`
     - 👔 **면접 / 커리어 (`Interview`)**: 로열 인디고 테마 & `LIVE CAREER`
     - 💜 **데일리 / 스타일 (`Style`)**: 바이올렛 퍼플 테마 & `LIVE STYLE`
     - 🌟 **SNS 프로필 (`Profile`)**: 웜 골드 테마 & `LIVE PROFILE`
   - **YES / NO 실시간 투표**: 슬림하고 직관적인 버튼으로 투표 즉시 실시간 득표율 및 신뢰도 지수 분석 제공.

2. **로컬 이미지 파일 업로드 (Local File Upload & Ingestion)**
   - PC나 모바일 기기에 있는 로컬 사진(JPG, PNG, WEBP 등)을 드래그 앤 드롭 또는 파일 탐색기로 즉시 선택.
   - `FileReader API` 기반의 실시간 이미지 미리보기 및 메타데이터(용량, 파일명) 확인.
   - 카테고리 선택 및 추천 질문 프리셋 원클릭 적용.
   - 업로드 즉시 피드 맨 앞에 등록되어 실시간 투표 및 평가 가능 (`localStorage` 지속성 연동).

3. **인텔리전스 랭킹 (Leaderboard)**
   - 실시간 호감도/신뢰도 지수가 가장 높은 베스트 룩 랭킹 목록.
   - 카테고리별 필터링 기능 지원.

4. **사용자 프로필 & 분석 리포트 (Profile Insights)**
   - 내가 업로드한 사진들의 누적 투표 수, 평균 긍정 응답률(YES율), 세부 통계 리포트.
   - 업로드 항목 관리 및 삭제 기능.

---

## 🛠 기술 스택 (Tech Stack)

- **Frontend**: HTML5, Vanilla JavaScript (ES6+), CSS3
- **Styling**: Tailwind CSS, Google Fonts (Manrope, Inter, JetBrains Mono), Material Symbols
- **Storage**: Browser LocalStorage
- **Architecture**: Single Page Application (SPA)

---

## 💻 실행 방법 (Getting Started)

### 로컬 웹 서버 실행
프로젝트 루트 디렉토리에서 간단한 HTTP 서버를 실행합니다:

```bash
# Python 3 내장 서버 사용 시
python3 -m http.server 4173

# Node.js npx 사용 시
npx serve .
```

브라우저에서 `http://localhost:4173` 으로 접속합니다.

---

## 📁 프로젝트 구조 (Directory Structure)

```
xCubus/
├── assets/
│   └── images/               # 카드 및 프로필 샘플 고해상도 이미지
├── index.html                # SPA 메인 HTML 구조
├── styles.css                # 커스텀 애니메이션, 스캔 레이저, 제스처 스타일
├── app.js                    # 제스처 엔진, 업로드 리더, 카테고리 테마 및 상태 관리
└── README.md
```
