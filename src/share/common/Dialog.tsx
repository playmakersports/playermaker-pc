import type { ComponentProps } from 'react';
import type { OverlayAsyncControllerComponent, OverlayControllerComponent } from 'overlay-kit';
import { dialogStyle } from '@/share/common/css/dialog.css.ts';
import { flexs } from '@/style/container.css.ts';
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
    <section className={dialogStyle.dim} onClick={type === 'confirm' ? undefined : () => handleClose}>
      <div className={dialogStyle.container}>
        <div className={dialogStyle.inner}>
          <p className={dialogStyle.title}>{title}</p>
          {contents && <p className={dialogStyle.contents}>{contents}</p>}
        </div>
        <div className={flexs({ gap: '8' })}>
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
