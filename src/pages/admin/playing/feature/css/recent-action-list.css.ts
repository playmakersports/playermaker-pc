import { globalStyle, style } from '@vanilla-extract/css';
import { fonts } from '@/style/typo.css.ts';
import { theme } from '@/style/theme.css.ts';

const title = style({
  margin: '24px 0 12px',
});
const container = style({
  display: 'flex',
  maxHeight: '210px',
  flexDirection: 'column',
  flexWrap: 'wrap',
  gap: '4px 20px',
});
const action = style([
  fonts.body3.regular,
  {
    maxWidth: '300px',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    fontFeatureSettings: `'cv02', 'cv04', 'cv06', 'cv09', 'cv13'`,
    fontVariantNumeric: 'tabular-nums',
  },
]);
const time = style([
  fonts.body3.medium,
  {
    marginRight: '-2px',
    minWidth: '46px',
    color: theme.color.gray['500'],
    letterSpacing: '-0.25px',
  },
]);
const playerNum = style([
  fonts.body4.semibold,
  {
    minWidth: '38px',
    maxWidth: '38px',
    textAlign: 'center',
    padding: '1px 09',
    backgroundColor: theme.color.gray['200'],
    color: theme.color.gray['600'],
    borderRadius: '4px',
  },
]);

const hover = style({
  position: 'relative',
});
const hoverInfo = style([
  fonts.body4.medium,
  {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    right: 0,
    top: '100%',
    width: 'max-content',
    marginTop: '6px',
    padding: '4px 8px',
    backgroundColor: theme.color.gray['500'],
    color: theme.color.white,
    borderRadius: '4px',
    gap: '4px',
    opacity: 0,
    transition: 'opacity 0.2s, transform 0.3s',
    transform: 'translateY(-100%)',
  },
]);
globalStyle(`${hoverInfo} > span.key`, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2px',
  color: theme.color.gray['200'],
});
globalStyle(`${hover}:hover ${hoverInfo}`, {
  userSelect: 'none',
  opacity: 1,
  transform: 'translateY(0)',
});

export const recentActionStyle = { title, container, action, time, playerNum, hover, hoverInfo };
