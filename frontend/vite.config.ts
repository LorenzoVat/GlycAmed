import { sentryReactRouter } from "@sentry/react-router";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig((config) => ({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    sentryReactRouter(
      {
        org: "lorencompany",
        project: "glycamed",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
      config
    ),
  ],

  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": "http://backend:3000",
    },
  },

  resolve: {
    dedupe: ["react", "react-dom"],
  },
}));