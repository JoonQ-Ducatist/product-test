import { useEffect, useMemo, useState } from 'react';
import { categories, initialCards } from './data/cards.js';
import FeedView from './features/feed/FeedView.jsx';
import UploadView from './features/upload/UploadView.jsx';
import RankingView from './features/ranking/RankingView.jsx';
import ProfileView from './features/profile/ProfileView.jsx';
import SplashView from './features/auth/SplashView.jsx';
import logoUrl from './assets/xcubus-snake-logo.png';

const tabs = [
  ['feed', 'dynamic_feed', 'Feed'],
  ['upload', 'add_circle', 'Upload'],
  ['ranking', 'emoji_events', 'Ranking'],
  ['profile', 'account_circle', 'Profile'],
];

export default function App() {
  const [isGuest, setIsGuest] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [cards, setCards] = useState(initialCards);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votedIds, setVotedIds] = useState(() => new Set());
  const [toast, setToast] = useState('');

  const visibleCards = useMemo(() => activeCategory === 'ALL' ? cards : cards.filter((card) => card.category === activeCategory), [activeCategory, cards]);
  const safeIndex = visibleCards.length ? currentIndex % visibleCards.length : 0;
  const currentCard = visibleCards[safeIndex];

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function changeCategory(category) {
    setActiveCategory(category);
    setCurrentIndex(0);
    setToast(category === 'ALL' ? '전체 피드 모아보기' : `'${categories[category].label}' 모아보기`);
  }

  function moveCard(direction) {
    if (!visibleCards.length) return;
    setCurrentIndex((index) => (index + direction + visibleCards.length) % visibleCards.length);
  }

  function shuffle() {
    setActiveCategory('ALL');
    setCurrentIndex(Math.floor(Math.random() * cards.length));
    setToast('새로운 사진을 보여드릴게요');
  }

  function vote(isYes) {
    if (!currentCard || votedIds.has(currentCard.id)) return;
    setCards((items) => items.map((card) => card.id === currentCard.id ? { ...card, yesVotes: card.yesVotes + (isYes ? 1 : 0), noVotes: card.noVotes + (isYes ? 0 : 1) } : card));
    setVotedIds((ids) => new Set([...ids, currentCard.id]));
    setToast(isYes ? 'YES 의견을 남겼습니다.' : 'NO 의견을 남겼습니다.');
  }

  function addComment(cardId, body) {
    const trimmed = body.trim();
    if (!trimmed) return;
    setCards((items) => items.map((item) => item.id === cardId ? {
      ...item,
      comments: [...(item.comments ?? []), { id: `local-${Date.now()}`, author: 'you', body: trimmed, createdAt: '방금', replies: [] }],
    } : item));
    setToast('댓글을 남겼습니다.');
  }

  function addCard(card) {
    setCards((items) => [card, ...items]);
    setActiveCategory('ALL');
    setCurrentIndex(0);
    setActiveTab('feed');
    setToast('새 사진이 피드 맨 앞에 등록되었습니다.');
  }

  function openRankingCard(target) {
    setActiveCategory('ALL');
    setCurrentIndex(Math.max(cards.findIndex((item) => item.id === target.id), 0));
    setActiveTab('feed');
  }

  function deleteCard(id) { setCards((items) => items.filter((item) => item.id !== id)); setToast('게시물을 삭제했습니다.'); }

  if (isGuest) return <SplashView cards={cards} onEnter={(provider) => { setIsGuest(false); setToast(`${provider} 로그인은 현재 목업입니다.`); }} />;

  return <div className="editorial-app min-h-screen bg-background text-on-background font-body">
    <header className="fixed top-0 z-50 w-full border-b border-[#e4e2dd] bg-[#fbf9f4]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] max-w-md items-center justify-between px-4">
        <button type="button" onClick={() => setActiveTab('feed')} className="flex min-w-0 items-end gap-2 text-left" aria-label="XY by x.Cubus 피드로 이동">
          <img src={logoUrl} width="38" height="28" className="h-7 w-9 shrink-0 object-contain" alt="XY by x.Cubus 로고" />
          <span className="whitespace-nowrap font-headline text-[17px] font-bold leading-none tracking-tight text-[#1b1c19] sm:text-xl">XY by x.Cubus</span><span aria-label="AI" className="flex h-[20px] w-[29px] shrink-0 items-center justify-center rounded-[4px] border border-[#c5a059] bg-[#fbf9f4] font-mono text-[10px] font-bold leading-none tracking-[-0.04em] text-[#735c00]">AI</span><span className="hidden whitespace-nowrap font-mono text-[8px] leading-none tracking-wide text-[#735c00] sm:inline">MORE VIEWS, MORE YOU</span>
        </button>
        <div className="flex items-center gap-2">
          <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-container" onClick={() => setToast('새 알림은 없습니다.')} aria-label="알림"><span className="material-symbols-outlined text-[22px] text-on-surface-variant">notifications</span><span className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full bg-[#c5a059] ring-2 ring-background" /></button>
          <button type="button" onClick={() => setActiveTab('profile')} className="h-9 w-9 overflow-hidden rounded-full border border-[#c5a059]/60 p-0.5" aria-label="프로필"><img className="h-full w-full rounded-full object-cover" src={initialCards[0].imageUrl} alt="내 프로필" /></button>
        </div>
      </div>
    </header>

    <main className="editorial-main mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-20 pt-[76px] sm:px-5">
      {activeTab === 'feed' && <FeedView categories={categories} cards={visibleCards} card={currentCard} currentIndex={safeIndex} activeCategory={activeCategory} hasVoted={currentCard && votedIds.has(currentCard.id)} onCategoryChange={changeCategory} onPrevious={() => moveCard(-1)} onNext={() => moveCard(1)} onShuffle={shuffle} onVote={vote} onAddComment={addComment} />}
      {activeTab === 'upload' && <UploadView categories={categories} onSubmit={addCard} />}
      {activeTab === 'ranking' && <RankingView cards={cards} categories={categories} onOpen={openRankingCard} />}
      {activeTab === 'profile' && <ProfileView cards={cards} categories={categories} onDelete={deleteCard} onUpload={() => setActiveTab('upload')} />}
    </main>

    {toast && <div role="status" className="fixed left-1/2 top-[72px] z-[60] w-full max-w-xs -translate-x-1/2 px-4"><div className="flex items-center gap-2 rounded-lg border border-[#e4e2dd] bg-white/95 px-3.5 py-2.5 text-xs text-[#1b1c19] shadow-lg backdrop-blur"><span className="material-symbols-outlined text-base text-cyan-glow">check_circle</span>{toast}</div></div>}

    <nav className="fixed bottom-0 z-50 w-full border-t border-[#e4e2dd] bg-[#fbf9f4]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.03)] backdrop-blur-xl" aria-label="주요 메뉴"><div className="mx-auto flex h-[60px] max-w-md items-center justify-around px-2">{tabs.map(([id, icon, label]) => <button key={id} type="button" onClick={() => setActiveTab(id)} className={`flex h-[52px] w-16 flex-col items-center justify-center transition-all ${activeTab === id ? 'text-cyan-glow' : 'text-slate-400 hover:text-[#1b1c19]'}`}><span className="material-symbols-outlined text-[22px]">{icon}</span><span className="mt-0.5 font-mono text-[9px] font-bold">{label}</span></button>)}</div></nav>
  </div>;
}
