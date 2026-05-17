import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'ChuyenTinOJ',
        short_name: 'ChuyenTin',
        description: 'Personal competitive programming platform for Vietnamese students.',
        theme_color: '#0a0f1e',
        background_color: '#050810',
        display: 'standalone',
        start_url: '/chuyentinOJ/',
        scope: '/chuyentinOJ/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/data\/.*\.json$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'chuyentin-data',
              expiration: { maxEntries: 200 },
            },
          },
          {
            urlPattern: /\.(?:woff2?|ttf|eot)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'chuyentin-fonts',
              expiration: { maxEntries: 30 },
            },
          },
        ],
      },
    }),
  ],
  base: '/chuyentinOJ/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    sourcemap: false,
  },
})
