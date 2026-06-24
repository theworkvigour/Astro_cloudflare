import type { PageAnalysis, GeoScore } from '../core/types';

export function generatePageReport(analysis: PageAnalysis, score: GeoScore): Record<string, unknown> {
  return {
    url: analysis.url,
    score: score.overall,
    grade: score.grade,
    llmGrade: score.llmReadability.grade,
    categories: score.categories,
    signals: score.llmReadability.signals,
    details: {
      title: analysis.title || '(missing)',
      metaDescription: analysis.metaDescription ? `${analysis.metaDescription.slice(0, 80)}...` : '(missing)',
      wordCount: analysis.wordCount,
      headings: analysis.headings.length,
      images: analysis.images.length,
      internalLinks: analysis.links.filter((l) => l.isInternal).length,
      externalLinks: analysis.links.filter((l) => !l.isInternal).length,
      jsonLdTypes: analysis.jsonLdTypes,
    },
    recommendations: generateRecommendations(score),
  };
}

function generateRecommendations(score: GeoScore): string[] {
  const recs: string[] = [];
  for (const rule of score.rules) {
    if (!rule.passed) {
      recs.push(`[${rule.rule}] ${rule.detail}`);
    }
  }
  return recs.slice(0, 10);
}
