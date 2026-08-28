import * as DialogPrimitive from '@radix-ui/react-dialog';

/**
 * xCubus의 공통 모달 기반 요소다. shadcn/ui의 Radix Dialog 패턴을
 * 현재 서비스의 다크·네온 디자인 토큰에 맞춰 최소 구성으로 적용한다.
 */
export const Dialog = DialogPrimitive.Root;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({ children, className = '', title = '대화 상자', ...props }) {
  return <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm" />
    <DialogPrimitive.Content {...props} className={`fixed inset-0 z-[71] flex items-center justify-center p-4 outline-none ${className}`}>
      <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>;
}
