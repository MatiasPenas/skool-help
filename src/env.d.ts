/// <reference types="astro/client" />

interface PostHogInstance {
  capture: (event: string, properties?: Record<string, unknown>) => void;
  identify: (distinctId: string, properties?: Record<string, unknown>) => void;
  reset: () => void;
  captureException: (error: unknown, properties?: Record<string, unknown>) => void;
  init: (apiKey: string, options?: Record<string, unknown>) => void;
}

interface Window {
  posthog?: PostHogInstance;
}
