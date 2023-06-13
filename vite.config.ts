import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/socket.io/': {
        target: 'ws://localhost:3000',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
