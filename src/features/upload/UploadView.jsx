import { useRef, useState } from 'react';

const MAX_IMAGES = 5;
const MAX_VIDEOS = 1;
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const questionSuggestions = {
  Business: ['이 룩에서 신뢰감과 전문성이 느껴지나요?', '오늘의 출근 룩, 깔끔하고 센스 있어 보이나요?', '이 스타일이 제 강점을 잘 보여주는 것 같나요?'],
  Dating: ['오늘 이 룩, 데이트에서 호감이 갈 것 같나요?', '이 스타일이 저와 잘 어울려 보이나요?', '첫 만남에 편안하고 매력적인 인상이 들까요?'],
  Workout: ['이 운동 룩, 활동적이고 건강해 보이나요?', '운동하기에 편안하면서도 스타일 있어 보이나요?', '오늘의 운동 스타일, 자신감 있어 보이나요?'],
  Interview: ['이 모습에서 전문성과 신뢰감이 느껴지나요?', '면접 자리에서 단정하고 준비된 인상일까요?', '이 룩이 제 역량을 잘 보여주는 데 도움이 될까요?'],
  Style: ['오늘 제 스타일, 어떤 분위기로 보여요?', '새로 산 이 옷, 저와 잘 어울리나요?', '오늘의 룩, 자랑하고 싶을 만큼 괜찮아 보이나요?'],
  Profile: ['이 사진, 제 SNS 프로필로 잘 어울릴까요?', '이 사진에서 제 매력이 잘 보이나요?', '처음 보는 사람에게 좋은 인상을 줄 것 같나요?'],
};

function getQuestionSuggestions(category, media) {
  const base = questionSuggestions[category] ?? questionSuggestions.Style;
  if (!media.length) return base;
  const mediaHint = media.some((item) => item.type === 'video') ? '짧은 영상으로 봤을 때도' : '이 사진에서';
  return [`${mediaHint} ${base[0]}`, ...base.slice(1)];
}

/** 개발용 복수 미디어 업로드 화면. 실제 저장·검토는 백엔드 단계에서 처리한다. */
export default function UploadView({ categories, onSubmit }) {
  const inputRef = useRef(null);
  const [media, setMedia] = useState([]);
  const [category, setCategory] = useState('Business');
  const [question, setQuestion] = useState('');
  const [author, setAuthor] = useState('my_look_daily');
  const [error, setError] = useState('');

  const imageCount = media.filter((item) => item.type === 'image').length;
  const videoCount = media.filter((item) => item.type === 'video').length;
  const selectedTheme = categories[category];
  const suggestions = getQuestionSuggestions(category, media);
  const canAddImage = imageCount < MAX_IMAGES;
  const canAddVideo = videoCount < MAX_VIDEOS;
  const canAddMedia = canAddImage || canAddVideo;
  const acceptedTypes = [canAddImage && 'image/jpeg,image/png,image/webp,image/gif', canAddVideo && 'video/mp4,video/webm,video/quicktime'].filter(Boolean).join(',');

  async function addFiles(fileList) {
    const candidates = Array.from(fileList ?? []);
    if (!candidates.length) return;
    const accepted = [];
    let nextImages = imageCount;
    let nextVideos = videoCount;
    for (const file of candidates) {
      const type = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null;
      if (!type) { setError('이미지 또는 동영상 파일만 선택할 수 있습니다.'); continue; }
      if (file.size > MAX_FILE_SIZE) { setError('각 파일은 15MB 이하만 선택할 수 있습니다.'); continue; }
      if (type === 'image' && nextImages >= MAX_IMAGES) { setError(`이미지는 최대 ${MAX_IMAGES}개까지 선택할 수 있습니다.`); continue; }
      if (type === 'video' && nextVideos >= MAX_VIDEOS) { setError('동영상은 1개만 선택할 수 있습니다.'); continue; }
      const url = URL.createObjectURL(file);
      if (type === 'video') {
        const duration = await getVideoDuration(url);
        if (!Number.isFinite(duration) || duration > 10) { URL.revokeObjectURL(url); setError('동영상은 10초 이하만 업로드할 수 있습니다.'); continue; }
        nextVideos += 1;
        accepted.push(makeItem(file, url, type, duration));
      } else {
        nextImages += 1;
        accepted.push(makeItem(file, url, type));
      }
    }
    if (accepted.length) { setMedia((items) => [...items, ...accepted]); setError(''); }
    if (inputRef.current) inputRef.current.value = '';
  }

  function removeMedia(id) { setMedia((items) => { const target = items.find((item) => item.id === id); if (target) URL.revokeObjectURL(target.url); return items.filter((item) => item.id !== id); }); }
  function moveMedia(index, direction) { setMedia((items) => { const destination = index + direction; if (destination < 0 || destination >= items.length) return items; const next = [...items]; [next[index], next[destination]] = [next[destination], next[index]]; return next; }); }
  function submit(event) {
    event.preventDefault();
    if (!media.length) { setError('사진 또는 동영상을 선택해 주세요.'); inputRef.current?.click(); return; }
    const primary = media[0];
    onSubmit({ id: `local-${Date.now()}`, author: author.trim() || 'my_look', category, question: question.trim() || '첫인상에서 호감과 신뢰감이 느껴지나요?', subtext: '실시간 첫인상 피드백을 수집 중입니다', imageUrl: primary.url, mediaType: primary.type, media, objectPosition: 'center 20%', yesVotes: 1, noVotes: 0, timestamp: '방금 전', commentsAllowed: true, comments: [], categoryIcon: selectedTheme.icon });
  }

  return <section className="editorial-upload w-full pb-3 pt-1">
    <div className="mb-5 flex items-start justify-between"><div><span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-glow">CREATE A LOOKBOOK</span><h1 className="font-headline text-2xl font-bold text-white">새로운 룩 공유하기</h1><p className="mt-1 text-xs text-slate-400">사진 최대 5개와 10초 이하 동영상 1개를 함께 선택할 수 있습니다.</p></div><span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c5a059]/50 bg-[#fbf9f4] text-cyan-glow"><span className="material-symbols-outlined text-lg">add_a_photo</span></span></div>
    <form className="flex flex-col gap-3.5" onSubmit={submit}>
      <div role={canAddMedia ? 'button' : undefined} tabIndex={canAddMedia ? 0 : undefined} onClick={() => canAddMedia && inputRef.current?.click()} onKeyDown={(event) => { if (canAddMedia && (event.key === 'Enter' || event.key === ' ')) inputRef.current?.click(); }} onDragOver={(event) => canAddMedia && event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (canAddMedia) addFiles(event.dataTransfer.files); }} className={`relative min-h-[190px] w-full overflow-hidden rounded-lg border border-dashed border-[#c5a059]/60 bg-white p-4 transition-colors ${canAddMedia ? 'cursor-pointer hover:bg-[#f5f3ee]' : 'cursor-default'}`}>
        <input ref={inputRef} type="file" multiple accept={acceptedTypes} className="hidden" onChange={(event) => addFiles(event.target.files)} />
        {!media.length ? <div className="flex min-h-[164px] flex-col items-center justify-center text-center"><span className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-[#c5a059]/50 bg-[#f9f7f2] text-cyan-glow"><span className="material-symbols-outlined text-2xl">upload_file</span></span><p className="font-headline text-sm font-bold text-white">사진 또는 짧은 동영상 선택</p><p className="mt-1 font-mono text-[10px] text-slate-400">이미지 5개 + 동영상 1개 · 동영상 최대 10초 · 파일당 15MB</p><span className="mt-3 rounded-full border border-[#c4c6cd] bg-white px-3 py-1 text-[10px] font-medium text-cyan-glow">로컬 디바이스에서 파일 찾기</span></div> : <><div className="mb-2 flex items-center justify-between text-[10px] font-mono"><span className="text-slate-300">이미지 <strong style={{ color: selectedTheme.color }}>{imageCount}/{MAX_IMAGES}</strong> · 동영상 <strong style={{ color: selectedTheme.color }}>{videoCount}/{MAX_VIDEOS}</strong></span><span className="text-slate-500">{canAddMedia ? '클릭 또는 드롭하여 추가' : '최대 선택 완료'}</span></div><div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{media.map((item, index) => <MediaPreview key={item.id} item={item} index={index} color={selectedTheme.color} onRemove={() => removeMedia(item.id)} onMove={(direction) => moveMedia(index, direction)} canMovePrevious={index > 0} canMoveNext={index < media.length - 1} />)}{canAddMedia && <button type="button" onClick={(event) => { event.stopPropagation(); inputRef.current?.click(); }} aria-label="미디어 추가" className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-[#c5a059]/60 bg-[#f9f7f2] text-cyan-glow"><span className="material-symbols-outlined text-xl">add</span></button>}</div></>}
      </div>
      <fieldset><legend className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-300">1. 카테고리 선택</legend><div className="grid grid-cols-3 gap-2">{Object.entries(categories).map(([id, item]) => <button key={id} type="button" onClick={() => setCategory(id)} className="flex items-center justify-center gap-1 rounded-md border px-2 py-2 font-body text-xs transition-all" style={category === id ? { borderColor: item.color, color: item.color, backgroundColor: `${item.color}14`, fontWeight: 700 } : { borderColor: '#c4c6cd', color: '#44474c', backgroundColor: '#ffffff' }}><span className="material-symbols-outlined text-sm">{item.icon}</span>{item.label}</button>)}</div></fieldset>
      <div><label htmlFor="question-input" className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">2. 어떤 점을 평가받고 싶나요?</label><div className="mb-2 rounded-lg bg-[#f5f3ee] p-2.5"><p className="mb-1.5 font-mono text-[10px] text-slate-400">{selectedTheme.label} · 선택한 미디어에 맞춘 추천 질문</p><div className="flex flex-wrap gap-1.5">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => setQuestion(suggestion)} style={{ borderColor: question === suggestion ? selectedTheme.color : '#c4c6cd', color: question === suggestion ? selectedTheme.color : '#44474c', backgroundColor: question === suggestion ? `${selectedTheme.color}12` : '#ffffff' }} className="rounded-md border px-2 py-1 text-left text-[10px] transition-colors">{suggestion}</button>)}</div></div><textarea id="question-input" rows="2" value={question} maxLength="140" onChange={(event) => setQuestion(event.target.value)} placeholder="예: 오늘 이 룩, 저와 잘 어울리나요?" className="w-full resize-none rounded-md border border-surface-container-high bg-white p-2.5 text-xs text-white placeholder:text-slate-500 focus:border-cyan-glow focus:outline-none sm:text-sm" /></div>
      <div><label htmlFor="author-input" className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-300">3. 닉네임 / 핸들</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">@</span><input id="author-input" value={author} maxLength="30" onChange={(event) => setAuthor(event.target.value)} className="w-full rounded-xl border border-surface-container-high bg-surface-container py-2 pl-8 pr-3 text-xs text-white focus:border-cyan-glow focus:outline-none sm:text-sm" /></div></div>
      {error && <p role="alert" className="text-xs text-rose-400">{error}</p>}
      <button type="submit" className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg border border-[#0e1c2d] bg-primary-container py-3 font-body text-sm font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,.08)] active:scale-95 sm:text-base"><span className="material-symbols-outlined text-lg">arrow_upward</span>피드에 업로드하기</button>
      <p className="text-center text-[10px] text-slate-500">현재는 브라우저 목업입니다. 실서비스에서는 권리 동의·검토·안전한 미디어 저장 절차가 적용됩니다.</p>
    </form>
  </section>;
}

function makeItem(file, url, type, duration = 0) { return { id: `${file.name}-${file.lastModified}-${Math.random()}`, url, type, duration, name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(2)} MB` }; }
function MediaPreview({ item, index, color, onRemove, onMove, canMovePrevious, canMoveNext }) { return <div className="relative aspect-square overflow-hidden rounded-xl border bg-black/30" style={{ borderColor: `${color}66` }}>{item.type === 'video' ? <video className="h-full w-full object-cover" src={item.url} muted playsInline /> : <img className="h-full w-full object-cover" src={item.url} alt={`${index + 1}번째 선택 이미지`} />}<span className="absolute bottom-1 left-1 rounded bg-black/65 px-1.5 py-0.5 font-mono text-[9px] text-white">{item.type === 'video' ? `VIDEO ${item.duration.toFixed(1)}s` : `IMAGE ${index + 1}`}</span><div className="absolute left-1 top-1 flex gap-0.5"><button type="button" disabled={!canMovePrevious} onClick={(event) => { event.stopPropagation(); onMove(-1); }} aria-label={`${item.name} 순서 앞으로`} className="flex h-5 w-5 items-center justify-center rounded bg-black/65 text-white disabled:opacity-25"><span className="material-symbols-outlined text-[13px]">chevron_left</span></button><button type="button" disabled={!canMoveNext} onClick={(event) => { event.stopPropagation(); onMove(1); }} aria-label={`${item.name} 순서 뒤로`} className="flex h-5 w-5 items-center justify-center rounded bg-black/65 text-white disabled:opacity-25"><span className="material-symbols-outlined text-[13px]">chevron_right</span></button></div><button type="button" onClick={(event) => { event.stopPropagation(); onRemove(); }} aria-label={`${item.name} 제거`} className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded bg-black/65 text-white"><span className="material-symbols-outlined text-[13px]">close</span></button></div>; }
function getVideoDuration(url) { return new Promise((resolve) => { const video = document.createElement('video'); video.preload = 'metadata'; video.onloadedmetadata = () => resolve(video.duration); video.onerror = () => resolve(Number.NaN); video.src = url; }); }
