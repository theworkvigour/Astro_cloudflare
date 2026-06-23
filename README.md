# Wavefella — Product Intelligence System

**Wavefella** is a water sports equipment manufacturer that designs and produces inflatable SUP boards, kayaks, dinghies, RIBs, safety equipment, and accessories.

This is the **Product Intelligence System** — a unified platform where a single source of truth (SSOT) drives the UI, AI decision engine, SEO, and product graph simultaneously.

Built on [AstroWind](https://github.com/arthelokyo/astrowind), deployed to Cloudflare Workers (static + SSR).

---

## Architecture

```
src/data/products.ts  ──→  SSOT (12 products, 6 categories)
       │
       ├──→ UI (product cards, category grid, filters)
       ├──→ AI (Product Selection Engine at /api/ask)
       ├──→ SEO (JSON-LD, llms.txt, AI Summary, FAQ)
       └──→ Product Graph (category intelligence, safety rules)
```

### Core Principles

| Layer | Description |
|-------|-------------|
| **SSOT** | `products.ts` is the single source of truth — UI, AI, and SEO all read from it |
| **Product Graph** | 6 category nodes with intent, best-for, avoid, safety rules |
| **AI Decision Engine** | Structured reasoning (not chat) — matches environment + skill + safety |
| **UI** | Bound to SSOT — no hardcoded product data in templates |
| **SEO** | One-line definition, AI Summary, llms.txt, JSON-LD (Organization + FAQPage + Brand) |

---

## Quick Start

```bash
corepack enable
yarn install
yarn dev
```

### Required: `.dev.vars`

```
SESSION_SECRET=your-random-secret-here
```

---

## Homepage Structure (V2.0)

```
[Header]
[Hero Carousel]         5-image auto-rotating carousel with dot nav
[Trust Bar]             Stable for Beginners · Travel-Ready · Ocean, Lake & River Tested
[AI Summary]            "What is Wavefella?" — structured for AI consumption
[SUP Collection]        Find Your Perfect SUP — 4 entry cards
[Product System]        12 products across 6 categories
[Product Catalog]       Full product grid with specs
[Hero Product]          Featured product with feature tags (Stability+, Ocean Ready, Travel+)
[Technology]            PVC Layer · Drop-Stitch Core · Reinforced Rail Edge
[Why Wavefella]         Engineered Materials · Tested for Safety · Adapts to All Waters
[Proof Layer]           12 products · 50+ countries · Founded 2012 · ISO certified
[Use Cases]             Scenario-based: Beginner, Outdoor, Professional, Family
[AI Ask]                Product Selection Engine — structured recommendations
[Community]             Real Riders — user photos + testimonials
[Learning Center]       Guides: How to Choose, Beginner, Inflatable vs Hard, Safety
[FAQ]                   6 conversion-focused questions
[Final CTA]             Shop All Boards / Take the Quiz
[Contact]               Address · Phone · Email
[Footer]
```

---

## AI Product Selection Engine

Located at `POST /api/ask`. Unlike a chatbot, this is a **structured decision engine**:

- **Input**: Question + full product catalog + product graph (JSON, not text)
- **Processing**: Environment matching → skill matching → safety validation
- **Output**: Recommended Product / Reason / Category Intelligence / Safety / Warning
- **Temperature**: 0.2 (deterministic, no hallucination)
- **System prompt**: "Product Selection Engine — do not sell, do not market, do not hallucinate"

---

## Products

12 products across 6 categories, defined in `src/data/products.ts`:

| Category | Products | Environments |
|----------|----------|-------------|
| SUP | Explorer 11, Tour 12 | Lake, River, Coastal, Ocean |
| KAYAK | Lite, Tandem | Lake, River, Coastal |
| DINGHY | AirDeck 270, AirDeck 360 | Lake, Coastal, Protected |
| RIB | 330, 450 Patrol | Coastal, Ocean, Offshore |
| SAFETY | Life Vest Classic, Life Vest Pro | All waters |
| ACCESSORY | Carbon Paddle, Dual-Action Pump | All waters |

Each product includes: `definition`, `problem`, `howItWorks`, `audience`, `environment`, `water_condition`, `safety_level`, `use_case`, `safety_rules`.

---

## AI SEO (GEO/AEO) Framework

| Element | Location |
|---------|----------|
| One-line definition | H1 tag, top of homepage |
| AI Summary | `#ai-summary` section — what/how/who structured block |
| llms.txt | `/llms.txt` — AI-crawlable site summary |
| JSON-LD Organization | Schema.org `Organization` + `Brand` + `FAQPage` |
| Product structure | `definition`/`problem`/`howItWorks`/`audience` per product |
| FAQ schema | 6 Q&A items as `mainEntity` in JSON-LD |
| Scenario use cases | 4 scenario-based cards with Scenario/Solution/Products |

---

## Commands

| Command | Purpose |
|---------|---------|
| `yarn dev` | Local dev server |
| `yarn build` | Production build |
| `yarn preview` | Preview production build |
| `yarn check` | astro check + ESLint + Prettier |
| `yarn fix` | Auto-fix lint issues |

---

## Deployment

Push to `main` triggers GitHub Actions CI/CD:

1. Type check + lint
2. Build all enabled locales
3. Deploy each locale to Cloudflare Workers

**Domain**: `wavefella-{locale}.theworkvigo.workers.dev`

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
| AI | Workers AI (bge-base-en-v1.5, llama-3.1-8b-instruct) |
| Vector DB | Cloudflare Vectorize (768-dim cosine) |
| Deployment | Cloudflare Workers |
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
