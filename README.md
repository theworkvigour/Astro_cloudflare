# Wavefella — Astro v6 Multilingual Platform

Multilingual (12 languages) water sports equipment site for **Wavefella**, built on [Astro v6](https://astro.build) with hybrid SSG/SSR, deployed to a **single Cloudflare Worker**.

**Domains:** `alluredna.com` (production), preview via `wrangler dev` (local) or CI preview URLs.

---

## 1. Architecture Overview

```
Request → alluredna.com/{lang}/{path}
              ↓
         Astro handler
              ↓
    ┌──────────────────┐
    │  SSG (prerender)  │  →  [lang]/products/*, [lang]/guides/*, [lang]/faq, etc.
    │  SSR (server)     │  →  /about, /contact, /news, /keystatic, /api/*
    │  API routes       │  →  /api/ask, /api/chat, /api/contact, etc.
    └──────────────────┘
```

All locale URLs use **path-based** format: `alluredna.com/fr/products`, `alluredna.com/de/guides`.

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro v6 |
| Styling | Tailwind CSS v4 |
| Icons | tabler (via astro-icon) |
| Fonts | Inter Variable (fontsource) |
| AI | Workers AI (bge-base-en-v1.5, llama-3.1-8b-instruct) |
| Vector DB | Cloudflare Vectorize (768-dim cosine) |
| Session | Cloudflare KV (`wavefella-session`) |
| Admin CMS | Keystatic (GitHub API-backed) |
| Contact | AES-256-GCM encryption + Resend email |
| Deployment | Cloudflare Workers (`output:'server'`) |
| CI/CD | GitHub Actions |
| SEO | astro-seo, @astrojs/sitemap, JSON-LD |
| Compression | astro-compress |
| MDX | @astrojs/mdx |

---

## 3. Directory Structure

```
Astro_cloudflare/
├── src/
│   ├── pages/
│   │   ├── [lang]/                   # Localized pages (12 languages)
│   │   │   ├── index.astro           # Homepage (SSG)
│   │   │   ├── faq.astro             # FAQ page with FAQPage schema
│   │   │   ├── geo-report.astro      # GEO audit report
│   │   │   ├── products/
│   │   │   │   ├── index.astro       # Product catalog
│   │   │   │   └── [slug].astro      # Product detail (+ Product/FAQPage/Breadcrumb schema)
│   │   │   ├── guides/
│   │   │   │   ├── index.astro       # Guides listing
│   │   │   │   └── [slug].astro      # Auto-generated guide (Article + FAQPage + Breadcrumb)
│   │   │   ├── use-cases/
│   │   │   │   └── [slug].astro      # Use-case page (Article + FAQPage + Breadcrumb)
│   │   │   ├── compare/
│   │   │   │   └── [slug].astro      # Product comparison (Article + Breadcrumb)
│   │   │   ├── v2/
│   │   │   │   ├── index.astro
│   │   │   │   └── [slug].astro      # V2 library articles
│   │   │   ├── sitemap.xml.ts        # Per-locale sitemap
│   │   │   └── llms.txt.ts           # Per-locale AI knowledge graph
│   │   ├── api/                      # API routes (24 endpoints)
│   │   │   ├── admin/                # Keystatic admin CRUD
│   │   │   ├── ai/                   # AI quota & sitemap
│   │   │   ├── auth/                 # Login/logout/change-password
│   │   │   ├── ask.ts                # AI Q&A
│   │   │   ├── chat.ts               # AI chat
│   │   │   ├── contact.ts            # Encrypted contact form
│   │   │   ├── search.ts             # Full-text search
│   │   │   ├── embed.ts              # Embeddings
│   │   │   ├── geo-score.ts          # GEO scoring
│   │   │   ├── page-inspect.ts       # Page inspection
│   │   │   └── seo/                  # SEO analysis & execution
│   │   ├── about.astro               # SSR (prerender=false)
│   │   ├── contact.astro             # SSR + captcha + encrypted
│   │   ├── news/                     # Blog (SSR)
│   │   ├── keystatic/                # Admin panel (protected)
│   │   ├── internal/                 # GEO/SEO dashboards
│   │   ├── brand/, wavefella/        # Brand pages
│   │   ├── randdcenter/              # R&D center pages
│   │   ├── products/, guides/        # Non-localized versions
│   │   ├── search.astro              # Search page
│   │   └── ...                       # 404, login, privacy, terms, etc.
│   ├── components/
│   │   ├── widgets/                  # 28 page sections (Header, Footer, Hero, Features, etc.)
│   │   ├── common/                   # Shared (JsonLd, Breadcrumbs, Image, Metadata, etc.)
│   │   ├── blog/                     # Blog UI (SinglePost, Grid, Pagination, etc.)
│   │   ├── admin/                    # Keystatic admin form components (20 section forms)
│   │   ├── ui/                       # Primitives (Button, Form, Headline, etc.)
│   │   ├── seo/                      # OrganizationSchema, SEO meta
│   │   └── blocks/                   # Section wrapper, story block
│   ├── layouts/                      # 8 layouts
│   │   ├── Layout.astro              # Base layout (hreflang, Organization/WebSite schema)
│   │   ├── PageLayout.astro          # Breadcrumbs + Header + Footer
│   │   ├── ProductLayout.astro       # Product page layout
│   │   ├── NewsLayout.astro          # News/blog layout
│   │   ├── MarkdownLayout.astro      # Markdown pages
│   │   ├── AdminLayout.astro         # Keystatic admin
│   │   └── LandingLayout.astro       # Landing pages
│   ├── lib/
│   │   ├── seo/                      # SEO engine (17 modules: brand, GSC, CTR, geo, rules, tasks)
│   │   ├── geo-v4/                   # GEO content v4 (generator, graph, templates)
│   │   ├── geo-v5/                   # GEO content v5 (semantic engine, topic clusters, gaps)
│   │   ├── geo/                      # Locale resolver
│   │   ├── ai-gateway.ts             # Cloudflare AI gateway
│   │   ├── rag.ts                    # RAG pipeline
│   │   ├── vector.ts                 # Vector operations
│   │   ├── auth.ts                   # Session auth
│   │   ├── contact-captcha.ts        # HMAC captcha
│   │   ├── contact-crypto.ts         # AES-256-GCM encryption
│   │   ├── rate-limit.ts             # Sliding window rate limiter
│   │   ├── github.ts                 # GitHub API client
│   │   ├── markdown.ts               # Markdown utilities
│   │   ├── productGraph.ts           # Product knowledge graph
│   │   └── ...                       # link-refactor, query-bank, token-store, etc.
│   ├── i18n/
│   │   ├── config.ts                 # Translation keys (12 langs, ~2000 lines)
│   │   ├── utils.ts                  # getLangFromUrl, removeLang, localizePath
│   │   └── page-content.ts           # YAML page content loader
│   ├── data/
│   │   ├── pages/                    # YAML: home/about/news/contact per locale (52 files)
│   │   ├── site/                     # YAML: navigation, branding, languages, etc.
│   │   ├── products.ts               # Product SSOT (12 products, 6 categories)
│   │   ├── guides.ts                 # Guide records
│   │   ├── faq.ts                    # FAQ data
│   │   ├── content-v2.ts             # V2 library content
│   │   └── seo/                      # SEO types & sample data
│   ├── content/
│   │   ├── graph/                    # Knowledge graph (nodes, relations, index)
│   │   ├── news/                     # 15 blog posts (MDX)
│   │   └── products/                 # 13 product pages (MDX)
│   ├── middleware.ts                 # Locale detection, auth, geo API protection
│   ├── navigation.ts                 # YAML-driven nav structure
│   ├── config.yaml                   # Site configuration (brand, SEO, blog, analytics)
│   └── assets/styles/tailwind.css    # Tailwind CSS v4 config
├── scripts/
│   ├── geo-build.mjs                 # GEO/AI build pipeline
│   ├── patch-worker.mjs              # No-op (subdomain routing removed)
│   ├── build-all.js                  # Multi-build script
│   ├── seo-pipeline.mjs              # SEO pipeline
│   ├── seed-vectorize.cjs            # Vectorize seeding
│   └── fix-favicons.ps1              # CI favicon fix
├── workers/                          # Synthetic Cloudflare Workers
│   ├── cron.js                       # Scheduled tasks
│   ├── geo-generator.js              # GEO content generation
│   ├── gsc-fetch.js                  # Google Search Console fetch
│   ├── rule-engine.js                # SEO rule engine
│   └── task-export.js                # SEO task export
├── astro.config.ts                   # Astro build config + Vite plugins
├── wrangler.toml                     # Cloudflare Workers config
├── keystatic.config.ts               # Keystatic CMS config
├── .github/workflows/actions.yaml    # CI/CD pipeline
├── AGENTS.md                         # AstroWind project instructions
├── WAVEFELLA-PROJECT-DOCS.md         # Project documentation (Chinese)
└── SEO-GEO-OPTIMIZATION.md           # SEO/GEO optimization guide (Chinese)
```

---

## 4. Routing System

### 4.1 Path-based i18n

Pages under `src/pages/[lang]/` auto-generate for all 12 languages at `/{lang}/...`.

```
/en/products/sup-explorer-11
/fr/guides/inflatable-sup
/de/use-cases/touring
/ja/compare/inflatable-sup-vs-inflatable-kayak
/ar/faq
```

The `[lang]` directory is a dynamic Astro route parameter. Each page reads `Astro.params.lang` or calls `getLangFromUrl(Astro.url)` for locale detection.

### 4.2 Middleware (Locale Detection)

File: `src/middleware.ts`

| Priority | Method | Source |
|----------|--------|--------|
| 1 | Cookie | `x-user-locale` (set by language switcher) |
| 2 | Geo-IP | `cf-ipcountry` header (Cloudflare) |
| 3 | Accept-Language | Browser header |
| 4 | Default | English (`en`) |

When a visitor hits `alluredna.com/products` without a language prefix:
- Cookie exists → redirect `/{lang}/products`
- Geo-IP detected → redirect `/{lang}/products`
- Default → serve English

**Excluded from i18n redirect:** `/api`, `/keystatic`, `/admin`, `/login`, `/internal`, `/images`, `/assets`, `/favicon`, and URLs with file extensions.

### 4.3 SSR Pages

These pages have `prerender = false`:
- `/about`, `/contact`, `/news/*`, `/keystatic/*`

They detect language via `Accept-Language` header (no `X-Original-Lang` — subdomain routing was removed).

### 4.4 Navigation Link Localization

`Header.astro` and `Footer.astro` auto-localize nav links:

```typescript
const LOCALIZED_ROUTES = new Set([
  '/products', '/guides', '/faq', '/v2',
  '/use-cases', '/compare', '/geo-report'
]);
const NON_LOCALIZED_ROUTES = new Set(['/products/compare']);
```

- English: links stay as-is (`/products`)
- Non-English: prefixed (`/fr/products`)
- Non-localized routes: kept at root

### 4.5 Language Switcher

Embedded in `Header.astro` — uses path-based URL construction:
- Reads `data-locale` from clicked language
- Replaces or prepends `/{lang}/` in path
- Saves selection to cookie + localStorage
- Navigates to `alluredna.com/{locale}/...`

---

## 5. i18n System

### 5.1 Supported Languages (12)

| Code | Language | Direction |
|------|----------|-----------|
| `en` | English | LTR |
| `zh` | 中文 | LTR |
| `fr` | Français | LTR |
| `de` | Deutsch | LTR |
| `es` | Español | LTR |
| `pt` | Português | LTR |
| `ar` | العربية | RTL |
| `it` | Italiano | LTR |
| `ja` | 日本語 | LTR |
| `ko` | 한국어 | LTR |
| `ru` | Русский | LTR |
| `pl` | Polski | LTR |

### 5.2 Translation System

```typescript
const t = (key: string) =>
  (ui as any)[lang]?.[key] || (ui as any)[defaultLang]?.[key] || key;
```

**Fallback chain:** `current language key` → `English key` → `raw key string`

### 5.3 Key Utilities

| Function | Purpose |
|----------|---------|
| `getLangFromUrl(url)` | Extract `{lang}` from URL path |
| `removeLang(path)` | Strip `/{lang}/` prefix |
| `localizePath(path, lang)` | Add `/{lang}/` prefix |

### 5.4 Page Content (YAML)

Build-time virtual module `astro:page-content` pre-loads all 12 languages × 4 page types (home, about, news, contact) from `src/data/pages/`. 52 YAML files total.

---

## 6. Structured Data (JSON-LD)

All schema types generated via `src/components/common/JsonLd.astro`:

| Schema Type | Applied To |
|-------------|-----------|
| `Organization` | All pages (via `Layout.astro`) |
| `WebSite` | All pages (via `Layout.astro`) |
| `BreadcrumbList` | Product pages, guide pages, use-case pages, comparison pages (RDFa via `Breadcrumbs` component) |
| `Product` | Product detail pages |
| `FAQPage` | FAQ page, product detail pages, guide pages, use-case pages |
| `Article` | Guide pages, use-case pages, comparison pages, news articles |
| `HowTo` | Available via `JsonLd` component |

AI knowledge graph at `/llms.txt` provides ontology definitions with URLs for AI crawlers.

---

## 7. GEO / SEO Engine

### 7.1 GEO Content v4 (`src/lib/geo-v4/`)
- Knowledge graph (nodes + relations)
- Auto-generated guides, use-cases, comparisons
- Template system for content generation

### 7.2 GEO Content v5 (`src/lib/geo-v5/`)
- Semantic engine for content analysis
- Topic clustering
- Content gap detection
- Scoring & reporting
- Link optimization

### 7.3 SEO Suite (`src/lib/seo/`)
- Brand layer management
- Google Search Console data extraction
- Click-through rate analysis
- Internal link optimization
- Position/ranking engine
- Rule engine for SEO audits
- Health score calculation
- Task management & export
- Social media optimization
- GEO monitoring & generation

### 7.4 AI Integration
- **Workers AI:** `bge-base-en-v1.5` (embeddings), `llama-3.1-8b-instruct` (chat/Q&A)
- **Vectorize:** 768-dim cosine similarity search
- **RAG pipeline:** Product → embeddings → similarity search → context → AI response
- **AI Chat:** `/api/chat` with product-aware context
- **AI Q&A:** `/api/ask` for structured product recommendations

### 7.5 llms.txt
AI entry point at `/{lang}/llms.txt` with knowledge graph definitions linking to actual pages.

---

## 8. Contact Form

| Feature | Implementation |
|---------|---------------|
| Encryption | AES-256-GCM (key from `SESSION_SECRET`) |
| Captcha | HMAC-signed math captcha |
| Rate Limit | 5/hr per IP (in-memory sliding window) |
| Honeypot | Hidden `email_confirm` field |
| Storage | GitHub API → `src/data/contact/submissions.enc.json` |
| Email | Resend API (optional) |

Form: `/contact`
API: `POST /api/contact`
Admin: `/keystatic/contact-submissions`

---

## 9. Admin Panel

Keystatic CMS at `/keystatic/` (GitHub API-backed).

### 9.1 Authentication (Two-Layer)

| Layer | What | Where |
|-------|------|-------|
| **Basic Auth** | Username + password (from `src/data/admin-auth.json` or `ADMIN_USERNAME`/`ADMIN_PASSWORD` env vars) | `/login.astro` |
| **GitHub PAT** | Fine-grained Personal Access Token with Contents R/W on the repo | `/keystatic/github-token` (encrypted in browser cookie) |

**First login:**
1. Navigate to `/keystatic` → redirected to `/login`
2. Use credentials from `.env.local` (generated by `migrate-domain.mjs`) or the default `Admin` / `Aa123456#`
3. After login, paste a GitHub PAT at `/keystatic/github-token` to enable content editing

The Basic Auth grants dashboard access; the GitHub PAT is required for all CRUD operations (posts, products, navigation, etc.). The PAT is stored in an encrypted browser cookie only — never persisted on the server.

### 9.2 Available Tools

- **Pages:** Create/edit homepage, about, sections
- **Posts:** Blog/news article management (MDX)
- **Products:** Product content management (MDX)
- **Navigation:** Visual navigation editor with auto-link-refactor detection
- **Branding:** Brand colors, logos, API keys
- **Languages:** Enable/disable supported languages
- **SEO:** Meta tags, social previews
- **Contact:** View encrypted submissions
- **Link Refactor:** Bulk URL rename tool
- **Validate Links:** Internal link validation

---

## 10. Build Pipeline

### 10.1 Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` / `yarn dev` | Astro dev server at `localhost:4321` |
| `npm run build` / `yarn build` | Full production build |
| `npm run preview` / `yarn preview` | Preview production build |
| `npm run check` / `yarn check` | `astro check → eslint → prettier → check:i18n` |
| `npm run check:i18n` / `yarn check:i18n` | Translation audit (12-language coverage, TODO detection) |
| `npm run fix` / `yarn fix` | Auto-fix ESLint + Prettier |

### 10.2 Build Process

```
1. scripts/geo-build.mjs      ← GEO/AI analysis + llms.txt + sitemap-entity.xml
2. astro build                ← Astro hybrid build
   ├── YAML Plugin            ← Locale-specific YAML loading
   ├── Page Content Plugin    ← Pre-loads all page YAML
   ├── SSG pages              → dist/client/
   └── SSR entrypoints        → dist/server/
3. scripts/patch-worker.mjs   ← No-op (subdomain routing removed)
```

### 10.3 Output

| Directory | Content |
|-----------|---------|
| `dist/client/` | Static HTML, assets, sitemaps, llms.txt |
| `dist/server/` | Cloudflare Worker entrypoint + wrangler.json |

---

## 11. Translation Self-Check

Run before each push to verify all 12 languages are complete:

```bash
npm run check:i18n
```

### What it checks

| Check | Scope | Fail if |
|-------|-------|---------|
| **Navigation files** | `src/data/site/navigation.{lang}.yaml` | Missing for any of 12 locales |
| **Config siteSettings** | `src/config.{lang}.yaml` | Missing `siteSettings` block |
| **Page content YAML** | `src/data/pages/{lang}/{home,about,contact,news}.yaml` | File missing or empty |
| **Product texts** | `src/data/product-texts.ts` | Any product × language lacks translation |
| **TODO placeholders** | All YAML + config files | Any `# TODO` comment remains |
| **Knowledge graph nodes** | `src/content/graph/nodes.ts` | Node missing `name`/`slug` for any locale |
| **Hardcoded English** | `src/pages/[lang]/*.astro` | Page with `getStaticPaths()` but no `t()` lookup |

Supports `--json` (CI integration) and `--fail` (exit code 1 on issues).

---

## 12. Deployment

### 11.1 CI/CD (GitHub Actions)

**Trigger:** Push to `main`

| Job | Runs On | Steps |
|-----|---------|-------|
| `check-astro` | ubuntu-latest | `yarn install → astro check` |
| `build-and-deploy` | ubuntu-latest | Build → inject AI/KV bindings → `wrangler deploy` |

### 11.2 Required Secrets

| Secret | Purpose |
|--------|---------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account |
| `CLOUDFLARE_API_TOKEN` | Workers + Vectorize + KV permissions |
| `SESSION_SECRET` | Session encryption + contact form key |

### 11.3 Required Cloudflare Resources

| Resource | Name | Purpose |
|----------|------|---------|
| Worker | `wavefella` | Astro site (SSG + SSR) |
| KV Namespace | `wavefella-session` | Keystatic sessions |
| Vectorize Index | `ai-index` | 768-dim cosine similarity |
| AI Binding | `AI` | Workers AI |

### 11.4 DNS

```
alluredna.com  A  (Cloudflare proxied)
*.alluredna.com  CNAME  alluredna.com  (Cloudflare proxied)
```

### 11.5 Route Configuration

In Cloudflare Dashboard → Workers & Pages → `wavefella` → **Triggers** → **Routes**:
```
*.alluredna.com/* → wavefella
```

---

## 12. Data Flow

### Product Data

```
src/data/products.ts  →  SSOT (12 products, 6 categories)
       │
       ├── Product detail pages (SSG)
       ├── Product catalog (SSG with filters)
       ├── AI recommendation engine
       ├── JSON-LD structured data
       ├── Knowledge graph nodes
       └── llms.txt generation
```

### Content Collections

```
src/content/
  news/{slug}.mdx    →  15 news articles
  products/{slug}.mdx  →  13 product MDX pages
  graph/              →  Knowledge graph (nodes + relations)
```

### Page Content

```
src/data/pages/{lang}/*.yaml  →  astro:page-content (build-time JSON)
                                       ↓
                                getPageContent(lang, page)
                                       ↓
                            SSG pages / SSR pages
```

---

## 13. Key Files Reference

| File | Role |
|------|------|
| `src/i18n/config.ts` | Translation keys + language list |
| `src/i18n/utils.ts` | URL language utilities |
| `src/middleware.ts` | Locale detection, auth, geo API protection |
| `src/navigation.ts` | Nav structure from YAML |
| `src/config.yaml` | Site config (brand, SEO, URLs, blog settings) |
| `src/components/widgets/Header.astro` | Nav bar + language switcher + search |
| `src/components/common/JsonLd.astro` | JSON-LD schema generator (7 types) |
| `src/components/common/Breadcrumbs.astro` | Visual breadcrumbs with RDFa |
| `astro.config.ts` | Astro build config + Vite plugins |
| `wrangler.toml` | Cloudflare Workers config |
| `keystatic.config.ts` | Keystatic CMS config |
| `.github/workflows/actions.yaml` | CI/CD pipeline |
| `public/llms.txt` | AI knowledge graph entry point |

---

## 14. Adding a New Language

1. Add to `languages` in `src/i18n/config.ts`
2. Add all translation keys under a new block in `ui`
3. Add to `PAGE_LANGS` in `astro.config.ts`
4. Create `src/data/pages/{lang}/` YAML files (home, about, news, contact)
5. Enable in `src/data/site/languages.yaml`

---

## 15. Error Diagnostics

### Build Failures

| Error | Check |
|-------|-------|
| `Rollup failed to resolve import` | File exists? Case mismatch on Linux? |
| `[ERROR] [content]` | Content collection schema + data mismatch |
| Build succeeds locally but fails in CI | Case sensitivity, platform-specific paths |

### Routing Issues

| Symptom | Check |
|---------|-------|
| Non-English page shows English | Missing translation key in `src/i18n/config.ts` |
| Nav link wrong locale | Is route in `LOCALIZED_ROUTES`? |
| 404 on locale page | Does `[lang]/` page template exist? |

### Deployment

| Issue | Check |
|-------|-------|
| Deploy fails | GitHub Secrets (`CLOUDFLARE_*`) correct? |
| KV namespace error | Manually create: `npx wrangler kv namespace create wavefella-session` |
| Worker not responding | Routes configured in Cloudflare Dashboard? DNS proxied? |

---

## 16. Forking & Domain Migration

When forking this project for your own deployment, use the migration script to replace all hardcoded references to the original domain:

```bash
# Interactive mode (asks for each value)
node scripts/migrate-domain.mjs

# Silent mode (for CI / unattended use)
node scripts/migrate-domain.mjs \
  --domain=https://yourdomain.com \
  --worker=your-worker-name \
  --email=admin@yourdomain.com \
  --yes
```

### What it updates (33 files, ~645 references)

| Change | Scope |
|--------|-------|
| `https://alluredna.com` → new domain | All config YAML (12 files), sitemaps, worker ingest URL, guide JSON-LD, homepage schema, admin SEO page |
| Worker name (globally unique) | `wrangler.toml` + CI workflow |
| `compatibility_date` | `wrangler.toml` (sets to current date) |
| Contact email | `branding.yaml` (contact + from address) |
| Admin credentials | `admin-auth.json` + `.env.local` (gitignored) |

### Admin credentials

The script generates a random 16-character admin password and writes it to `.env.local` (added to `.gitignore` automatically). Open this file to retrieve the password for first login:

```
# Admin credentials (generated by migrate-domain.mjs)
ADMIN_USERNAME=Admin
ADMIN_PASSWORD=Ab3$xYz9!kP7@wQ2
```

### Manual steps after migration

1. **Set GitHub Secrets** (repo → Settings → Secrets and variables → Actions):
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN`
   - `SESSION_SECRET` (generate a random 32+ character string)
2. **Run Cloudflare init**:
   ```powershell
   .\scripts\cloudflare-init.ps1
   ```
   (creates Vectorize index `ai-index` + KV namespace `wavefella-session`)
3. **Enable Workers AI** in Cloudflare Dashboard:
   Workers & Pages → your-worker → Workers AI
4. **(Optional)** Set `ADMIN_PASSWORD` as a Cloudflare secret to override the file-based credentials
5. **(Optional)** Configure `contact_submissions_pat` at `/keystatic/branding` for contact form storage

---

*Built with [Astro](https://astro.build) v6 · Deployed on [Cloudflare Workers](https://workers.cloudflare.com)*
