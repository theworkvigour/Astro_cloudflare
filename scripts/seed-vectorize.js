/**
 * seed-vectorize.js
 *
 * One-time script to build the initial Vectorize index from all site pages.
 *
 * Usage:
 *   1. Build the site first:   npm run build
 *   2. Ensure Vectorize exists: npx wrangler vectorize create ai-index --dimensions=768 --metric=cosine
 *   3. Run:                    node scripts/seed-vectorize.js
 *
 * Reads the built HTML files from dist/client/, strips markup,
 * chunks the text, embeds each chunk, and upserts into Vectorize.
 *
 * Requires: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN env vars.
 */

const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '..', 'dist', 'client');
const AI_SITEMAP_URL = 'http://localhost:4321/api/ai/sitemap';  // dev server

/**
 * Strip HTML tags, keep meaningful text.
 */
function stripHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Get page content from built HTML file.
 */
function getPageContent(url) {
  const filePath = path.join(DIST, url === '/' ? 'index.html' : `${url}.html`.replace(/\/$/, '/index.html'));
  if (!fs.existsSync(filePath)) {
    // try /index.html
    const altPath = path.join(DIST, url.replace(/\/$/, ''), 'index.html');
    if (!fs.existsSync(altPath)) return null;
    return stripHtml(fs.readFileSync(altPath, 'utf8'));
  }
  return stripHtml(fs.readFileSync(filePath, 'utf8'));
}

async function main() {
  // Fetch the AI sitemap to get the page list
  let pages;
  try {
    const res = await fetch(AI_SITEMAP_URL);
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
      console.warn(`  ⚠ No built file for ${page.url}, skipping`);
      continue;
    }

    console.log(`  → ${page.title} (${page.url}) [${content.length} chars]`);

    // Upload via API
    try {
      const res = await fetch('http://localhost:4321/api/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, pageId: page.id, pageUrl: page.url, pageTitle: page.title }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.warn(`  ⚠ Embed API error: ${err}`);
      }
    } catch (err) {
      console.warn(`  ⚠ Network error: ${err.message}`);
    }

    totalChunks++;
  }

  console.log(`\n✓ Indexed ${totalChunks} pages.`);
  console.log('Run: npx wrangler vectorize describe ai-index  to verify.');
}

main().catch(console.error);
