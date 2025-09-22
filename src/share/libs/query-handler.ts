import { lib } from '@/share/libs/dialog.tsx';

export const handleQueryRetry = (failureCount: number, error: Error) => {
  if (failureCount === 1) {
    lib.alert({
      title: '서버 통신 오류',
      contents: error.message,
    });
    return false;
  }
  return true;
};
