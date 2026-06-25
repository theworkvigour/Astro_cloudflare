import type { NodeScore } from './semanticEngine';

export interface GEOScore {
  total: number;
  grade: 'A' | 'B' | 'C';
}

export function calculateGEOScore(score: NodeScore): GEOScore {
  const total = Math.round((score.seo + score.ai + score.structure) / 3);
  const grade: 'A' | 'B' | 'C' =
    score.seo >= 80 && score.ai >= 80 ? 'A' :
    score.seo >= 60 ? 'B' : 'C';
  return { total, grade };
}

export interface NodeGEOScore {
  id: string;
  seo: number;
  ai: number;
  structure: number;
  total: number;
  grade: string;
}

export function scoreAllNodes(scores: { id: string; score: NodeScore }[]): NodeGEOScore[] {
  return scores.map(s => {
    const geo = calculateGEOScore(s.score);
    return {
      id: s.id,
      seo: s.score.seo,
      ai: s.score.ai,
      structure: s.score.structure,
      total: geo.total,
      grade: geo.grade,
    };
  });
}

export function systemHealth(scores: NodeGEOScore[]): {
  averageTotal: number;
  aCount: number;
  bCount: number;
  cCount: number;
  weakest: NodeGEOScore | null;
  strongest: NodeGEOScore | null;
} {
  const avg = scores.reduce((sum, s) => sum + s.total, 0) / scores.length;
  const aCount = scores.filter(s => s.grade === 'A').length;
  const bCount = scores.filter(s => s.grade === 'B').length;
  const cCount = scores.filter(s => s.grade === 'C').length;
  const sorted = [...scores].sort((a, b) => a.total - b.total);

  return {
    averageTotal: Math.round(avg),
    aCount,
    bCount,
    cCount,
    weakest: sorted[0] || null,
    strongest: sorted[sorted.length - 1] || null,
  };
}
