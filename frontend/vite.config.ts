import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/user": "http://backend:3000",
      "/product": "http://backend:3000",
      "/consumption": "http://backend:3000",
      "/dashboard": "http://backend:3000",
      "/alert": "http://backend:3000",
    },
  },
});