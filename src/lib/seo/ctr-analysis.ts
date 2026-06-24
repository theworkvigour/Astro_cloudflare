import type { ContentV2Record } from '~/data/content-v2';
import type { GscQuery, OptimizationSuggestion } from '~/data/seo/types';

const CTR_THRESHOLD = 2.0;
const IMPRESSION_THRESHOLD = 100;

export function filterLowCtrQueries(queries: GscQuery[]): GscQuery[] {
  return queries.filter(q => q.impressions >= IMPRESSION_THRESHOLD && q.ctr < CTR_THRESHOLD);
}

export function filterOptimizableQueries(queries: GscQuery[]): GscQuery[] {
  return queries.filter(q => q.impressions > 100 && q.ctr < 3 && q.position >= 4 && q.position <= 20);
}

const FIX_TEMPLATES: Record<string, (title: string) => string> = {
  beginner: (t) => `${t.replace(/\(.*?\)/, '').trim()} (Avoid These Common Mistakes)`,
  safety: (t) => `${t.replace(/\(.*?\)/, '').trim()} (What You MUST Know Before Paddling Out)`,
  guide: (t) => `${t.replace(/\(.*?\)/, '').trim()} (What Actually Works)`,
  comparison: (t) => `${t.replace(/\(.*?\)/, '').trim()} (The Honest Answer Nobody Gives You)`,
  default: (t) => `${t.replace(/\(.*?\)/, '').trim()} (Avoid These Mistakes)`,
};

function deterministicTrigger(slug: string): string {
  if (slug.includes('beginner')) return 'Avoid These Common Mistakes';
  if (slug.includes('safety')) return 'What You MUST Know Before Paddling Out';
  if (slug.includes('guide') || slug.includes('size') || slug.includes('choose')) return 'What Actually Works';
  if (slug.includes('comparison') || slug.includes('vs')) return 'The Honest Answer Nobody Gives You';
  if (slug.includes('brand') || slug.includes('best')) return 'Spend Smart, Not Sorry';
  if (slug.includes('etiquette')) return 'How to Not Be the Person Everyone Avoids';
  return 'Avoid These Mistakes';
}

export function suggestTitleRewrite(slug: string, currentTitle: string, currentCtr?: number): string | null {
  if (currentCtr !== undefined && currentCtr >= 3) return null;
  const clean = currentTitle.replace(/\(.*?\)/g, '').trim();
  const trigger = deterministicTrigger(slug);
  const suggested = `${clean} (${trigger})`;
  if (suggested === currentTitle) return null;
  return suggested;
}

export function suggestTitleOptimizations(entries: ContentV2Record[]): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];
  for (const entry of entries) {
    const rewrite = suggestTitleRewrite(entry.slug, entry.title);
    if (rewrite) {
      suggestions.push({
        slug: entry.slug,
        title: entry.title,
        type: 'ctr',
        priority: 'high',
        suggestion: rewrite,
        currentValue: entry.title,
        expectedImpact: 'CTR +0.5-1.5%',
      });
    }
  }
  return suggestions;
}

function hasConflictWords(title: string): boolean {
  const conflicts = ['avoid', 'mistake', 'wrong', 'real', 'actually', 'honest'];
  return conflicts.some(c => title.toLowerCase().includes(c));
}

function hasColonOrParen(title: string): boolean {
  return title.includes(':') || title.includes('(');
}

export function analyzeTitleQuality(entries: ContentV2Record[]): { slug: string; title: string; hasEmotional: boolean; hasColon: boolean; hasNumber: boolean; score: number }[] {
  return entries.map(entry => {
    const hasEmotional = hasConflictWords(entry.title);
    const hasColon = hasColonOrParen(entry.title);
    const hasNumber = /\d/.test(entry.title);
    let score = 0;
    if (hasEmotional) score += 3;
    if (hasColon) score += 2;
    if (hasNumber) score += 2;
    if (entry.title.length > 40) score += 1;
    if (entry.title.length > 60) score += 1;
    return { slug: entry.slug, title: entry.title, hasEmotional, hasColon, hasNumber, score };
  }).sort((a, b) => a.score - b.score);
}
