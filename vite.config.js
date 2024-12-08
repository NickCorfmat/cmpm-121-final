import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/cmpm-121-final/', // Add this line to set the base path for your project
  server: {
    port: 3000,
    fs: {
      allow: ['..']
    }
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Mining Simulator',
        short_name: 'MiningSim',
        description: 'A mining simulation game.',
        start_url: '/index.html',
        display: 'standalone',
        theme_color: '#000000',
        background_color: '#000000',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      'phaser': 'phaser/dist/phaser.js'
    }
  }
});
