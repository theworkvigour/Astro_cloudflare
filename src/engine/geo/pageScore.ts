import { analyzeHTML } from '../core/analyzer';
import { runRules } from '../core/rules';
import { calculateScore } from '../core/scorer';
import type { PageAnalysis, GeoScore } from '../core/types';

export function analyzePage(html: string, url: string): { analysis: PageAnalysis; score: GeoScore } {
  const analysis = analyzeHTML(html, url);
  const rules = runRules(analysis);
  const score = calculateScore(rules, analysis);
  return { analysis, score };
}
