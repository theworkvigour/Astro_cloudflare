import type { ContentV2Record } from '~/data/content-v2';
import type { GscQuery, GscPage } from '~/data/seo/types';
import { runAllRules, type RuleResult } from './rule-engine';
import { suggestTitleRewrite } from './ctr-analysis';
import { suggestPositionImprovements } from './position-engine';
import { suggestLinkImprovements } from './link-optimizer';
import { TIER_A_SLUGS } from './constants';

export interface SeoTask {
  id: string;
  priority: '🔥 HIGH' | '🟡 MEDIUM' | '⚪ LOW';
  type: 'TITLE_FIX' | 'CONTENT_EXPANSION' | 'LINK_INJECT' | 'NEW_SECTION';
  page: string;
  issue: string;
  action: string;
  expectedImpact: string;
}

export function generateTaskList(
  queries: GscQuery[],
  pages: GscPage[],
  entries: ContentV2Record[],
): { high: SeoTask[]; medium: SeoTask[]; low: SeoTask[] } {
  const rules: RuleResult[] = runAllRules(queries, pages, entries);
  const tasks: SeoTask[] = [];
  let counter = 0;

  for (const rule of rules) {
    if (rule.action === 'NO_CHANGE') continue;
    counter++;
    const isHigh = rule.priority === 'HIGH';
    tasks.push({
      id: `TASK-${String(counter).padStart(2, '0')}`,
      priority: isHigh ? '🔥 HIGH' : rule.priority === 'MEDIUM' ? '🟡 MEDIUM' : '⚪ LOW',
      type: rule.action,
      page: rule.page,
      issue: rule.reason,
      action: rule.action === 'TITLE_FIX'
        ? `Rewrite title with emotional trigger + utility promise`
        : rule.action === 'CONTENT_EXPANSION'
          ? `Add 3+ sections, FAQ, comparison table, internal links`
          : rule.action === 'LINK_INJECT'
            ? `Add internal link to Tier A core guide (${TIER_A_SLUGS[0]})`
            : `Add new section targeting long-tail keyword`,
      expectedImpact: rule.expectedImpact,
    });
  }

  for (const entry of entries) {
    const rewrite = suggestTitleRewrite(entry.slug, entry.title);
    if (rewrite && !tasks.some(t => t.page === entry.slug && t.type === 'TITLE_FIX')) {
      counter++;
      tasks.push({
        id: `TASK-${String(counter).padStart(2, '0')}`,
        priority: '🔥 HIGH',
        type: 'TITLE_FIX',
        page: entry.slug,
        issue: `Title lacks emotional trigger — current: "${entry.title}"`,
        action: `Rewrite to: "${rewrite}"`,
        expectedImpact: 'CTR +0.5-1.5%',
      });
    }
  }

  const linkSuggestions = suggestLinkImprovements(entries);
  for (const s of linkSuggestions) {
    if (!tasks.some(t => t.page === s.slug && t.type === 'LINK_INJECT')) {
      counter++;
      tasks.push({
        id: `TASK-${String(counter).padStart(2, '0')}`,
        priority: '🟡 MEDIUM',
        type: 'LINK_INJECT',
        page: s.slug,
        issue: s.currentValue,
        action: s.suggestion,
        expectedImpact: s.expectedImpact,
      });
    }
  }

  const positionSuggestions = suggestPositionImprovements(entries);
  for (const s of positionSuggestions) {
    if (!tasks.some(t => t.page === s.slug && t.type === 'CONTENT_EXPANSION')) {
      counter++;
      tasks.push({
        id: `TASK-${String(counter).padStart(2, '0')}`,
        priority: '🔥 HIGH',
        type: 'CONTENT_EXPANSION',
        page: s.slug,
        issue: s.currentValue,
        action: s.suggestion,
        expectedImpact: s.expectedImpact,
      });
    }
  }

  const high = tasks.filter(t => t.priority === '🔥 HIGH');
  const medium = tasks.filter(t => t.priority === '🟡 MEDIUM');
  const low = tasks.filter(t => t.priority === '⚪ LOW');

  return { high, medium, low };
}
