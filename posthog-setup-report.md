<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into SKOOL.HELP. The existing PostHog snippet in `BaseLayout.astro` was replaced with a proper reusable component (`src/components/posthog.astro`) that reads the API key and host from environment variables via Astro's `define:vars` directive, eliminating the hardcoded placeholder key. TypeScript type declarations for `window.posthog` were added via `src/env.d.ts`. Eight business-critical events were instrumented across six files, covering calculator engagement, swipe file usage, affiliate clicks, and CTA conversions. The build passes cleanly with zero errors.

| Event | Description | File |
|---|---|---|
| `calculator_used` | Fired when a user changes any input or applies a scenario preset on the premium calculator. Includes all current input values as properties. | `src/components/calculator/InputPanel.tsx` |
| `calculator_shared` | Fired when a user copies the share link for the premium calculator. | `src/components/calculator/InputPanel.tsx` |
| `freemium_calculator_used` | Fired when a user changes any input or applies a preset on the freemium calculator. Includes all current inputs including conversion rate. | `src/components/calculator/freemium/FreemiumInputPanel.tsx` |
| `freemium_calculator_shared` | Fired when a user copies the share link for the freemium calculator. | `src/components/calculator/freemium/FreemiumInputPanel.tsx` |
| `swipe_file_copied` | Fired when a user copies a Meta ad, about page copy, or DM template. Includes `swipe_file_type` to distinguish sources. | `src/components/examples/MetaAdsExamples.tsx`, `src/components/examples/AboutPageExamples.tsx`, `src/components/examples/WelcomeMessageExamples.tsx` |
| `dm_template_filter_changed` | Fired when a user applies a category or length filter on the DM templates page. Shows how users navigate the template library. | `src/components/examples/WelcomeMessageExamples.tsx` |
| `community_link_clicked` | Fired when a user clicks a Skool community affiliate link. Includes `community_name` for per-community breakdown. | `src/pages/communities.astro` |
| `tool_cta_clicked` | Fired when a user clicks the "Join Skool" affiliate CTA in the calculator. Key conversion event. | `src/components/calculator/CtaSection.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics](https://eu.posthog.com/project/129500/dashboard/534828)
- **Insight:** [Calculator Usage (Daily Active Users)](https://eu.posthog.com/project/129500/insights/Rk6wG6fA) — daily unique users on each calculator
- **Insight:** [Swipe File Copies by Tool](https://eu.posthog.com/project/129500/insights/vdvHz2WK) — which swipe file tools get the most engagement
- **Insight:** [Calculator to Skool CTA Funnel](https://eu.posthog.com/project/129500/insights/IOVUUD3D) — how many calculator users click the affiliate CTA
- **Insight:** [Community Affiliate Link Clicks](https://eu.posthog.com/project/129500/insights/MaxDvMHU) — affiliate clicks by community name
- **Insight:** [Calculator Shares](https://eu.posthog.com/project/129500/insights/ByrJZbMJ) — users sharing calculator URLs

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
