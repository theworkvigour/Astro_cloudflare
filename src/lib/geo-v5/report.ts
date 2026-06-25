import { nodes } from '../../content/graph/nodes';
import { analyzeAll } from './semanticEngine';
import { scoreAllNodes, systemHealth, type NodeGEOScore } from './scoring';
import { clusterTopics } from './topicCluster';
import { generateAllLinks } from './linkOptimizer';
import { detectContentGaps, gapsBySeverity } from './gapDetector';
import { generateV5Content, type V5Content } from './generator';

export interface V5Report {
  generatedAt: string;
  summary: {
    totalNodes: number;
    totalRelations: number;
    nodeTypes: number;
  };
  scores: NodeGEOScore[];
  health: ReturnType<typeof systemHealth>;
  clusters: ReturnType<typeof clusterTopics>;
  gaps: ReturnType<typeof detectContentGaps>;
  gapsBySeverity: ReturnType<typeof gapsBySeverity>;
  v5Content: V5Content[];
  suggestedLinks: ReturnType<typeof generateAllLinks>;
  healthScore: number;
}

export function generateReport(): V5Report {
  const scores = scoreAllNodes(analyzeAll(nodes).map(a => ({ id: a.id, score: a.score })));
  const health = systemHealth(scores);
  const gaps = detectContentGaps(nodes);
  const totalPossible = 100 * nodes.length;
  const actualTotal = scores.reduce((sum, s) => sum + s.total, 0);
  const healthScore = Math.round((actualTotal / totalPossible) * 100);

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalNodes: nodes.length,
      totalRelations: nodes.reduce((sum, n) => sum + n.related.length, 0),
      nodeTypes: new Set(nodes.map(n => n.type)).size,
    },
    scores,
    health,
    clusters: clusterTopics(nodes),
    gaps,
    gapsBySeverity: gapsBySeverity(gaps),
    v5Content: generateV5Content(),
    suggestedLinks: generateAllLinks(nodes),
    healthScore,
  };
}
