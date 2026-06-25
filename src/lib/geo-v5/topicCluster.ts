import type { GraphNode } from '../../content/graph/nodes';

export interface TopicCluster {
  type: string;
  nodes: GraphNode[];
  count: number;
}

export function clusterByType(nodes: GraphNode[]): TopicCluster[] {
  const map = new Map<string, GraphNode[]>();

  for (const node of nodes) {
    const list = map.get(node.type) || [];
    list.push(node);
    map.set(node.type, list);
  }

  return Array.from(map.entries()).map(([type, nodes]) => ({
    type,
    nodes,
    count: nodes.length,
  }));
}

export function clusterTopics(nodes: GraphNode[]): Record<string, GraphNode[]> {
  return {
    equipment: nodes.filter(n => n.type === 'product-category'),
    useCase: nodes.filter(n => n.type === 'use-case'),
    material: nodes.filter(n => n.type === 'material'),
    technology: nodes.filter(n => n.type === 'technology'),
    component: nodes.filter(n => n.type === 'component'),
    concept: nodes.filter(n => n.type === 'concept'),
  };
}
