import path from "path";
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});