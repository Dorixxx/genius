import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    define: {
      // Polyfill process.env.API_KEY.
      // Use logical OR to ensure it's a string, avoiding JSON.stringify(undefined)
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  };
});