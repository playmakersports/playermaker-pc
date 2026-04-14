import * as React from 'react';
import clsx from 'clsx';

export type ButtonThemeType = 'primary' | 'gray' | 'success' | 'info' | 'warning' | 'red';
export type ButtonFillType = 'default' | 'light' | 'outline';
type ButtonSizeType = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

type Props = {
  fillType?: ButtonFillType;
  theme?: ButtonThemeType;
  children?: React.ReactNode;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
  flex?: number;
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  size?: ButtonSizeType;
};

const BUTTON_BASE =
  'relative inline-flex items-center justify-center border whitespace-nowrap select-none antialiased transition-all duration-200 will-change-[outline] cursor-pointer disabled:cursor-not-allowed active:brightness-95 active:scale-[0.97] active:duration-[250ms]';

const BUTTON_SIZES: Record<ButtonSizeType, string> = {
  xsmall: 'text-xs font-medium py-2 px-3 h-8 rounded-lg',
  small: 'text-sm font-medium py-2 px-3 h-9 rounded-lg',
  medium: 'text-sm font-medium py-2.5 px-4 h-10 rounded-lg',
  large: 'text-base font-medium py-2.5 px-4 h-11 rounded-lg',
  xlarge: 'text-base font-medium py-3 px-4.5 h-12 rounded-xl',
};

const BUTTON_ICON_ONLY: Record<ButtonSizeType, string> = {
  xsmall: 'p-1.5',
  small: 'p-2',
  medium: 'p-2.5',
  large: 'p-2.5',
  xlarge: 'p-3',
};

const BUTTON_THEMES: Record<ButtonThemeType, Record<ButtonFillType, string>> = {
  primary: {
    default:
      'bg-primary-500 text-white border-transparent disabled:bg-gray-300 disabled:text-gray-50 disabled:border-transparent',
    light:
      'bg-primary-50 text-primary-600 border-transparent disabled:bg-gray-100 disabled:text-gray-300 disabled:border-transparent',
    outline:
      'bg-transparent text-primary-600 border-primary-200 active:bg-primary-50 disabled:bg-white disabled:text-gray-300 disabled:border-gray-200',
  },
  gray: {
    default:
      'bg-gray-500 text-white border-transparent disabled:bg-gray-300 disabled:text-gray-50 disabled:border-transparent',
    light:
      'bg-gray-100 text-gray-600 border-transparent disabled:bg-gray-100 disabled:text-gray-300 disabled:border-transparent',
    outline:
      'bg-white text-gray-600 border-gray-200 active:bg-gray-50 disabled:bg-white disabled:text-gray-300 disabled:border-gray-200',
  },
  success: {
    default:
      'bg-success-500 text-white border-transparent disabled:bg-gray-300 disabled:text-gray-50 disabled:border-transparent',
    light:
      'bg-success-50 text-success-600 border-transparent disabled:bg-gray-100 disabled:text-gray-300 disabled:border-transparent',
    outline:
      'bg-white text-success-600 border-success-200 active:bg-success-50 disabled:bg-white disabled:text-gray-300 disabled:border-gray-200',
  },
  info: {
    default:
      'bg-info-500 text-white border-transparent disabled:bg-gray-300 disabled:text-gray-50 disabled:border-transparent',
    light:
      'bg-info-50 text-info-600 border-transparent disabled:bg-gray-100 disabled:text-gray-300 disabled:border-transparent',
    outline:
      'bg-white text-info-600 border-info-200 active:bg-info-50 disabled:bg-white disabled:text-gray-300 disabled:border-gray-200',
  },
  warning: {
    default:
      'bg-warning-500 text-white border-transparent disabled:bg-gray-300 disabled:text-gray-50 disabled:border-transparent',
    light:
      'bg-warning-50 text-warning-600 border-transparent disabled:bg-gray-100 disabled:text-gray-300 disabled:border-transparent',
    outline:
      'bg-white text-warning-600 border-warning-200 active:bg-warning-50 disabled:bg-white disabled:text-gray-300 disabled:border-gray-200',
  },
  red: {
    default:
      'bg-red-500 text-white border-transparent disabled:bg-gray-300 disabled:text-gray-50 disabled:border-transparent',
    light:
      'bg-red-50 text-red-600 border-transparent disabled:bg-gray-100 disabled:text-gray-300 disabled:border-transparent',
    outline:
      'bg-white text-red-600 border-red-200 active:bg-red-50 disabled:bg-white disabled:text-gray-300 disabled:border-gray-200',
  },
};

const ICON_SIZES: Record<ButtonSizeType, string> = {
  xsmall: 'size-5 inline-flex items-center justify-center',
  small: 'size-5 inline-flex items-center justify-center',
  medium: 'size-5 inline-flex items-center justify-center',
  large: 'size-6 inline-flex items-center justify-center',
  xlarge: 'size-6 inline-flex items-center justify-center',
};

function Button(props: Props) {
  const {
    fillType = 'default',
    theme = 'primary',
    children,
    fullWidth,
    type,
    flex,
    disabled = false,
    onClick,
    icon,
    size = 'medium',
  } = props;

  const isOnlyIcon = !children && !!icon;

  return (
    <button
      type={type ?? 'button'}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        BUTTON_BASE,
        isOnlyIcon ? BUTTON_ICON_ONLY[size] : BUTTON_SIZES[size],
        BUTTON_THEMES[theme][fillType],
        fullWidth ? 'w-full' : 'w-auto',
      )}
      style={flex ? { flex } : undefined}
    >
      <span className="inline-flex items-center gap-1">
        {icon && <i className={ICON_SIZES[size]}>{icon}</i>}
        {children}
      </span>
    </button>
  );
}

export default Button;
