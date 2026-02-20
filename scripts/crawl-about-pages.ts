/**
 * Batch crawl Skool community about pages using Firecrawl.
 * Extracts community name, owner, avatar, and about page copy,
 * then appends results to src/data/about-page-examples.json.
 *
 * Usage:
 *   FIRECRAWL_API_KEY=fc-xxx npx tsx scripts/crawl-about-pages.ts <url1> <url2> ...
 *
 * Example:
 *   FIRECRAWL_API_KEY=fc-xxx npx tsx scripts/crawl-about-pages.ts \
 *     https://www.skool.com/some-community/about \
 *     https://www.skool.com/another-community/about
 */

import { FirecrawlClient } from '@mendable/firecrawl-js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

interface CommunityExample {
  communityName: string;
  ownerName: string;
  avatarUrl: string;
  skoolUrl: string;
  copy: string;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(__dirname, '../src/data/about-page-examples.json');

const apiKey = process.env.FIRECRAWL_API_KEY;
if (!apiKey) {
  console.error('Error: FIRECRAWL_API_KEY environment variable is required.');
  console.error('Get your key at https://firecrawl.dev');
  process.exit(1);
}

const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.error('Usage: FIRECRAWL_API_KEY=fc-xxx npx tsx scripts/crawl-about-pages.ts <url1> <url2> ...');
  process.exit(1);
}

function extractCommunityData(markdown: string, metadata: Record<string, unknown>, url: string): CommunityExample | null {
  // Extract community name from metadata title or og:title
  // Typical title format: "Community Name | Pair with description" or just "Community Name"
  const rawTitle = (metadata.title as string) || (metadata['og:title'] as string) || '';
  const communityName = rawTitle.split('|')[0].split(' - ')[0].trim();

  if (!communityName) {
    console.warn(`  Could not extract community name from: ${url}`);
    return null;
  }

  // Extract owner name from the markdown
  // Skool about pages typically show the owner/admin name near the top
  const ownerName = extractOwnerName(markdown, metadata);

  // Extract avatar URL from metadata or markdown
  const avatarUrl = extractAvatarUrl(markdown, metadata);

  // Extract the about page copy (main content)
  const copy = extractAboutCopy(markdown);

  if (!copy) {
    console.warn(`  Could not extract about page copy from: ${url}`);
    return null;
  }

  return {
    communityName,
    ownerName,
    avatarUrl,
    skoolUrl: url,
    copy,
  };
}

function extractOwnerName(markdown: string, metadata: Record<string, unknown>): string {
  // Try to find "by <Name>" or "Admin: <Name>" patterns in early content
  // Skool pages often have the admin name in the metadata or early in the markdown
  const byMatch = markdown.match(/(?:by|admin|created by|founder|owner)[:\s]+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z.]+)*)/i);
  if (byMatch) return byMatch[1].trim();

  // Check og:description or description metadata
  const desc = (metadata.description as string) || (metadata['og:description'] as string) || '';
  const descMatch = desc.match(/(?:by|from)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z.]+)*)/i);
  if (descMatch) return descMatch[1].trim();

  // Look for a name pattern near the top of the markdown (first 500 chars)
  const topContent = markdown.slice(0, 500);
  const nameMatch = topContent.match(/^#+\s*(.+)/m);
  if (nameMatch) {
    const possibleName = nameMatch[1].trim();
    // Only use if it looks like a person's name (2-3 words, starts with caps)
    if (/^[A-Z][a-z]+ [A-Z][a-z]+/.test(possibleName) && possibleName.split(' ').length <= 4) {
      return possibleName;
    }
  }

  return 'Unknown';
}

function extractAvatarUrl(markdown: string, metadata: Record<string, unknown>): string {
  // Look for Skool avatar URLs in the markdown
  const avatarMatch = markdown.match(/!\[.*?\]\((https:\/\/assets\.skool\.com\/f\/[^\s)]+)\)/);
  if (avatarMatch) return avatarMatch[1];

  // Check og:image
  const ogImage = metadata['og:image'] as string;
  if (ogImage && ogImage.includes('assets.skool.com')) return ogImage;

  return '';
}

function extractAboutCopy(markdown: string): string {
  // Remove navigation/header elements and extract the main about content
  let content = markdown;

  // Remove common Skool page chrome (nav links, buttons, etc.)
  // Lines that are just links or navigation
  content = content.replace(/^\[.*?\]\(.*?\)\s*$/gm, '');
  // Remove image markdown
  content = content.replace(/!\[.*?\]\(.*?\)/g, '');
  // Remove heading lines that look like navigation (short, generic)
  content = content.replace(/^#+\s*(Home|Community|Classroom|Calendar|Members|Leaderboards|About)\s*$/gm, '');
  // Remove "Join Group" / "Join" button text
  content = content.replace(/^.*Join\s*(Group|Now|Free).*$/gim, '');

  // Trim leading/trailing whitespace and collapse multiple newlines
  content = content.trim();
  content = content.replace(/\n{3,}/g, '\n\n');

  // Remove any remaining leading/trailing blank lines
  content = content.replace(/^\s*\n+/, '').replace(/\n+\s*$/, '');

  return content;
}

async function main() {
  const client = new FirecrawlClient({ apiKey });

  // Load existing data
  let existing: CommunityExample[] = [];
  try {
    existing = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    console.log('No existing data file found, starting fresh.');
  }

  const existingUrls = new Set(existing.map(e => e.skoolUrl));
  const newExamples: CommunityExample[] = [];

  for (const url of urls) {
    if (existingUrls.has(url)) {
      console.log(`Skipping (already exists): ${url}`);
      continue;
    }

    console.log(`Scraping: ${url}`);
    try {
      const result = await client.scrape(url, { formats: ['markdown'] });

      if (!result.markdown) {
        console.warn(`  No markdown content returned for: ${url}`);
        continue;
      }

      const data = extractCommunityData(result.markdown, result.metadata || {}, url);
      if (data) {
        newExamples.push(data);
        console.log(`  Extracted: ${data.communityName} by ${data.ownerName}`);
      }
    } catch (err) {
      console.error(`  Error scraping ${url}:`, err);
    }
  }

  if (newExamples.length === 0) {
    console.log('\nNo new examples to add.');
    return;
  }

  // Append new examples and write
  const combined = [...existing, ...newExamples];
  writeFileSync(DATA_FILE, JSON.stringify(combined, null, 2) + '\n');
  console.log(`\nAdded ${newExamples.length} new example(s). Total: ${combined.length}`);
  console.log('Data written to:', DATA_FILE);

  // Print the new entries for review
  console.log('\n=== NEW ENTRIES ===');
  for (const ex of newExamples) {
    console.log(`\n--- ${ex.communityName} ---`);
    console.log(`Owner: ${ex.ownerName}`);
    console.log(`Avatar: ${ex.avatarUrl || '(none)'}`);
    console.log(`URL: ${ex.skoolUrl}`);
    console.log(`Copy preview: ${ex.copy.slice(0, 100)}...`);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
