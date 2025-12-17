import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    define: {
      // Polyfill process.env.API_KEY so the existing code works without changes.
      // NOTE: This injects the key into the client-side bundle. 
      // Ensure your Vercel project environment variables are set.
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});