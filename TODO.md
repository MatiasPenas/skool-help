# SKOOL.HELP — To-Do List

## Content
- [ ] 1. Scrape meta ads and create a CSV (use Firecrawl pattern from scripts/crawl-about-pages.ts; save output to scripts/output/)
- [ ] 2. Delete all existing blog posts in src/content/blog/ and write 5 new ones — **[CLAUDE]**
- [ ] 3. Rewrite site copy/descriptions on each page (index, tools/index, communities, blog, each tool page) — **[CLAUDE]**

## Design / Assets
- [ ] 4. Create thumbnails for each tool (ads-calculator-premium, ads-calculator-freemium, about-page-copy, meta-ads, auto-dm) → save to public/assets/
- [x] 5. Create category icons for tool types: Calculators, Examples, Templates → SVG or PNG in public/icons/ — **[CLAUDE]**
- [ ] 6. Add more communities to /communities (update SKOOL_COMMUNITIES array in src/lib/constants.ts)

## UI / Navigation
- [x] 7. Redo navbar links (update NAV_ITEMS in src/lib/constants.ts and Header.astro) — **[CLAUDE]**
- [ ] 8. Remove "Communities for Skool Owners" tooltip on the homepage — **[CLAUDE]**

## Technical
- [ ] 9.  Remove Astro devtoolbar (add `devToolbar: { enabled: false }` to astro.config.mjs) — **[CLAUDE]**
- [ ] 10. Fix Astro devtool audit issues (review and resolve each flagged item) — **[CLAUDE]**
- [ ] 11. Check all pages for responsive layout issues (mobile, tablet, desktop)
- [ ] 12. Check site speed (Lighthouse audit; optimize images, lazy-load, etc.)
- [ ] 13. Set up GitHub repo (push codebase, configure remote)
- [ ] 14. Install Cloudflare Pages (connect repo, configure build: `npm run build`, output: `dist/`)
- [ ] 15. Install PostHog analytics (add snippet to BaseLayout.astro or use posthog-js npm package) — **[CLAUDE]**

## Security
- [x] 16. Add `.env` and `.env.*` to .gitignore (currently missing — Firecrawl key would be exposed if a .env is ever created) — **[CLAUDE]**
- [x] 17. Add `scripts/output/` to .gitignore (scraped data / CSVs should not be published) — **[CLAUDE]**
- [x] 18. Add `tech-spec.md` to .gitignore or delete it (leftover from a prior project, should not be published) — **[CLAUDE]**
- [x] 19. Do not publish `CLAUDE.md` — added to .gitignore
- [x] 20. Audit git history for any previously committed secrets — **clean**, only package-lock.json token package names found — **[CLAUDE]**
- [ ] 21. Confirm PostHog public API key (write-only, safe to expose) vs any server-side keys stay out of source

## SEO / Keyword Research
- [ ] 24. Set up DataForSEO for keyword volume data — sign up at dataforseo.com (free $1 credit on signup, ~20k keyword lookups), add `DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD` to `.env`, then Claude writes `scripts/kw-research.ts` to pull search volume/CPC/competition into `scripts/output/kw-data.csv` — **[CLAUDE]** (after you provide credentials)

## SEO
- [ ] 23. Audit SEO on all pages: title tags, meta descriptions, OG tags (og:image, og:type, og:url), Twitter card tags, canonical URLs — **[CLAUDE]**

## Manual
- [ ] 22. Join "Grow with Evelyn" Skool community and get referral link → add to SKOOL_COMMUNITIES in src/lib/constants.ts
