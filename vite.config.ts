import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.mp4'],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "client", "src", "assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  base: "./",
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, "client", "index.html"),
        // Standalone fullscreen GPU demo; served with COOP/COEP so SharedArrayBuffer is available.
        "crystal-tunnel": path.resolve(import.meta.dirname, "client", "crystal-tunnel", "index.html"),
      },
    },
  },
  worker: {
    format: "es",
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
