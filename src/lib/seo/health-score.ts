import type { ContentV2Record } from '~/data/content-v2';
import type { PageHealthScore } from '~/data/seo/types';
import { TIER_A_SLUGS } from './constants';

function gradeFromTotal(total: number): PageHealthScore['grade'] {
  if (total >= 90) return 'A';
  if (total >= 75) return 'B';
  if (total >= 60) return 'C';
  if (total >= 40) return 'D';
  return 'F';
}

function hasEmotionalTrigger(title: string): boolean {
  const triggers = ['avoid', 'mistake', 'wrong', 'must', 'dont', "don't", 'nobody', 'actually', 'honest', 'secret', 'stop', 'real'];
  return triggers.some(t => title.toLowerCase().includes(t));
}

function hasUtilityPromise(title: string): boolean {
  const promises = ['guide', 'how to', 'tips', 'works', 'proven', 'effective', 'complete', 'best', 'ultimate'];
  return promises.some(t => title.toLowerCase().includes(t));
}

function hasNumberInTitle(title: string): boolean {
  return /\d/.test(title);
}

export function computeCtrScore(entry: ContentV2Record): number {
  let score = 10;
  if (hasEmotionalTrigger(entry.title)) score += 8;
  if (hasUtilityPromise(entry.title)) score += 6;
  if (hasNumberInTitle(entry.title)) score += 4;
  if (entry.description.length > 110) score += 2;
  return Math.min(score, 30);
}

export function computePositionScore(entry: ContentV2Record): number {
  let score = 15;
  if (TIER_A_SLUGS.includes(entry.slug)) score += 8;
  if (entry.difficulty === 'beginner') score += 4;
  if (entry.faq.length >= 4) score += 3;
  return Math.min(score, 30);
}

export function computeContentDepthScore(entry: ContentV2Record): number {
  let score = 5;
  if (entry.definition && entry.definition.length > 60) score += 3;
  if (entry.tldr && entry.tldr.length > 100) score += 2;
  if (entry.problem && entry.problem.length > 100) score += 2;
  if (entry.explanation && entry.explanation.length > 200) score += 3;
  if (entry.solution && entry.solution.length > 100) score += 2;
  if (entry.faq.length >= 3) score += 3;
  return Math.min(score, 20);
}

export function computeInternalLinksScore(entry: ContentV2Record): number {
  let score = 2;
  if (entry.relatedGuides.length >= 3) score += 3;
  if (entry.relatedGuides.length >= 5) score += 2;
  if (entry.relatedProducts.length >= 2) score += 2;
  if (TIER_A_SLUGS.includes(entry.slug)) score += 1;
  return Math.min(score, 10);
}

export function computeAiStructureScore(entry: ContentV2Record): number {
  let score = 2;
  if (entry.definition) score += 2;
  if (entry.tldr) score += 1;
  if (entry.faq.length >= 3) score += 2;
  if (entry.slug.includes('comparison') || entry.category === 'comparison') score += 1;
  if (entry.solution && entry.solution.length > 80) score += 1;
  if (TIER_A_SLUGS.includes(entry.slug)) score += 1;
  return Math.min(score, 10);
}

export function computePageHealth(entries: ContentV2Record[]): PageHealthScore[] {
  return entries.map(entry => {
    const ctrScore = computeCtrScore(entry);
    const positionScore = computePositionScore(entry);
    const contentDepthScore = computeContentDepthScore(entry);
    const internalLinksScore = computeInternalLinksScore(entry);
    const aiStructureScore = computeAiStructureScore(entry);
    const total = ctrScore + positionScore + contentDepthScore + internalLinksScore + aiStructureScore;
    return {
      slug: entry.slug,
      title: entry.title,
      ctrScore,
      positionScore,
      contentDepthScore,
      internalLinksScore,
      aiStructureScore,
      total,
      grade: gradeFromTotal(total),
    };
  }).sort((a, b) => a.total - b.total);
}
