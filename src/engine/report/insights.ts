import type { GeoScore } from '../core/types';

export interface Insight {
  type: 'positive' | 'warning' | 'critical';
  message: string;
  category: string;
}

export function generateInsights(scores: GeoScore[]): Insight[] {
  const insights: Insight[] = [];

  const avgScore = scores.length > 0 ? scores.reduce((s, p) => s + p.overall, 0) / scores.length : 0;

  if (avgScore >= 75) {
    insights.push({ type: 'positive', message: `Average GEO score is ${Math.round(avgScore)} (B or higher)`, category: 'overall' });
  } else if (avgScore >= 55) {
    insights.push({ type: 'warning', message: `Average GEO score is ${Math.round(avgScore)} — room for improvement`, category: 'overall' });
  } else {
    insights.push({ type: 'critical', message: `Average GEO score is ${Math.round(avgScore)} — needs significant improvement`, category: 'overall' });
  }

  const catAverages: Record<string, number[]> = {};
  for (const s of scores) {
    for (const [cat, val] of Object.entries(s.categories)) {
      if (!catAverages[cat]) catAverages[cat] = [];
      catAverages[cat].push(val);
    }
  }

  for (const [cat, vals] of Object.entries(catAverages)) {
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    if (avg < 40) {
      insights.push({ type: 'critical', message: `Low score in "${cat}" (${Math.round(avg)}%)`, category: cat });
    } else if (avg < 60) {
      insights.push({ type: 'warning', message: `"${cat}" could be improved (${Math.round(avg)}%)`, category: cat });
    } else if (avg >= 85) {
      insights.push({ type: 'positive', message: `Strong "${cat}" score (${Math.round(avg)}%)`, category: cat });
    }
  }

  return insights;
}
