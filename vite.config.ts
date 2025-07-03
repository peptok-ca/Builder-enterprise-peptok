import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    // Only allow TypeScript and TSX files
    include: /\.(ts|tsx)$/,
    // Exclude JavaScript files to enforce TypeScript-only
    exclude: /\.(js|jsx)$/,
  },
  build: {
    // Strict TypeScript checking during build
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
    // Enforce smaller chunks for better performance
    chunkSizeWarningLimit: 1000,
  },
}));
