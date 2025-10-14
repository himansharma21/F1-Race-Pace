import { defineConfig } from "vite";

export default defineConfig({
  base: "/", 
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts"
  }
});
