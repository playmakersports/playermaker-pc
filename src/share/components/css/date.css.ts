import { style } from '@vanilla-extract/css';
import { theme } from '@/style/theme.css.ts';
import { flexRatio } from '@/style/container.css.ts';
import { align, fonts } from '@/style/typo.css.ts';

const container = style({
  borderRadius: '10px',
  padding: '16px',
  boxShadow: theme.shadow.lg,
  backgroundColor: theme.color.white,
});
const calendarHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
});
const date = style([
  flexRatio['1'],
  align.center,
  fonts.body3.medium,
  {
    cursor: 'pointer',
    width: '36px',
    height: '36px',
    color: theme.color.gray['700'],
    borderRadius: '8px',
    selectors: {
      '&:hover': {
        backgroundColor: theme.color.gray['50'],
      },
      '&:active': {
        backgroundColor: theme.color.gray['100'],
      },
      '&[data-color300="true"]': {
        color: theme.color.gray['300'],
      },
      '&[data-selected="true"]': {
        backgroundColor: theme.color.primary['500'],
        color: theme.color.white,
      },
    },
  },
]);

export const datePickerStyle = { container, calendarHeader, date };
