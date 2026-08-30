/** 정의: 화면 목업에서 사용하는 카테고리 토큰과 카드 샘플 데이터의 단일 출처다. */
import outfitMockImage from '../../assets/generated/mock-outfit-seoul.jpg';
import dateMockImage from '../../assets/generated/mock-date-seoul.jpg';
import travelMockImage from '../../assets/generated/mock-travel-seoul.jpg';
import fitnessMockImage from '../../assets/generated/mock-fitness-seoul.jpg';
import workMockImage from '../../assets/generated/mock-work-seoul.jpg';
import socialProfileMockImage from '../../assets/generated/mock-social-profile-seoul.jpg';

/** 정의: 사용자·관리 화면이 공유하는 카테고리의 표시명, 아이콘, 색상과 피드 표기 토큰이다. */
export const categories = {
  Outfit: { label: '오늘의 룩', icon: 'checkroom', color: '#FE2C55', liveTag: 'OOTD', feedLabel: 'OOTD' },
  Date: { label: '데이트', icon: 'favorite', color: '#EA4C89', liveTag: 'Date Look' },
  Travel: { label: '여행', icon: 'travel_explore', color: '#1AB7EA', liveTag: 'Travel Look' },
  Fitness: { label: '운동', icon: 'fitness_center', color: '#25D366', liveTag: 'Fitness Look' },
  Work: { label: '출근', icon: 'business_center', color: '#5865F2', liveTag: 'Work Look' },
  SocialProfile: { label: 'SNS 프로필', icon: 'account_circle', color: '#F2C94C', liveTag: 'Profile Look' },
};

/** 정의: 하나의 촬영 장면을 5개 피드 미디어 슬롯으로 구성해 다중 사진 UX를 검증한다. @param {string} prefix 카드 ID 접두어 @param {string} url 최적화된 로컬 이미지 URL */
function createAlbum(prefix, url) {
  return ['center 12%', 'center 28%', 'center 44%', 'center 60%', 'center 76%'].map((objectPosition, index) => ({
    id: `${prefix}-media-${index + 1}`,
    type: 'image',
    url,
    objectPosition,
  }));
}

/** 정의: 카테고리별로 생성한 서울 생활권 사진과 대표 질문을 정의한 목업 시드다. */
const mockCardSeeds = [
  { category: 'Outfit', author: 'today_sora', question: '오늘 이 스타일,\n괜찮아 보여요?', subtext: 'Does this outfit feel right for today?', imageUrl: outfitMockImage, yesVotes: 1280, noVotes: 210, comments: [{ id: 'c1', author: 'style_lab', body: '서울 거리의 자연광과 룩이 잘 어울려요.', createdAt: '8분 전', replies: [{ id: 'r1', author: 'today_sora', body: '의견 감사합니다!', createdAt: '6분 전' }] }] },
  { category: 'Date', author: 'date_mood', question: '첫 만남이라면\n호감이 가나요?', subtext: 'Would this look make a lovely first impression?', imageUrl: dateMockImage, yesVotes: 942, noVotes: 88, comments: [{ id: 'c2', author: 'xcubus_kr', body: '밝고 다정한 인상이 느껴져요.', createdAt: '12분 전', replies: [] }] },
  { category: 'Travel', author: 'travel_day', question: '이 여행 스타일,\n매력적으로 보이나요?', subtext: 'Does this travel style feel memorable and charming?', imageUrl: travelMockImage, yesVotes: 782, noVotes: 86, comments: [{ id: 'c3', author: 'seoul_walker', body: '여행의 설렘이 자연스럽게 담겼네요.', createdAt: '20분 전', replies: [] }] },
  { category: 'Fitness', author: 'fit_queen', question: '건강하고 매력적인 인상을\n주나요?', subtext: 'Does this look feel healthy and confident?', imageUrl: fitnessMockImage, yesVotes: 1105, noVotes: 95, comments: [{ id: 'c4', author: 'run_more', body: '활동적인 에너지가 잘 보여요.', createdAt: '1시간 전', replies: [] }] },
  { category: 'Work', author: 'workday_note', question: '직장에서 좋은 첫인상을\n줄 것 같나요?', subtext: 'Would this make a great first impression at work?', imageUrl: workMockImage, yesVotes: 1430, noVotes: 190, comments: [{ id: 'c5', author: 'team_player', body: '차분하고 믿음직한 분위기입니다.', createdAt: '45분 전', replies: [] }] },
  { category: 'SocialProfile', author: 'portrait_note', question: '이 사진, SNS 프로필로\n매력적으로 보이나요?', subtext: 'Would this make a memorable social profile photo?', imageUrl: socialProfileMockImage, yesVotes: 654, noVotes: 72, comments: [] },
];

/** 정의: 각 카테고리에서 두 카드와 카드별 5개 미디어 상태를 제공하는 초기 목업 피드다. */
export const initialCards = mockCardSeeds.flatMap((seed, seedIndex) => [
  { ...seed, id: `card-${seedIndex + 1}-a`, media: createAlbum(`card-${seedIndex + 1}-a`, seed.imageUrl), objectPosition: 'center 38%', timestamp: `${seedIndex * 20 + 10}분 전`, isMyUpload: seedIndex === 0, commentsAllowed: true },
  { ...seed, id: `card-${seedIndex + 1}-b`, author: `${seed.author}_daily`, media: createAlbum(`card-${seedIndex + 1}-b`, seed.imageUrl), objectPosition: 'center 50%', timestamp: `${seedIndex + 2}시간 전`, yesVotes: seed.yesVotes - 87, noVotes: seed.noVotes + 14, commentsAllowed: true },
]);
