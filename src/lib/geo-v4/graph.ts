import { nodes, type GraphNode } from '../../content/graph/nodes';
import { relations, type GraphRelation } from '../../content/graph/relations';

export function getNode(id: string): GraphNode | undefined {
  return nodes.find(n => n.id === id);
}

export function getNodesByType(type: string): GraphNode[] {
  return nodes.filter(n => n.type === type);
}

export function getRelations(id: string): GraphRelation[] {
  return relations.filter(r => r.source === id);
}

export function getRelatedNodes(nodeId: string): GraphNode[] {
  const node = getNode(nodeId);
  if (!node) return [];
  return node.related.map(id => getNode(id)).filter(Boolean) as GraphNode[];
}

export function getRelatedByType(nodeId: string, type: string): GraphNode[] {
  return getRelatedNodes(nodeId).filter(n => n.type === type);
}

export function getInboundRelations(id: string): GraphRelation[] {
  return relations.filter(r => r.target === id);
}

export { nodes, relations };
