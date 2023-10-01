import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import autoprefixer from 'autoprefixer'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  server: { port: 7001 },
  resolve: {
    alias: {
      lib: __dirname + '/src/lib'
    }
  },
  build: { outDir: 'build' },
  css: { postcss: { plugins: [autoprefixer()] } },
  base: '/jinie'
})
