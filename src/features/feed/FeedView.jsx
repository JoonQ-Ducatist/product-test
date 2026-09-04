import { useEffect, useRef, useState } from 'react';

/** 정의: 카테고리 필터, 카드 제스처, 투표와 댓글 요약을 제공하는 콘텐츠 중심 피드 화면이다. */
export default function FeedView({ categories, cards, card, currentIndex, activeCategory, hasVoted, onCategoryChange, onPrevious, onNext, onShuffle, onVote, onAddComment }) {
  const [expandedComments, setExpandedComments] = useState(false);
  const [draft, setDraft] = useState('');
  const gestureStart = useRef(null);
  const wheelLocked = useRef(false);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [carouselKick, setCarouselKick] = useState('');
  const [dragOffset, setDragOffset] = useState(0);
  const [isDraggingMedia, setIsDraggingMedia] = useState(false);
  useEffect(() => { setExpandedComments(false); setDraft(''); setMediaIndex(0); }, [card.id]);
  if (!card) return <section className="mt-4 rounded-xl border border-surface-container-high bg-surface-container-low p-6 text-center text-slate-400">표시할 사진이 없습니다.</section>;
  const theme = categories[card.category];
  const cardMedia = card.media?.length ? card.media : [{ id: `${card.id}-main`, type: card.mediaType ?? 'image', url: card.imageUrl, objectPosition: card.objectPosition }];
  const activeMedia = cardMedia[mediaIndex];
  const total = card.yesVotes + card.noVotes;
  const yesPercent = Math.round((card.yesVotes / total) * 100);
  const noPercent = 100 - yesPercent;

  /** 정의: 카드 표면의 시작 좌표를 기록해 가로 앨범·세로 피드 제스처를 구분한다. @param {PointerEvent} event 포인터 이벤트 */
  function startCardGesture(event) {
    if (event.target.closest('button, input, textarea')) return;
    gestureStart.current = { x: event.clientX, y: event.clientY, pointerType: event.pointerType };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }
  /** 정의: 가로 이동 거리를 중앙 사진에 반영해 손으로 잡고 넘기는 앨범 전환 감각을 제공한다. @param {PointerEvent} event 포인터 이벤트 */
  function moveCardGesture(event) {
    if (!gestureStart.current || cardMedia.length < 2) return;
    const deltaX = event.clientX - gestureStart.current.x;
    const deltaY = event.clientY - gestureStart.current.y;
    if (Math.abs(deltaX) <= Math.abs(deltaY)) return;
    setIsDraggingMedia(true);
    setDragOffset(Math.max(-82, Math.min(82, deltaX)));
  }
  /** 정의: 가로 스와이프는 같은 카드의 미디어를, 세로 터치 스와이프는 이전·다음 카드를 표시한다. @param {PointerEvent} event 포인터 이벤트 */
  function finishCardGesture(event) {
    if (!gestureStart.current) return;
    const start = gestureStart.current;
    gestureStart.current = null;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const resetDrag = () => { setIsDraggingMedia(false); setDragOffset(0); };
    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 42) { resetDrag(); return; }
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      const direction = deltaX < 0 ? 'left' : 'right';
      setCarouselKick(`media-carousel--kick-${direction}`);
      setIsDraggingMedia(false);
      setDragOffset(deltaX < 0 ? -150 : 150);
      window.setTimeout(() => {
        setMediaIndex((index) => (index + (deltaX < 0 ? 1 : -1) + cardMedia.length) % cardMedia.length);
        setDragOffset(deltaX < 0 ? 42 : -42);
        window.requestAnimationFrame(() => setDragOffset(0));
      }, 130);
      window.setTimeout(() => setCarouselKick(''), 300);
      return;
    }
    resetDrag();
    if (start.pointerType !== 'mouse') {
      if (deltaY < 0) onNext(); else onPrevious();
    }
  }
  /** 정의: 데스크톱 휠의 세로 이동으로 피드를 한 장씩 안전하게 순환한다. @param {WheelEvent} event 마우스 휠 이벤트 */
  function moveCardByWheel(event) {
    if (Math.abs(event.deltaY) < 12 || wheelLocked.current) return;
    event.preventDefault();
    wheelLocked.current = true;
    if (event.deltaY > 0) onNext(); else onPrevious();
    window.setTimeout(() => { wheelLocked.current = false; }, 420);
  }

  return <section className="editorial-feed relative flex h-full w-full min-h-0 flex-col items-center">
    <div className="mb-0 flex w-full items-center gap-1 overflow-x-auto px-4 pb-1 no-scrollbar">
      <CategoryButton label="전체 피드" active={activeCategory === 'ALL'} color="#00f0ff" onClick={() => onCategoryChange('ALL')} />
      {Object.entries(categories).map(([id, category]) => <CategoryButton key={id} label={category.label} active={activeCategory === id} color={category.color} onClick={() => onCategoryChange(id)} />)}
    </div>
    <div className="mb-0.5 flex w-full items-center justify-between px-4 text-xs"><div className="flex items-center gap-1 font-mono text-[10px]" style={{ color: theme.color }}>LIVE STREAM <span className="ml-0.5 text-[9px] opacity-75">{card.timestamp}</span></div><div className="flex items-center gap-1"><span className="flex h-5 items-center rounded-full border px-1.5 font-mono text-[10px] font-bold" style={{ color: theme.color, borderColor: `${theme.color}66`, backgroundColor: `${theme.color}1f` }}>{String(currentIndex + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}</span><button type="button" onClick={onShuffle} style={{ color: theme.color, borderColor: `${theme.color}80` }} className="flex h-5 items-center gap-0.5 rounded-md border bg-surface-container px-1.5 font-mono text-[10px] font-bold"><span className="material-symbols-outlined text-[13px]">shuffle</span>셔플</button></div></div>

    <div className={`media-carousel relative flex min-h-0 w-full flex-1 items-center ${carouselKick}`}>
    <article onPointerDown={startCardGesture} onPointerMove={moveCardGesture} onPointerUp={finishCardGesture} onPointerCancel={() => { gestureStart.current = null; setIsDraggingMedia(false); setDragOffset(0); }} onWheel={moveCardByWheel} className="relative z-10 h-full min-h-0 w-full touch-none overflow-hidden rounded-xl border border-surface-container-high/60 bg-[#fbfaf7] shadow-2xl">
      {cardMedia.length > 1 && <MediaPeek side="left" card={card} media={cardMedia[(mediaIndex - 1 + cardMedia.length) % cardMedia.length]} onClick={() => setMediaIndex((index) => (index - 1 + cardMedia.length) % cardMedia.length)} />}
      {cardMedia.length > 1 && <MediaPeek side="right" card={card} media={cardMedia[(mediaIndex + 1) % cardMedia.length]} onClick={() => setMediaIndex((index) => (index + 1) % cardMedia.length)} />}
      <div className={`media-primary absolute ${cardMedia.length > 1 ? 'inset-y-0 left-3 right-3' : 'inset-0'} z-10 overflow-hidden ${isDraggingMedia ? 'media-primary--dragging' : ''}`} style={{ transform: `translateX(${dragOffset}px)` }}><CardMedia card={card} media={activeMedia} className="h-full w-full object-cover object-center brightness-[1.02] contrast-[1.03]" /></div>
      <div className={`absolute ${cardMedia.length > 1 ? 'inset-y-0 left-3 right-3' : 'inset-0'} z-10 bg-[linear-gradient(180deg,rgba(1,8,17,.62)_0%,rgba(1,8,17,.05)_32%,rgba(1,8,17,.12)_52%,rgba(1,8,17,.88)_100%)]`} />
      <div className="scan-line absolute left-0 top-0 z-20 h-px w-full" style={{ backgroundColor: theme.color, boxShadow: `0 0 13px 2px ${theme.color}` }} />
      {cardMedia.length > 1 && <div className="absolute left-4 right-4 top-3 z-30 flex h-1.5 gap-1" aria-label={`등록된 사진 ${cardMedia.length}장`}>
        {cardMedia.map((media, index) => <button key={media.id} type="button" aria-label={`${index + 1}번째 사진 보기`} aria-current={mediaIndex === index ? 'true' : undefined} onClick={() => setMediaIndex(index)} className="flex-1 rounded-full bg-white/35 p-0 shadow-sm"><span className="block h-full rounded-full transition-all" style={{ backgroundColor: mediaIndex === index ? theme.color : 'transparent' }} /></button>)}
      </div>}
      <div className="absolute left-0 top-0 z-30 flex w-full items-start justify-between px-4 pt-7"><div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/50 px-2.5 py-0.5 shadow-lg backdrop-blur"><span className="material-symbols-outlined text-[14px]" style={{ color: theme.color }}>{theme.icon}</span><span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-white">{theme.feedLabel ?? card.category}</span></div><div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 py-0.5 pl-1 pr-2.5 shadow-lg backdrop-blur"><span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary-container"><span className="material-symbols-outlined text-[12px] text-white">person</span></span><span className="font-headline text-[11px] font-semibold tracking-wide text-white">@{card.author}</span></div></div>
      <div className="absolute right-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2.5"><ArrowButton label="이전 카드" icon="expand_less" onClick={onPrevious} /><ArrowButton label="다음 카드" icon="expand_more" onClick={onNext} /></div>
      <div className="card-details absolute bottom-0 left-0 z-20 flex w-full flex-col px-4 pb-2 pt-9"><div className="mb-2"><h1 className="whitespace-pre-line font-headline text-lg font-bold leading-snug text-white sm:text-xl">{card.question}</h1><p className="mt-0.5 text-xs text-slate-300">{card.subtext}</p></div>
        {hasVoted ? <Result yesPercent={yesPercent} noPercent={noPercent} total={total} color={theme.color} onNext={onNext} /> : <div className="flex w-full gap-2.5"><button type="button" onClick={() => onVote(true)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-1 text-[13px] font-extrabold tracking-wider text-[#051424] active:scale-95" style={{ borderColor: theme.color, backgroundColor: theme.color }}>YES <span className="material-symbols-outlined text-[15px]">check_circle</span></button><button type="button" onClick={() => onVote(false)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border bg-surface-container-low/70 py-1 text-[13px] font-bold tracking-wider active:scale-95" style={{ borderColor: `${theme.color}aa`, color: theme.color }}>NO <span className="material-symbols-outlined text-[15px]">cancel</span></button></div>}
        {card.commentsAllowed && <CommentPreview comments={card.comments ?? []} onExpand={() => setExpandedComments(true)} />}
      </div>
    </article></div>
    {card.commentsAllowed && expandedComments && <CommentPanel card={card} media={activeMedia} comments={card.comments ?? []} draft={draft} onDraftChange={setDraft} onClose={() => setExpandedComments(false)} onSubmit={() => { onAddComment(card.id, draft); setDraft(''); }} />}
  </section>;
}

/** 정의: 현재 선택된 카테고리 상태를 보여 주고 필터 변경을 요청하는 버튼이다. */
function CategoryButton({ label, active, color, onClick }) { return <button type="button" onClick={onClick} className="whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[11px] transition-all" style={active ? { color, borderColor: color, backgroundColor: `${color}1a`, fontWeight: 700 } : { color: '#44474c', borderColor: '#c4c6cd', backgroundColor: '#ffffff' }}>{label}</button>; }
/** 정의: 사진 또는 동영상 카드 자산을 동일한 피드 미디어 규칙으로 렌더링한다. */
function CardMedia({ card, media, className, muted = false }) { const source = media ?? { type: card.mediaType ?? 'image', url: card.imageUrl, objectPosition: card.objectPosition }; return source.type === 'video' ? <video className={className} style={{ objectPosition: source.objectPosition ?? card.objectPosition }} src={source.url} autoPlay loop muted={muted || undefined} playsInline controls={!muted} aria-label={`${card.author}의 ${card.category} 동영상`} /> : <img className={className} style={{ objectPosition: source.objectPosition ?? card.objectPosition }} src={source.url} alt={`${card.author}의 ${card.category} 사진`} />; }
/** 정의: 다중 미디어 카드의 좌우 다음·이전 사진을 좁게 미리 보이고 해당 사진으로 이동시키는 제어다. */
function MediaPeek({ side, card, media, onClick }) { return <button type="button" aria-label={side === 'left' ? '이전 사진 미리보기' : '다음 사진 미리보기'} onClick={onClick} className={`media-peek media-peek--${side}`}><CardMedia card={card} media={media} className="h-full w-full object-cover" muted /></button>; }
/** 정의: 카드 이동을 위한 접근성 레이블 포함 화살표 버튼이다. */
function ArrowButton({ label, icon, onClick }) { return <button type="button" onClick={onClick} aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white shadow-md backdrop-blur active:scale-90"><span className="material-symbols-outlined text-xl">{icon}</span></button>; }
/** 정의: 투표 완료 뒤 YES/NO 비율과 다음 카드 행동을 보여 주는 결과 패널이다. */
function Result({ yesPercent, noPercent, total, color, onNext }) { return <div className="mb-2.5 rounded-xl border border-surface-container-high bg-surface-container-low/95 p-2.5 backdrop-blur"><div className="mb-1 flex items-center justify-between font-mono text-xs font-bold"><span className="flex items-center gap-1" style={{ color }}><span className="material-symbols-outlined text-[14px]">thumb_up</span> YES {yesPercent}%</span><span className="text-slate-400">총 {total.toLocaleString()}명 참여</span><span className="flex items-center gap-1 text-rose-400">NO {noPercent}% <span className="material-symbols-outlined text-[14px]">thumb_down</span></span></div><div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-800"><span style={{ width: `${yesPercent}%`, backgroundColor: color }} /><span className="bg-rose-500/80" style={{ width: `${noPercent}%` }} /></div><div className="mt-1.5 flex items-center justify-between"><span className="font-mono text-[10px] text-slate-400">신뢰도 지수: <strong className="text-white">96.2 / 100</strong></span><button type="button" onClick={onNext} className="flex items-center text-[11px] font-bold" style={{ color }}>다음 사진 <span className="material-symbols-outlined text-[13px]">arrow_downward</span></button></div></div>; }

/** 정의: 카드 위에 첫 댓글만 간결하게 보여 주고 전체 댓글 열기를 제공하는 요약 영역이다. */
function CommentPreview({ comments, onExpand }) {
  const comment = comments[0];
  return <div className="relative mt-2 overflow-hidden bg-gradient-to-b from-transparent via-[#061225]/10 to-transparent px-1 py-1.5" aria-label="댓글 미리보기">
    <button type="button" onClick={onExpand} aria-label="댓글 더 보기" className="absolute right-0 top-1/2 z-10 flex -translate-y-1/2 items-center gap-0.5 px-1 text-[12px] font-bold text-cyan-glow"><span>더 보기</span><span className="material-symbols-outlined text-[16px]">more_horiz</span></button>
    {comment ? <p className="truncate pr-16 text-[13px] leading-5 text-white/90"><strong className="mr-1 text-cyan-50">@{comment.author}</strong>{comment.body}</p> : <p className="pr-16 text-[12px] text-slate-300/80">첫 번째 댓글을 남겨 보세요.</p>}
  </div>;
}

/** 정의: PC에서는 사진과 댓글을 나란히 보여 주는 게시물 상세 모달, 모바일에서는 확장 댓글 영역을 제공한다. */
function CommentPanel({ card, media, comments, draft, onDraftChange, onClose, onSubmit }) {
  const [visibleCount, setVisibleCount] = useState(10);
  useEffect(() => setVisibleCount(10), [comments.length]);
  const visibleComments = comments.slice(0, visibleCount);
  const hasMore = comments.length > visibleCount;
  return <section className="comment-panel" role="dialog" aria-modal="true" aria-label="게시물 댓글 상세">
    <div className="comment-panel__dialog">
      <div className="comment-panel__sheet-heading"><span className="comment-panel__handle" aria-hidden="true" /><strong>댓글</strong></div>
      <button type="button" onClick={onClose} className="comment-panel__close" aria-label="댓글 상세 닫기"><span className="material-symbols-outlined">close</span></button>
      <div className="comment-panel__media"><CardMedia card={card} media={media} className="h-full w-full object-contain" muted /></div>
      <div className="comment-panel__content">
        <header className="flex shrink-0 items-center gap-2 border-b border-[#e4e2dd] px-4 py-3"><Avatar author={card.author} /><div className="min-w-0 flex-1"><strong className="block truncate text-[13px] text-[#1b1c19]">@{card.author}</strong><span className="block truncate text-[10px] text-[#74777d]">{card.timestamp}</span></div><span className="material-symbols-outlined text-[19px] text-[#44474c]">more_horiz</span></header>
        <div className="comment-panel__comments">{visibleComments.length ? <><div className="mb-4 flex gap-2"><Avatar author={card.author} /><p className="min-w-0 text-xs leading-relaxed text-[#44474c]"><strong className="mr-1 text-[#1b1c19]">@{card.author}</strong>{card.question.replace('\n', ' ')}</p></div>{visibleComments.map((comment) => <div key={comment.id} className="mb-4"><div className="flex gap-2"><Avatar author={comment.author} /><p className="min-w-0 text-xs leading-relaxed text-[#44474c]"><strong className="mr-1 text-[#1b1c19]">@{comment.author}</strong>{comment.body}<span className="ml-1.5 font-mono text-[10px] text-[#8d8d87]">{comment.createdAt}</span></p></div>{comment.replies.map((reply) => <div key={reply.id} className="ml-7 mt-2 flex gap-2 border-l border-[#e4e2dd] pl-2"><Avatar author={reply.author} small /><p className="min-w-0 text-xs leading-relaxed text-[#55575c]"><strong className="mr-1 text-[#1b1c19]">@{reply.author}</strong>{reply.body}<span className="ml-1.5 font-mono text-[10px] text-[#8d8d87]">{reply.createdAt}</span></p></div>)}</div>)}</> : <p className="py-2 text-xs text-[#74777d]">첫 번째 의견을 남겨 보세요.</p>}</div>
        {hasMore && <button type="button" onClick={() => setVisibleCount((count) => count + 10)} className="mx-4 flex w-[calc(100%-2rem)] items-center justify-center gap-1 border-t border-[#e4e2dd] py-3 text-xs font-bold text-[#735c00]"><span className="material-symbols-outlined text-base">expand_more</span>댓글 10개 더 보기</button>}
        <form className="comment-panel__form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}><label className="sr-only" htmlFor="comment-draft">댓글 작성</label><span className="material-symbols-outlined text-[23px] text-[#44474c]">sentiment_satisfied</span><input id="comment-draft" value={draft} onChange={(event) => onDraftChange(event.target.value)} maxLength="500" placeholder="댓글 달기..." className="min-w-0 flex-1 border-0 bg-transparent px-1 py-2 text-xs text-[#1b1c19] placeholder:text-[#8d8d87] focus:outline-none" /><button type="submit" disabled={!draft.trim()} className="text-xs font-bold text-[#5865F2] disabled:cursor-not-allowed disabled:opacity-40">게시</button></form>
      </div>
    </div>
  </section>;
}

/** 정의: 작성자 핸들의 첫 글자로 만드는 개인정보 비노출형 아바타다. */
function Avatar({ author, small = false }) { return <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full bg-primary-container/40 font-mono font-bold text-cyan-glow ${small ? 'h-4 w-4 text-[8px]' : 'h-5 w-5 text-[9px]'}`}>{author.slice(0, 1).toUpperCase()}</span>; }
