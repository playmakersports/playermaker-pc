import { overlay } from 'overlay-kit';
import { Dialog, type DialogCommon } from '@/share/common/Dialog.tsx';

const confirm = (param: DialogCommon) =>
  overlay.openAsync<boolean>(controller => (
    <Dialog title={param.title} contents={param.contents} type="confirm" {...controller} />
  ));

const alert = (param: DialogCommon) =>
  overlay.open(controller => <Dialog title={param.title} contents={param.contents} type="alert" {...controller} />);

export const lib = {
  confirm,
  alert,
};
