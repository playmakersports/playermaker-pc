import { style, styleVariants } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const flexs = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
  },
  variants: {
    justify: {
      center: { justifyContent: 'center' },
      spb: { justifyContent: 'space-between' },
      start: { justifyContent: 'flex-start' },
      end: { justifyContent: 'flex-end' },
      around: { justifyContent: 'space-around' },
    },
    align: {
      start: { alignItems: 'flex-start' },
      end: { alignItems: 'flex-end' },
    },
    dir: {
      row: { flexDirection: 'row' },
      col: { flexDirection: 'column' },
    },
    gap: {
      '0': { gap: '0px' },
      '2': { gap: '2px' },
      '4': { gap: '4px' },
      '8': { gap: '8px' },
      '12': { gap: '12px' },
      '16': { gap: '16px' },
      '20': { gap: '20px' },
      '24': { gap: '24px' },
      '32': { gap: '32px' },
    },
  },
  defaultVariants: {
    justify: 'center',
    dir: 'row',
    gap: '0',
  },
});

export const fullwidth = style({
  width: '100%',
});
export const flexRatio = styleVariants({
  1: { flex: 1 },
  2: { flex: 2 },
  3: { flex: 3 },
});
