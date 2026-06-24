import type { ContentV2Record } from '~/data/content-v2';
import type { AiCitationSignal, OptimizationSuggestion } from '~/data/seo/types';

export function estimateAiReadiness(entry: ContentV2Record): { score: number; signals: string[] } {
  const signals: string[] = [];
  let score = 0;
  if (entry.tldr && entry.tldr.length > 50) {
    signals.push('TLDR block present — high chance of AI snippet extraction');
    score += 25;
  }
  if (entry.definition && entry.definition.length > 40) {
    signals.push('Definition block present — AI citation target for featured snippets');
    score += 20;
  }
  if (entry.faq.length >= 3) {
    signals.push(`${entry.faq.length} FAQ items with schema.org markup — AI FAQ extraction target`);
    score += 20;
  }
  if (entry.category === 'comparison') {
    signals.push('Comparison structure — AI comparison table candidate');
    score += 15;
  }
  if (entry.solution && entry.solution.length > 80) {
    signals.push('Solution block with actionable content — high AI citation probability');
    score += 10;
  }
  if (entry.slug.includes('beginner') || entry.slug.includes('guide')) {
    signals.push('Tutorial/guide structure —ChatGPT instructional content target');
    score += 10;
  }
  return { score: Math.min(score, 100), signals };
}

export function computeAiCitationScore(entries: ContentV2Record[]): { slug: string; title: string; score: number; grade: string; signals: string[] }[] {
  return entries.map(entry => {
    const { score, signals } = estimateAiReadiness(entry);
    let grade: string;
    if (score >= 80) grade = 'A';
    else if (score >= 60) grade = 'B';
    else if (score >= 40) grade = 'C';
    else grade = 'D';
    return { slug: entry.slug, title: entry.title, score, grade, signals };
  }).sort((a, b) => b.score - a.score);
}

export function suggestGeoImprovements(entries: ContentV2Record[]): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];
  for (const entry of entries) {
    const { score } = estimateAiReadiness(entry);
    if (score < 60) {
      let suggestion = '';
      if (!entry.tldr || entry.tldr.length < 50) suggestion = 'Add concise TLDR block (2-3 sentences) for AI snippet extraction';
      else if (!entry.definition || entry.definition.length < 40) suggestion = 'Add definition block with clear term explanation for AI citation';
      else if (entry.faq.length < 3) suggestion = 'Add 3+ FAQ items with schema.org markup for AI FAQ extraction';
      else suggestion = 'Strengthen solution block with actionable steps for higher AI citation probability';
      suggestions.push({
        slug: entry.slug,
        title: entry.title,
        type: 'structure',
        priority: score < 40 ? 'high' : 'medium',
        suggestion,
        currentValue: `GEO readiness score: ${score}/100`,
        expectedImpact: 'Increased probability of AI citation in ChatGPT/Perplexity/SGE responses',
      });
    }
  }
  return suggestions;
}
