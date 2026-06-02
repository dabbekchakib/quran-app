import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.svg'],
      manifest: {
        name: 'Quran',
        short_name: 'Quran',
        description: 'اقرأ واستمع إلى القرآن الكريم',
        theme_color: '#0F766E',
        background_color: '#0F172A',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'ar',
        dir: 'rtl',
        icons: [
          { src: 'icons/icon-72x72.svg', sizes: '72x72', type: 'image/svg+xml' },
          { src: 'icons/icon-96x96.svg', sizes: '96x96', type: 'image/svg+xml' },
          { src: 'icons/icon-128x128.svg', sizes: '128x128', type: 'image/svg+xml' },
          { src: 'icons/icon-144x144.svg', sizes: '144x144', type: 'image/svg+xml' },
          { src: 'icons/icon-152x152.svg', sizes: '152x152', type: 'image/svg+xml' },
          { src: 'icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'icons/icon-384x384.svg', sizes: '384x384', type: 'image/svg+xml' },
          { src: 'icons/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.alquran\.cloud\/v1\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'quran-api-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /^https:\/\/cdn\.islamic\.network\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'quran-audio-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
})
