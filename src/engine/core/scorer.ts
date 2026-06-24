import type { GeoRuleResult, GeoScore } from './types';
import { getMaxScore } from './rules';
import { calculateLlmReadability } from '../geo/llmReadability';
import type { PageAnalysis } from './types';

export function calculateScore(rules: GeoRuleResult[], analysis: PageAnalysis): GeoScore {
  const totalScore = rules.reduce((sum, r) => sum + r.score, 0);
  const maxScore = getMaxScore();
  const overall = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  const categories = categorizeScores(rules);
  const llmReadability = calculateLlmReadability(analysis);

  return {
    overall,
    grade: toGrade(overall),
    categories,
    rules,
    llmReadability,
  };
}

function categorizeScores(rules: GeoRuleResult[]): Record<string, number> {
  const cats: Record<string, { earned: number; max: number }> = {};

  for (const r of rules) {
    const cat = categorizeRule(r.rule);
    if (!cats[cat]) cats[cat] = { earned: 0, max: 0 };
    cats[cat].earned += r.score;
    cats[cat].max += r.weight;
  }

  const result: Record<string, number> = {};
  for (const [key, val] of Object.entries(cats)) {
    result[key] = val.max > 0 ? Math.round((val.earned / val.max) * 100) : 0;
  }
  return result;
}

function categorizeRule(rule: string): string {
  if (rule.startsWith('has-title') || rule.startsWith('title-')) return 'title';
  if (rule.startsWith('has-meta') || rule.startsWith('meta-')) return 'metadata';
  if (rule.startsWith('has-h') || rule.startsWith('heading')) return 'headings';
  if (rule.startsWith('has-semantic') || rule.startsWith('has-lang')) return 'semantic';
  if (rule.startsWith('has-viewport') || rule.startsWith('has-canonical')) return 'technical';
  if (rule.startsWith('json-ld') || rule.startsWith('og-')) return 'structured-data';
  if (rule.startsWith('content-')) return 'content';
  if (rule.includes('link')) return 'links';
  if (rule.includes('image') || rule.includes('alt')) return 'media';
  if (rule.includes('llms')) return 'geo';
  return 'other';
}

export function toGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 55) return 'C';
  if (score >= 35) return 'D';
  return 'F';
}
