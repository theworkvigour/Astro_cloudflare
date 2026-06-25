import { nodes } from '../../content/graph/nodes';
import { relations } from '../../content/graph/relations';

export function resolveNodeSlug(slug: string) {
  return nodes.find(n => n.id === slug);
}

export function getRelatedSlugs(id: string): string[] {
  const node = nodes.find(n => n.id === id);
  if (!node) return [];
  return node.related;
}

export function resolveRelations(id: string) {
  return {
    outgoing: relations.filter(r => r.source === id),
    incoming: relations.filter(r => r.target === id),
  };
}

export function getNodeName(id: string, lang: string = 'en'): string {
  const node = nodes.find(n => n.id === id);
  if (!node) return id;
  return node.name[lang] || node.name.en;
}
