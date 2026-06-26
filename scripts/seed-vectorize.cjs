/**
 * seed-vectorize.js
 * Build the initial Vectorize index from all site pages.
 *
 * Chunks each page, embeds via Workers AI REST API, upserts to Vectorize.
 *
 * Usage:
 *   1. Build:            npm run build
 *   2. Create index:     npx wrangler vectorize create ai-index --dimensions=768 --metric=cosine
 *   3. Seed:             node scripts/seed-vectorize.js
 *
 * Requires CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN env vars.
 * (OAuth token from `npx wrangler login` works as API_TOKEN.)
 */

const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '..', 'dist', 'client');
const INDEX_NAME = process.env.INDEX_NAME || 'ai-index';

const CF_API = (accountId, path) =>
  `https://api.cloudflare.com/client/v4/accounts/${accountId}/${path}`;

const VECTORIZE_UPSERT = accountId =>
  CF_API(accountId, `vectorize/v2/indexes/${INDEX_NAME}/upsert`);

const WORKERS_AI_EMBED = accountId =>
  CF_API(accountId, 'ai/run/@cf/baai/bge-base-en-v1.5');

function stripHtml(html) {
  let sanitized = html;
  let previous;

  do {
    previous = sanitized;
    sanitized = sanitized.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  } while (sanitized !== previous);

  do {
    previous = sanitized;
    sanitized = sanitized.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  } while (sanitized !== previous);

  return sanitized
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

function chunkText(text, maxLen = 400, overlap = 50) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + maxLen, text.length);
    chunks.push(text.slice(i, end));
    i += maxLen - overlap;
  }
  return chunks;
}

async function main() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    console.error('CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required');
    process.exit(1);
  }

  // Hardcoded sitemap (matches src/pages/api/ai/sitemap.ts)
  const pages = [
    { id: 'home', url: '/', title: 'Wavefella — Premium Inflatables', type: 'page', section: 'main' },
    { id: 'about', url: '/about', title: 'About Wavefella', type: 'page', section: 'main' },
    { id: 'services', url: '/services', title: 'Services', type: 'page', section: 'main' },
    { id: 'pricing', url: '/pricing', title: 'Pricing', type: 'page', section: 'main' },
    { id: 'contact', url: '/contact', title: 'Contact', type: 'page', section: 'main' },
    { id: 'products', url: '/products', title: 'Products Overview', type: 'product', section: 'products' },
    { id: 'product-rib-330', url: '/products/rib-330', title: 'RIB 330', type: 'product', section: 'products' },
    { id: 'product-rib-450-patrol', url: '/products/rib-450-patrol', title: 'RIB 450 Patrol', type: 'product', section: 'products' },
    { id: 'product-airdeck-270', url: '/products/airdeck-270', title: 'AirDeck 270', type: 'product', section: 'products' },
    { id: 'product-airdeck-360', url: '/products/airdeck-360', title: 'AirDeck 360', type: 'product', section: 'products' },
    { id: 'product-oars-pump-set', url: '/products/oars-pump-set', title: 'Oars & Pump Set', type: 'product', section: 'products' },
    { id: 'randd', url: '/randdcenter', title: 'R&D Center', type: 'technology', section: 'randd' },
    { id: 'randd-pvc-fabric', url: '/randdcenter/pvc-fabric-lab', title: 'PVC Fabric Lab', type: 'technology', section: 'randd' },
    { id: 'randd-hull-engineering', url: '/randdcenter/hull-engineering', title: 'Hull Engineering Studio', type: 'technology', section: 'randd' },
    { id: 'randd-rf-welding', url: '/randdcenter/rf-welding', title: 'RF Welding Center', type: 'technology', section: 'randd' },
    { id: 'randd-prototype', url: '/randdcenter/prototype-workshop', title: 'Prototype Workshop', type: 'technology', section: 'randd' },
    { id: 'randd-hydrodynamic', url: '/randdcenter/hydrodynamic-test-tank', title: 'Hydrodynamic Test Tank', type: 'technology', section: 'randd' },
    { id: 'randd-quality', url: '/randdcenter/quality-inspection-lab', title: 'Quality & Inspection Lab', type: 'technology', section: 'randd' },
    { id: 'privacy', url: '/privacy', title: 'Privacy Policy', type: 'page', section: 'legal' },
    { id: 'terms', url: '/terms', title: 'Terms and Conditions', type: 'page', section: 'legal' },
    { id: 'disclaimer', url: '/disclaimer', title: 'Disclaimer', type: 'page', section: 'legal' },
  ];

  console.log(`Found ${pages.length} pages to index.`);

  let totalChunks = 0;
  let inserted = 0;
  const batchSize = 50;

  for (const page of pages) {
    const content = getPageContent(page.url);
    if (!content) {
      console.warn(`  ✗ ${page.title} — no built file`);
      continue;
    }

    const chunks = chunkText(content, 400, 50);
    console.log(`  ${page.title} (${page.url}) → ${chunks.length} chunks`);

    const vectors = [];

    const productAttrs = {
      'products': { category: 'overview', attributes: {}, safety: '' },
      'product-rib-330': { category: 'RIB', attributes: { stability: 'high', usage: ['coastal', 'transport', 'commercial'], skill_level: 'advanced' }, safety: 'life vests required, capacity 4 persons' },
      'product-rib-450-patrol': { category: 'RIB', attributes: { stability: 'high', usage: ['coastal', 'patrol', 'rescue'], skill_level: 'professional' }, safety: 'life vests required, capacity 6 persons, emergency equipment recommended' },
      'product-airdeck-270': { category: 'Dinghy', attributes: { stability: 'medium', usage: ['lake', 'river', 'fishing'], skill_level: 'beginner' }, safety: 'life vests recommended, max 3 persons' },
      'product-airdeck-360': { category: 'Dinghy', attributes: { stability: 'medium', usage: ['lake', 'coastal', 'family'], skill_level: 'beginner' }, safety: 'life vests recommended, max 5 persons' },
      'product-oars-pump-set': { category: 'Accessory', attributes: { usage: ['all'] }, safety: '' },
    };

    // SSOT product attributes from src/data/products.ts
    const ssotProducts = {
      'sup-explorer-11': { category: 'SUP', attributes: { stability: 'high', usage: ['lake', 'sea'], skill_level: 'beginner' }, safety: 'life vest recommended, leash required' },
      'sup-tour-12': { category: 'SUP', attributes: { stability: 'medium', usage: ['lake', 'sea', 'river'], skill_level: 'intermediate' }, safety: 'life vest recommended, leash required' },
      'kayak-lite': { category: 'KAYAK', attributes: { stability: 'medium', usage: ['river', 'lake'], skill_level: 'beginner' }, safety: 'life vest required' },
      'kayak-tandem': { category: 'KAYAK', attributes: { stability: 'medium', usage: ['lake', 'coastal'], skill_level: 'beginner' }, safety: 'life vest required' },
      'life-vest-classic': { category: 'SAFETY', attributes: { usage: ['all'] }, safety: 'CE certified, ISO 12402' },
      'life-vest-pro': { category: 'SAFETY', attributes: { usage: ['all'] }, safety: 'CE certified, ISO 12402, SOLAS compliant' },
      'paddle-carbon': { category: 'ACCESSORY', attributes: { usage: ['all'] }, safety: '' },
      'pump-dual': { category: 'ACCESSORY', attributes: { usage: ['all'] }, safety: '' },
    };

    const pAttr = productAttrs[page.id] || ssotProducts[page.id] || {};

    for (const [i, chunk] of chunks.entries()) {
      try {
        const res = await fetch(WORKERS_AI_EMBED(accountId), {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: [chunk] }),
        });
        if (!res.ok) {
          console.warn(`    chunk ${i} embed error: ${await res.text()}`);
          continue;
        }
        const data = await res.json();
        if (!data.success || !data.result?.data?.[0]) {
          console.warn(`    chunk ${i}: empty vector`);
          continue;
        }
        const vector = data.result.data[0];
        vectors.push({
          id: `${page.id}-${i}`,
          values: vector,
          metadata: {
            text: chunk.slice(0, 500),
            url: page.url,
            title: page.title,
            type: page.type || 'page',
            section: page.section || 'main',
            ...(pAttr.category ? { category: pAttr.category } : {}),
            ...(pAttr.attributes && Object.keys(pAttr.attributes).length ? { attributes: JSON.stringify(pAttr.attributes) } : {}),
            ...(pAttr.safety ? { safety: pAttr.safety } : {}),
          },
        });
        totalChunks++;
      } catch (err) {
        console.warn(`    chunk ${i} network error: ${err.message}`);
        continue;
      }

      if (vectors.length >= batchSize) {
        await upsertBatch(vectors, accountId, apiToken);
        inserted += vectors.length;
        vectors.length = 0;
      }
    }

    if (vectors.length > 0) {
      await upsertBatch(vectors, accountId, apiToken);
      inserted += vectors.length;
    }
  }

  console.log(`\nDone. ${totalChunks} chunks embedded, ${inserted} upserted.`);
  console.log(`Verify: npx wrangler vectorize describe ${INDEX_NAME}`);
}

async function upsertBatch(vectors, accountId, apiToken) {
  const res = await fetch(VECTORIZE_UPSERT(accountId), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ vectors }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`  Upsert error: ${text}`);
    throw new Error(`Upsert failed: ${res.status}`);
  }
  const data = await res.json();
  if (!data.success) {
    console.error(`  Upsert API error: ${JSON.stringify(data.errors)}`);
    throw new Error('Upsert API failed');
  }
  process.stdout.write(`  ✓ upserted ${vectors.length} vectors\n`);
}

main().catch(console.error);
