import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'Planorama',
      formats: ['es'],
      fileName: 'index',
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: ['konva', '@preact/signals-core', 'lodash-es'],
      output: {
        preserveModules: false,
      },
    },
  },
  plugins: [
    dts({
      include: ['src/lib/**/*'],
      outDir: 'dist',
      rollupTypes: true,
    }),
  ],
});
