import type { PageAnalysis, GeoScore, LinkGraph } from '../core/types';

export function generateSiteReport(
  pages: { analysis: PageAnalysis; score: GeoScore }[],
  siteScore: GeoScore,
  linkGraph: LinkGraph,
): Record<string, unknown> {
  const grades = pages.map((p) => p.score.grade);
  const gradeDist = countGrades(grades);

  return {
    pagesAnalyzed: pages.length,
    overallGrade: siteScore.grade,
    overallScore: siteScore.overall,
    gradeDistribution: gradeDist,
    llmReadability: siteScore.llmReadability,
    linkGraph: {
      totalInternal: linkGraph.totalInternal,
      totalExternal: linkGraph.totalExternal,
      brokenLinks: linkGraph.brokenLinks.length,
    },
    topPages: pages
      .sort((a, b) => b.score.overall - a.score.overall)
      .slice(0, 5)
      .map((p) => ({ url: p.analysis.url, score: p.score.overall, grade: p.score.grade })),
    bottomPages: pages
      .sort((a, b) => a.score.overall - b.score.overall)
      .slice(0, 5)
      .map((p) => ({ url: p.analysis.url, score: p.score.overall, grade: p.score.grade })),
    generatedAt: new Date().toISOString(),
  };
}

function countGrades(grades: string[]): Record<string, number> {
  const dist: Record<string, number> = {};
  for (const g of grades) dist[g] = (dist[g] || 0) + 1;
  return dist;
}
