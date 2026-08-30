import { useEffect, useMemo, useState } from 'react';
import { categories, initialCards } from './data/cards.js';
import FeedView from './features/feed/FeedView.jsx';
import UploadView from './features/upload/UploadView.jsx';
import RankingView from './features/ranking/RankingView.jsx';
import ProfileView from './features/profile/ProfileView.jsx';
import SplashView from './features/auth/SplashView.jsx';
import logoUrl from './assets/xcubus-snake-logo.png';
import StatePanel from './components/ui/StatePanel.jsx';
import SkipLink from './components/ui/SkipLink.jsx';
import { submitVote } from './services/mockApi.js';

/** 정의: 앱 전역 하단 탐색 메뉴의 식별자·아이콘·표시명·선택 색상 목록이다. */
const tabs = [
  ['feed', 'dynamic_feed', 'Feed', '#2BA8E8'],
  ['upload', 'add_circle', 'Upload', '#E65B7A'],
  ['ranking', 'emoji_events', 'Ranking', '#18B9B5'],
  ['profile', 'account_circle', 'Profile', '#EAAF2D'],
];

/** 정의: 구성 비율을 보존하기 위한 기준 모바일 디자인 캔버스의 크기다. */
const DESIGN_CANVAS = { width: 430, height: 920 };

/** 정의: 표시 영역에 맞는 단일 스케일과 모바일 세로 화면용 캔버스 너비를 계산한다. */
function getCanvasMetrics() {
  if (typeof window === 'undefined') return { scale: 1, width: DESIGN_CANVAS.width };
  const viewport = window.visualViewport;
  const visibleWidth = viewport?.width ?? window.innerWidth;
  const visibleHeight = viewport?.height ?? window.innerHeight;
  const scale = Math.min(visibleWidth / DESIGN_CANVAS.width, visibleHeight / DESIGN_CANVAS.height);
  const isPortraitMobile = visibleWidth <= 600 && visibleHeight > visibleWidth;
  return { scale, width: isPortraitMobile ? visibleWidth / scale : DESIGN_CANVAS.width };
}

/** 정의: 실제 가용 뷰포트에 맞춰 헤더·카드·하단 메뉴를 렌더링하는 반응형 프레임이다. */
function CanvasStage({ children }) {
  const [metrics, setMetrics] = useState(getCanvasMetrics);
  useEffect(() => {
    const updateMetrics = () => setMetrics(getCanvasMetrics());
    window.addEventListener('resize', updateMetrics);
    window.visualViewport?.addEventListener('resize', updateMetrics);
    return () => {
      window.removeEventListener('resize', updateMetrics);
      window.visualViewport?.removeEventListener('resize', updateMetrics);
    };
  }, []);
  return <div className="app-stage"><div className="app-canvas" style={{ width: metrics.width, height: DESIGN_CANVAS.height, transform: `scale(${metrics.scale})` }}>{children}</div></div>;
}

/** 정의: 인증 진입, 탭 상태, 피드 목업 데이터와 사용자 상호작용을 조합하는 루트 화면 컴포넌트다. */
export default function App() {
  const [isGuest, setIsGuest] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [cards, setCards] = useState(initialCards);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votedIds, setVotedIds] = useState(() => new Set());
  const [toast, setToast] = useState('');
  const [previewState, setPreviewState] = useState(() => new URLSearchParams(window.location.search).get('state') ?? 'ready');

  const visibleCards = useMemo(() => activeCategory === 'ALL' ? cards : cards.filter((card) => card.category === activeCategory), [activeCategory, cards]);
  const safeIndex = visibleCards.length ? currentIndex % visibleCards.length : 0;
  const currentCard = visibleCards[safeIndex];

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  /** 정의: 피드 카테고리를 변경하고 새 목록의 첫 카드로 이동한다. @param {string} category 카테고리 식별자 */
  function changeCategory(category) {
    setActiveCategory(category);
    setCurrentIndex(0);
  }

  /** 정의: 현재 필터 결과 안에서 이전 또는 다음 카드를 순환 이동한다. @param {number} direction -1 또는 1 */
  function moveCard(direction) {
    if (!visibleCards.length) return;
    setCurrentIndex((index) => (index + direction + visibleCards.length) % visibleCards.length);
  }

  /** 정의: 모든 카테고리에서 임의의 카드를 선택하고 안내 토스트를 표시한다. */
  function shuffle() {
    setActiveCategory('ALL');
    setCurrentIndex(Math.floor(Math.random() * cards.length));
    setToast('새로운 사진을 보여드릴게요');
  }

  /** 정의: 목업 API 계약을 통해 YES/NO 투표를 기록하고 카드 집계를 동기화한다. @param {boolean} isYes YES 선택 여부 */
  async function vote(isYes) {
    const result = await submitVote(currentCard, isYes ? 'yes' : 'no', votedIds);
    if (result.error) { setToast(result.error.message); return; }
    setCards((items) => items.map((card) => card.id === currentCard.id ? result.data.post : card));
    setVotedIds((ids) => new Set([...ids, currentCard.id]));
    setToast(isYes ? 'YES 의견을 남겼습니다.' : 'NO 의견을 남겼습니다.');
  }

  /** 정의: 유효한 댓글을 현재 목업 카드에 추가한다. @param {string} cardId 게시물 ID @param {string} body 댓글 내용 */
  function addComment(cardId, body) {
    const trimmed = body.trim();
    if (!trimmed) return;
    setCards((items) => items.map((item) => item.id === cardId ? {
      ...item,
      comments: [...(item.comments ?? []), { id: `local-${Date.now()}`, author: 'you', body: trimmed, createdAt: '방금', replies: [] }],
    } : item));
    setToast('댓글을 남겼습니다.');
  }

  /** 정의: 업로드 목업 결과를 피드 맨 앞에 넣고 피드 탭으로 전환한다. @param {object} card 새 카드 데이터 */
  function addCard(card) {
    setCards((items) => [card, ...items]);
    setActiveCategory('ALL');
    setCurrentIndex(0);
    setActiveTab('feed');
    setToast('새 사진이 피드 맨 앞에 등록되었습니다.');
  }

  /** 정의: 랭킹에서 선택한 카드의 피드 위치로 이동한다. @param {{ id: string }} target 대상 카드 */
  function openRankingCard(target) {
    setActiveCategory('ALL');
    setCurrentIndex(Math.max(cards.findIndex((item) => item.id === target.id), 0));
    setActiveTab('feed');
  }

  /** 정의: 목업 프로필에서 카드 노출을 제거하고 완료 안내를 표시한다. @param {string} id 카드 ID */
  function deleteCard(id) { setCards((items) => items.filter((item) => item.id !== id)); setToast('게시물을 삭제했습니다.'); }

  if (isGuest) return <CanvasStage><SplashView cards={cards} onEnter={(provider) => { setIsGuest(false); setToast(`${provider} 로그인은 현재 목업입니다.`); }} /></CanvasStage>;

  return <CanvasStage><div className="editorial-app h-full bg-background text-on-background font-body">
    <SkipLink />
    <header className="fixed top-0 z-50 w-full border-b border-[#e4e2dd] bg-[#fbf9f4]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] max-w-none items-center justify-between px-4">
        <button type="button" onClick={() => setActiveTab('feed')} className="flex min-w-0 items-end gap-2 text-left" aria-label="xy by x.Cubus 피드로 이동">
          <img src={logoUrl} width="38" height="28" className="h-7 w-9 shrink-0 object-contain" alt="xy by x.Cubus 로고" />
          <span lang="en" className="whitespace-nowrap font-latin text-[17px] font-bold leading-none tracking-tight text-[#1b1c19] sm:text-xl">xy by x.Cubus</span><span aria-label="AI" className="flex h-[20px] w-[29px] shrink-0 items-center justify-center rounded-[4px] border border-[#c5a059] bg-[#fbf9f4] font-mono text-[10px] font-bold leading-none tracking-[-0.04em] text-[#735c00]">AI</span><span lang="en" className="hidden whitespace-nowrap font-mono text-[8px] leading-none tracking-wide text-[#735c00] sm:inline">MORE VIEWS, MORE YOU</span>
        </button>
        <div className="flex items-center gap-2">
          <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-container" onClick={() => setToast('새 알림은 없습니다.')} aria-label="알림"><span className="material-symbols-outlined text-[22px] text-on-surface-variant">notifications</span><span className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full bg-[#c5a059] ring-2 ring-background" /></button>
          <button type="button" onClick={() => setActiveTab('profile')} className="h-9 w-9 overflow-hidden rounded-full border border-[#c5a059]/60 p-0.5" aria-label="프로필"><img className="h-full w-full rounded-full object-cover" src={initialCards[0].imageUrl} alt="내 프로필" /></button>
        </div>
      </div>
    </header>

    <main id="main-content" tabIndex="-1" className="editorial-main mx-auto flex h-full w-full max-w-none flex-col px-4 pb-20 pt-[76px] sm:px-5">
      {previewState !== 'ready' ? <StatePanel state={previewState} pageName={tabs.find(([id]) => id === activeTab)?.[2] ?? 'xCubus'} onAction={() => { if (previewState === 'permission') setIsGuest(true); else if (previewState === 'review') setActiveTab('profile'); setPreviewState('ready'); }} /> : <>
        {activeTab === 'feed' && <FeedView categories={categories} cards={visibleCards} card={currentCard} currentIndex={safeIndex} activeCategory={activeCategory} hasVoted={currentCard && votedIds.has(currentCard.id)} onCategoryChange={changeCategory} onPrevious={() => moveCard(-1)} onNext={() => moveCard(1)} onShuffle={shuffle} onVote={vote} onAddComment={addComment} />}
        {activeTab === 'upload' && <UploadView categories={categories} onSubmit={addCard} onMessage={setToast} />}
        {activeTab === 'ranking' && <RankingView cards={cards} categories={categories} onOpen={openRankingCard} />}
        {activeTab === 'profile' && <ProfileView cards={cards} categories={categories} onDelete={deleteCard} onUpload={() => setActiveTab('upload')} />}
      </>}
    </main>

    {toast && <div role="status" className="fixed left-1/2 top-[72px] z-[60] w-full max-w-xs -translate-x-1/2 px-4"><div className="flex items-center gap-2 rounded-lg border border-[#e4e2dd] bg-white/95 px-3.5 py-2.5 text-xs text-[#1b1c19] shadow-lg backdrop-blur"><span className="material-symbols-outlined text-base text-cyan-glow">check_circle</span>{toast}</div></div>}

    <nav className="fixed bottom-0 z-50 w-full border-t border-[#e4e2dd] bg-[#fbf9f4]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.03)] backdrop-blur-xl" aria-label="주요 메뉴"><div className="mx-auto flex h-[60px] max-w-none items-center justify-around px-2">{tabs.map(([id, icon, label, color]) => <button key={id} type="button" onClick={() => setActiveTab(id)} aria-current={activeTab === id ? 'page' : undefined} style={activeTab === id ? { color } : undefined} className={`flex h-[52px] w-16 flex-col items-center justify-center transition-all ${activeTab === id ? 'scale-[1.03]' : 'text-slate-400 hover:text-[#1b1c19]'}`}><span className="material-symbols-outlined text-[22px]">{icon}</span><span className="mt-0.5 font-mono text-[11px] font-bold">{label}</span></button>)}</div></nav>
  </div></CanvasStage>;
}
