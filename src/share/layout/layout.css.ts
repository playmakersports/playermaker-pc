import { style } from '@vanilla-extract/css';
import { fonts, fontWeight } from '@/style/typo.css.ts';
import { layout, theme } from '@/style/theme.css.ts';

const adminRoot = style({
  margin: '0 auto',
  height: 'max-content',
});
const main = style({
  margin: '0 auto',
  padding: '0 16px',
  minWidth: '1280px',
  maxWidth: '1280px',
  width: '100%',
  height: '100%',
  minHeight: 'calc(100vh - 60px)',
});
const navContainer = style({
  width: '100%',
  height: layout.headerHeight,
  borderBottom: `1px solid ${theme.color.gray['100']}`,
});
const navInner = style({
  margin: '0 auto',
  padding: '0 16px',
  display: 'flex',
  justifyContent: 'space-between',
  minWidth: '1280px',
  maxWidth: '1280px',
  width: '100%',
  height: '100%',
});
const navMenu = style({
  display: 'flex',
  gap: '16px',
});
const navItems = style([
  fonts.body4.regular,
  {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 10px 0',
    height: '100%',
    borderBottom: '3px solid transparent',
    selectors: {
      '&:active': {
        backgroundColor: theme.color.gray['100'],
      },
      "&[data-active='true']": {
        fontWeight: fontWeight.semibold,
        color: theme.color.primary['600'],
        borderColor: theme.color.primary['600'],
      },
    },
  },
]);
const navUser = style({
  display: 'flex',
  gap: '6px',
  alignItems: 'center',
});

export const layoutStyle = { adminRoot, main, navInner, navContainer, navMenu, navItems, navUser };
