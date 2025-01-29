import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "docs", // to easily publish on GH pages
  },
  plugins: [svelte()],
});
