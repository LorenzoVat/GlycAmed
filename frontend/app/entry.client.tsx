import * as Sentry from "@sentry/react-router";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

Sentry.init({
  dsn: "https://6c717386c209eba1ea11ef36e57f6d11@o4510702502543360.ingest.de.sentry.io/4510702505951312",
  sendDefaultPii: true,
  integrations: [Sentry.reactRouterTracingIntegration()],
  enableLogs: true,
  tracesSampleRate: 1.0,
  tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});