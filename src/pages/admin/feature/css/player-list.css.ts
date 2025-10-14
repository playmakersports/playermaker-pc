import { style } from '@vanilla-extract/css';
import { theme } from '@/style/theme.css.ts';
import { fonts } from '@/style/typo.css.ts';

const floatContainer = style({
  padding: '16px 8px',
  boxShadow: theme.shadow.xl,
  minWidth: '190px',
});
const listItem = style([
  fonts.body2.regular,
  {
    width: '100%',
    userSelect: 'none',
    cursor: 'pointer',
    padding: '6px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    borderRadius: '12px',
    outline: 'none',
    selectors: {
      '&:hover': {
        backgroundColor: theme.color.primary['50'],
      },
      '&:focus': {
        backgroundColor: theme.color.primary['100'],
      },
    },
  },
]);
const backNumber = style([
  fonts.caption1.medium,
  {
    display: 'inline-block',
    width: '24px',
    textAlign: 'center',
    backgroundColor: theme.color.primary['500'],
    color: theme.color.white,
    borderRadius: '4px',
  },
]);

const selected = style({
  backgroundColor: theme.color.primary['100'],
});

export const playerListStyle = { floatContainer, listItem, backNumber, selected };
