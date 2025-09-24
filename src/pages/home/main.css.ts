import { style } from '@vanilla-extract/css';
import { theme } from '@/style/theme.css.ts';
import { flexs } from '@/style/container.css.ts';

const container = style([
  flexs({ justify: 'center' }),
  {
    height: '100vh',
  },
]);
const box = style([
  flexs({ gap: '12' }),
  {
    margin: '0 auto',
    padding: '12px 48px 0 20px',
    maxWidth: '960px',
    borderRadius: '16px',
    border: `1px solid ${theme.color.gray['200']}`,
  },
]);

export const mainStyle = { container, box };
