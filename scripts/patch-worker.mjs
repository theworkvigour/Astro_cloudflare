import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENTRY_PATH = path.resolve(__dirname, '../dist/server/entry.mjs');

// Language subdomain map (same as workers/subdomain-router.js)
const LANG_MAP = {
  de: 'de', fr: 'fr', es: 'es', pt: 'pt',
  it: 'it', pl: 'pl', ru: 'ru', ja: 'ja', ko: 'ko',
  ar: 'ar', zh: 'zh',
};

// Routes that exist under [lang]/ and should get /{lang}/ prefix
const LANG_PREFIX_ROUTES = [
  '', 'faq', 'guides', 'use-cases', 'products', 'compare',
  'geo-report', 'llms.txt', 'sitemap.xml', 'v2',
];

// Static asset extensions to proxy without lang prefix
const STATIC_ASSET_RE = /\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|eot|json|xml|mp4|webm)$/i;

const PREFIX_CODE = `
// --- Injected subdomain router (single Worker mode) ---
const LANG_MAP = ${JSON.stringify(LANG_MAP)};
const LANG_PREFIX_ROUTES = new Set(${JSON.stringify(LANG_PREFIX_ROUTES)});
const STATIC_ASSET_RE = ${STATIC_ASSET_RE};

const origFetch = (w.fetch || w).bind(w || globalThis);

w.fetch = async function(request, env, context) {
  const url = new URL(request.url);
  const host = url.hostname;
  const parts = host.split('.');
  const subdomain = parts[0];
  const lang = LANG_MAP[subdomain];

  // www redirect
  if (subdomain === 'www') {
    url.hostname = host.replace('www.', '');
    return Response.redirect(url.toString(), 301);
  }

  // Subdomain routing: {locale}.example.com
  if (parts.length >= 3 && lang) {
    let path = url.pathname;

    // Static assets — proxy without lang prefix
    if (STATIC_ASSET_RE.test(path)) {
      url.hostname = host.replace(subdomain + '.', '');
      return origFetch(new Request(url.toString(), request), env, context);
    }

    // Strip existing lang prefix (e.g. /de/products/ from nav click)
    let firstSegment = path.split('/')[1] || '';
    if (firstSegment === lang) {
      path = '/' + path.split('/').slice(2).join('/');
      firstSegment = path.split('/')[1] || '';
    }

    if (LANG_PREFIX_ROUTES.has(firstSegment)) {
      const rest = path === '/' ? '' : path;
      url.pathname = '/' + lang + rest;
    }

    url.hostname = host.replace(subdomain + '.', '');

    const headers = new Headers(request.headers);
    headers.set('X-Original-Lang', lang);

    return origFetch(new Request(url.toString(), { method: request.method, headers, body: request.body }), env, context);
  }

  return origFetch(request, env, context);
};
// --- End of injected subdomain router ---
`;

// Read generated entry.mjs
let content = fs.readFileSync(ENTRY_PATH, 'utf8');

// Insert routing logic after imports but before export
const exportMatch = content.match(/\nexport\s*\{/);
if (!exportMatch) {
  console.error('ERROR: Could not find export statement in entry.mjs');
  process.exit(1);
}

const insertPos = exportMatch.index;
content = content.slice(0, insertPos) + PREFIX_CODE + '\n' + content.slice(insertPos);

fs.writeFileSync(ENTRY_PATH, content, 'utf8');
console.log('✓ Injected subdomain router into dist/server/entry.mjs');
