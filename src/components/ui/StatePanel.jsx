/** 정의: 공통 상태 화면이 사용하는 상태별 아이콘·문구·다음 행동의 정적 사전이다. */
const stateContent = {
  loading: { icon: 'progress_activity', eyebrow: 'PLEASE WAIT', title: '룩을 준비하고 있어요.', body: '잠시만 기다리면 새로운 콘텐츠를 보여드릴게요.', action: null },
  empty: { icon: 'auto_awesome', eyebrow: 'NOTHING HERE YET', title: '아직 보여드릴 룩이 없어요.', body: '조금 뒤 다시 확인하거나, 오늘의 첫 룩을 직접 공유해 보세요.', action: '새로고침' },
  error: { icon: 'cloud_off', eyebrow: 'SOMETHING WENT WRONG', title: '화면을 불러오지 못했어요.', body: '연결 상태를 확인한 뒤 다시 시도해 주세요.', action: '다시 시도' },
  permission: { icon: 'lock', eyebrow: 'MEMBERS ONLY', title: '로그인 후 이용할 수 있어요.', body: 'FACt.Smack에 가입하고 더 많은 시선으로 오늘의 룩을 확인해 보세요.', action: '로그인하기' },
  review: { icon: 'hourglass_top', eyebrow: 'UNDER REVIEW', title: '게시물을 검토하고 있어요.', body: '안전한 커뮤니티를 위해 확인이 끝나면 피드에 공개됩니다.', action: '내 프로필 보기' },
};

/**
 * 정의: API 연결 전후에 동일한 문구·동작 원칙으로 쓰는 상태 패널이다.
 *
 * @param {{ state: keyof typeof stateContent, pageName: string, onAction?: () => void }} props
 */
export default function StatePanel({ state, pageName, onAction }) {
  const content = stateContent[state] ?? stateContent.empty;
  const isLoading = state === 'loading';

  return (
    <section className="flex min-h-[420px] w-full items-center justify-center py-10" aria-label={`${pageName} 상태 안내`} role={state === 'error' ? 'alert' : 'status'} aria-live="polite">
      <div className="w-full max-w-sm rounded-lg border border-surface-container-high bg-white px-6 py-10 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#c5a059]/40 bg-[#f9f7f2] text-cyan-glow ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true">
          <span className="material-symbols-outlined text-[23px]">{content.icon}</span>
        </span>
        <p className="mt-4 font-mono text-[10px] font-semibold tracking-[0.15em] text-cyan-glow">{content.eyebrow}</p>
        <h1 className="mt-2 font-headline text-2xl font-bold text-[#1b1c19]">{content.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{content.body}</p>
        {content.action && <button type="button" onClick={onAction} className="ui-primary-action mt-6 rounded-lg border border-[#0e1c2d] bg-primary-container px-4 py-2.5 text-sm font-bold text-white">{content.action}</button>}
      </div>
    </section>
  );
}
