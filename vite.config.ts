import { defineConfig } from 'vite'
import path from "path";
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  base: '/cmkd',
  plugins: [
    vue(), 
    dts({
      //rollupTypes: true,
      tsconfigPath: "./tsconfig.app.json",
    }),
    cssInjectedByJsPlugin({ useStrictCSP: true, relativeCSSInjection: false }), 
  ],
  build: {
    lib: {
      name: 'vue3-cmkd',
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: (format) => `vue3-cmkd.${format}.js`,
    },
    emptyOutDir: true,
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
