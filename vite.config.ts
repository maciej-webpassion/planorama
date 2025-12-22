import { resolve } from 'path';
import { defineConfig } from 'vite';

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
});
