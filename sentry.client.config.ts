// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

// Sentry DSN is only set on mainnet production deployment and testnet production deployment
// For other environments, issues are logged to console and not sent to Sentry
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn:
    SENTRY_DSN ||
    'https://dab44a9ceb557a4232d628aae7a8801d@o4504299902468096.ingest.us.sentry.io/4508212988805120', // Default to mainnet production DSN if error

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  beforeSend: (event, hint) => {
    // Only send errors to Sentry in mainnet and testnet production
    if (process.env.VERCEL_ENV !== 'production') {
      console.error(hint.originalException || hint.syntheticException || event);
      return null; // this drops the event and nothing will be sent to sentry
    }
    return event;
  },
});
