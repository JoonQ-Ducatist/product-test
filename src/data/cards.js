import businessImage from '../../assets/images/card1_business.jpg';
import datingImage from '../../assets/images/card2_dating.png';
import officeImage from '../../assets/images/card3_office.png';
import workoutImage from '../../assets/images/card4_workout.png';

export const categories = {
  Business: { label: '비즈니스', icon: 'work', color: '#00f0ff', liveTag: 'Live Business' },
  Dating: { label: '소개팅/데이트', icon: 'favorite', color: '#ff7597', liveTag: 'Live Dating' },
  Workout: { label: '운동/피트니스', icon: 'fitness_center', color: '#ff3b30', liveTag: 'Live Fitness' },
  Interview: { label: '면접/이력서', icon: 'badge', color: '#6366f1', liveTag: 'Live Career' },
  Style: { label: '데일리 룩', icon: 'checkroom', color: '#a855f7', liveTag: 'Live Style' },
  Profile: { label: 'SNS 프로필', icon: 'person', color: '#fbbf24', liveTag: 'Live Profile' },
};

export const initialCards = [
  { id: 'card-1', author: 'career_mode', category: 'Business', question: '비즈니스 캐주얼 룩으로\n전문성이 느껴지나요?', subtext: 'Does this business casual look feel professional?', imageUrl: businessImage, objectPosition: 'center 12%', yesVotes: 1280, noVotes: 210, timestamp: '10분 전', isMyUpload: true, commentsAllowed: true, comments: [{ id: 'c1', author: 'style_lab', body: '재킷과 셔츠 조합이 단정해서 신뢰감이 느껴져요.', createdAt: '8분 전', replies: [{ id: 'r1', author: 'career_mode', body: '의견 감사합니다!', createdAt: '6분 전' }] }, { id: 'c2', author: 'weekday_fit', body: '신발 톤까지 맞추면 더 완성도 있어 보일 것 같아요.', createdAt: '5분 전', replies: [] }, { id: 'c3', author: 'office_note', body: '첫 미팅에도 무난한 스타일이에요.', createdAt: '2분 전', replies: [] }] },
  { id: 'card-2', author: 'daily_look', category: 'Dating', question: '소개팅에서 이 첫인상을 보면\n호감이 생길 것 같나요?', subtext: 'Would you be interested after seeing this first impression on a blind date?', imageUrl: datingImage, objectPosition: 'center 38%', yesVotes: 942, noVotes: 88, timestamp: '30분 전', isMyUpload: true, commentsAllowed: true, comments: [{ id: 'c4', author: 'xcubus_kr', body: '밝은 색감이라 편안한 인상이네요.', createdAt: '12분 전', replies: [] }] },
  { id: 'card-3', author: 'office_pro', category: 'Business', question: '오늘 출근길에 이 사람을 보면\n신뢰가 갈 것 같나요?', subtext: 'Does this person inspire trust on their first day?', imageUrl: officeImage, objectPosition: 'center 38%', yesVotes: 1430, noVotes: 190, timestamp: '1시간 전', commentsAllowed: true, comments: [{ id: 'c5', author: 'team_player', body: '차분하고 전문적인 분위기입니다.', createdAt: '45분 전', replies: [] }] },
  { id: 'card-4', author: 'fit_queen', category: 'Workout', question: '이 운동복 스타일이 이 사람의\n건강한 매력을 잘 보여주나요?', subtext: 'Does this workout style showcase their healthy charm?', imageUrl: workoutImage, objectPosition: 'center 34%', yesVotes: 1105, noVotes: 95, timestamp: '2시간 전', commentsAllowed: true, comments: [{ id: 'c6', author: 'run_more', body: '활동적인 느낌이 잘 살아 있어요.', createdAt: '1시간 전', replies: [] }] },
  { id: 'card-5', author: 'fresh_start', category: 'Interview', question: '면접에서 전문성과 신뢰감이\n느껴지는 인상인가요?', subtext: 'Does this look feel professional and trustworthy for an interview?', imageUrl: officeImage, objectPosition: 'center 24%', yesVotes: 782, noVotes: 86, timestamp: '3시간 전', commentsAllowed: true, comments: [] },
];
