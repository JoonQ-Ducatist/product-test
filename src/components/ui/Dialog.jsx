import * as DialogPrimitive from '@radix-ui/react-dialog';

/**
 * FACt.Smack의 공통 모달 기반 요소다. shadcn/ui의 Radix Dialog 패턴을
 * 현재 서비스의 에디토리얼 디자인 토큰에 맞춰 최소 구성으로 적용한다.
 */
/** 정의: 대화상자의 열림 상태와 접근성 관계를 관리하는 Radix Root 별칭이다. */
export const Dialog = DialogPrimitive.Root;
/** 정의: 대화상자를 닫는 Radix Close 별칭이다. */
export const DialogClose = DialogPrimitive.Close;

/** 정의: 오버레이·포커스 관리·스크린리더 제목을 포함해 콘텐츠를 렌더링하는 공통 모달 본문이다. */
export function DialogContent({ children, className = '', title = '대화 상자', ...props }) {
  return <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-[#1b1c19]/35 backdrop-blur-sm" />
    <DialogPrimitive.Content {...props} className={`fixed inset-0 z-[71] flex items-center justify-center p-4 outline-none ${className}`}>
      <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>;
}
