import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite exposes VITE_-prefixed vars from .env automatically via import.meta.env.
// NOTE: never `define` secrets here — anything injected that way is baked into
// the shipped client bundle. Server-side keys belong in mavi-backend/.env.
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
