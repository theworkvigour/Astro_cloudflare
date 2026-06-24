import type { ContentV2Record } from '~/data/content-v2';
import type { OptimizationSuggestion } from '~/data/seo/types';
import { TIER_A_SLUGS } from './constants';

const LOW_INTENT_CATEGORIES = ['authority', 'product'];
const HIGH_INTENT_CATEGORIES = ['guide', 'comparison', 'problem'];

export function analyzeLinkDensity(entries: ContentV2Record[]): { slug: string; title: string; guideLinks: number; productLinks: number; total: number; score: 'good' | 'needs-work' | 'poor' }[] {
  return entries.map(entry => {
    const total = entry.relatedGuides.length + entry.relatedProducts.length;
    let score: 'good' | 'needs-work' | 'poor';
    if (total >= 6) score = 'good';
    else if (total >= 4) score = 'needs-work';
    else score = 'poor';
    return { slug: entry.slug, title: entry.title, guideLinks: entry.relatedGuides.length, productLinks: entry.relatedProducts.length, total, score };
  });
}

export function getPageIntentLevel(entry: ContentV2Record): 'low' | 'medium' | 'high' {
  if (entry.category === 'comparison' || entry.category === 'guide') return 'high';
  if (entry.category === 'problem') return 'medium';
  return 'low';
}

export function suggestLinkImprovements(entries: ContentV2Record[]): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];
  for (const entry of entries) {
    if (!entry.relatedGuides.some(s => TIER_A_SLUGS.includes(s))) {
      suggestions.push({
        slug: entry.slug,
        title: entry.title,
        type: 'links',
        priority: 'high',
        suggestion: `Link to Tier A core guide: ${TIER_A_SLUGS[0]}`,
        currentValue: `Links: ${entry.relatedGuides.join(', ') || 'none'}`,
        expectedImpact: 'Stronger topical authority flow to core pages',
      });
    }
    if (entry.relatedProducts.length === 0) {
      suggestions.push({
        slug: entry.slug,
        title: entry.title,
        type: 'links',
        priority: 'medium',
        suggestion: 'Add at least 1 product link for conversion path',
        currentValue: '0 product links',
        expectedImpact: 'Potential conversion lift from content→product flow',
      });
    }
  }
  return suggestions;
}

export function buildLinkGraph(entries: ContentV2Record[]): { from: string; to: string; type: 'guide' | 'product' }[] {
  const edges: { from: string; to: string; type: 'guide' | 'product' }[] = [];
  for (const entry of entries) {
    for (const guideSlug of entry.relatedGuides) {
      edges.push({ from: entry.slug, to: guideSlug, type: 'guide' });
    }
    for (const prodId of entry.relatedProducts) {
      edges.push({ from: entry.slug, to: prodId, type: 'product' });
    }
  }
  return edges;
}

export function countInboundLinks(entries: ContentV2Record[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    for (const slug of entry.relatedGuides) {
      counts.set(slug, (counts.get(slug) || 0) + 1);
    }
    for (const prodId of entry.relatedProducts) {
      counts.set(prodId, (counts.get(prodId) || 0) + 1);
    }
  }
  return counts;
}
