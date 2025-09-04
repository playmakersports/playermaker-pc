import { globalStyle, style } from '@vanilla-extract/css';
import { fonts } from '@/style/typo.css.ts';
import { theme } from '@/style/theme.css.ts';

const wrapper = style({
  maxWidth: 'var(--mobile-max-width)',
});

const base = style([
  fonts.body3.regular,
  {
    width: '100%',
    color: theme.color.gray['700'],
    border: 'none',
    selectors: {
      '&::placeholder': {
        color: theme.color.gray['400'],
      },
      '&:disabled': {
        color: theme.color.gray['400'],
        cursor: 'not-allowed',
      },
    },
  },
]);
const innerBox = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '40px',
  padding: '0 12px',
  gap: '8px',
  borderRadius: '8px',
  border: `1px solid ${theme.color.gray['200']}`,
  selectors: {
    '&:has(input:disabled)': {
      backgroundColor: theme.color.gray['50'],
    },
  },
});
const innerIcon = style({
  flexShrink: 0,
  padding: '1px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
});
globalStyle(`${innerIcon} > svg`, {
  width: '100%',
  height: '100%',
});
const baseHeader = style([
  fonts.body4.medium,
  {
    display: 'flex',
    padding: '0 2px',
    marginBottom: '4px',
    alignItems: 'center',
    gap: '4px',
    color: theme.color.gray['500'],
  },
]);

const baseQuestion = style({
  position: 'relative',
  cursor: 'help',
  width: '20px',
  height: '20px',
});

const baseTime = style({
  position: 'absolute',
  left: 0,
  margin: '8px -4px',
  width: '320px',
  minWidth: '320px',
  padding: '16px',
  backgroundColor: 'var(--background-light)',
  borderRadius: '10px',
  boxShadow: 'var(--shadow-lg)',
  zIndex: 50,
  color: theme.color.gray['700'],
});

const baseDropdown = {
  Box: style({
    position: 'absolute',
    display: 'flex',
    padding: '4px',
    flexDirection: 'column',
    gap: '4px',
    width: '100%',
    minWidth: '140px',
    borderRadius: '10px',
    backgroundColor: 'var(--white)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 50,
    overflow: 'auto',
    boxSizing: 'border-box',
  }),
};

const flowContainer = style({
  position: 'relative',
  display: 'grid',
  width: 'inherit',
  alignItems: 'center',
  justifyItems: 'center',
  textAlign: 'center',
  gridTemplateAreas: "'overlap'",
  boxSizing: 'border-box',
});
const flowInternal = style({
  width: 'inherit',
  fontVariantNumeric: 'inherit',
  appearance: 'textfield',
  backgroundColor: 'transparent',
  fontFamily: 'inherit',
  fontWeight: 'inherit',
  textAlign: 'center',
  color: 'transparent !important',
  caretColor: 'var(--gray700)',

  '::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
});
globalStyle(`${flowContainer} > *`, {
  gridArea: 'overlap',
});

export const inputStyle = { base, wrapper, innerBox, innerIcon, baseHeader, baseQuestion, baseTime, baseDropdown };
export const numberFlowStyle = { flowContainer, flowInternal };
