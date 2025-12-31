import { resolve } from 'path';
import { defineConfig } from 'vite';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: '.',
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      '@maciejwegrzynek/planorama': resolve(__dirname, '../../src/lib/index.ts'),
    },
  },
});
