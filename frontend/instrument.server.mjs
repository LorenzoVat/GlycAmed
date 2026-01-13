import * as Sentry from '@sentry/react-router';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: "https://6c717386c209eba1ea11ef36e57f6d11@o4510702502543360.ingest.de.sentry.io/4510702505951312",

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  profilesSampleRate: 1.0, // profile every transaction

  // Set up performance monitoring
  beforeSend(event) {
    // Filter out 404s from error reporting
    if (event.exception) {
      const error = event.exception.values?.[0];
      if (error?.type === "NotFoundException" || error?.value?.includes("404")) {
        return null;
      }
    }
    return event;
  },
});