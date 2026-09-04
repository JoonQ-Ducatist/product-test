import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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

/** 정의: 모바일은 전체 폭, PC·태블릿은 중앙 SNS 콘텐츠 컬럼으로 렌더링하는 반응형 프레임이다. */
function CanvasStage({ children }) { return <div className="app-stage"><div className="app-canvas">{children}</div></div>; }

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
  const tabGestureStart = useRef(null);
  const mainRef = useRef(null);

  const visibleCards = useMemo(() => activeCategory === 'ALL' ? cards : cards.filter((card) => card.category === activeCategory), [activeCategory, cards]);
  const safeIndex = visibleCards.length ? currentIndex % visibleCards.length : 0;
  const currentCard = visibleCards[safeIndex];

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  /** 정의: 메뉴 전환마다 이전 화면의 스크롤 위치를 0으로 초기화해 상단 헤더·본문이 잘린 채 렌더링되는 것을 막는다. */
  useLayoutEffect(() => {
    const main = mainRef.current;
    if (main) main.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [activeTab]);

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

  /** 정의: 카테고리 평가 유형에 맞춰 BINARY 또는 NUMERIC_AGE 투표를 기록하고 카드 집계를 동기화한다. @param {boolean|number} value YES/NO 또는 예상 나이 */
  async function vote(value) {
    const payload = currentCard.evaluationType === 'NUMERIC_AGE' ? { type: 'age', value } : value ? 'yes' : 'no';
    const result = await submitVote(currentCard, payload, votedIds);
    if (result.error) { setToast(result.error.message); return; }
    setCards((items) => items.map((card) => card.id === currentCard.id ? result.data.post : card));
    setVotedIds((ids) => new Set([...ids, currentCard.id]));
    setToast(currentCard.evaluationType === 'NUMERIC_AGE' ? `${value}세로 첫인상을 남겼습니다.` : value ? 'YES 의견을 남겼습니다.' : 'NO 의견을 남겼습니다.');
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

  /** 정의: 본문에서의 가로 터치를 기록하되 카드 앨범·입력·버튼과 같은 자체 제스처 영역은 탭 이동 대상에서 제외한다. @param {PointerEvent} event 포인터 시작 이벤트 */
  function startTabGesture(event) {
    if (event.pointerType !== 'touch' || event.target.closest('button, input, textarea, select, a, [role="dialog"], .media-carousel')) return;
    tabGestureStart.current = { x: event.clientX, y: event.clientY };
  }

  /** 정의: 가로 터치가 세로 스크롤보다 충분히 클 때 Feed·Upload·Ranking·Profile을 인접 순서로 이동한다. @param {PointerEvent} event 포인터 종료 이벤트 */
  function finishTabGesture(event) {
    const start = tabGestureStart.current;
    tabGestureStart.current = null;
    if (!start || event.pointerType !== 'touch') return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < 72 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return;
    const currentTabIndex = tabs.findIndex(([id]) => id === activeTab);
    const nextIndex = Math.min(Math.max(currentTabIndex + (deltaX < 0 ? 1 : -1), 0), tabs.length - 1);
    if (nextIndex !== currentTabIndex) setActiveTab(tabs[nextIndex][0]);
  }

  if (isGuest) return <CanvasStage><SplashView cards={cards} onEnter={(provider) => { setIsGuest(false); setToast(`${provider} 로그인은 현재 목업입니다.`); }} /></CanvasStage>;

  return <CanvasStage><div className="editorial-app h-full bg-background text-on-background font-body">
    <SkipLink />
    <header className="fixed top-0 z-50 w-full border-b border-[#e4e2dd] bg-[#fbf9f4]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[48px] max-w-none items-center justify-between px-4">
        <button type="button" onClick={() => setActiveTab('feed')} className="flex min-w-0 items-end gap-1 text-left" aria-label="xy by x.Cubus 피드로 이동">
          <img src={logoUrl} width="38" height="28" className="h-7 w-9 shrink-0 object-contain" alt="xy by x.Cubus 로고" />
          <span lang="en" className="whitespace-nowrap font-latin text-[17px] font-bold leading-none tracking-tight text-[#1b1c19] sm:text-xl">xy by x.Cubus</span><span aria-label="AI" className="flex h-[20px] w-[29px] shrink-0 items-center justify-center rounded-[4px] border border-[#c5a059] bg-[#fbf9f4] font-mono text-[10px] font-bold leading-none tracking-[-0.04em] text-[#735c00]">AI</span><span lang="en" className="hidden whitespace-nowrap font-mono text-[8px] leading-none tracking-wide text-[#735c00] sm:inline">MORE VIEWS, MORE YOU</span>
        </button>
        <div className="flex items-center gap-2">
          <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-container" onClick={() => setToast('새 알림은 없습니다.')} aria-label="알림"><span className="material-symbols-outlined text-[22px] text-on-surface-variant">notifications</span><span className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full bg-[#c5a059] ring-2 ring-background" /></button>
          <button type="button" onClick={() => setActiveTab('profile')} className="h-9 w-9 overflow-hidden rounded-full border border-[#c5a059]/60 p-0.5" aria-label="프로필"><img className="h-full w-full rounded-full object-cover" src={initialCards[0].imageUrl} alt="내 프로필" /></button>
        </div>
      </div>
    </header>

    <main key={`main-${activeTab}`} ref={mainRef} id="main-content" tabIndex="-1" onPointerDown={startTabGesture} onPointerUp={finishTabGesture} onPointerCancel={() => { tabGestureStart.current = null; }} className={`editorial-main mx-auto flex h-full w-full max-w-none flex-col px-4 pb-11 pt-[56px] sm:px-5 ${activeTab === 'feed' ? 'editorial-main--feed' : 'editorial-main--scroll'}`}>
      {previewState !== 'ready' ? <StatePanel state={previewState} pageName={tabs.find(([id]) => id === activeTab)?.[2] ?? 'xCubus'} onAction={() => { if (previewState === 'permission') setIsGuest(true); else if (previewState === 'review') setActiveTab('profile'); setPreviewState('ready'); }} /> : <>
        {activeTab === 'feed' && <FeedView categories={categories} cards={visibleCards} card={currentCard} currentIndex={safeIndex} activeCategory={activeCategory} hasVoted={currentCard && votedIds.has(currentCard.id)} onCategoryChange={changeCategory} onPrevious={() => moveCard(-1)} onNext={() => moveCard(1)} onShuffle={shuffle} onVote={vote} onAddComment={addComment} />}
        {activeTab === 'upload' && <UploadView categories={categories} onSubmit={addCard} onMessage={setToast} />}
        {activeTab === 'ranking' && <RankingView cards={cards} categories={categories} onOpen={openRankingCard} />}
        {activeTab === 'profile' && <ProfileView cards={cards} categories={categories} onDelete={deleteCard} onUpload={() => setActiveTab('upload')} />}
      </>}
    </main>

    <DesktopRecommendationAside cards={cards} onProfile={() => setActiveTab('profile')} />

    {toast && <div role="status" className="fixed left-1/2 top-[60px] z-[60] w-full max-w-xs -translate-x-1/2 px-4"><div className="flex items-center gap-2 rounded-lg border border-[#e4e2dd] bg-white/95 px-3.5 py-2.5 text-xs text-[#1b1c19] shadow-lg backdrop-blur"><span className="material-symbols-outlined text-base text-cyan-glow">check_circle</span>{toast}</div></div>}

    <nav className="fixed bottom-0 z-50 w-full border-t border-[#e4e2dd] bg-[#fbf9f4]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.03)] backdrop-blur-xl" aria-label="주요 메뉴">
      <button type="button" onClick={() => setActiveTab('feed')} className="desktop-nav-brand" aria-label="xy by x.Cubus 피드로 이동"><img src={logoUrl} width="30" height="24" alt="" /><span lang="en">xy by x.Cubus</span></button>
      <div className="desktop-nav-items mx-auto flex h-[44px] max-w-none items-center justify-around px-2">{tabs.map(([id, icon, label, color]) => <button key={id} type="button" onClick={() => setActiveTab(id)} aria-current={activeTab === id ? 'page' : undefined} style={activeTab === id ? { color } : undefined} className={`flex h-[38px] w-16 flex-col items-center justify-center transition-all ${activeTab === id ? 'scale-[1.03]' : 'text-slate-400 hover:text-[#1b1c19]'}`}><span className="material-symbols-outlined text-[20px]">{icon}</span><span className="mt-px font-mono text-[10px] font-bold">{label}</span></button>)}</div>
    </nav>
  </div></CanvasStage>;
}

/** 정의: 넓은 PC 화면에서 중앙 피드와 병렬로 표시하는 Instagram형 사용자·추천 콘텐츠 영역이다. */
function DesktopRecommendationAside({ cards, onProfile }) {
  const suggestions = cards.slice(1, 6);
  return <aside className="desktop-recommendations" aria-label="회원님을 위한 추천">
    <button type="button" onClick={onProfile} className="mb-7 flex w-full items-center gap-3 text-left">
      <img className="h-11 w-11 rounded-full border border-[#c5a059]/60 object-cover p-0.5" src={cards[0]?.imageUrl} alt="내 프로필" />
      <span className="min-w-0 flex-1"><strong className="block truncate text-[13px] text-[#1b1c19]">my_look_daily</strong><span className="block truncate text-[12px] text-[#74777d]">나의 Look Book</span></span>
      <span className="font-mono text-[11px] font-bold text-[#5865F2]">전환</span>
    </button>
    <div className="mb-3 flex items-center justify-between"><h2 className="text-[13px] font-bold text-[#44474c]">회원님을 위한 추천</h2><button type="button" className="text-[11px] font-bold text-[#1b1c19]">모두 보기</button></div>
    <div className="space-y-3">{suggestions.map((item) => <div key={item.id} className="flex items-center gap-2.5"><img className="h-8 w-8 rounded-full object-cover" src={item.imageUrl} alt="" /><div className="min-w-0 flex-1"><strong className="block truncate text-[12px] text-[#1b1c19]">@{item.author}</strong><span className="block truncate text-[10px] text-[#74777d]">{item.subtext}</span></div><button type="button" className="text-[11px] font-bold text-[#5865F2]">팔로우</button></div>)}</div>
    <p className="mt-8 text-[10px] leading-relaxed text-[#9a9a95]">소개 · 도움말 · 안전 · 개인정보처리방침 · 약관 · 위치 · 언어</p>
    <p className="mt-3 font-mono text-[10px] text-[#9a9a95]">© 2026 xCUBUS</p>
  </aside>;
}
