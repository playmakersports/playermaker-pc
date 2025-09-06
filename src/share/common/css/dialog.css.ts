import { style } from '@vanilla-extract/css';
import { theme } from '@/style/theme.css.ts';
import { flexs } from '@/style/container.css.ts';
import { fonts } from '@/style/typo.css.ts';

const dim = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
});
const container = style([
  flexs({ dir: 'col', gap: '32' }),
  {
    minWidth: '350px',
    borderRadius: '20px',
    backgroundColor: theme.color.white,
    padding: '20px',
    alignItems: 'stretch',
  },
]);
const inner = style([flexs({ dir: 'col', gap: '12', justify: 'start', align: 'start' }), { padding: '0 8px' }]);
const title = style([
  fonts.body2.semibold,
  {
    color: theme.color.gray['700'],
  },
]);
const contents = style([
  fonts.body4.regular,
  {
    color: theme.color.gray['700'],
  },
]);

export const dialogStyle = { dim, container, inner, title, contents };
