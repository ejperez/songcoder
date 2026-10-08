import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "frontend",
  base: "/songcoder/",
  plugins: [tailwindcss(), react()],
  build: {
    outDir: "../frontend/dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "frontend/index.html"),
        syntax: resolve(import.meta.dirname, "frontend/syntax.html"),
      },
    },
  },
});
