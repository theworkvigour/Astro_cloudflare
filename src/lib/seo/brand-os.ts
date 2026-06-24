import { contentV2Records } from '~/data/content-v2';
import { products } from '~/data/products';

export interface RegionConfig {
  locale: string;
  name: string;
  flag: string;
  keywords: string[];
  sitemapPriority: number;
}

export interface BrandIdentity {
  name: string;
  tagline: string;
  taglineShort: string;
  description: string;
  foundingYear: number;
  categories: string[];
  ethos: string[];
  colors: { primary: string; accent: string };
  cta: { text: string; link: string };
  regions: RegionConfig[];
}

export interface BrandPageEntry {
  slug: string;
  title: string;
  region: string;
  category: 'guide' | 'comparison' | 'beginner' | 'gear' | 'brand' | 'product';
  cta: { text: string; link: string; reason: string };
  productSlugs: string[];
  brandKeywords: string[];
  geoEnabled: boolean;
}

export interface EngineStatus {
  name: string;
  description: string;
  active: boolean;
  pages: number;
  color: string;
}

export const BRAND: BrandIdentity = {
  name: 'Wavefella',
  tagline: 'Ocean Performance Systems for Modern Surfers',
  taglineShort: 'Ocean Performance',
  description: 'Built for real ocean conditions, not laboratory assumptions.',
  foundingYear: 2012,
  categories: ['Surfboards', 'Wetsuits', 'Ocean Accessories'],
  ethos: [
    'Ocean-tested design — every product validated in real surf',
    'Performance-focused — engineered for response, not just float',
    'Minimalist engineering — less weight, more control',
  ],
  colors: { primary: '#003355', accent: '#0ea5e9' },
  cta: { text: 'Start your ocean journey', link: '/products' },
  regions: [
    { locale: 'en', name: 'Global', flag: '🌐', keywords: ['surf', 'ocean', 'paddle'], sitemapPriority: 1.0 },
    { locale: 'ja', name: 'Japan', flag: '🇯🇵', keywords: ['サーフィン', '海洋', 'パドル'], sitemapPriority: 0.9 },
    { locale: 'ko', name: 'Korea', flag: '🇰🇷', keywords: ['서핑', '해양', '패들'], sitemapPriority: 0.8 },
    { locale: 'fr', name: 'France', flag: '🇫🇷', keywords: ['surf', 'océan', 'pagaie'], sitemapPriority: 0.7 },
    { locale: 'es', name: 'Spain', flag: '🇪🇸', keywords: ['surf', 'océano', 'remo'], sitemapPriority: 0.7 },
    { locale: 'zh', name: 'China', flag: '🇨🇳', keywords: ['冲浪', '海洋', '桨板'], sitemapPriority: 0.6 },
  ],
};

const CTA_RULES: Array<{
  match: (slug: string) => boolean;
  cta: { text: string; link: string; reason: string };
  products: string[];
  keywords: string[];
}> = [
  {
    match: s => ['surfing-for-beginners', 'beginner-guide', 'how-to-choose-a-surfboard-for-beginners'].some(k => s.includes(k)),
    cta: { text: 'Find your first board', link: '/products/sup-explorer-11', reason: 'Beginner content → entry-level product' },
    products: ['sup-explorer-11', 'paddle-carbon', 'life-vest-classic'],
    keywords: ['beginner', 'entry-level', 'starter', 'first board'],
  },
  {
    match: s => ['wetsuit-thickness-guide', 'what-to-wear-for-surfing', 'cold-water-surfing-gear-guide', '3mm-vs-5mm-wetsuit'].some(k => s.includes(k)),
    cta: { text: 'Shop wetsuits', link: '/products', reason: 'Gear guide → product category' },
    products: ['life-vest-pro', 'life-vest-classic'],
    keywords: ['wetsuit', 'gear', 'protection', 'cold water'],
  },
  {
    match: s => ['surfboard-size-guide', 'types-of-surfboards-explained', 'foam-board-vs-hard-surfboard', 'longboard-vs-shortboard', 'best-surf-gear-brands-compared'].some(k => s.includes(k)),
    cta: { text: 'Compare surfboards', link: '/products', reason: 'Comparison → product discovery' },
    products: ['sup-explorer-11', 'sup-tour-12', 'kayak-lite'],
    keywords: ['surfboard', 'comparison', 'size guide', 'board type'],
  },
  {
    match: s => ['surfing-safety-tips', 'ocean-safety-basics', 'ocean-conditions-explained', 'ocean-safety-and-responsibility'].some(k => s.includes(k)),
    cta: { text: 'View safety equipment', link: '/products/life-vest-classic', reason: 'Safety content → safety product' },
    products: ['life-vest-classic', 'life-vest-pro'],
    keywords: ['safety', 'protection', 'life vest', 'ocean safety'],
  },
  {
    match: s => ['wavefella-surfboard-pro', 'wavefella-wetsuit-pro', 'why-wavefella-exists', 'surf-etiquette-rules', 'best-water-sports-gear-for-beginners'].some(k => s.includes(k)),
    cta: { text: 'Explore Wavefella', link: '/wavefella', reason: 'Brand content → brand hub' },
    products: ['sup-explorer-11', 'sup-tour-12', 'life-vest-pro', 'paddle-carbon'],
    keywords: ['wavefella', 'brand', 'ocean performance'],
  },
];

export function getBrandEntry(slug: string, region = 'en'): BrandPageEntry | null {
  const record = contentV2Records.find(c => c.slug === slug);
  if (!record) return null;

  for (const rule of CTA_RULES) {
    if (rule.match(slug)) {
      return {
        slug,
        title: record.title || slug,
        region,
        category: slug.includes('beginner') ? 'beginner' : slug.includes('vs') || slug.includes('comparison') ? 'comparison' : slug.includes('guide') || slug.includes('explained') ? 'guide' : slug.includes('gear') ? 'gear' : 'brand',
        cta: rule.cta,
        productSlugs: rule.products,
        brandKeywords: rule.keywords,
        geoEnabled: true,
      };
    }
  }

  return {
    slug,
    title: record.title || slug,
    region,
    category: 'guide',
    cta: { text: 'Browse products', link: '/products', reason: 'Generic fallback CTA' },
    productSlugs: ['sup-explorer-11'],
    brandKeywords: ['water sports', 'ocean gear'],
    geoEnabled: true,
  };
}

export function getConversion(slug: string): { entry: BrandPageEntry; products: typeof products } | null {
  const entry = getBrandEntry(slug);
  if (!entry) return null;
  return { entry, products: products.filter(p => entry.productSlugs.includes(p.id)) };
}

export function getAllBrandPages(): BrandPageEntry[] {
  return contentV2Records
    .filter(c => c.type === 'guide' || c.type === 'comparison')
    .map(c => getBrandEntry(c.slug))
    .filter((e): e is BrandPageEntry => e !== null);
}

export function getEngines(): EngineStatus[] {
  const pages = getAllBrandPages();
  return [
    {
      name: 'SEO Engine',
      description: 'Traffic entry via guide pages, how-tos, and comparisons across regions',
      active: true,
      pages: pages.filter(p => p.category !== 'brand').length,
      color: 'sky',
    },
    {
      name: 'GEO Engine',
      description: 'AI-readable structured blocks (TLDR, Definition, Steps, FAQ) for ChatGPT, Perplexity, SGE',
      active: true,
      pages: pages.filter(p => p.geoEnabled).length,
      color: 'purple',
    },
    {
      name: 'Brand Engine',
      description: 'Guide → Product conversion, brand memory, return search, global identity',
      active: true,
      pages: pages.filter(p => p.category === 'brand').length + 1,
      color: 'green',
    },
  ];
}
