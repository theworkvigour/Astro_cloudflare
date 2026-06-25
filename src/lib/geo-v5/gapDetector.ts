import type { GraphNode } from '../../content/graph/nodes';

export interface ContentGap {
  node: string;
  issue: string;
  severity: 'high' | 'medium' | 'low';
}

export function detectContentGaps(nodes: GraphNode[]): ContentGap[] {
  const gaps: ContentGap[] = [];

  for (const node of nodes) {
    if (!node.useCases?.en?.length) {
      gaps.push({ node: node.id, issue: 'missing use-cases', severity: 'high' });
    }
    if (!node.faq?.en?.length) {
      gaps.push({ node: node.id, issue: 'missing FAQ', severity: 'high' });
    }
    if (!node.features?.en?.length) {
      gaps.push({ node: node.id, issue: 'missing features', severity: 'medium' });
    }
    const desc = node.description?.en;
    if (!desc || desc.length < 50) {
      gaps.push({ node: node.id, issue: 'description too short (< 50 chars)', severity: 'medium' });
    }
    if (!node.related || !node.related.length) {
      gaps.push({ node: node.id, issue: 'no relations defined', severity: 'high' });
    }
  }

  return gaps;
}

export function gapsBySeverity(gaps: ContentGap[]): Record<string, ContentGap[]> {
  return {
    high: gaps.filter(g => g.severity === 'high'),
    medium: gaps.filter(g => g.severity === 'medium'),
    low: gaps.filter(g => g.severity === 'low'),
  };
}
