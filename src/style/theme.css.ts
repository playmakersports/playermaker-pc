import { createGlobalTheme } from '@vanilla-extract/css';

export const layout = createGlobalTheme(':root', {
  headerHeight: '60px',
});

export const theme = createGlobalTheme(':root', {
  shadow: {
    xs: '0 1px 6px 0 rgba(15, 23, 42, 0.05)',
    sm: '0 1px 9px 0 rgba(15, 23, 42, 0.08)',
    md: '0 4px 10px 0 rgba(15, 23, 42, 0.1)',
    lg: '0 10px 15px 0 rgba(0, 0, 0, 0.08)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  color: {
    white: '#fff',
    black: '#000',
    gray: {
      900: '#0f172a',
      800: '#1e293b',
      700: '#334155',
      600: '#475569',
      500: '#64748b',
      400: '#94a3b8',
      300: '#cbd5e1',
      200: '#e2e8f0',
      100: '#f1f5f9',
      50: '#f8fafc',
    },

    success: {
      900: '#0e633c',
      800: '#177843',
      700: '#24954d',
      600: '#35b256',
      500: '#49cf60',
      400: '#74e27c',
      300: '#94f093',
      200: '#c0fab9',
      100: '#e2fcdb',
      50: '#f0fdec',
    },

    primary: {
      900: '#086261',
      800: '#0d776a',
      700: '#159478',
      600: '#1fb182',
      500: '#2bce8a',
      400: '#5be19c',
      300: '#7ef0a9',
      200: '#aafac1',
      100: '#d4fcdb',
      50: '#e7fdeb',
    },

    info: {
      900: '#09237a',
      800: '#0f3393',
      700: '#1949b7',
      600: '#2463db',
      500: '#3281ff',
      400: '#65a6ff',
      300: '#83bdff',
      200: '#add6ff',
      100: '#d6ecff',
      50: '#ebf6ff',
    },

    warning: {
      900: '#7a3f05',
      800: '#935309',
      700: '#b76f0f',
      600: '#db8d16',
      500: '#ffaf1f',
      400: '#ffc957',
      300: '#ffd878',
      200: '#ffe8a5',
      100: '#fff5d2',
      50: '#fff9e6',
    },

    red: {
      900: '#770c25',
      800: '#8f1427',
      700: '#b2202b',
      600: '#d52f2e',
      500: '#f85040',
      400: '#fa866f',
      300: '#fca88c',
      200: '#fecbb2',
      100: '#fee8d8',
      50: '#fef3eb',
    },

    purple: {
      900: '#280c6a',
      800: '#3a1480',
      700: '#53209f',
      600: '#6f2ebe',
      500: '#8f40de',
      400: '#b26deb',
      300: '#cb8cf5',
      200: '#e2b4fb',
      100: '#f2d9fd',
      50: '#f8ecfe',
    },

    magenta: {
      900: '#730d5b',
      800: '#8b1664',
      700: '#ac2371',
      600: '#ce337b',
      500: '#f04785',
      400: '#f67496',
      300: '#fa90a2',
      200: '#fdb6bb',
      100: '#fedbda',
      50: '#fff1f0',
    },
  },
});
