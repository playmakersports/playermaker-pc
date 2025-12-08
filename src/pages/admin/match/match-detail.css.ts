import { style } from '@vanilla-extract/css';
import { flexs } from '@/style/container.css.ts';
import { fonts } from '@/style/typo.css.ts';
import { theme } from '@/style/theme.css.ts';

const container = style({
  padding: '32px 40px 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '28px',
});
const description = style([
  fonts.body2.regular,
  flexs({ dir: 'col', gap: '4' }),
  {
    marginTop: '18px',
    color: theme.color.gray['500'],
  },
]);

const backNumber = style([
  fonts.body3.semibold,
  {
    display: 'inline-block',
    minWidth: '40px',
    backgroundColor: theme.color.gray['100'],
    borderRadius: '4px',
    color: theme.color.gray['700'],
    textAlign: 'center',
    fontFeatureSettings: `'cv02', 'cv04', 'cv06', 'cv09', 'cv13'`,
  },
]);

const starterButton = style([
  fonts.body3.semibold,
  flexs({ gap: '4' }),
  {
    cursor: 'pointer',
    padding: '4px 6px',
    borderRadius: '6px',
    selectors: {
      '&[data-active="true"]': {
        backgroundColor: theme.color.primary['300'],
      },
      '&[data-active="false"]': {
        color: theme.color.gray['400'],
      },
    },
  },
]);

export const matchDetailStyle = { container, description, backNumber, starterButton };
