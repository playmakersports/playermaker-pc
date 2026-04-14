import clsx from 'clsx';

type SpinnerOptions = {
  theme?: 'primary' | 'gray';
  size?: 20 | 24 | 28;
  stroke?: 1 | 2 | 3 | 4;
};

export function spinner(options: SpinnerOptions = {}): string {
  const { theme = 'primary', size = 24, stroke = 2 } = options;
  return clsx(
    'inline-block shrink-0 rounded-full border-solid animate-spinner',
    size === 20 && 'size-5',
    size === 24 && 'size-6',
    size === 28 && 'size-7',
    theme === 'primary' && 'border-primary-200 border-r-primary-600',
    theme === 'gray' && 'border-gray-100 border-r-gray-600',
    stroke === 1 && 'border',
    stroke === 2 && 'border-2',
    stroke === 3 && 'border-[3px]',
    stroke === 4 && 'border-4',
  );
}
