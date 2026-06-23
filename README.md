# Vectoflare — Multilingual AI-Powered Site (Astro + Cloudflare Workers)

Perplexity-style AI search engine with RAG, semantic search, and multi-model routing. Built on [AstroWind](https://github.com/arthelokyo/astrowind), deployed as Cloudflare Workers.

## 语言

| Locale | URL |
|--------|-----|
| 🇬🇧 en | `https://vectoflare-en.theworkvigo.workers.dev` |
| 🇫🇷 fr | `https://vectoflare-fr.theworkvigo.workers.dev` |
| 🇩🇪 de | `https://vectoflare-de.theworkvigo.workers.dev` |
| 🇪🇸 es | `https://vectoflare-es.theworkvigo.workers.dev` |
| 🇵🇹 pt | `https://vectoflare-pt.theworkvigo.workers.dev` |
| 🇨🇳 zh | `https://vectoflare-zh.theworkvigo.workers.dev` |

## 架构

```
src/
├── config.yaml                  # 默认 (英文) 站点配置
├── config.{locale}.yaml         # 各语言站点配置 (自动推导 locale)
├── components/
│   └── widgets/Header.astro     # 语言切换器
├── data/
│   ├── pages/                   # 页面内容 (YAML)
│   │   └── {locale}/            # 各语言页面数据
│   ├── post/                    # 文章
│   ├── product/                 # 产品
│   ├── site/
│   │   ├── languages.yaml       # 语言列表 (唯一数据源)
│   │   └── navigation.{locale}.yaml  # 各语言导航
│   └── contact/                 # 联系表单 (加密)
├── lib/                         # 工具库
├── pages/
│   └── keystatic/               # 管理后台
├── utils/
│   └── locale.ts                # 语言工具函数
└── vendor/integration/          # AstroWind 集成 (自动推导 locale)
```

### 语言自动推导

`vendor/integration/index.ts` 从配置文件名自动提取语言代码：

- `config.yaml` → `en`
- `config.pt.yaml` → `pt`
- `config.fr.yaml` → `fr`

**无需手动同步 `i18n.language` 字段**，文件名即语言。所有组件通过 `I18N.language`（来自 `astrowind:config`）读取当前语言。

## 前置要求

- **Node.js >= 22.12.0**
- **Yarn 4.x**（corepack 自动管理）
- **Cloudflare 账号**（Worker + KV Namespace）
- **GitHub PAT**（管理后台保存内容用）

## 本地开发

```shell
yarn install

# 默认英文
yarn dev

# 指定语言
SITE_LOCALE=fr yarn dev
SITE_LOCALE=zh yarn dev
```

### .dev.vars

项目根目录创建 `.dev.vars`：

```
SESSION_SECRET=your-random-secret-here
```

## 构建

```shell
# 构建指定语言
SITE_LOCALE=pt yarn build

# 构建全部语言
yarn build:all
```

## 部署

### CI/CD 自动部署

推送 `main` 分支自动触发 GitHub Actions：

1. **check-astro** — 类型检查 + ESLint + Prettier
2. **build-and-deploy** — 6 个语言依次构建并部署

部署地址：`vectoflare-{locale}.theworkvigo.workers.dev`

### Custom Domain

在 GitHub repo Settings → Variables 中设置 `CUSTOM_DOMAIN = true`，CI 会自动将 `{locale}.alluredna.com` 映射到对应 Worker（需要 `alluredna.com` 域名已在 Cloudflare 中配置）。

### 手动部署

```shell
SITE_LOCALE=en yarn build
cd dist/server
yarn wrangler deploy --name vectoflare-en
```

### 密钥

```shell
echo "your-secret" | yarn wrangler secret put SESSION_SECRET --name vectoflare-en
```

CI 自动从 GitHub Secrets `SESSION_SECRET` 设置。

## 添加新语言

只需 3 步：

1. **创建配置文件** — 复制任意 `config.{locale}.yaml`，修改站点名称、SEO 等
2. **添加语言条目** — 在 `src/data/site/languages.yaml` 添加：
   ```yaml
   - code: JA
     name: 日本語
     locale: ja
   ```
3. **CI 矩阵** — 在 `.github/workflows/actions.yaml` 的 `matrix.locale` 中添加 `ja`

无需修改任何组件代码。语言推导和切换器自动适配。

## 管理后台

每个 Worker 包含独立管理后台（`/keystatic/`）：

| 路径 | 功能 |
|------|------|
| `/keystatic` | 仪表盘 |
| `/keystatic/pages` | 编辑页面内容 |
| `/keystatic/navigation` | 编辑导航菜单 |
| `/keystatic/branding` | 品牌配置 |
| `/keystatic/posts` | 文章管理 |
| `/keystatic/products` | 产品管理 |
| `/keystatic/languages` | 语言管理（增删语言） |
| `/keystatic/contact-submissions` | 联系表单 |
| `/keystatic/link-refactor` | 链接批量重构 |
| `/keystatic/validate-links` | 链接验证 |

### 首次使用

1. 访问 `/keystatic`，输入管理员密码
2. 配置 GitHub PAT（Fine-grained，权限 `Contents: Read and write`）
3. Token 加密保存在浏览器 Cookie 中

### 内容保存

编辑内容后通过 GitHub API 直接提交到 `src/data/` 目录。下次 CI 部署时更新。

### 内容回退

1. 当前语言内容
2. 英文内容
3. YAML 配置默认值

## 联系表单

`/contact` 页面（SSR）：

- 数学验证码（HMAC 签名）
- 蜜罐反爬虫
- 速率限制（5 次/IP/小时）
- AES-256-GCM 加密存储
- Resend 邮件通知

## AI Search Engine (Perplexity-style)

The site includes a fully functional AI search engine with RAG:

### Architecture

```
User → AIChat Widget / API
        ↓
  /api/search (semantic search)
        ↓
  Vectorize (1536-dim cosine)
        ↓
  /api/chat (RAG answer + citations)
        ↓
  LLM (AI_GATEWAY → OpenAI → Workers AI)
        ↓
  Answer + source references
```

### Components

| File | Purpose |
|------|---------|
| `src/lib/vector.ts` | Vector dimension (1536), input preprocessing |
| `src/lib/embed.ts` | Text→vector with 24h in-memory cache |
| `src/lib/rag.ts` | Core RAG engine: chunk → embed → search → assemble → answer |
| `src/lib/ai-gateway.ts` | Multi-model router (fast/quality, 3 providers) |
| `src/pages/api/search.ts` | `POST /api/search` — semantic search |
| `src/pages/api/chat.ts` | `POST /api/chat` — RAG Q&A with source citations |
| `src/pages/api/embed.ts` | `POST /api/embed` — embedding endpoint |
| `src/pages/api/ai/sitemap.ts` | `GET /api/ai/sitemap` — page list for indexing |
| `src/components/widgets/AIChat.astro` | Floating chat bubble UI (injected in Layout.astro) |
| `src/workers/ingest.ts` | Standalone ingestion Worker (deploy separately) |
| `scripts/seed-vectorize.js` | One-time index seeder |

### Provider Fallback Chain

```
AI_GATEWAY (Cloudflare AI Gateway proxy) → best
  ↓ (if unset)
OPENAI_API_KEY → gpt-4o-mini / text-embedding-3-small
  ↓ (if unset)
Workers AI (free tier) → Llama 3.1 8B / bge-base-en-v1.5
```

### Setup

```bash
# 1. Create Vectorize index (one-time)
npx wrangler vectorize create ai-index --dimensions=1536 --metric=cosine

# 2. Set secrets
npx wrangler secret put OPENAI_API_KEY        # optional
npx wrangler secret put AI_GATEWAY             # optional
npx wrangler secret put SESSION_SECRET

# 3. Seed knowledge base
npm run build
# Start dev server in another terminal: npm run dev
node scripts/seed-vectorize.js

# 4. Deploy
git push origin main    # CI/CD auto-deploys
```

### Free Tier Budget

| Resource | Free Limit | Our Usage |
|----------|-----------|-----------|
| Workers AI | 500+ req/day | ~5 req/chat session |
| Vectorize | 1M queries/month | ~5 queries/chat |
| Workers | 100k req/day | Static HTML + API |
| KV | 1k writes/day | Session tokens only |

## 技术栈

- **Astro v6** — 框架
- **Tailwind CSS v4** — 样式
- **Cloudflare Workers + Pages** — 部署
- **@astrojs/cloudflare** — 适配器
- **Vectorize** — 1536-dim 语义搜索
- **js-yaml** — YAML 解析
- **GitHub API** — 内容保存

## 项目命令

| 命令 | 作用 |
|------|------|
| `yarn dev` | 本地开发 |
| `yarn build` | 构建（`SITE_LOCALE` 指定语言） |
| `yarn build:all` | 构建全部语言 |
| `yarn preview` | 预览 |
| `yarn check` | 类型检查 + ESLint + Prettier |
| `yarn fix` | 自动修复 |

## CI/CD 环境变量

GitHub Secrets：

| Secret | 用途 |
|--------|------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账号 ID |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API 令牌（需 Workers + Vectorize 权限） |
| `SESSION_SECRET` | 会话加密密钥 |
| `OPENAI_API_KEY` | （可选）OpenAI API 密钥，用于 AI 问答/嵌入 |
| `AI_GATEWAY` | （可选）Cloudflare AI Gateway URL，替代直接调用 |

GitHub Variables（可选）：

| Variable | 用途 |
|----------|------|
| `CUSTOM_DOMAIN` | 设为 `true` 启用 custom domain 映射 |
