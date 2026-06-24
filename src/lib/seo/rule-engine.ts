import type { ContentV2Record } from '~/data/content-v2';
import type { GscQuery, GscPage } from '~/data/seo/types';
import { TIER_A_SLUGS } from './constants';

export type RuleAction = 'TITLE_FIX' | 'CONTENT_EXPANSION' | 'NEW_SECTION' | 'LINK_INJECT' | 'NO_CHANGE';

export interface RuleResult {
  page: string;
  query?: string;
  action: RuleAction;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  expectedImpact: string;
}

/**
 * Rule 1: CTR issue
 * IF impressions > 100 AND ctr < 2% → TITLE_FIX (HIGH)
 */
export function ruleCtrFix(queries: GscQuery[]): RuleResult[] {
  const results: RuleResult[] = [];
  for (const q of queries) {
    if (q.impressions > 100 && q.ctr < 2) {
      results.push({
        page: q.query,
        query: q.query,
        action: 'TITLE_FIX',
        priority: 'HIGH',
        reason: `CTR too low (${q.ctr}%) with ${q.impressions} impressions`,
        expectedImpact: 'CTR +0.5-1.5% within 2 weeks',
      });
    }
  }
  return results;
}

/**
 * Rule 2: Ranking improvement
 * IF position >= 4 AND position <= 20 → CONTENT_EXPANSION (HIGH)
 */
export function ruleContentExpansion(queries: GscQuery[]): RuleResult[] {
  const results: RuleResult[] = [];
  for (const q of queries) {
    if (q.position >= 4 && q.position <= 20) {
      results.push({
        page: q.query,
        query: q.query,
        action: 'CONTENT_EXPANSION',
        priority: 'HIGH',
        reason: `Position ${q.position} — within optimizable range`,
        expectedImpact: 'Position improvement of 2-5 spots within 2-4 weeks',
      });
    }
  }
  return results;
}

/**
 * Rule 3: Long-tail keyword opportunity
 * IF impressions < 50 AND query length > 4 words → NEW_SECTION (MEDIUM)
 */
export function ruleNewSection(queries: GscQuery[]): RuleResult[] {
  const results: RuleResult[] = [];
  for (const q of queries) {
    const wordCount = q.query.split(' ').length;
    if (q.impressions < 50 && wordCount >= 4) {
      results.push({
        page: q.query,
        query: q.query,
        action: 'NEW_SECTION',
        priority: 'MEDIUM',
        reason: `Low impressions (${q.impressions}) for long-tail query "${q.query}"`,
        expectedImpact: 'Additional long-tail traffic within 4-6 weeks',
      });
    }
  }
  return results;
}

/**
 * Rule 4: Stable pages — no change needed
 * IF position <= 3 AND ctr > 5% → NO_CHANGE
 */
export function ruleNoChange(queries: GscQuery[]): RuleResult[] {
  const results: RuleResult[] = [];
  for (const q of queries) {
    if (q.position <= 3 && q.ctr > 5) {
      results.push({
        page: q.query,
        query: q.query,
        action: 'NO_CHANGE',
        priority: 'LOW',
        reason: `Stable: position ${q.position}, CTR ${q.ctr}%`,
        expectedImpact: 'None — maintain current state',
      });
    }
  }
  return results;
}

/**
 * Rule 5: Page-level CTR fix
 * IF impressions > 100 AND ctr < 2% → TITLE_FIX (HIGH)
 */
export function rulePageCtrFix(pages: GscPage[]): RuleResult[] {
  const results: RuleResult[] = [];
  for (const p of pages) {
    if (p.impressions > 100 && p.ctr < 2) {
      results.push({
        page: p.path,
        action: 'TITLE_FIX',
        priority: 'HIGH',
        reason: `Page CTR ${p.ctr}% with ${p.impressions} impressions — title rewrite needed`,
        expectedImpact: 'CTR +0.5-1.5% within 2 weeks',
      });
    }
  }
  return results;
}

/**
 * Rule 6: Content pages missing Tier A links
 * IF entry is not Tier A AND has no link to any Tier A guide → LINK_INJECT (HIGH)
 */
export function ruleMissingCoreLinks(entries: ContentV2Record[]): RuleResult[] {
  const results: RuleResult[] = [];
  for (const entry of entries) {
    if (!TIER_A_SLUGS.includes(entry.slug)) {
      const linksToCore = entry.relatedGuides.filter(s => TIER_A_SLUGS.includes(s));
      if (linksToCore.length === 0) {
        results.push({
          page: entry.slug,
          action: 'LINK_INJECT',
          priority: 'HIGH',
          reason: `No link to any Tier A core guide — missing authority flow`,
          expectedImpact: 'Improved topical authority and position lift for core terms',
        });
      }
    }
  }
  return results;
}

/**
 * Run all rules and return combined, prioritized results
 */
export function runAllRules(queries: GscQuery[], pages: GscPage[], entries: ContentV2Record[]): RuleResult[] {
  const results: RuleResult[] = [
    ...ruleCtrFix(queries),
    ...ruleContentExpansion(queries),
    ...ruleNewSection(queries),
    ...ruleNoChange(queries),
    ...rulePageCtrFix(pages),
    ...ruleMissingCoreLinks(entries),
  ];
  const priorityOrder: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  return results.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
