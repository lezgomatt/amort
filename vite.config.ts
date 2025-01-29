import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig({
  base: "./", // Make it relative so it'll load on GH Pages
  build: {
    outDir: "docs", // to easily publish on GH Pages
  },
  plugins: [svelte()],
});
