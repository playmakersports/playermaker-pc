import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vanillaExtractPlugin(), svgr()],
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
});
