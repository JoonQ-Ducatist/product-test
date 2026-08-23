import businessImage from '../../assets/images/card1_business.jpg';
import datingImage from '../../assets/images/card2_dating.png';
import officeImage from '../../assets/images/card3_office.png';
import workoutImage from '../../assets/images/card4_workout.png';

export const categories = {
  Business: { label: '비즈니스', color: '#00f0ff', icon: '💼' },
  Dating: { label: '소개팅/데이트', color: '#ff7597', icon: '💗' },
  Workout: { label: '운동/피트니스', color: '#ff3b30', icon: '🏃' },
  Interview: { label: '면접/커리어', color: '#6366f1', icon: '🪪' },
  Style: { label: '데일리 룩', color: '#a855f7', icon: '✨' },
  Profile: { label: 'SNS 프로필', color: '#fbbf24', icon: '🌟' },
};

export const initialCards = [
  { id: 'card-1', author: 'career_mode', category: 'Business', question: '비즈니스 캐주얼 룩으로 전문성이 느껴지나요?', imageUrl: businessImage, yesVotes: 1280, noVotes: 210, isMyUpload: true, timestamp: '10분 전' },
  { id: 'card-2', author: 'daily_look', category: 'Dating', question: '소개팅에서 이 첫인상을 보면 호감이 생길 것 같나요?', imageUrl: datingImage, yesVotes: 942, noVotes: 88, isMyUpload: true, timestamp: '30분 전' },
  { id: 'card-3', author: 'office_pro', category: 'Business', question: '오늘 출근길에 이 사람을 보면 신뢰가 갈 것 같나요?', imageUrl: officeImage, yesVotes: 1430, noVotes: 190, isMyUpload: false, timestamp: '1시간 전' },
  { id: 'card-4', author: 'fit_queen', category: 'Workout', question: '이 운동복 스타일이 건강한 매력을 잘 보여주나요?', imageUrl: workoutImage, yesVotes: 1105, noVotes: 95, isMyUpload: false, timestamp: '2시간 전' },
];
