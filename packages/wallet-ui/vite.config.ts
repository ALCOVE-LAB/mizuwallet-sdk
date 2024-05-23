import { resolve } from 'path';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import Inspect from 'vite-plugin-inspect';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: { entry: resolve(__dirname, 'src/index.ts'), formats: ['es'] },
    watch: {
      clearScreen: true,
      include: [resolve(__dirname, 'uno.config.js')],
    },
  },
  resolve: { alias: { src: resolve('src/') } },
  plugins: [
    dts({}),
    Inspect(),
    UnoCSS({
      mode: 'shadow-dom',
    }),
  ],
});
