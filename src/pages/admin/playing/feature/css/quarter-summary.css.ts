import { style } from '@vanilla-extract/css';
import { theme } from '@/style/theme.css';
import { fonts } from '@/style/typo.css';

const container = style({
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.25)',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  zIndex: 50,
  display: 'flex',
  padding: '0 28px',
  justifyContent: 'center',
  alignItems: 'center',
  selectors: {
    '&[data-open="true"]': {
      opacity: 1,
    },
  },
});

const inner = style({
  width: '100%',
  maxWidth: '1200px',
  height: '80vh',
  maxHeight: '80vh',
  backgroundColor: theme.color.white,
  borderRadius: '20px',
  padding: '32px 32px 0',
  boxShadow: theme.shadow.lg,
  transform: 'translateY(40px)',
  opacity: 0,
  transition: 'transform 0.25s ease-in-out, opacity 0.3s ease-in-out',
  display: 'flex',
  flexDirection: 'column',
  selectors: {
    '&[data-open="true"]': {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },
});

const timeerText = style([
  fonts.body3.regular,
  {
    color: theme.color.primary['600'],
  },
]);

const eventContainer = style({
  display: 'flex',
  margin: '20px -4px 0',
  height: '100%',
  gap: '24px',
  justifyContent: 'space-between',
  flex: 1,
  minHeight: 0,
});

const eventList = style({
  width: '240px',
  display: 'inline-flex',
  flexDirection: 'column',
  gap: '12px',
  overflowY: 'auto',
  height: '100%',
  paddingRight: '12px',
  paddingBottom: '32px',
});
const eventCard = style([
  fonts.body4.regular,
  {
    cursor: 'pointer',
    userSelect: 'none',
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: theme.color.gray['100'],
    border: '1px solid transparent',
    selectors: {
      '&[data-selected="true"]': {
        border: `1px solid ${theme.color.primary['500']}`,
        backgroundColor: theme.color.white,
        color: theme.color.primary['700'],
      },
    },
  },
]);

const eventFormSection = style({
  flex: 1,
});

export const summaryStyle = { container, inner, timeerText, eventContainer, eventList, eventCard, eventFormSection };
