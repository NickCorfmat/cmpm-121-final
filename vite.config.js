import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/cmpm-121-final/",
  plugins: [
    VitePWA({
      manifest: "/manifest.webmanifest",
    }),
  ],
  server: {
    port: 3000,
  },
});
