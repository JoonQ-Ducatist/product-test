/**
 * 정의: Couture Intelligence 표면 규칙을 따르는 기본 카드 컨테이너다.
 * section, article, button 등 의미에 맞는 요소로 렌더링할 수 있다.
 *
 * @param {{ as?: React.ElementType, className?: string, children: React.ReactNode } & React.HTMLAttributes<HTMLElement>} props
 */
export default function SurfaceCard({ as: Component = 'section', className = '', children, ...props }) {
  return (
    <Component {...props} className={`rounded-lg border border-surface-container-high bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${className}`}>
      {children}
    </Component>
  );
}
