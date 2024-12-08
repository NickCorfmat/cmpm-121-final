import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      manifest: {
        name: "Mining Simulator",
        short_name: "Mining",
        description: "A mining simulator built using Phaser 3",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/index.html",
        icons: [
          {
            src: "icons/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
          },
          {
            src: "icons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icons/favicon-32x32.png",
            sizes: "32x32",
            type: "image/png",
          },
          {
            src: "icons/favicon-16x16.png",
            sizes: "16x16",
            type: "image/png",
          },
          {
            src: "icons/favicon.ico",
            sizes: "any",
            type: "image/x-icon",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return url.pathname.startsWith("./api");
            },
            handler: "CacheFirst",
            options: {
              cacheName: "api-cache",
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
  },
});
