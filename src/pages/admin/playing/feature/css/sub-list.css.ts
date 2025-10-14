import { style } from '@vanilla-extract/css';
import { theme } from '@/style/theme.css.ts';
import { fonts } from '@/style/typo.css.ts';

const floatContainer = style({
  padding: '16px 8px',
  boxShadow: theme.shadow.xl,
  minWidth: '190px',
  backgroundColor: theme.color.white,
  borderRadius: '12px',
  border: `1px solid ${theme.color.info['300']}`,
});
const listItem = style([
  fonts.body1.medium,
  {
    width: '100%',
    userSelect: 'none',
    cursor: 'pointer',
    padding: '10px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    borderRadius: '8px',
    outline: 'none',
    selectors: {
      '&:hover': {
        backgroundColor: theme.color.info['50'],
      },
      '&:focus': {
        backgroundColor: theme.color.info['100'],
      },
    },
  },
]);
const backNumber = style([
  fonts.body2.semibold,
  {
    display: 'inline-block',
    minWidth: '36px',
    textAlign: 'center',
    color: theme.color.info['600'],
    borderRadius: '4px',
    backgroundColor: theme.color.info['50'],
  },
]);

export const subListStyle = { floatContainer, listItem, backNumber };
