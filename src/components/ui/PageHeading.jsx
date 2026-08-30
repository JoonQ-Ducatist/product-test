/**
 * 에디토리얼 화면에서 반복되는 상단 소개 영역이다.
 *
 * @param {{ eyebrow: string, title: string, description: string, action?: React.ReactNode }} props
 */
export default function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-glow">{eyebrow}</p>
        <h1 className="font-headline text-2xl font-bold text-white">{title}</h1>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  );
}
