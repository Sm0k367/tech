import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    cloudflare()  // This helps with Pages + Wrangler integration
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined  // Helps keep build smaller for Pages
      }
    }
  }
});
