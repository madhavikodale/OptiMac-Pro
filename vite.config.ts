import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5175,
    strictPort: true,
    open: true,
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    cssCodeSplit: true,
    sourcemap: false,
    outDir: 'dist',
    assetsDir: 'assets',
  },
  css: {
    postcss: './postcss.config.js',
  },
})
