import { buttonStyles } from '@/share/components/css/button.css.ts';
import * as React from 'react';

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
      className={buttonStyles.recipes({
        theme,
        fillType,
        size,
        fullWidth,
        onlyIcon: isOnlyIcon,
      })}
      style={flex ? { flex } : undefined}
    >
      <span className={buttonStyles.content}>
        {icon && <i className={buttonStyles.icon[size]}>{icon}</i>}
        {children}
      </span>
    </button>
  );
}

export default Button;
