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
      external: ['konva', /^konva\/.*/, '@preact/signals-core', 'lodash-es', /^lodash-es\/.*/],
      output: {
        preserveModules: false,
        globals: {
          konva: 'Konva',
          '@preact/signals-core': 'signals',
          'lodash-es': '_',
        },
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
