import type { ContentV2Record } from '~/data/content-v2';
import type { GscQuery, OptimizationSuggestion } from '~/data/seo/types';
import { TIER_A_SLUGS } from './constants';

export function estimatePagePosition(query: GscQuery, slug: string): number {
  if (TIER_A_SLUGS.includes(slug)) return Math.max(1, query.position - 3);
  if (query.position <= 3) return query.position;
  if (query.ctr > 3) return Math.max(1, Math.round(query.position * 0.7));
  return Math.round(query.position * 0.9);
}

export function classifyPosition(position: number): 'top-3' | 'top-10' | 'mid-rank' | 'low-rank' {
  if (position <= 3) return 'top-3';
  if (position <= 10) return 'top-10';
  if (position <= 20) return 'mid-rank';
  return 'low-rank';
}

export function findPositionJumps(queries: GscQuery[]): { query: string; from: number; to: number; jump: number }[] {
  const jumps: { query: string; from: number; to: number; jump: number }[] = [];
  for (const q of queries) {
    const band = classifyPosition(q.position);
    const estimatedPrev: number = (() => {
      if (band === 'top-3') return q.position + 1;
      if (band === 'top-10') return q.position + 4;
      if (band === 'mid-rank') return q.position + 6;
      return q.position + 8;
    })();
    const delta = estimatedPrev - q.position;
    if (delta >= 2) {
      jumps.push({ query: q.query, from: estimatedPrev, to: q.position, jump: delta });
    }
  }
  return jumps.sort((a, b) => b.jump - a.jump);
}

export function suggestPositionImprovements(entries: ContentV2Record[]): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];
  for (const entry of entries) {
    let linkCount = entry.relatedGuides.length + entry.relatedProducts.length;
    let issue: string | null = null;
    let suggestion = '';
    if (linkCount < 5) {
      issue = `Only ${linkCount} internal links`;
      suggestion = `Add ${5 - linkCount}+ more internal links to related guides and products`;
    }
    if (entry.faq.length < 3) {
      issue = issue ? `${issue}; only ${entry.faq.length} FAQ items` : `Only ${entry.faq.length} FAQ items`;
      suggestion = 'Add 2-3 more FAQ items targeting long-tail question keywords';
    }
    if (!TIER_A_SLUGS.includes(entry.slug) && entry.relatedGuides.filter(s => TIER_A_SLUGS.includes(s)).length === 0) {
      issue = issue ? `${issue}; no link to core guide` : 'No link to core guide (Tier A)';
      suggestion = 'Add internal link to one of the 3 core guides (surfboard, wetsuit, beginner surfing)';
    }
    if (issue) {
      suggestions.push({
        slug: entry.slug,
        title: entry.title,
        type: 'content',
        priority: issue.includes('Only') && issue.includes('internal') ? 'medium' : 'high',
        suggestion,
        currentValue: issue,
        expectedImpact: 'Position improvement of 2-5 spots within 2-4 weeks',
      });
    }
  }
  return suggestions;
}
