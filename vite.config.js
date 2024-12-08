import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      manifest: "manifest.webmanifest",
    }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      phaser: "/node_modules/phaser/dist/phaser.js",
    },
  },
});
