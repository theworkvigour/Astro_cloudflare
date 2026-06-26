# AstroCloudflare — Multilingual Water Sports Platform

Multilingual static site for **Wavefella** (inflatable SUP boards, kayaks, dinghies, RIBs, safety equipment, and accessories) built with [Astro v6](https://astro.build) and deployed on [Cloudflare Workers](https://workers.cloudflare.com).

Supports **12 languages**: English, Chinese, French, German, Spanish, Portuguese, Arabic, Italian, Japanese, Korean, Russian, Polish.

---

## Architecture

```
src/
  pages/[lang]/          Localized pages (12 languages)
  i18n/config.ts         Translation keys per language
  i18n/utils.ts          getLangFromUrl, localizePath, removeLang
  navigation.ts          Header / Footer nav data
  components/widgets/    Header.astro, Footer.astro (i18n-aware nav links)
  data/site/             YAML configs (navigation, branding, languages)
workers/
  subdomain-router.js    {locale}.alluredna.com → alluredna.com
```

### Routing

| Mode | Mechanism | Pages |
|------|-----------|-------|
| Path-based i18n | `/{lang}/products/...` | Products, Guides, V2, FAQ, Use Cases, Compare, Geo Report |
| Subdomain routing | `{locale}.alluredna.com` → `alluredna.com` with `X-Original-Lang` header | SSR pages (About, Contact, News) |
| Middleware | Auto-redirects non-EN users to `/{detected}/...` on localhost | All routes |

### Language Switching

- Navigation links auto-prefix with `/{lang}/` for known localized routes (Products, Guides, FAQ, V2, Use Cases, Compare, Geo Report)
- Non-localized routes (About, Contact, News, Journal, Technology) remain at root
- Language switcher dialog sets cookie + subdomain (production) or path (localhost)

---

## Quick Start

```bash
corepack enable
yarn install
yarn dev        # http://localhost:4321
```

### Required: `.dev.vars`

```
SESSION_SECRET=your-random-secret-here
```

---

## Commands

| Command | Purpose |
|---------|---------|
| `yarn dev` | Local dev server at localhost:4321 |
| `yarn build` | Production build to `dist/` |
| `yarn preview` | Preview production build |
| `yarn check` | astro check + ESLint + Prettier |
| `yarn fix` | Auto-fix lint issues |

---

## I18n

Translation keys live in `src/i18n/config.ts`. Each language has a `ui` block. The `t()` helper falls back to English for missing keys:

```typescript
const t = (key: string) => (ui as any)[lang]?.[key] || (ui as any)[defaultLang]?.[key] || key;
```

### Adding a new page

1. Create `src/pages/[lang]/your-page.astro`
2. Add translation keys to `src/i18n/config.ts`
3. Add route to `LOCALIZED_ROUTES` in Header.astro / Footer.astro if nav links should be prefixed

---

## Deployment

Push to `main` triggers GitHub Actions CI/CD:

1. Type check + lint
2. Build all enabled locales
3. Deploy to Cloudflare Pages (`astrocloudflare`)

### Required Secrets

| Secret | Purpose |
|--------|---------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account |
| `CLOUDFLARE_API_TOKEN` | Workers + Vectorize permissions |
| `SESSION_SECRET` | Session encryption |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro v6 |
| Styling | Tailwind CSS v4 |
| I18n | Custom (path-based + subdomain) |
| AI | Workers AI (bge-base-en-v1.5, llama-3.1-8b-instruct) |
| Vector DB | Cloudflare Vectorize |
| Deployment | Cloudflare Pages + Workers |
| Admin | Keystatic (GitHub API-backed) |
| Contact | AES-256-GCM + Resend |
| Images | Local assets (`public/images/wavefella/`) |

---

## Contact

**Wavefella**  
5067 Saddleback St, Montclair, CA 91763, USA  
213-557-7888  
info@wavefella.com

[YouTube](https://www.youtube.com/@Wavefella) · [X](https://x.com/wavefella) · [Instagram](https://www.instagram.com/wavefellaco) · [Facebook](https://www.facebook.com/wavefella)
