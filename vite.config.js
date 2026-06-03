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
      includeAssets: ['quranLogo.png', 'icons/*.png'],
      manifest: {
        name: 'Quran',
        short_name: 'Quran',
        description: 'اقرأ واستمع إلى القرآن الكريم',
        theme_color: '#1A8579',
        background_color: '#1A8579',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'ar',
        dir: 'rtl',
        icons: [
          { src: 'icons/icon-72x72.png', sizes: '72x72', type: 'image/png' },
          { src: 'icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
          { src: 'icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
          { src: 'icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: 'icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
          { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
          { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
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
            urlPattern: /^https:\/\/khorasan\.mamluk\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'quran-audio-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
              fetchOptions: { mode: 'no-cors' },
            },
          },
          {
            urlPattern: /^https:\/\/cdn\.islamic\.network\/quran\/audio\/128\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'quran-verse-audio-cache',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 365 },
              fetchOptions: { mode: 'no-cors' },
            },
          },
        ],
      },
    }),
  ],
})
