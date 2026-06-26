# Wavefella — SEO / GEO / 宣传优化建议汇总

> 在整个开发过程中提出的所有有利于搜索引擎优化（SEO）、生成式引擎优化（GEO）及网站宣传推广的建议方案，按方向分类整理。

---

## 目录

1. [多语言国际 SEO](#1-多语言国际-seo)
2. [GEO / AI 语义优化](#2-geo--ai-语义优化)
3. [结构化数据 / JSON-LD](#3-结构化数据--json-ld)
4. [技术 SEO](#4-技术-seo)
5. [内容优化](#5-内容优化)
6. [可爬取性与索引](#6-可爬取性与索引)
7. [性能与核心网页指标](#7-性能与核心网页指标)
8. [宣传与转化](#8-宣传与转化)
9. [监控与诊断](#9-监控与诊断)

---

## 1. 多语言国际 SEO

### 1.1 12 语言全覆盖

- [x] 所有 12 种语言（en, zh, fr, de, es, pt, ar, it, ja, ko, ru, pl）添加完整的首页 i18n 键
- [x] 每个语言的 `ui` 块包含：`home.*`, `v2.*`, `product.*`, `faq.*`, `guides.*`, `useCase.*`, `guide.*`, `compare.*`
- [x] 通过 `t()` 函数实现优雅降级：当前语言 → 英语 → 原始 key

### 1.2 hreflang 标签

- [x] `Layout.astro` 中为所有 12 种语言生成 `<link rel="alternate" hreflang="{lang}" href="...">`
- [x] 生产环境使用子域名（`fr.alluredna.com`），本地开发使用路径前缀（`/fr/`）
- [x] `hreflang="x-default"` 指向英语版本

### 1.3 语言路由架构

- [x] 子域名路由器 `workers/subdomain-router.js`：`{locale}.alluredna.com` → `alluredna.com` + `X-Original-Lang` 请求头
- [x] 路径前缀路由：SSG 页面使用 `/{lang}/...` 路径
- [x] SSR 页面通过 `X-Original-Lang` 请求头检测语言（about, contact, news）
- [x] 中间件 `src/middleware.ts` 的本地语言检测（Cookie → Geo-IP + Accept-Language → 英语）

### 1.4 导航链接本地化

- [x] `Header.astro` 和 `Footer.astro` 中的 `localizeHref()` 函数自动为已知本地化路由添加 `/{lang}/` 前缀
- [x] 路由白名单：`/products`, `/guides`, `/faq`, `/v2`, `/use-cases`, `/compare`, `/geo-report`
- [x] 排除路由：`/products/compare`（无本地化版本）
- [x] 修复了非英语页面的导航链接高亮（active state）

### 1.5 语言切换器

- [x] 语言切换弹窗（Header 中的 `lang-dialog`）
- [x] 切换时设置 Cookie (`x-user-locale`) + localStorage
- [x] 生产环境切换子域名，开发环境切换路径前缀
- [ ] **待优化**：语言切换链接使用 `href="javascript:void(0)"`，对搜索引擎不可爬取

---

## 2. GEO / AI 语义优化

### 2.1 llms.txt

- [x] 自动生成 `/llms.txt`（由 `scripts/geo-build.mjs` 在构建时生成）
- [x] 包含 26 个实体、16 个资源、18 条指南、7 个用例、15 个类别的结构化摘要
- [x] 为 AI 爬虫（如 ChatGPT、Claude、DeepSeek 等）提供网站内容摘要

### 2.2 AI 摘要区块

- [x] 首页 `#ai-summary` 区块结构化描述：What / How / Who
- [x] 使用 `home.ai.desc1` / `home.ai.desc2` 翻译键，支持 12 种语言
- [x] 语义隐藏区块（sr-only）用于 AI 消费
- [x] AI 语义分析系统：系统健康评分、等级分布、内容差距检测

### 2.3 AI 产品选择引擎

- [x] `/api/ask` — 结构化决策引擎（非聊天机器人）
- [x] 输入：用户问题 + 完整产品目录 + 产品图谱（JSON）
- [x] 流程：环境匹配 → 技能匹配 → 安全验证
- [x] 输出：推荐产品 / 原因 / 类别智能 / 安全 / 警告
- [x] 温度 0.2（确定性输出，无幻觉风险）
- [x] 系统提示词："Product Selection Engine — do not sell, do not market, do not hallucinate"

### 2.4 产品语义结构

- [x] 每个产品包含：`definition`（一句话定义）、`problem`（解决的问题）、`howItWorks`（工作原理）
- [x] 还有：`audience`、`environment`、`water_condition`、`safety_level`、`use_case`、`safety_rules`
- [x] 产品图谱（Product Graph）：6 个类别节点，含 intent、best-for、avoid、safety_rules

### 2.5 GEO v4/v5 构建流程

- [x] 构建时自动运行 AI 语义分析
- [x] 生成实体级 sitemap（`sitemap-entity.xml`）
- [x] 内容差距分析（高/中/低优先级）
- [x] 主题聚类：equipment, useCase, material, technology, component, concept

---

## 3. 结构化数据 / JSON-LD

### 3.1 组织架构数据

- [x] `src/components/common/JsonLd.astro` 生成 `Organization` Schema
- [x] 含名称、URL、Logo、联系方式、社交媒体链接

### 3.2 品牌数据

- [x] `Brand` Schema（与 Organization 嵌套）

### 3.3 FAQ 数据

- [x] `FAQPage` Schema，首页 6 个问答项作为 `mainEntity`
- [x] 使用翻译后的内容（支持 12 种语言）

### 3.4 产品数据

- [x] `Product` Schema（在 `[lang]/products/[slug].astro` 页面中）
- [x] 含产品名称、描述、图片、分类、价格

### 3.5 导航元素

- [x] `SiteNavigationElement` Schema
- [x] `BreadcrumbList` Schema（在 Breadcrumbs 组件中）

### 3.6 文章数据

- [x] `Article` Schema（博客/指南页面中）
- [x] `TechArticle` Schema（技术文章）

---

## 4. 技术 SEO

### 4.1 Sitemap

- [x] `@astrojs/sitemap` 自动生成 `sitemap-index.xml` + 每个语言的 `sitemap.xml`
- [x] 排除路径：`/keystatic`, `/admin`, `/login`, `/api`, `/404`, `/500`
- [x] 实体级 sitemap：`sitemap-entity.xml`（由 GEO 构建脚本生成）

### 4.2 Robots

- [ ] **待检查**：确保 `/robots.txt` 正确配置，指向 sitemap

### 4.3 规范 URL（Canonical）

- [x] SEO 组件设置 `<link rel="canonical" href="...">`
- [x] `hreflang` 标签使用规范 URL + 语言代码

### 4.4 HTML lang 属性

- [x] `<html lang="{language}">` 在 `Layout.astro` 中正确设置
- [x] 根据当前语言动态设置

### 4.5 元数据

- [x] `title` 和 `meta description` 每个页面独立设置
- [x] `og:title`, `og:description`, `og:image` Open Graph 标签
- [x] `twitter:card` Twitter Card 标签

---

## 5. 内容优化

### 5.1 首页内容国际化

- [x] Hero 标题/副标题 → `home.hero.*` 翻译键
- [x] 信任标记（Trust Bar） → `home.trust.*`
- [x] AI 摘要段落 → `home.ai.desc1` / `home.ai.desc2`
- [x] 产品证明数据（Proof Points）：产品数、国家数、成立年份、认证 → `home.proof.*`
- [x] 产品系统标签 → `home.productSystem.*`
- [x] CTA 按钮文案 → `home.cta.*`
- [x] FAQ 标题/答案 → `home.faq.*`
- [x] 套餐折扣标签 → `home.bundles.save`
- [x] 哲学卡片标题/描述 → `home.philosophy.*`

### 5.2 页面级标题国际化

- [x] V2 页面：Library, Most Read, TLDR, Definition, The problem, How it works, The solution, Key comparisons, FAQ → `v2.*`
- [x] 产品页面：Why this exists, The problem it solves, Use cases, Specifications, Comparison, FAQ → `product.*`
- [x] FAQ 页面：标签 + 描述 → `faq.*`
- [x] 指南列表页：所有标题 → `guides.*`
- [x] 用例页面："Use Case" 标签 + FAQ → `useCase.*`
- [x] 指南详情页："Guide" 标签 + FAQ → `guide.*`
- [x] 对比页面："Compare" 标签 → `compare.*`

### 5.3 ALT 属性

- [x] 首页所有图片添加翻译后的 `alt` 文本

### 5.4 HTML 语义化

- [x] 使用 `<h1>`、`<h2>`、`<h3>` 等语义化标题层级
- [x] `<nav>`、`<main>`、`<footer>` 结构化标签
- [x] 使用 `aria-label` 提高无障碍性

---

## 6. 可爬取性与索引

### 6.1 内部链接

- [x] 导航链接完整，无断开链接
- [x] 页脚链接完整
- [x] 面包屑导航（Breadcrumbs）

### 6.2 语言版本互链

- [x] `hreflang` 标签链接所有语言版本
- [ ] **待优化**：语言切换器中的 `<a>` 链接使用 `href="javascript:void(0)"`，搜索引擎无法爬取

### 6.3 搜索功能

- [x] `/search-index.json` 搜索索引（构建时自动生成）
- [x] 客户端搜索功能（支持类型过滤：product, article, guide, page）
- [ ] **待优化**：搜索结果链接不包含 `/{lang}/` 前缀，指向英语版本
- [ ] **待优化**：搜索索引 `/search-index.json` 始终加载英语版本

### 6.4 404 页面

- [x] 自定义 404 页面，含导航链接

### 6.5 RSS Feed

- [x] `/rss.xml` RSS 订阅源

---

## 7. 性能与核心网页指标

### 7.1 构建优化

- [x] `astro-compress`：CSS 压缩、HTML 压缩（保留属性引号）、JavaScript 压缩
- [x] 构建时压缩了 2 个 CSS 文件，节省 1.46 KB

### 7.2 图片优化

- [x] `@astrojs/image` 或 `astro:assets` 图片处理
- [x] 支持本地图片和远程图片（通过 Unpic CDN）
- [x] 英雄图使用 `loading="eager"` + `fetchpriority="high"`
- [x] 产品图片使用 `loading="lazy"`
- [ ] **待检查**：是否需要 WebP/AVIF 格式支持

### 7.3 字体优化

- [x] `@fontsource-variable/inter` — 可变字体，无需加载多个字重

### 7.4 样式优化

- [x] Tailwind CSS v4 — 按需生成 CSS，无冗余
- [x] `@tailwindcss/vite` — Vite 原生集成

### 7.5 暗色模式

- [x] 支持暗色/亮色模式切换
- [x] CSS 变量实现

---

## 8. 宣传与转化

### 8.1 CTA 按钮

- [x] 首页多个 CTA：Shop All Boards、Take the Quiz、Explore products、Ask AI
- [x] 导航栏固定 "Get a quote" 按钮
- [x] 所有 CTA 文案支持 12 种语言翻译

### 8.2 社交证明

- [x] 信任标记（Trust Bar）："Stable for Beginners"、"Travel-Ready Design"、"Ocean, Lake & River Tested"
- [x] 证明层（Proof Layer）：12 产品、50+ 国家、2012 年成立、ISO 认证
- [x] 社区板块：Real Riders 用户照片 + 评价
- [x] 社交媒体链接：YouTube、X、Instagram、Facebook

### 8.3 联系我们

- [x] `/contact` 页面：地址、电话、邮箱
- [x] 联系表单：AES-256-GCM 加密、HMAC 签名验证码、频率限制（5 次/IP/小时）

### 8.4 品牌页面

- [x] `/brand` 品牌介绍
- [x] `/about` 关于我们
- [x] `/technology` 技术展示（PVC Layer、Drop-Stitch Core、Reinforced Rail Edge）
- [x] `/safety` 安全认证
- [x] `/randdcenter` 研发中心

### 8.5 内容营销

- [x] 指南列表页 `/guides` 聚合所有指南
- [x] V2 知识库 `/v2` 系统化文章
- [x] 博客/新闻 `/news`
- [x] 用例场景展示：Beginner、Outdoor、Professional、Family 等

---

## 9. 监控与诊断

### 9.1 SEO 工厂

- [x] `scripts/seo-pipeline.mjs` — SEO 分析管道
- [x] 生成 `tasks.json`（SEO 任务列表）、`tasks.md`、`tasks.csv`、`geo.json`
- [x] 可通过 GitHub Actions 定时运行（每日 UTC 9:00）

### 9.2 GEO 监控

- [x] `src/lib/seo/geo-monitor.ts` — AI 语义分析监控
- [x] 系统健康评分
- [x] 等级分布（A/B/C）
- [x] 内容差距检测

### 9.3 链接验证

- [x] `/keystatic/validate-links` — 内部链接验证工具
- [x] `/keystatic/link-refactor` — URL/名称重构工具（支持旧→新映射、自动提交）

### 9.4 构建诊断

- [x] CI/CD 部署日志上传（失败时）
- [x] 构建错误输出到 `/tmp/deploy.log`

---

## 状态图例

| 标记 | 含义 |
|------|------|
| ✅ 已完成 | 已实现并部署 |
| ⚠️ 部分完成 | 已实现但需进一步完善 |
| ❌ 未开始 | 建议但尚未实现 |

---

> 最后更新：2026-06-26
