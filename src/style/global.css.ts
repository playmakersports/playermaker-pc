import { globalStyle } from '@vanilla-extract/css';

globalStyle('*::-webkit-scrollbar', {
  width: '8px',
  height: '8px',
});
globalStyle('*::-webkit-scrollbar-track', {
  backgroundColor: 'yellow',
});
globalStyle('*::-webkit-scrollbar-thumb', {
  backgroundColor: 'yellow',
});
globalStyle('*::-webkit-scrollbar-corner', {
  backgroundColor: 'transparent',
});
