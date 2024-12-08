import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/cmpm-121-final/', // Set the base path for your project
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Mining Simulator',
        short_name: 'MiningSim',
        description: 'A mining simulation game.',
        start_url: '/cmpm-121-final/index.html',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
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
  server: {
    fs: {
      allow: ['..']
    }
  },
  resolve: {
    alias: {
      'phaser': 'phaser/dist/phaser.js'
    }
  }
});