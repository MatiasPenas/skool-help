/**
 * Scrape Skool community about pages using Firecrawl.
 *
 * Usage:
 *   FIRECRAWL_API_KEY=fc-xxx npx tsx scripts/scrape-skool.ts <skool-url>
 *
 * Example:
 *   FIRECRAWL_API_KEY=fc-xxx npx tsx scripts/scrape-skool.ts https://www.skool.com/tom-bilyeu/about
 */

import { FirecrawlClient } from '@mendable/firecrawl-js';

const apiKey = process.env.FIRECRAWL_API_KEY;
if (!apiKey) {
  console.error('Error: FIRECRAWL_API_KEY environment variable is required.');
  console.error('Get your key at https://firecrawl.dev');
  process.exit(1);
}

const url = process.argv[2];
if (!url) {
  console.error('Usage: FIRECRAWL_API_KEY=fc-xxx npx tsx scripts/scrape-skool.ts <skool-about-url>');
  process.exit(1);
}

async function scrape() {
  const app = new FirecrawlClient({ apiKey });

  console.log(`Scraping: ${url}\n`);

  const result = await app.scrape(url, {
    formats: ['markdown'],
  });

  console.log('=== METADATA ===');
  console.log(JSON.stringify(result.metadata, null, 2));
  console.log('\n=== MARKDOWN CONTENT ===');
  console.log(result.markdown);
}

scrape().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
