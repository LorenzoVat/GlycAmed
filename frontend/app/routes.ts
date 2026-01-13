import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("add", "routes/add-consumption.tsx"),
  route("history", "routes/history.tsx"),
  route("profile", "routes/profile.tsx"),
  route("alerts", "routes/alerts.tsx"),
  route("statistics", "routes/statistics.tsx"),
  route("leaderboard", "routes/leaderboard.tsx"),
  route("/sentry-example-page", "routes/sentry-example-page.tsx"),
  route("/api/sentry-example-api", "routes/api.sentry-example-api.ts")
] satisfies RouteConfig;