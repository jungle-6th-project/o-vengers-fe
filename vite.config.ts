import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr({
      svgrOptions: {
        // svgr options
      },
    }),
    VitePWA({
      strategies: 'injectManifest',
      injectRegister: null,
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
      },
      workbox: {
        sourcemap: true,
      },
    }),
  ],
  server: {
    proxy: {
      '/socket.io/': {
        target: 'ws://localhost:5000',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
      '/video/getToken': 'http://localhost:5000',
      '/video/api/url': 'http://localhost:5000',
    },
  },
});
