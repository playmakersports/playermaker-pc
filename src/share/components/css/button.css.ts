import { style, styleVariants } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { fonts } from '@/style/typo.css.ts';
import { theme } from '@/style/theme.css.ts';

const buttonBase = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  WebkitFontSmoothing: 'antialiased',
  transition: 'all 0.2s',
  willChange: 'outline',
  cursor: 'pointer',
  selectors: {
    '&:disabled': {
      cursor: 'not-allowed',
    },
    '&:active': {
      filter: 'brightness(0.95)',
      transform: 'scale(0.97)',
      transition: 'all 0.25s',
    },
  },
});

const recipes = recipe({
  base: buttonBase,
  variants: {
    theme: {
      primary: {},
      gray: {},
      success: {},
      info: {},
      warning: {},
      red: {},
    },
    fillType: {
      default: {},
      light: {},
      outline: {},
    },
    size: {
      xsmall: [
        fonts.caption1.medium,
        {
          padding: '8px 12px',
          height: '32px',
          borderRadius: '8px',
        },
      ],
      small: [
        fonts.body4.medium,
        {
          padding: '8px 12px',
          height: '36px',
          borderRadius: '8px',
        },
      ],
      medium: [
        fonts.body4.medium,
        {
          padding: '10px 16px',
          height: '40px',
          borderRadius: '8px',
        },
      ],
      large: [
        fonts.body3.medium,
        {
          padding: '10px 16px',
          height: '44px',
          borderRadius: '8px',
        },
      ],
      xlarge: [
        fonts.body3.medium,
        {
          padding: '12px 18px',
          height: '48px',
          borderRadius: '10px',
        },
      ],
    },
    fullWidth: {
      true: {
        width: '100%',
      },
      false: {
        width: 'auto',
      },
    },
    onlyIcon: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: { theme: 'primary', fillType: 'default' },
      style: {
        backgroundColor: theme.color.primary[500],
        color: theme.color.white,
        borderColor: 'transparent',
        selectors: {
          '&:disabled': {
            backgroundColor: theme.color.gray[300],
            color: theme.color.gray[50],
            borderColor: 'transparent',
          },
        },
      },
    },
    {
      variants: { theme: 'primary', fillType: 'light' },
      style: {
        backgroundColor: theme.color.primary[50],
        color: theme.color.primary[600],
        borderColor: 'transparent',
        selectors: {
          '&:disabled': {
            backgroundColor: theme.color.gray[100],
            color: theme.color.gray[300],
            borderColor: 'transparent',
          },
        },
      },
    },
    {
      variants: { theme: 'primary', fillType: 'outline' },
      style: {
        backgroundColor: 'transparent',
        color: theme.color.primary[600],
        borderColor: theme.color.primary[200],
        selectors: {
          '&:active': {
            backgroundColor: theme.color.primary[50],
          },
          '&:disabled': {
            backgroundColor: theme.color.white,
            color: theme.color.gray[300],
            borderColor: theme.color.gray[200],
          },
        },
      },
    },
    {
      variants: { theme: 'gray', fillType: 'default' },
      style: {
        backgroundColor: theme.color.gray[500],
        color: theme.color.white,
        borderColor: 'transparent',
        selectors: {
          '&:disabled': {
            backgroundColor: theme.color.gray[300],
            color: theme.color.gray[50],
            borderColor: 'transparent',
          },
        },
      },
    },
    {
      variants: { theme: 'gray', fillType: 'light' },
      style: {
        backgroundColor: theme.color.gray[100],
        color: theme.color.gray[600],
        borderColor: 'transparent',
        selectors: {
          '&:disabled': {
            backgroundColor: theme.color.gray[100],
            color: theme.color.gray[300],
            borderColor: 'transparent',
          },
        },
      },
    },
    {
      variants: { theme: 'gray', fillType: 'outline' },
      style: {
        backgroundColor: theme.color.white,
        color: theme.color.gray[600],
        borderColor: theme.color.gray[200],
        selectors: {
          '&:disabled': {
            backgroundColor: theme.color.white,
            color: theme.color.gray[300],
            borderColor: theme.color.gray[200],
          },

          '&:active': {
            backgroundColor: theme.color.gray[50],
          },
        },
      },
    },
    {
      variants: { theme: 'success', fillType: 'default' },
      style: {
        backgroundColor: theme.color.success[500],
        color: theme.color.white,
        borderColor: 'transparent',
        selectors: {
          '&:disabled': {
            backgroundColor: theme.color.gray[300],
            color: theme.color.gray[50],
            borderColor: 'transparent',
          },
        },
      },
    },
    {
      variants: { theme: 'success', fillType: 'light' },
      style: {
        backgroundColor: theme.color.success[50],
        color: theme.color.success[600],
        borderColor: 'transparent',
        selectors: {
          '&:disabled': {
            backgroundColor: theme.color.gray[100],
            color: theme.color.gray[300],
            borderColor: 'transparent',
          },
        },
      },
    },
    {
      variants: { theme: 'success', fillType: 'outline' },
      style: {
        backgroundColor: theme.color.white,
        color: theme.color.success[600],
        borderColor: theme.color.success[200],

        selectors: {
          '&:disabled': {
            backgroundColor: theme.color.white,
            color: theme.color.gray[300],
            borderColor: theme.color.gray[200],
          },
          '&:active': {
            backgroundColor: theme.color.success[50],
          },
        },
      },
    },
    {
      variants: { theme: 'info', fillType: 'default' },
      style: {
        backgroundColor: theme.color.info[500],
        color: theme.color.white,
        borderColor: 'transparent',
        selectors: {
          '&:disabled': {
            backgroundColor: theme.color.gray[300],
            color: theme.color.gray[50],
            borderColor: 'transparent',
          },
        },
      },
    },
    {
      variants: { theme: 'info', fillType: 'light' },
      style: {
        backgroundColor: theme.color.info[50],
        color: theme.color.info[600],
        borderColor: 'transparent',
        selectors: {
          '&:disabled': {
            backgroundColor: theme.color.gray[100],
            color: theme.color.gray[300],
            borderColor: 'transparent',
          },
        },
      },
    },
    {
      variants: { theme: 'info', fillType: 'outline' },
      style: {
        backgroundColor: theme.color.white,
        color: theme.color.info[600],
        borderColor: theme.color.info[200],
        selectors: {
          '&:disabled': {
            backgroundColor: theme.color.white,
            color: theme.color.gray[300],
            borderColor: theme.color.gray[200],
          },
          '&:active': {
            backgroundColor: theme.color.info[50],
          },
        },
      },
    },
    {
      variants: { theme: 'warning', fillType: 'default' },
      style: {
        backgroundColor: theme.color.warning[500],
        color: theme.color.white,
        borderColor: 'transparent',
        selectors: {
          '&:disabled': {
            backgroundColor: theme.color.gray[300],
            color: theme.color.gray[50],
            borderColor: 'transparent',
          },
        },
      },
    },
    {
      variants: { theme: 'warning', fillType: 'light' },
      style: {
        backgroundColor: theme.color.warning[50],
        color: theme.color.warning[600],
        borderColor: 'transparent',
        selectors: {
          '&:disabled': {
            backgroundColor: theme.color.gray[100],
            color: theme.color.gray[300],
            borderColor: 'transparent',
          },
        },
      },
    },
    {
      variants: { theme: 'warning', fillType: 'outline' },
      style: {
        backgroundColor: theme.color.white,
        color: theme.color.warning[600],
        borderColor: theme.color.warning[200],
        selectors: {
          '&:disabled': {
            backgroundColor: theme.color.white,
            color: theme.color.gray[300],
            borderColor: theme.color.gray[200],
          },
          '&:active': {
            backgroundColor: theme.color.warning[50],
          },
        },
      },
    },
    {
      variants: { theme: 'red', fillType: 'default' },
      style: {
        backgroundColor: theme.color.red[500],
        color: theme.color.white,
        borderColor: 'transparent',
        selectors: {
          '&:disabled': {
            backgroundColor: theme.color.gray[300],
            color: theme.color.gray[50],
            borderColor: 'transparent',
          },
        },
      },
    },
    {
      variants: { theme: 'red', fillType: 'light' },
      style: {
        backgroundColor: theme.color.red[50],
        color: theme.color.red[600],
        borderColor: 'transparent',
        selectors: {
          '&:disabled': {
            backgroundColor: theme.color.gray[100],
            color: theme.color.gray[300],
            borderColor: 'transparent',
          },
        },
      },
    },
    {
      variants: { theme: 'red', fillType: 'outline' },
      style: {
        backgroundColor: theme.color.white,
        color: theme.color.red[600],
        borderColor: theme.color.red[200],
        selectors: {
          '&:disabled': {
            backgroundColor: theme.color.white,
            color: theme.color.gray[300],
            borderColor: theme.color.gray[200],
          },

          '&:active': {
            backgroundColor: theme.color.red[50],
          },
        },
      },
    },
    {
      variants: { size: 'xsmall', onlyIcon: true },
      style: {
        padding: '6px',
      },
    },
    {
      variants: { size: 'small', onlyIcon: true },
      style: {
        padding: '8px',
      },
    },
    {
      variants: { size: 'medium', onlyIcon: true },
      style: {
        padding: '10px',
      },
    },
    {
      variants: { size: 'large', onlyIcon: true },
      style: {
        padding: '10px',
      },
    },
    {
      variants: { size: 'xlarge', onlyIcon: true },
      style: {
        padding: '12px',
      },
    },
  ],
  defaultVariants: {
    theme: 'primary',
    fillType: 'default',
    size: 'medium',
    fullWidth: false,
    onlyIcon: false,
  },
});

const content = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
});

const icon = styleVariants({
  xsmall: {
    width: '20px',
    height: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    width: '20px',
    height: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    // selectors: {
    //   '& svg': {
    //     width: '100%',
    //     height: 'auto',
    //     fill: 'currentColor',
    //   },
    // },
  },
  medium: {
    width: '20px',
    height: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    // selectors: {
    //   '& svg': {
    //     width: '100%',
    //     height: 'auto',
    //     fill: 'currentColor',
    //   },
    // },
  },
  large: {
    width: '24px',
    height: '24px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    // selectors: {
    //   '& svg': {
    //     width: '100%',
    //     height: 'auto',
    //     fill: 'currentColor',
    //   },
    // },
  },
  xlarge: {
    width: '24px',
    height: '24px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    selectors: {
      //   '& svg': {
      //     width: '100%',
      //     height: 'auto',
      //     fill: 'currentColor',
      //   },
    },
  },
});

export const buttonStyles = { recipes, content, icon };
