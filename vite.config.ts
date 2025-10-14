import { defineConfig } from "vite";

export default defineConfig({
  base: "F1-Race-Pace", 
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts"
  }
});
