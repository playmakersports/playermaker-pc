import { createVar, globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { theme } from '@/style/theme.css.ts';
import { fonts } from '@/style/typo.css.ts';

const centerWidthVar = createVar();
const pageSection = style({
  display: 'flex',
  gap: '32px',
  flexDirection: 'column',
  padding: '16px',
  height: '100vh',
  vars: {
    [centerWidthVar]: 'max(140px, 16.5vw)',
  },
});
const layoutContainer = style({
  display: 'flex',
  gap: '16px',
  justifyContent: 'space-between',
});
const headerCenter = style([
  fonts.head4.semibold,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    width: centerWidthVar,
    textAlign: 'center',
    fontFeatureSettings: `'cv02', 'cv04', 'cv06', 'cv09', 'cv13'`,
  },
]);
const playingScore = style([
  fonts.head6.semibold,
  {
    padding: '8px 0',
    minWidth: '152px',
    border: `2px solid ${theme.color.gray['300']}`,
    color: theme.color.gray['700'],
    borderRadius: '10px',
    textAlign: 'center',
    fontVariant: 'tabular-nums',
    letterSpacing: '-0.7px',
  },
]);
const teamTypeFlag = style([
  fonts.body4.semibold,
  {
    padding: '2px 8px',
    backgroundColor: theme.color.gray['500'],
    borderRadius: '3px',
    color: theme.color.white,
  },
]);
const subNumberText = style([
  fonts.head4.medium,
  {
    fontFeatureSettings: `'cv02', 'cv04', 'cv06', 'cv09', 'cv13'`,
  },
]);
const playingTimeout = style({
  backgroundColor: theme.color.red['500'],
  color: theme.color.white,
  borderColor: 'transparent',
});
const headerTeam = style([
  fonts.head6.medium,
  {
    flex: 1,
    textAlign: 'center',
  },
]);

const headerTeamFouls = style({
  display: 'flex',
  marginTop: '4px',
  justifyContent: 'center',
  gap: '4px',
});
globalStyle(`ul.${headerTeamFouls} > li`, {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  backgroundColor: theme.color.gray['200'],
  color: theme.color.gray['400'],
  borderRadius: '2px',
});
globalStyle(`ul.${headerTeamFouls} > li[data-active="true"]`, {
  backgroundColor: theme.color.red['500'],
  color: theme.color.white,
});

const controlCards = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: '40px',
});
const playingScoreTable = style({
  position: 'relative',
  width: centerWidthVar,
  height: '75vh',
  border: `1px solid ${theme.color.gray['300']}`,
  borderRadius: '8px',
  overflow: 'auto',
});

const scoreTableHeader = style([
  fonts.body3.semibold,
  {
    position: 'sticky',
    top: 0,
    padding: '6px 0',
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: theme.color.gray['100'],
    borderBottom: `1px solid ${theme.color.gray['300']}`,
    textAlign: 'center',
  },
]);

const scoreTableCell = style([
  fonts.body2.regular,
  {
    borderBottom: `1px solid ${theme.color.gray['200']}`,
    textAlign: 'center',
    minHeight: '36px',
    display: 'grid',
    gridTemplateColumns: '1fr auto auto 1fr',
    alignItems: 'center',
  },
]);
const scoreTablePointCell = style([
  fonts.body3.semibold,
  {
    padding: '6px 0',
    minWidth: '40px',
    backgroundColor: theme.color.gray['50'],
    color: theme.color.gray['600'],
    borderLeft: `1px solid ${theme.color.gray['200']}`,
    fontFeatureSettings: `'cv02', 'cv04', 'cv06', 'cv09', 'cv13'`,
    selectors: {
      '&:nth-child(3)': {
        borderRight: `1px solid ${theme.color.gray['200']}`,
      },
    },
  },
]);

const playersList = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  borderRadius: '8px',
  gap: '8px',
});
const actionsList = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  borderRadius: '8px',
  gap: '8px',
});
const playerButton = style([
  fonts.head6.medium,
  {
    userSelect: 'none',
    display: 'flex',
    padding: '12px 0',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.color.info['100'],
    borderRadius: '6px',
    cursor: 'pointer',
    textAlign: 'center',
    selectors: {
      '&:hover': {
        backgroundColor: theme.color.info['200'],
      },
      '&:active': {
        backgroundColor: theme.color.info['300'],
      },
      '&:disabled': {
        backgroundColor: theme.color.gray['100'],
        color: theme.color.gray['400'],
      },
      '&[data-selected="true"]': {
        padding: '10px 0',
        backgroundColor: theme.color.info['600'],
        color: theme.color.white,
        border: `2px solid ${theme.color.white}`,
        outline: `2px solid ${theme.color.info['600']}`,
      },
    },
  },
]);
const actionButton = style([
  fonts.head6.medium,
  {
    userSelect: 'none',
    padding: '24px 0',
    backgroundColor: theme.color.primary['200'],
    borderRadius: '6px',
    cursor: 'pointer',
    textAlign: 'center',
    selectors: {
      '&:hover': {
        backgroundColor: theme.color.primary['300'],
      },
      '&:active': {
        backgroundColor: theme.color.primary['400'],
      },
      '&:disabled': {
        cursor: 'not-allowed',
        backgroundColor: theme.color.gray['100'],
        color: theme.color.gray['400'],
      },
      '&[data-selected="true"]': {
        padding: '14px 0',
        backgroundColor: theme.color.primary['600'],
        color: theme.color.white,
        border: `2px solid ${theme.color.white}`,
        outline: `2px solid ${theme.color.primary['600']}`,
      },
    },
  },
]);
const playerChangeButton = style([
  fonts.head6.medium,
  {
    userSelect: 'none',
    width: '100%',
    height: '100%',
    display: 'flex',
    gap: '12px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid',
    borderColor: theme.color.gray['300'],
    borderRadius: '6px',
    cursor: 'pointer',
    textAlign: 'center',
    color: theme.color.gray['500'],
    selectors: {
      '&:hover': {
        backgroundColor: theme.color.gray['50'],
      },
      '&:active': {
        backgroundColor: theme.color.gray['200'],
      },
      '&:disabled': {
        border: 'none',
        backgroundColor: theme.color.gray['100'],
        color: theme.color.gray['400'],
      },
    },
  },
]);

const playerFoulCount = style({
  display: 'inline-flex',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  border: '2px solid',
  borderColor: theme.color.gray['400'],
  selectors: {
    '&[data-active="true"]': {
      backgroundColor: theme.color.gray['600'],
      borderColor: theme.color.gray['600'],
    },
  },
});

const buttonBase = style([
  fonts.head6.medium,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    width: '100%',
    padding: '8px 14px',
    color: theme.color.white,
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none',
    selectors: {
      '&:disabled': {
        backgroundColor: theme.color.gray['200'],
        color: theme.color.gray['400'],
        cursor: 'not-allowed',
      },
    },
  },
]);

const button = styleVariants({
  primary: [
    buttonBase,
    {
      backgroundColor: theme.color.primary['500'],
      selectors: {
        '&:active': {
          backgroundColor: theme.color.primary['600'],
        },
      },
    },
  ],
  success: [
    buttonBase,
    {
      backgroundColor: theme.color.success['500'],
      selectors: {
        '&:active': {
          backgroundColor: theme.color.success['600'],
        },
      },
    },
  ],
  info: [
    buttonBase,
    {
      backgroundColor: theme.color.info['500'],
      selectors: {
        '&:active': {
          backgroundColor: theme.color.info['600'],
        },
      },
    },
  ],
  warning: [
    buttonBase,
    {
      backgroundColor: theme.color.warning['500'],
      selectors: {
        '&:active': {
          backgroundColor: theme.color.warning['600'],
        },
      },
    },
  ],
  red: [
    buttonBase,
    {
      backgroundColor: theme.color.red['500'],
      selectors: {
        '&:active': {
          backgroundColor: theme.color.red['600'],
        },
      },
    },
  ],
  purple: [
    buttonBase,
    {
      backgroundColor: theme.color.purple['500'],
      selectors: {
        '&:active': {
          backgroundColor: theme.color.purple['600'],
        },
      },
    },
  ],
  magenta: [
    buttonBase,
    {
      backgroundColor: theme.color.magenta['500'],
      selectors: {
        '&:active': {
          backgroundColor: theme.color.magenta['600'],
        },
      },
    },
  ],
  gray: [
    buttonBase,
    {
      backgroundColor: theme.color.gray['500'],
      selectors: {
        '&:active': {
          backgroundColor: theme.color.gray['600'],
        },
      },
    },
  ],
});

export const playingStyle = {
  pageSection,
  layoutContainer,
  playingScore,
  teamTypeFlag,
  playingTimeout,
  headerTeam,
  headerCenter,
  headerTeamFouls,
  controlCards,
  playingScoreTable,
  scoreTablePointCell,
  scoreTableHeader,
  scoreTableCell,
  actionsList,
  playersList,
  playerChangeButton,
  playerFoulCount,
  subNumberText,
  playerButton,
  actionButton,
  button,
};
