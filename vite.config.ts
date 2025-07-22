import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: ['localhost'],
    port: 5173,
    proxy: {
      '/api': {
        changeOrigin: true,
        secure: false,
        target: 'http://localhost:4000',
      },
    },
    strictPort: true,
  },
})
