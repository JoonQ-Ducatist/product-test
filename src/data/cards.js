import businessImage from '../../assets/images/card1_business.jpg';
import datingImage from '../../assets/images/card2_dating.png';
import officeImage from '../../assets/images/card3_office.png';
import workoutImage from '../../assets/images/card4_workout.png';

export const categories = {
  Outfit: { label: '오늘의 룩', icon: 'checkroom', color: '#72CDB5', liveTag: 'Today’s Outfit' },
  Date: { label: '데이트', icon: 'favorite', color: '#C97B91', liveTag: 'Date Look' },
  Travel: { label: '여행', icon: 'travel_explore', color: '#5F9F9A', liveTag: 'Travel Look' },
  Fitness: { label: '운동', icon: 'fitness_center', color: '#8AA65B', liveTag: 'Fitness Look' },
  Work: { label: '출근', icon: 'business_center', color: '#7894B8', liveTag: 'Work Look' },
  SocialProfile: { label: 'SNS 프로필', icon: 'account_circle', color: '#B28AA8', liveTag: 'Profile Look' },
};

export const initialCards = [
  { id: 'card-1', author: 'today_sora', category: 'Outfit', question: '오늘 이 스타일,\n괜찮아 보여요?', subtext: 'Does this outfit feel right for today?', imageUrl: businessImage, objectPosition: 'center 12%', yesVotes: 1280, noVotes: 210, timestamp: '10분 전', isMyUpload: true, commentsAllowed: true, comments: [{ id: 'c1', author: 'style_lab', body: '재킷과 셔츠 조합이 단정해서 오늘의 분위기와 잘 어울려요.', createdAt: '8분 전', replies: [{ id: 'r1', author: 'today_sora', body: '의견 감사합니다!', createdAt: '6분 전' }] }, { id: 'c2', author: 'weekday_fit', body: '신발 톤까지 맞추면 더 완성도 있어 보일 것 같아요.', createdAt: '5분 전', replies: [] }, { id: 'c3', author: 'daily_note', body: '오늘 하루 자신감 있게 시작할 수 있는 룩이에요.', createdAt: '2분 전', replies: [] }] },
  { id: 'card-2', author: 'date_mood', category: 'Date', question: '첫 만남이라면\n호감이 가나요?', subtext: 'Would this look make a lovely first impression?', imageUrl: datingImage, objectPosition: 'center 38%', yesVotes: 942, noVotes: 88, timestamp: '30분 전', isMyUpload: true, commentsAllowed: true, comments: [{ id: 'c4', author: 'xcubus_kr', body: '밝은 색감이라 편안하고 다정한 인상이네요.', createdAt: '12분 전', replies: [] }] },
  { id: 'card-3', author: 'workday_note', category: 'Work', question: '직장에서 좋은 첫인상을\n줄 것 같나요?', subtext: 'Would this make a great first impression at work?', imageUrl: officeImage, objectPosition: 'center 38%', yesVotes: 1430, noVotes: 190, timestamp: '1시간 전', commentsAllowed: true, comments: [{ id: 'c5', author: 'team_player', body: '차분하고 믿음직한 분위기입니다.', createdAt: '45분 전', replies: [] }] },
  { id: 'card-4', author: 'fit_queen', category: 'Fitness', question: '건강하고 매력적인 인상을\n주나요?', subtext: 'Does this look feel healthy and confident?', imageUrl: workoutImage, objectPosition: 'center 34%', yesVotes: 1105, noVotes: 95, timestamp: '2시간 전', commentsAllowed: true, comments: [{ id: 'c6', author: 'run_more', body: '활동적인 느낌이 잘 살아 있어요.', createdAt: '1시간 전', replies: [] }] },
  { id: 'card-5', author: 'travel_day', category: 'Travel', question: '이 여행 스타일,\n매력적으로 보이나요?', subtext: 'Does this travel style feel memorable and charming?', imageUrl: datingImage, objectPosition: 'center 30%', yesVotes: 782, noVotes: 86, timestamp: '3시간 전', commentsAllowed: true, comments: [] },
  { id: 'card-6', author: 'portrait_note', category: 'SocialProfile', question: '이 사진, SNS 프로필로\n매력적으로 보이나요?', subtext: 'Would this make a memorable social profile photo?', imageUrl: datingImage, objectPosition: 'center 22%', yesVotes: 654, noVotes: 72, timestamp: '4시간 전', commentsAllowed: true, comments: [] },
];
