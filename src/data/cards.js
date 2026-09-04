/** 정의: 화면 목업에서 사용하는 카테고리 토큰과 카드 샘플 데이터의 단일 출처다. */
const selfieAssets = import.meta.glob('../../assets/generated/selfies/*.jpg', { eager: true, import: 'default' });
const seriesAssets = import.meta.glob('../../assets/generated/feed-series/*.jpg', { eager: true, import: 'default' });

/** 정의: 세트·합성 이미지를 배제하고 카드마다 한 명의 단독 인물만 쓰는 대표 사진 인덱스다. */
const categorySelfieIndex = { Outfit: 1, Date: 3, Travel: 4, Fitness: 1, Work: 5, SocialProfile: 6 };

/** 정의: 거울 앞 스마트폰 셀피와 여성 운동 셀피의 프로젝트 자산 URL을 반환한다. @param {number} index 1~6 사진 순번 @param {boolean} fitness 여성 운동 셀피 여부 */
function getSelfieImage(index, fitness = false) {
  const safeIndex = String(((index - 1) % 6) + 1).padStart(2, '0');
  const prefix = fitness ? 'fitness-selfie' : 'selfie';
  return selfieAssets[`../../assets/generated/selfies/${prefix}-${safeIndex}.jpg`];
}

/** 정의: 동일 인물의 복장·포즈·장소가 달라진 단독 세로 셀피 시리즈 URL을 반환한다. @param {string} name 시리즈 파일명 */
function getSeriesImage(name) { return seriesAssets[`../../assets/generated/feed-series/${name}.jpg`]; }

/** 정의: 사용자·관리 화면이 공유하는 카테고리의 표시명, 아이콘, 색상과 피드 표기 토큰이다. */
export const categories = {
  Outfit: { label: '오늘의 룩', icon: 'checkroom', color: '#FE2C55', liveTag: 'OOTD', feedLabel: 'OOTD' },
  Date: { label: '데이트', icon: 'favorite', color: '#EA4C89', liveTag: 'Date Look' },
  Travel: { label: '여행', icon: 'travel_explore', color: '#1AB7EA', liveTag: 'Travel Look' },
  Fitness: { label: '운동', icon: 'fitness_center', color: '#25D366', liveTag: 'Fitness Look' },
  Work: { label: '출근', icon: 'business_center', color: '#5865F2', liveTag: 'Work Look' },
  SocialProfile: { label: 'SNS 프로필', icon: 'account_circle', color: '#F2C94C', liveTag: 'Profile Look' },
};

/** 정의: 다중 사진 카드에 동일 인물의 서로 다른 단독 셀피만 순서대로 담는다. @param {string} prefix 카드 ID 접두어 @param {string[]} imageUrls 단독 인물 사진 URL 목록 */
function createAlbum(prefix, imageUrls) {
  return imageUrls.map((url, index) => ({
    id: `${prefix}-media-${index + 1}`,
    type: 'image',
    url,
    objectPosition: 'center center',
  }));
}

/** 정의: 카테고리마다 1~5장의 서로 다른 단독 인물 셀피를 제공하는 피드용 미디어 시리즈다. */
const mediaByCategory = {
  Outfit: [getSelfieImage(1), getSeriesImage('outfit-02'), getSeriesImage('outfit-03'), getSeriesImage('outfit-04'), getSeriesImage('outfit-05')],
  Date: [getSelfieImage(3), getSeriesImage('date-02'), getSeriesImage('date-03'), getSeriesImage('date-04')],
  Travel: [getSelfieImage(4), getSeriesImage('travel-02'), getSeriesImage('travel-03')],
  Fitness: [getSelfieImage(1, true), getSeriesImage('fitness-02')],
  Work: [getSelfieImage(5)],
  SocialProfile: [getSelfieImage(6)],
};

/** 정의: 카테고리별로 생성한 서울 생활권 사진과 대표 질문을 정의한 목업 시드다. */
const mockCardSeeds = [
  { category: 'Outfit', author: 'today_sora', question: '오늘 이 스타일,\n괜찮아 보여요?', subtext: 'Does this outfit feel right for today?', imageUrl: getSelfieImage(categorySelfieIndex.Outfit), yesVotes: 1280, noVotes: 210, comments: [{ id: 'c1', author: 'style_lab', body: '서울 거리의 자연광과 룩이 잘 어울려요.', createdAt: '8분 전', replies: [{ id: 'r1', author: 'today_sora', body: '의견 감사합니다!', createdAt: '6분 전' }] }] },
  { category: 'Date', author: 'date_mood', question: '첫 만남이라면\n호감이 가나요?', subtext: 'Would this look make a lovely first impression?', imageUrl: getSelfieImage(categorySelfieIndex.Date), yesVotes: 942, noVotes: 88, comments: [{ id: 'c2', author: 'xcubus_kr', body: '밝고 다정한 인상이 느껴져요.', createdAt: '12분 전', replies: [] }] },
  { category: 'Travel', author: 'travel_day', question: '이 여행 스타일,\n매력적으로 보이나요?', subtext: 'Does this travel style feel memorable and charming?', imageUrl: getSelfieImage(categorySelfieIndex.Travel), yesVotes: 782, noVotes: 86, comments: [{ id: 'c3', author: 'seoul_walker', body: '여행의 설렘이 자연스럽게 담겼네요.', createdAt: '20분 전', replies: [] }] },
  { category: 'Fitness', author: 'fit_queen', question: '건강하고 매력적인 인상을\n주나요?', subtext: 'Does this look feel healthy and confident?', imageUrl: getSelfieImage(categorySelfieIndex.Fitness, true), yesVotes: 1105, noVotes: 95, comments: [{ id: 'c4', author: 'run_more', body: '활동적인 에너지가 잘 보여요.', createdAt: '1시간 전', replies: [] }] },
  { category: 'Work', author: 'workday_note', question: '직장에서 좋은 첫인상을\n줄 것 같나요?', subtext: 'Would this make a great first impression at work?', imageUrl: getSelfieImage(categorySelfieIndex.Work), yesVotes: 1430, noVotes: 190, comments: [{ id: 'c5', author: 'team_player', body: '차분하고 믿음직한 분위기입니다.', createdAt: '45분 전', replies: [] }] },
  { category: 'SocialProfile', author: 'portrait_note', question: '이 사진, SNS 프로필로\n매력적으로 보이나요?', subtext: 'Would this make a memorable social profile photo?', imageUrl: getSelfieImage(categorySelfieIndex.SocialProfile), yesVotes: 654, noVotes: 72, comments: [] },
];

/** 정의: 카테고리별 1~5장의 현실적인 단독 인물 미디어 수를 가진 초기 목업 피드다. */
export const initialCards = mockCardSeeds.map((seed, seedIndex) => {
  const mediaUrls = mediaByCategory[seed.category];
  return { ...seed, id: `card-${seedIndex + 1}`, imageUrl: mediaUrls[0], media: createAlbum(`card-${seedIndex + 1}`, mediaUrls), objectPosition: 'center center', timestamp: `${seedIndex * 20 + 10}분 전`, isMyUpload: seedIndex === 0, commentsAllowed: true };
});
