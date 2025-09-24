import { recipe } from '@vanilla-extract/recipes';
import { keyframes } from '@vanilla-extract/css';
import { theme } from '@/style/theme.css.ts';

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const spinner = recipe({
  base: {
    display: 'inline-block',
    flexShrink: 0,
    borderRadius: '50%',
    borderStyle: 'solid',
    animation: `${rotate} 1.5s infinite`,
    animationTimingFunction: 'linear',
  },
  variants: {
    size: {
      20: {
        width: '20px',
        height: '20px',
      },
      24: {
        width: '24px',
        height: '24px',
      },
      28: {
        width: '28px',
        height: '28px',
      },
    },
    theme: {
      primary: {
        borderColor: theme.color.primary['200'],
        borderRightColor: theme.color.primary['600'],
      },
      gray: {
        borderColor: theme.color.gray['100'],
        borderRightColor: theme.color.gray['600'],
      },
    },
    stroke: {
      1: { borderWidth: 1 },
      2: { borderWidth: 2 },
      3: { borderWidth: 3 },
      4: { borderWidth: 4 },
    },
  },
  defaultVariants: {
    size: 24,
    theme: 'primary',
    stroke: 2,
  },
});
