import type { ComponentProps } from 'react';
import type { OverlayAsyncControllerComponent, OverlayControllerComponent } from 'overlay-kit';
import Button from '@/share/components/Button.tsx';

type AlertBaseProps = ComponentProps<OverlayControllerComponent>;
type ConfirmBaseProps = ComponentProps<OverlayAsyncControllerComponent<boolean>>;
export type DialogCommon = {
  title: string;
  contents?: string;
};

export type DialogProps =
  | ({ type: 'alert' } & DialogCommon & AlertBaseProps)
  | ({
      type: 'confirm';
    } & DialogCommon &
      ConfirmBaseProps);

// 제네릭 컴포넌트
export const Dialog = (props: DialogProps) => {
  const { type, isOpen, close, title, contents } = props;
  const handleClose = (resolve: boolean) => {
    if (type === 'confirm') {
      close(resolve);
    } else {
      close();
    }
  };

  if (!isOpen) return null;
  return (
    <section
      className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/50 z-[1000]"
      onClick={type === 'confirm' ? undefined : () => handleClose}
    >
      <div className="flex flex-col gap-8 min-w-[350px] rounded-3xl bg-white p-5 items-stretch">
        <div className="flex flex-col gap-3 justify-start items-start px-2">
          <p className="text-lg font-semibold text-gray-700 whitespace-pre-line">{title}</p>
          {contents && <p className="text-sm font-normal text-gray-700 whitespace-pre-line">{contents}</p>}
        </div>
        <div className="flex items-center justify-center gap-2">
          {type === 'confirm' && (
            <Button size="large" fillType="light" fullWidth onClick={() => close(false)}>
              취소
            </Button>
          )}
          <Button size="large" fullWidth onClick={() => handleClose(true)}>
            확인
          </Button>
        </div>
      </div>
    </section>
  );
};
