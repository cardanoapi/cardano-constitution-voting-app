// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

// Sentry DSN is only set on mainnet production deployment and testnet production deployment
// For other environments, issues are logged to console and not sent to Sentry
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn:
    SENTRY_DSN ||
    'https://dab44a9ceb557a4232d628aae7a8801d@o4504299902468096.ingest.us.sentry.io/4508212988805120', // Default to mainnet production DSN if error

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

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
