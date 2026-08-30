import { useEffect, useRef, useState } from 'react';

/** 정의: 카테고리 필터, 카드 제스처, 투표와 댓글 요약을 제공하는 콘텐츠 중심 피드 화면이다. */
export default function FeedView({ categories, cards, card, currentIndex, activeCategory, hasVoted, onCategoryChange, onPrevious, onNext, onShuffle, onVote, onAddComment }) {
  const [expandedComments, setExpandedComments] = useState(false);
  const [draft, setDraft] = useState('');
  const gestureStart = useRef(null);
  const wheelLocked = useRef(false);
  const [mediaIndex, setMediaIndex] = useState(0);
  useEffect(() => { setExpandedComments(false); setDraft(''); setMediaIndex(0); }, [card.id]);
  if (!card) return <section className="mt-4 rounded-xl border border-surface-container-high bg-surface-container-low p-6 text-center text-slate-400">표시할 사진이 없습니다.</section>;
  const theme = categories[card.category];
  const cardMedia = card.media?.length ? card.media : [{ id: `${card.id}-main`, type: card.mediaType ?? 'image', url: card.imageUrl, objectPosition: card.objectPosition }];
  const activeMedia = cardMedia[mediaIndex];
  const nextCard = cards[(currentIndex + 1) % cards.length];
  const total = card.yesVotes + card.noVotes;
  const yesPercent = Math.round((card.yesVotes / total) * 100);
  const noPercent = 100 - yesPercent;

  /** 정의: 카드 표면의 시작 좌표를 기록해 가로 앨범·세로 피드 제스처를 구분한다. @param {PointerEvent} event 포인터 이벤트 */
  function startCardGesture(event) {
    if (event.target.closest('button, input, textarea')) return;
    gestureStart.current = { x: event.clientX, y: event.clientY, pointerType: event.pointerType };
  }
  /** 정의: 가로 스와이프는 같은 카드의 미디어를, 세로 터치 스와이프는 이전·다음 카드를 표시한다. @param {PointerEvent} event 포인터 이벤트 */
  function finishCardGesture(event) {
    if (!gestureStart.current) return;
    const start = gestureStart.current;
    gestureStart.current = null;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 42) return;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setMediaIndex((index) => (index + (deltaX < 0 ? 1 : -1) + cardMedia.length) % cardMedia.length);
      return;
    }
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
    <div className="mb-1 flex w-full items-center gap-1.5 overflow-x-auto px-0.5 pb-2 no-scrollbar">
      <CategoryButton label="전체 피드" active={activeCategory === 'ALL'} color="#00f0ff" onClick={() => onCategoryChange('ALL')} />
      {Object.entries(categories).map(([id, category]) => <CategoryButton key={id} label={category.label} active={activeCategory === id} color={category.color} onClick={() => onCategoryChange(id)} />)}
    </div>
    <div className="mb-2 flex w-full items-center justify-between px-1 text-xs"><div className="flex items-center gap-1.5 font-mono text-[12px]" style={{ color: theme.color }}><span className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: theme.color }} />LIVE STREAM</div><div className="flex items-center gap-2"><span className="rounded-full border px-2 py-0.5 font-mono text-[12px] font-bold" style={{ color: theme.color, borderColor: `${theme.color}66`, backgroundColor: `${theme.color}1f` }}>{String(currentIndex + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}</span><button type="button" onClick={onShuffle} style={{ color: theme.color, borderColor: `${theme.color}80` }} className="flex items-center gap-1 rounded-lg border bg-surface-container px-2.5 py-1.5 font-mono text-[12px] font-bold"><span className="material-symbols-outlined text-[16px]">shuffle</span>셔플</button></div></div>

    <article onPointerDown={startCardGesture} onPointerUp={finishCardGesture} onPointerCancel={() => { gestureStart.current = null; }} onWheel={moveCardByWheel} className="relative min-h-0 w-full flex-1 touch-none overflow-hidden rounded-xl border border-surface-container-high/60 bg-surface-container-lowest shadow-2xl">
      <div className="absolute inset-0 scale-95 opacity-40"><CardMedia card={nextCard} className="h-full w-full object-cover" muted /><div className="absolute inset-0 bg-black/60" /></div>
      <div className="absolute inset-0"><CardMedia card={card} media={activeMedia} className="h-full w-full object-cover brightness-[1.02] contrast-[1.03]" /><div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 via-black/10 to-transparent" /><div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#051424]/95 via-[#051424]/40 to-transparent" /><div className="scan-line absolute left-0 top-0 h-px w-full opacity-40" style={{ backgroundColor: theme.color, boxShadow: `0 0 12px ${theme.color}` }} /></div>
      <div className="absolute left-0 top-0 z-10 flex w-full items-start justify-between p-4"><div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1 shadow-lg backdrop-blur"><span className="material-symbols-outlined text-[15px]" style={{ color: theme.color }}>{theme.icon}</span><span className="font-mono text-xs font-semibold uppercase tracking-wider text-white">{theme.feedLabel ?? card.category}</span></div><div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/50 py-1 pl-1.5 pr-3 shadow-lg backdrop-blur"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-container"><span className="material-symbols-outlined text-[13px] text-white">person</span></span><span className="font-headline text-xs font-semibold tracking-wide text-white">@{card.author}</span></div></div>
      {cardMedia.length > 1 && <div className="absolute left-4 right-4 top-[54px] z-20 flex h-2 gap-1" aria-label={`등록된 사진 ${cardMedia.length}장`}>
        {cardMedia.map((media, index) => <button key={media.id} type="button" aria-label={`${index + 1}번째 사진 보기`} aria-current={mediaIndex === index ? 'true' : undefined} onClick={() => setMediaIndex(index)} className="flex-1 rounded-full bg-white/35 p-0 shadow-sm"><span className="block h-full rounded-full transition-all" style={{ backgroundColor: mediaIndex === index ? theme.color : 'transparent' }} /></button>)}
      </div>}
      <div className="absolute right-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2.5"><ArrowButton label="이전 사진" icon="expand_less" onClick={onPrevious} /><ArrowButton label="다음 사진" icon="expand_more" onClick={onNext} /></div>
      <div className="absolute bottom-0 left-0 z-20 flex w-full flex-col p-4"><div className="mb-2.5"><div className="mb-1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-2.5 py-0.5 backdrop-blur"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: theme.color }} /><span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: theme.color }} /></span><span className="font-mono text-[11px] font-bold uppercase tracking-widest" style={{ color: theme.color }}>{theme.liveTag}</span></div><h1 className="whitespace-pre-line font-headline text-lg font-bold leading-snug text-white drop-shadow-md sm:text-xl">{card.question}</h1><p className="mt-0.5 text-xs text-slate-300">{card.subtext}</p></div>
        {hasVoted ? <Result yesPercent={yesPercent} noPercent={noPercent} total={total} color={theme.color} onNext={onNext} /> : <div className="flex w-full gap-2.5"><button type="button" onClick={() => onVote(true)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-sm font-extrabold tracking-wider text-[#051424] active:scale-95" style={{ borderColor: theme.color, backgroundColor: theme.color }}>YES <span className="material-symbols-outlined text-base">check_circle</span></button><button type="button" onClick={() => onVote(false)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border bg-surface-container-low/70 py-2 text-sm font-bold tracking-wider active:scale-95" style={{ borderColor: `${theme.color}aa`, color: theme.color }}>NO <span className="material-symbols-outlined text-base">cancel</span></button></div>}
        {card.commentsAllowed && <CommentPreview comments={card.comments ?? []} onExpand={() => setExpandedComments(true)} />}
        <div className="mt-2 flex items-center justify-between px-1 font-mono text-[10px] text-slate-400"><span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]" style={{ color: theme.color }}>swipe_vertical</span>위·아래 스와이프 또는 스크롤</span><span>{card.timestamp}</span></div>
      </div>
    </article>
    {card.commentsAllowed && expandedComments && <CommentPanel comments={card.comments ?? []} draft={draft} onDraftChange={setDraft} onClose={() => setExpandedComments(false)} onSubmit={() => { onAddComment(card.id, draft); setDraft(''); }} />}
  </section>;
}

/** 정의: 현재 선택된 카테고리 상태를 보여 주고 필터 변경을 요청하는 버튼이다. */
function CategoryButton({ label, active, color, onClick }) { return <button type="button" onClick={onClick} className="whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[12px] transition-all" style={active ? { color, borderColor: color, backgroundColor: `${color}1a`, fontWeight: 700 } : { color: '#44474c', borderColor: '#c4c6cd', backgroundColor: '#ffffff' }}>{label}</button>; }
/** 정의: 사진 또는 동영상 카드 자산을 동일한 피드 미디어 규칙으로 렌더링한다. */
function CardMedia({ card, media, className, muted = false }) { const source = media ?? { type: card.mediaType ?? 'image', url: card.imageUrl, objectPosition: card.objectPosition }; return source.type === 'video' ? <video className={className} style={{ objectPosition: source.objectPosition ?? card.objectPosition }} src={source.url} autoPlay loop muted={muted || undefined} playsInline controls={!muted} aria-label={`${card.author}의 ${card.category} 동영상`} /> : <img className={className} style={{ objectPosition: source.objectPosition ?? card.objectPosition }} src={source.url} alt={`${card.author}의 ${card.category} 사진`} />; }
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

/** 정의: 댓글을 10개 단위로 확장하고 새 댓글을 작성하는 상세 영역이다. */
function CommentPanel({ comments, draft, onDraftChange, onClose, onSubmit }) {
  const [visibleCount, setVisibleCount] = useState(10);
  useEffect(() => setVisibleCount(10), [comments.length]);
  const visibleComments = comments.slice(0, visibleCount);
  const hasMore = comments.length > visibleCount;
  return <section className="mt-3 w-full bg-transparent px-1 py-2" aria-label="전체 댓글">
    <div className="flex items-center justify-between px-2"><h2 className="flex items-center gap-1.5 font-headline text-sm font-bold text-white"><span className="material-symbols-outlined text-[18px] text-cyan-glow">chat_bubble</span>전체 댓글 <span className="font-mono text-[11px] text-slate-400">{comments.length}</span></h2><button type="button" onClick={onClose} className="text-xs font-bold text-cyan-glow">접기</button></div>
    <div className="mt-2 space-y-3 px-2">{visibleComments.length ? visibleComments.map((comment) => <div key={comment.id}><div className="flex gap-2"><Avatar author={comment.author} /><p className="min-w-0 text-xs leading-relaxed text-slate-200"><strong className="mr-1 text-white">@{comment.author}</strong>{comment.body}<span className="ml-1.5 font-mono text-[10px] text-slate-500">{comment.createdAt}</span></p></div>{comment.replies.map((reply) => <div key={reply.id} className="ml-7 mt-2 flex gap-2 border-l border-surface-container-high pl-2"><Avatar author={reply.author} small /><p className="min-w-0 text-xs leading-relaxed text-slate-300"><strong className="mr-1 text-white">@{reply.author}</strong>{reply.body}<span className="ml-1.5 font-mono text-[10px] text-slate-500">{reply.createdAt}</span></p></div>)}</div>) : <p className="py-2 text-xs text-slate-400">첫 번째 의견을 남겨 보세요.</p>}</div>
    {hasMore && <button type="button" onClick={() => setVisibleCount((count) => count + 10)} className="mt-3 flex w-full items-center justify-center gap-1 border-t border-surface-container-high py-3 text-xs font-bold text-cyan-glow"><span className="material-symbols-outlined text-base">expand_more</span>댓글 10개 더 보기</button>}
    <form className="mx-2 mt-2 flex gap-2 border-t border-surface-container-high pt-3" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}><label className="sr-only" htmlFor="comment-draft">댓글 작성</label><input id="comment-draft" value={draft} onChange={(event) => onDraftChange(event.target.value)} maxLength="500" placeholder="의견을 남겨보세요" className="min-w-0 flex-1 rounded-lg border border-surface-container-high bg-[#060e20] px-3 py-2 text-xs text-white placeholder:text-slate-500" /><button type="submit" disabled={!draft.trim()} className="rounded-lg bg-cyan-glow px-3 text-xs font-bold text-[#051424] disabled:cursor-not-allowed disabled:opacity-40">등록</button></form>
  </section>;
}

/** 정의: 작성자 핸들의 첫 글자로 만드는 개인정보 비노출형 아바타다. */
function Avatar({ author, small = false }) { return <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full bg-primary-container/40 font-mono font-bold text-cyan-glow ${small ? 'h-4 w-4 text-[8px]' : 'h-5 w-5 text-[9px]'}`}>{author.slice(0, 1).toUpperCase()}</span>; }
