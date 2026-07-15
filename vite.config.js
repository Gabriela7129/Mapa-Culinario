import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Mapa Culinário',
        short_name: 'MapaCulinario',
        description: 'Seu mapa pessoal de restaurantes e eventos culturais',
        theme_color: '#D4A574',
        background_color: '#FAF7F2',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/tile\.openstreetmap\.org/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles',
              expiration: { maxEntries: 1000, maxAgeSeconds: 86400 * 30 }
            }
          }
        ]
      }
    })
  ],
  base: '/Mapa-Culinario/'
})
