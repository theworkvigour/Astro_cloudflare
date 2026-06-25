import type { GraphNode } from '../../content/graph/nodes';

export interface NodeScore {
  seo: number;
  ai: number;
  structure: number;
}

export interface NodeAnalysis {
  id: string;
  score: NodeScore;
  missing: string[];
}

function scoreSEO(node: GraphNode): number {
  let score = 0;
  if (node.description?.en) score += 30;
  if (node.name?.en) score += 20;
  if (node.type) score += 20;
  if (node.related?.length > 0) score += 30;
  return score;
}

function scoreAIReadability(node: GraphNode): number {
  let score = 50;
  const desc = node.description?.en;
  if (desc && desc.length > 80) score += 20;
  if (node.related && node.related.length > 2) score += 15;
  if (node.features?.en && node.features.en.length > 0) score += 15;
  return score;
}

function scoreStructure(node: GraphNode): number {
  let score = 40;
  if (node.type) score += 10;
  if (node.related && node.related.length > 0) score += 20;
  if (node.features?.en && node.features.en.length > 0) score += 15;
  if (node.useCases?.en && node.useCases.en.length > 0) score += 15;
  return score;
}

function detectMissing(node: GraphNode): string[] {
  const missing: string[] = [];
  if (!node.description?.en) missing.push('description');
  if (!node.related || !node.related.length) missing.push('relations');
  if (!node.useCases?.en || !node.useCases.en.length) missing.push('use-cases');
  if (!node.features?.en || !node.features.en.length) missing.push('features');
  return missing;
}

export function analyzeNode(node: GraphNode): NodeAnalysis {
  return {
    id: node.id,
    score: {
      seo: scoreSEO(node),
      ai: scoreAIReadability(node),
      structure: scoreStructure(node),
    },
    missing: detectMissing(node),
  };
}

export function analyzeAll(nodes: GraphNode[]): NodeAnalysis[] {
  return nodes.map(analyzeNode);
}
