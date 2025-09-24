import { style } from '@vanilla-extract/css';
import { theme } from '@/style/theme.css.ts';

export const floatBox = style({
  padding: '16px 12px',
  borderRadius: '20px',
  backgroundColor: theme.color.white,
});
