import type { GraphNode } from '../../content/graph/nodes';

export interface InternalLink {
  from: string;
  to: string;
  label: string;
}

export function generateInternalLinks(
  node: GraphNode,
  allNodes: GraphNode[],
  maxLinks: number = 5
): InternalLink[] {
  const candidates = allNodes
    .filter(n => n.id !== node.id)
    .filter(n => n.type !== node.type)
    .filter(n => !node.related.includes(n.id));

  return candidates.slice(0, maxLinks).map(n => ({
    from: node.id,
    to: n.id,
    label: `${node.name.en} → ${n.name.en}`,
  }));
}

export function generateAllLinks(nodes: GraphNode[]): InternalLink[] {
  const links: InternalLink[] = [];
  for (const node of nodes) {
    links.push(...generateInternalLinks(node, nodes));
  }
  return links;
}

export function suggestRelatedByKeyword(node: GraphNode, allNodes: GraphNode[]): InternalLink[] {
  const nodeWords = (node.name.en + ' ' + node.description.en).toLowerCase().split(/\W+/).filter(Boolean);
  const scored = allNodes
    .filter(n => n.id !== node.id)
    .map(n => {
      const targetWords = (n.name.en + ' ' + n.description.en).toLowerCase().split(/\W+/).filter(Boolean);
      const overlap = nodeWords.filter(w => targetWords.includes(w)).length;
      return { node: n, score: overlap };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return scored.map(s => ({
    from: node.id,
    to: s.node.id,
    label: `${node.name.en} ↔ ${s.node.name.en} (keyword overlap: ${s.score})`,
  }));
}
