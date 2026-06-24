import type { PageAnalysis, GeoScore } from '../core/types';
import { toGrade } from '../core/scorer';

export function calculateSiteScore(pages: { analysis: PageAnalysis; score: GeoScore }[]): GeoScore {
  if (pages.length === 0) {
    return {
      overall: 0,
      grade: 'F',
      categories: {},
      rules: [],
      llmReadability: { score: 0, grade: 'F', signals: { semanticStructure: 0, metadata: 0, contentQuality: 0, entityRichness: 0, linkHealth: 0 } },
    };
  }

  const avgOverall = Math.round(pages.reduce((s, p) => s + p.score.overall, 0) / pages.length);

  const catKeys = new Set<string>();
  for (const p of pages) {
    for (const key of Object.keys(p.score.categories)) catKeys.add(key);
  }

  const categories: Record<string, number> = {};
  for (const key of catKeys) {
    const vals = pages.filter((p) => key in p.score.categories).map((p) => p.score.categories[key]);
    categories[key] = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  }

  const llmScores = pages.map((p) => p.score.llmReadability.score);
  const avgLlm = llmScores.length > 0 ? Math.round(llmScores.reduce((a, b) => a + b, 0) / llmScores.length) : 0;

  return {
    overall: avgOverall,
    grade: toGrade(avgOverall),
    categories,
    rules: [],
    llmReadability: {
      score: avgLlm,
      grade: toGrade(avgLlm),
      signals: {
        semanticStructure: avg(pages.map((p) => p.score.llmReadability.signals.semanticStructure)),
        metadata: avg(pages.map((p) => p.score.llmReadability.signals.metadata)),
        contentQuality: avg(pages.map((p) => p.score.llmReadability.signals.contentQuality)),
        entityRichness: avg(pages.map((p) => p.score.llmReadability.signals.entityRichness)),
        linkHealth: avg(pages.map((p) => p.score.llmReadability.signals.linkHealth)),
      },
    },
  };
}

function avg(values: number[]): number {
  return values.length > 0 ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100 : 0;
}
