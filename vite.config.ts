import { resolve } from 'path';
import { defineConfig } from 'vite';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: 'src/demo',
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist-demo'),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
  plugins: [tailwindcss()],
});
