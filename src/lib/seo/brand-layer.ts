import { contentV2Records } from '~/data/content-v2';
import { products } from '~/data/products';

export interface BrandCta {
  text: string;
  link: string;
  reason: string;
}

export interface BrandPageEntry {
  slug: string;
  title: string;
  category: 'guide' | 'comparison' | 'beginner' | 'gear' | 'brand';
  cta: BrandCta;
  productSlugs: string[];
  brandKeywords: string[];
}

export interface BrandConversion {
  page: BrandPageEntry;
  recommendedProducts: typeof products;
}

const CTA_RULES: Array<{
  match: (slug: string) => boolean;
  cta: BrandCta;
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
    match: s => ['surf-etiquette-rules', 'best-water-sports-gear-for-beginners', 'wavefella-surfboard-pro', 'wavefella-wetsuit-pro', 'why-wavefella-exists'].some(k => s.includes(k)),
    cta: { text: 'Explore Wavefella', link: '/', reason: 'Brand content → brand homepage' },
    products: ['sup-explorer-11', 'sup-tour-12', 'life-vest-pro', 'paddle-carbon', 'pump-dual'],
    keywords: ['wavefella', 'brand', 'about', 'community'],
  },
];

export function getBrandEntry(slug: string): BrandPageEntry | null {
  const record = contentV2Records.find(c => c.slug === slug);
  if (!record) return null;

  for (const rule of CTA_RULES) {
    if (rule.match(slug)) {
      return {
        slug,
        title: record.title || slug,
        category: slug.includes('beginner') ? 'beginner' : slug.includes('vs') || slug.includes('comparison') ? 'comparison' : slug.includes('guide') || slug.includes('explained') ? 'guide' : slug.includes('gear') ? 'gear' : 'brand',
        cta: rule.cta,
        productSlugs: rule.products,
        brandKeywords: rule.keywords,
      };
    }
  }

  return {
    slug,
    title: record.title || slug,
    category: 'guide',
    cta: { text: 'Browse products', link: '/products', reason: 'Generic fallback CTA' },
    productSlugs: ['sup-explorer-11'],
    brandKeywords: ['water sports', 'ocean gear'],
  };
}

export function getConversion(slug: string): BrandConversion | null {
  const entry = getBrandEntry(slug);
  if (!entry) return null;
  return {
    page: entry,
    recommendedProducts: products.filter(p => entry.productSlugs.includes(p.id)),
  };
}

export function getAllBrandPages(): BrandPageEntry[] {
  return contentV2Records
    .filter(c => c.type === 'guide' || c.type === 'comparison')
    .map(c => getBrandEntry(c.slug))
    .filter((e): e is BrandPageEntry => e !== null)
    .sort((a, b) => (a.category === 'beginner' ? 0 : 1) - (b.category === 'beginner' ? 0 : 1));
}

export const BRAND_SUMMARY = {
  name: 'Wavefella',
  tagline: 'Ocean Performance Gear for Modern Surfers',
  description: 'Built for real ocean conditions, not laboratory assumptions.',
  foundingYear: 2012,
  categories: ['Surfboards', 'Wetsuits', 'Accessories'],
  ethos: ['Ocean-tested design', 'Performance-focused', 'Minimalist engineering'],
  cta: { text: 'Start your ocean journey', link: '/products' },
};
