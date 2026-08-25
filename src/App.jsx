import { useEffect, useMemo, useState } from 'react';
import { categories, initialCards } from './data/cards.js';
import FeedView from './features/feed/FeedView.jsx';
import UploadView from './features/upload/UploadView.jsx';
import RankingView from './features/ranking/RankingView.jsx';
import ProfileView from './features/profile/ProfileView.jsx';
import SplashView from './features/auth/SplashView.jsx';

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

  return <div className="min-h-screen bg-background text-on-background font-body">
    <header className="fixed top-0 z-50 w-full border-b border-surface-container-high/60 bg-[#051424]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] max-w-md items-center justify-between px-4">
        <button type="button" onClick={() => setActiveTab('feed')} className="flex items-center gap-2.5 text-left" aria-label="FirstLook 피드로 이동">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary-container to-cyan-glow shadow-[0_0_12px_rgba(0,240,255,0.4)]"><span className="material-symbols-outlined text-xl font-bold text-black">visibility</span></span>
          <span className="font-headline text-xl font-extrabold tracking-tight text-white">FirstLook <span className="rounded border border-cyan-glow/30 bg-cyan-glow/10 px-1.5 py-0.5 font-mono text-[10px] text-cyan-glow">AI</span></span>
        </button>
        <div className="flex items-center gap-2">
          <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-container" onClick={() => setToast('새 알림은 없습니다.')} aria-label="알림"><span className="material-symbols-outlined text-[22px] text-on-surface-variant">notifications</span><span className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full bg-cyan-glow ring-2 ring-background" /></button>
          <button type="button" onClick={() => setActiveTab('profile')} className="h-9 w-9 overflow-hidden rounded-full border border-cyan-glow/40 p-0.5" aria-label="프로필"><img className="h-full w-full rounded-full object-cover" src={initialCards[0].imageUrl} alt="내 프로필" /></button>
        </div>
      </div>
    </header>

    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-3 pb-20 pt-[68px] sm:px-4">
      {activeTab === 'feed' && <FeedView categories={categories} cards={visibleCards} card={currentCard} currentIndex={safeIndex} activeCategory={activeCategory} hasVoted={currentCard && votedIds.has(currentCard.id)} onCategoryChange={changeCategory} onPrevious={() => moveCard(-1)} onNext={() => moveCard(1)} onShuffle={shuffle} onVote={vote} onAddComment={addComment} />}
      {activeTab === 'upload' && <UploadView categories={categories} onSubmit={addCard} />}
      {activeTab === 'ranking' && <RankingView cards={cards} categories={categories} onOpen={openRankingCard} />}
      {activeTab === 'profile' && <ProfileView cards={cards} categories={categories} onDelete={deleteCard} onUpload={() => setActiveTab('upload')} />}
    </main>

    {toast && <div role="status" className="fixed left-1/2 top-[72px] z-[60] w-full max-w-xs -translate-x-1/2 px-4"><div className="flex items-center gap-2 rounded-xl border border-cyan-glow/50 bg-surface-container-high/95 px-3.5 py-2.5 text-xs text-white shadow-2xl backdrop-blur"><span className="material-symbols-outlined text-base text-cyan-glow">check_circle</span>{toast}</div></div>}

    <nav className="fixed bottom-0 z-50 w-full border-t border-surface-container-high/70 bg-[#051424]/90 pb-[env(safe-area-inset-bottom)] shadow-2xl backdrop-blur-xl" aria-label="주요 메뉴"><div className="mx-auto flex h-[60px] max-w-md items-center justify-around px-2">{tabs.map(([id, icon, label]) => <button key={id} type="button" onClick={() => setActiveTab(id)} className={`flex h-[52px] w-16 flex-col items-center justify-center transition-all ${activeTab === id ? 'text-cyan-glow' : 'text-slate-400 hover:text-white'}`}><span className="material-symbols-outlined text-[22px]">{icon}</span><span className="mt-0.5 font-mono text-[9px] font-bold">{label}</span></button>)}</div></nav>
  </div>;
}
