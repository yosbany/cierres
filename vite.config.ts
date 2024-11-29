import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    base: './',
    server: {
      watch: {
        usePolling: true,
        interval: 100
      },
      hmr: {
        overlay: true
      }
    },
    optimizeDeps: {
      exclude: ['lucide-react']
    },
    define: {
      'process.env': env
    }
  };
});