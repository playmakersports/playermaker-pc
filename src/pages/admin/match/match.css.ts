import { style } from '@vanilla-extract/css';
import { layout, theme } from '@/style/theme.css.ts';
import { flexs } from '@/style/container.css.ts';
import { fonts } from '@/style/typo.css.ts';

const container = style({
  display: 'flex',
  height: `calc(100vh - ${layout.headerHeight})`,
});
const aside = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '16px 16px 16px 0',
  minWidth: '240px',
  height: '100%',
  borderRight: `1px solid ${theme.color.gray['100']}`,
  transition: 'all 0.25s',
  selectors: {
    "&[data-staged='true']": {
      minWidth: '560px',
    },
  },
});

const asideListItem = style({
  cursor: 'pointer',
  userSelect: 'none',
  display: 'flex',
  padding: '16px 12px',
  flexDirection: 'column',
  width: '100%',
  borderBottom: `1px solid ${theme.color.gray['100']}`,
  selectors: {
    "&[data-active='true']": {
      color: theme.color.primary['600'],
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
});
const header = style({
  margin: '16px 0',
});
const stepItem = style([
  flexs({ gap: '8', justify: 'start' }),
  fonts.body4.regular,
  {
    margin: '10px 0 0',
    color: theme.color.gray['500'],
  },
]);
const stepCircle = style([
  flexs({ justify: 'center' }),
  fonts.head6.medium,
  {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: theme.color.primary['500'],
    color: theme.color.white,
    selectors: {
      "&[data-staged='false']": {
        backgroundColor: theme.color.gray['300'],
      },
    },
  },
]);
const stepLine = style({
  flex: 1,
  height: '1px',
  border: '1px dashed',
  borderColor: theme.color.gray['200'],
  selectors: {
    "&[data-active='true']": {
      borderColor: theme.color.primary['400'],
    },
  },
});
const formLayout = style({
  display: 'flex',
  gap: '16px',
  height: '100%',
});
const formContent = style({
  position: 'relative',
  flex: 1,
  padding: '16px 0',
  display: 'flex',
  justifyContent: 'space-around',
  gap: '20px',
  selectors: {
    "&[data-staged='false']::after": {
      content: '',
      position: 'absolute',
      backgroundColor: 'rgba(256,256,256,0.7)',
      display: 'block',
      width: '100%',
      height: '100%',
    },
  },
});

const sectionTitle = style({
  marginBottom: '16px',
});

const playerRow = style({
  alignItems: 'flex-end',
});

const playerNumberInput = style({
  width: '60px',
});

const playerNameInput = style({
  width: '152px',
});

const inputLabel = style({
  display: 'block',
  marginBottom: '4px',
});

const checkboxContainer = style([flexs({ gap: '4' })]);

const checkboxLabel = style([
  fonts.caption1.regular,
  {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    borderRadius: '4px',
    padding: '2px 4px',
    backgroundColor: theme.color.gray['50'],
    border: `1px solid ${theme.color.gray['100']}`,
    color: theme.color.gray['400'],
    overflow: 'hidden',
    selectors: {
      '&:has(input:checked)': {
        color: theme.color.primary['50'],
        backgroundColor: theme.color.primary['500'],
        borderColor: 'transparent',
      },
      '&:has(input:focus)': {
        outline: `2px solid ${theme.color.gray['200']}`,
      },
      '&:has(input:checked:focus)': {
        outline: `2px solid ${theme.color.primary['100']}`,
      },
    },
  },
]);

export const matchStyle = { container, aside, asideListItem };
export const matchCreateStyle = {
  header,
  stepCircle,
  stepItem,
  stepLine,
  aside,
  formLayout,
  formContent,
  sectionTitle,
  playerRow,
  playerNumberInput,
  playerNameInput,
  inputLabel,
  checkboxContainer,
  checkboxLabel,
};
