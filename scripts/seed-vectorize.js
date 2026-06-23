/**
 * seed-vectorize.js
 * One-time script to build the initial Vectorize index from all site pages.
 *
 * Usage:
 *   1. Build the site:                  npm run build
 *   2. Create Vectorize index:          npx wrangler vectorize create ai-index --dimensions=1536 --metric=cosine
 *   3. Start dev server:                npm run dev
 *   4. Run:                             node scripts/seed-vectorize.js
 *
 * Requires: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN env vars for direct API mode.
 * Otherwise runs against the local dev server (default).
 */

const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '..', 'dist', 'client');
const DEV_SERVER = process.env.DEV_SERVER || 'http://localhost:4321';

function stripHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getPageContent(url) {
  const filePath = path.join(DIST, url === '/' ? 'index.html' : `${url}.html`.replace(/\/$/, '/index.html'));
  if (fs.existsSync(filePath)) return stripHtml(fs.readFileSync(filePath, 'utf8'));
  const altPath = path.join(DIST, url.replace(/\/$/, ''), 'index.html');
  if (fs.existsSync(altPath)) return stripHtml(fs.readFileSync(altPath, 'utf8'));
  return null;
}

async function main() {
  let pages;
  try {
    const res = await fetch(`${DEV_SERVER}/api/ai/sitemap`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    pages = data.pages;
  } catch (err) {
    console.error('Failed to fetch AI sitemap. Start the dev server first: npm run dev');
    console.error('Error:', err.message);
    process.exit(1);
  }

  console.log(`Found ${pages.length} pages to index.`);

  let totalChunks = 0;
  for (const page of pages) {
    const content = getPageContent(page.url);
    if (!content) {
      console.warn(`  Skipping ${page.url} (no built file)`);
      continue;
    }
    console.log(`  Indexing ${page.title} (${page.url}) [${content.length} chars]`);

    try {
      const res = await fetch(`${DEV_SERVER}/api/embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.warn(`  Embed API error: ${err}`);
        continue;
      }
    } catch (err) {
      console.warn(`  Network error: ${err.message}`);
      continue;
    }
    totalChunks++;
  }

  console.log(`\nDone. Indexed ${totalChunks} pages.`);
  console.log('Verify: npx wrangler vectorize describe ai-index');
}

main().catch(console.error);
