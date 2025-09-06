import { style } from '@vanilla-extract/css';
import { theme } from '@/style/theme.css.ts';
import { flexs } from '@/style/container.css.ts';
import { fonts } from '@/style/typo.css.ts';

const container = style({
  display: 'flex',
  height: '100%',
});
const aside = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '16px 16px 16px 0',
  minWidth: '240px',
  height: '100%',
  borderRight: `1px solid ${theme.color.gray['100']}`,
});
const header = style({
  margin: '16px 0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});
const formLayout = style({
  display: 'flex',
  gap: '16px',
  height: '100%',
});
const formContent = style({
  flex: 1,
  padding: '16px 0',
  display: 'flex',
  justifyContent: 'space-around',
  gap: '20px',
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

export const matchStyle = { container, aside };
export const matchCreateStyle = {
  header,
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
