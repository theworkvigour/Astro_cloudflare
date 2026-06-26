# AstroCloudflare — Wavefella Multilingual Platform

Multilingual (12 languages) water sports equipment site for **Wavefella**, built on [Astro v6](https://astro.build) with hybrid SSG/SSR, deployed to a **single Cloudflare Worker**.

**Domains:** `alluredna.com` (production), `wavefella-{locale}.theworkvigo.workers.dev` (CI preview)

---

## 1. Architecture Overview

```
┌───────────────────────────────────────────────────────┐
│           Single Cloudflare Worker (wavefella)        │
│                                                       │
│  Request → subdomain routing (built into Worker)      │
│              ↓                                        │
│  {locale}.alluredna.com/{path}                        │
│              ↓                                        │
│  alluredna.com/{lang}/{path}  (internal rewrite)      │
│  + X-Original-Lang header for SSR pages               │
│              ↓                                        │
│  Astro handler serves:                                │
│    - SSG: /{lang}/products/* (pre-rendered HTML)      │
│    - SSR: /about, /contact, /news, /keystatic         │
│    - API: /api/ask, /api/chat, /api/contact           │
└───────────────────────────────────────────────────────┘
```

Subdomain routing logic is injected into the built Worker by `scripts/patch-worker.mjs` during the `npm run build` step. No separate subdomain-router Worker is needed.

### Build Modes

| Output | Mode | Files |
|--------|------|-------|
| `dist/client/` | Static (SSG) | All `[lang]/` pages, assets |
| `dist/server/` | Server (SSR) | Worker entrypoint with subdomain routing injected |

---

## 2. Directory Structure

```
Astro_cloudflare/
├── src/
│   ├── pages/
│   │   ├── [lang]/                  Localized pages (12 languages)
│   │   │   ├── index.astro           Homepage
│   │   │   ├── faq.astro
│   │   │   ├── geo-report.astro
│   │   │   ├── products/index.astro  Product catalog
│   │   │   ├── products/[slug].astro Product detail
│   │   │   ├── v2/index.astro        V2 library
│   │   │   ├── v2/[slug].astro       V2 article
│   │   │   ├── guides/index.astro    Guides listing
│   │   │   ├── guides/[slug].astro   Guide detail
│   │   │   ├── guides/*.astro        Static guides
│   │   │   ├── use-cases/[slug].astro
│   │   │   ├── compare/[slug].astro
│   │   │   └── ... (static articles)
│   │   ├── about.astro               SSR — uses X-Original-Lang
│   │   ├── contact.astro             SSR — uses X-Original-Lang
│   │   ├── news/                     SSR — uses X-Original-Lang
│   │   ├── keystatic/                Admin panel (protected)
│   │   ├── api/                      API routes
│   │   └── ... (brand, safety, technology, etc.)
│   ├── i18n/
│   │   ├── config.ts                 Translation keys (12 languages)
│   │   ├── utils.ts                  getLangFromUrl, removeLang, localizePath
│   │   └── page-content.ts           getPageContent() for YAML data
│   ├── middleware.ts                 Auth, locale detection, geo API protection
│   ├── navigation.ts                 Header/footer nav structure
│   ├── components/
│   │   └── widgets/
│   │       ├── Header.astro          Nav bar with i18n link localization
│   │       └── Footer.astro          Footer with i18n link localization
│   ├── data/
│   │   ├── site/                     YAML: navigation, branding, languages
│   │   ├── pages/                    YAML: home, about, news, contact per locale
│   │   ├── products.ts               SSOT product definitions
│   │   └── post/                     Blog posts (.md/.mdx)
│   ├── lib/                          Utilities (auth, geo, SEO, contact, etc.)
│   ├── layouts/                      Layout.astro, PageLayout.astro
│   ├── assets/                       Tailwind CSS, favicons
│   └── config.yaml                   Site configuration
├── scripts/
│   ├── geo-build.mjs                 GEO/AI build pipeline
│   ├── patch-worker.mjs              Injects subdomain routing into built Worker
│   └── fix-favicons.ps1              Fixes favicon files for CI (Windows only)
├── astro.config.ts                   Astro config + Vite plugins
├── wrangler.toml                     Cloudflare Workers config (local dev)
├── middleware.ts                     See src/middleware.ts
├── keystatic.config.ts               Keystatic admin config
└── .github/workflows/actions.yaml    CI/CD pipeline
```

---

## 3. Routing System

### 3.1 Path-based i18n (SSG pages)

Pages under `src/pages/[lang]/` auto-generate for all 12 languages at `/{lang}/...`.

**Example routes:**
- `/fr/products/sup-explorer-11`
- `/de/guides`
- `/ja/faq`

The `[lang]` directory is a dynamic Astro route parameter. Each page reads `Astro.params.lang` or calls `getLangFromUrl(Astro.url)` to determine the locale.

### 3.2 Subdomain Router (production, built into Worker)

The subdomain routing logic is injected into the built Worker by `scripts/patch-worker.mjs` during `npm run build`. No separate Worker is needed.

Logic (equivalent to the now-removed `workers/subdomain-router.js`):

| Subdomain | Rewrite to | Header |
|-----------|-----------|--------|
| `fr.alluredna.com/products` | `alluredna.com/fr/products` | `X-Original-Lang: fr` |
| `de.alluredna.com/` | `alluredna.com/de/` | `X-Original-Lang: de` |
| `de.alluredna.com/about` | `alluredna.com/about` | `X-Original-Lang: de` |
| `www.alluredna.com/*` | `alluredna.com/*` (301) | — |

**Route matching logic:**
```
if (first segment matches LANG_PREFIX_ROUTES) → add /{lang}/ prefix
else → proxy as-is (SSR pages handle via X-Original-Lang header)
```

**LANG_PREFIX_ROUTES:** `['', 'faq', 'guides', 'use-cases', 'products', 'compare', 'geo-report', 'llms.txt', 'sitemap.xml', 'v2']`

The router also strips duplicate `/{lang}/` prefixes (e.g. if a nav link already has `/de/products/`, it normalizes to `/products/` before re-adding `/de/`).

### 3.3 Middleware (localhost)

File: `src/middleware.ts`

On localhost (`localhost:4321`), the middleware performs locale detection and redirects:

```
Visitor at /products
  ├── Cookie "x-user-locale=fr" exists → redirect /fr/products
  ├── Geo-IP + Accept-Language → de   → redirect /de/products
  └── Default (en)                     → serve /products (English)
```

**Locale priority:** `Cookie → Geo-IP + Accept-Language → English (default)`

**Excluded from i18n:** `/api`, `/keystatic`, `/admin`, `/login`, `/internal`, `/images`, `/assets`, `/favicon`, and any URL with a file extension.

### 3.4 SSR Pages (About, Contact, News, Keystatic)

These pages have `prerender = false`. They detect language via:

```typescript
const xLang = Astro.request.headers.get('X-Original-Lang') || '';
const lang = xLang || detectFromAcceptLanguage() || 'en';
```

In production, the subdomain router sets `X-Original-Lang`. On localhost, the header is absent, so they fall back to `Accept-Language` header.

### 3.5 Navigation Link Localization

`Header.astro` and `Footer.astro` auto-localize nav links via `localizeHref()`:

```typescript
const LOCALIZED_ROUTES = new Set([
  '/products', '/guides', '/faq', '/v2',
  '/use-cases', '/compare', '/geo-report'
]);
const NON_LOCALIZED_ROUTES = new Set(['/products/compare']);

function localizeHref(href, locale) {
  if (locale === 'en' || !href.startsWith('/')) return href;
  const base = href.split('?')[0];
  if (base === '/' || NON_LOCALIZED_ROUTES.has(base)) return href;
  if (LOCALIZED_ROUTES.some(r => base === r || base.startsWith(r + '/'))) {
    return '/' + locale + href;
  }
  return href;
}
```

- English users: links stay as-is (`/products`)
- Non-English users with known routes: prefixed (`/fr/products`)
- Non-localized routes (About, Contact, etc.): kept at root

---

## 4. i18n System

### 4.1 Translation Keys

File: `src/i18n/config.ts`

```typescript
export const languages = {
  en: 'English', zh: '中文', fr: 'Français', de: 'Deutsch',
  es: 'Español', pt: 'Português', ar: 'العربية',
  it: 'Italiano', ja: '日本語', ko: '한국어', ru: 'Русский', pl: 'Polski',
};
export const defaultLang = 'en';
export const showDefaultLang = true;

export const ui = {
  en: { 'home.title': '...', ... },
  fr: { 'home.title': '...', ... },
  // ...
};
```

### 4.2 The `t()` Function

Defined in each `[lang]/` page:

```typescript
const t = (key: string) =>
  (ui as any)[lang]?.[key] || (ui as any)[defaultLang]?.[key] || key;
```

**Fallback chain:** `current language key` → `English key` → `raw key string`

### 4.3 Utility Functions

File: `src/i18n/utils.ts`

| Function | Purpose |
|----------|---------|
| `getLangFromUrl(url)` | Extract `{lang}` from URL path, or return `defaultLang` |
| `removeLang(path)` | Strip `/{lang}/` prefix from path |
| `localizePath(path, lang)` | Add `/{lang}/` prefix to path |

### 4.4 Page Content (YAML)

File: `src/i18n/page-content.ts`

Build-time virtual module `astro:page-content` pre-loads all 12 languages × 4 page types (home, about, news, contact) from `src/data/pages/`. Accessed via `getPageContent(lang, page)`.

**Fallback chain:** `lang/page content` → `en/page content` → `{}`

### 4.5 Adding a New Language

1. Add to `languages` in `src/i18n/config.ts`
2. Add all translation keys under a new block in `ui`
3. Add to `PAGE_LANGS` in `astro.config.ts` (line 60)
4. Create `src/data/pages/{lang}/` YAML files
5. Create `src/data/site/navigation.{lang}.yaml` (optional, falls back to English)
6. Add to subdomain router `LANG_MAP` in `workers/subdomain-router.js`
7. Add to `hreflang` alternate links in `Layout.astro`

---

## 5. Build Pipeline

### 5.1 Commands

| Command | Purpose |
|---------|---------|
| `yarn dev` | `astro dev` — local server at `localhost:4321` |
| `yarn build` | `geo-build.mjs → astro build` — full production build |
| `yarn preview` | Preview built site |
| `yarn check` | `astro check → eslint → prettier` |
| `yarn fix` | Auto-fix ESLint + Prettier |

### 5.2 Build Process

```
1. scripts/geo-build.mjs        ← GEO/AI analysis + llms.txt + sitemap-entity.xml
2. astro build                  ← Astro SSG build
   ├── YAML Plugin              ← Loads locale-specific YAML via SITE_LOCALE env
   ├── Page Content Plugin      ← Pre-loads all page YAML data
   ├── astro:content            ← Content collections (posts, products)
   ├── SSG pages               ← dist/client/
   └── SSR entrypoints         ← dist/server/
```

### 5.3 YAML Plugin (`yamlPlugin` in `astro.config.ts`)

- Reads `SITE_LOCALE` env var (unset in CI builds → defaults to `'en'`)
- For locale-specific page YAML: `src/data/pages/{locale}/{page}.yaml`
- For navigation: `src/data/site/navigation.{locale}.yaml` (via vite alias)
- Falls back to English if locale file not found

### 5.4 Page Content Plugin (`pageContentPlugin` in `astro.config.ts`)

Virtual module `astro:page-content` exports a JSON map of all `{lang}/{pageName}` → parsed YAML content. Pre-loaded at build time so all 48 combinations (12 langs × 4 pages) are available instantly.

---

## 6. Deployment

### 6.1 GitHub Actions CI/CD

File: `.github/workflows/actions.yaml`

**Trigger:** Push to `main`

**Jobs:**

```
check-astro (ubuntu-latest)
  └── corepack → yarn install → yarn check:astro

build-and-deploy (ubuntu-latest, if main + push)
  ├── yarn build                    (includes geo-build + astro build + patch-worker)
  ├── Inject VECTORIZE + AI bindings into wrangler.ci.json
  ├── Create/ensure KV namespace (wavefella-session)
  ├── Inject KV namespace ID
  ├── Deploy wavefella Worker       (subdomain routing built-in)
  └── Set SESSION_SECRET secret
```

### 6.2 Required GitHub Secrets

| Secret | Where Used | Purpose |
|--------|-----------|---------|
| `CLOUDFLARE_ACCOUNT_ID` | CI deploy step | Cloudflare account ID |
| `CLOUDFLARE_API_TOKEN` | CI deploy step | Workers + Vectorize + KV permissions |
| `SESSION_SECRET` | CI set on Worker | Session encryption for Keystatic |

### 6.3 Required Cloudflare Resources

| Resource | Name | Purpose |
|----------|------|---------|
| **Worker** | `wavefella` | Astro site (SSG + SSR) with built-in subdomain routing |
| **KV Namespace** | `wavefella-session` | Keystatic admin sessions |
| **Vectorize Index** | `ai-index` | 768-dim cosine similarity for AI search |
| **AI Binding** | `AI` | Workers AI (bge-base-en-v1.5, llama-3.1-8b-instruct) |

### 6.4 Route Configuration

In Cloudflare Dashboard → Workers & Pages → `wavefella` → **Triggers** → **Routes**:

```
*.alluredna.com/* → wavefella
```

### 6.5 DNS Configuration

```
Record  Type   Target           Proxied
*       CNAME  alluredna.com    Yes (橙色云)
```

### 6.6`.dev.vars` (Local Development)

```
SESSION_SECRET=your-random-secret-here
```

---

## 7. Data Flow

### 7.1 Product Data

```
src/data/products.ts  →  SSOT (12 products, 6 categories)
       │
       ├── UI (product cards, category grid, filters)
       ├── AI (/api/ask — structured recommendation engine)
       ├── SEO (JSON-LD, llms.txt, AI Summary, FAQ)
       └── Product Graph (category intelligence, safety rules)
```

### 7.2 Page Content Flow

```
src/data/pages/{lang}/*.yaml  ──→  astro:page-content (build-time JSON)
                                          │
                                    getPageContent(lang, page)
                                          │
                              ┌───────────┴───────────┐
                              ▼                       ▼
                       SSG pages               SSR pages
                   (pre-rendered HTML)    (server-rendered HTML)
```

### 7.3 Navigation Flow

```
src/data/site/navigation.yaml  ──→  src/navigation.ts  ──→  headerData / footerData
                                          │
                          ┌───────────────┴───────────────┐
                          ▼                               ▼
                   Header.astro                      Footer.astro
                   (localizeHref)                    (localizeHref)
                          │                               │
                          ▼                               ▼
              <a href="/fr/products">              <a href="/fr/products">
```

---

## 8. Error Diagnostics Guide

Use this section to determine whether a bug is a **logic error** (business/flow issue), a **structural error** (build/config issue), or a **deployment error** (CI/infra issue).

### 8.1 Build Failures

| Error | Likely Cause | Check |
|-------|-------------|-------|
| `Rollup failed to resolve import "~/assets/..."` | Missing file or case mismatch on Linux CI | `src/assets/` file exists? Filename case matches? Git-tracked? |
| `Cannot find module '/.astro/ai'` | Cloudflare AI types not generated (pre-existing on Windows) | Build on Linux CI (GitHub Actions) — passes there |
| `[ERROR] [vite] ✗ Build failed` with Vite error | Check the specific import that failed | `yarn build` locally first |
| `[ERROR] [content] [Error]` | Content collection schema mismatch | Check `src/content.config.ts` + data files |
| `Generated an empty chunk` | Warning only, not blocking | Usually harmless |

### 8.2 Locale/Routing Errors

| Symptom | Likely Cause | Check |
|---------|-------------|-------|
| Non-English page shows English content | Missing translation key in `src/i18n/config.ts` | Add key for the language |
| Nav link jumps to English | `localizeHref()` not matching the route | Is the route in `LOCALIZED_ROUTES` in Header.astro / Footer.astro? |
| `/{lang}/about` returns 404 | No `[lang]/about.astro` page (SSR pages don't have lang variants) | Expected — about is SSR, accessed via subdomain |
| Subdomain not routing correctly | DNS/subdomain-router config | Check `LANG_MAP` in `workers/subdomain-router.js`. Check Cloudflare Routes. |
| Active nav link not highlighted | `cleanPath` vs `href` mismatch | Check `cleanPath = removeLang(Astro.url.pathname)` in Header.astro |
| Language switcher not working | Cookie or subdomain logic | Check `data-locale` attributes and `window.location` logic in Header.astro |

### 8.3 Deployment Errors

| Error | Likely Cause | Check |
|-------|-------------|-------|
| `✗ Deploy to Cloudflare Workers` fails | Missing secrets or wrong config | Check GitHub Secrets (`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`). Check `wrangler.ci.json` injection. |
| `✗ Ensure KV namespace exists` fails | Wrangler not authenticated | Check API token has Workers + KV permissions |
| `ERROR: could not find KV namespace ID` | KV namespace not created | Manually create: `npx wrangler kv namespace create wavefella-session` |
| `✗ Set SESSION_SECRET` fails | Secret was already set (non-fatal) | Verify via Dashboard → Worker → Settings → Variables |
| Subdomain router deploy fails | Already exists or name conflict | Check worker name `alluredna-subdomain-router` is unique |
| `✗ Subdomain Router` deploy fails | `workers/subdomain-router.js` has syntax error | Test locally: `node -c workers/subdomain-router.js` |

### 8.4 Runtime (SSR/API) Errors

| Symptom | Likely Cause | Check |
|---------|-------------|-------|
| `/api/ask` returns 500 | AI binding not available or model name wrong | Check `AI` binding in wrangler. CI injects it. |
| `/api/contact` returns 429 | Rate limit hit (5/hr per IP) | Wait or check `src/lib/rate-limit.ts` |
| Keystatic `/keystatic` returns 404 | Protected page, not logged in | Check `SESSION_SECRET` is set. Visit `/login` first. |
| Search shows no results | No search index or CORS issue | Check `fetch('/search-index.json')` returns data |
| Email not sending | Resend API key missing or invalid | Check `contact_resend_api_key` in branding.yaml |

### 8.5 Structural Checklist

If something is fundamentally broken, verify these in order:

1. **`yarn build` succeeds locally?** → If no, fix build errors first
2. **`yarn dev` shows correct content?** → Check routes, i18n keys, data files
3. **`git push` triggers CI?** → Check GitHub Actions tab
4. **CI `check-astro` passes?** → Fails = type/lint error
5. **CI `build-and-deploy` succeeds?** → Check deploy logs
6. **Cloudflare Worker deployed?** → Check Dashboard → Workers
7. **Subdomain router deployed?** → Check `alluredna-subdomain-router`
8. **DNS proxied through Cloudflare?** → `dig A alluredna.com` shows Cloudflare IPs
9. **Routes configured?** → `*.alluredna.com/*` → subdomain-router
10. **Secrets set on Worker?** → `SESSION_SECRET`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`

---

## 9. Key Files Reference

| File | Role | What Breaks If Missing/Wrong |
|------|------|------------------------------|
| `src/i18n/config.ts` | Translation keys + language list | All non-English pages show English or broken keys |
| `src/i18n/utils.ts` | URL language utilities | `getLangFromUrl` returns wrong lang, nav links wrong |
| `src/middleware.ts` | Auth + locale detection + geo API | No locale redirects on localhost, no admin auth |
| `src/navigation.ts` | Nav structure from YAML | Header/footer show no links |
| `src/components/widgets/Header.astro` | Navigation bar + lang switcher + search | Nav links missing `/{lang}/` prefix, broken active state |
| `src/components/widgets/Footer.astro` | Footer links + social | Same as Header |
| `scripts/patch-worker.mjs` | Injects subdomain routing into built Worker | Language subdomains (fr.alluredna.com) don't route |
| `astro.config.ts` | Astro build config + Vite plugins | Build fails, YAML locale loading broken |
| `wrangler.toml` | Local worker config | `wrangler dev` doesn't work |
| `.github/workflows/actions.yaml` | CI/CD pipeline | No auto-deploy |
| `src/data/products.ts` | Product SSOT | Product pages wrong, AI recommendations broken |
| `src/config.yaml` | Site config (brand, SEO, URLs) | Site metadata wrong |

---

## 10. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro v6 |
| Styling | Tailwind CSS v4 |
| Icons | tabler (astronomy) via astro-icon |
| Fonts | Inter Variable (fontsource) |
| AI | Workers AI (bge-base-en-v1.5, llama-3.1-8b-instruct) |
| Vector DB | Cloudflare Vectorize (768-dim cosine) |
| Session | Cloudflare KV |
| Admin | Keystatic (GitHub API-backed) |
| Contact | AES-256-GCM + Resend |
| Deployment | Cloudflare Workers |
| CI/CD | GitHub Actions |
| SEO | astro-seo, @astrojs/sitemap, JSON-LD |
| Compression | astro-compress |
| MDX | @astrojs/mdx |

---

## 11. Contact

**Wavefella**  
5067 Saddleback St, Montclair, CA 91763, USA  
213-557-7888  
info@wavefella.com

[YouTube](https://www.youtube.com/@Wavefella) · [X](https://x.com/wavefella) · [Instagram](https://www.instagram.com/wavefellaco) · [Facebook](https://www.facebook.com/wavefella)
