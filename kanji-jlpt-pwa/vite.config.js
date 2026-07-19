import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Konfigurasi Vite untuk Kanji JLPT PWA
// - React plugin untuk JSX
// - VitePWA untuk generate manifest.json + service worker otomatis (Workbox)
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // service worker auto update saat ada versi baru
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Kanji JLPT N5 N4 - Belajar Kanji',
        short_name: 'Kanji JLPT',
        description: 'Aplikasi belajar & menghafal Kanji JLPT N5 dan N4 dengan flashcard, quiz, dan progress tracking.',
        theme_color: '#2563EB',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'id',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // Cache app shell + data kanji supaya bisa dipakai offline
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}'],
        runtimeCaching: [
          {
            // Cache respons API kanji (Cloudflare Worker) - stale-while-revalidate
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'kanji-api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            urlPattern: ({ request }) => request.destination === 'font',
            handler: 'CacheFirst',
            options: { cacheName: 'font-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } }
          }
        ]
      },
      devOptions: { enabled: true }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      // Saat development, arahkan /api ke wrangler dev (worker) di port 8787
      '/api': { target: 'http://127.0.0.1:8787', changeOrigin: true }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
