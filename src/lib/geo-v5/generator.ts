import { nodes } from '../../content/graph/nodes';
import { analyzeNode } from './semanticEngine';
import { calculateGEOScore } from './scoring';
import type { GraphNode } from '../../content/graph/nodes';

export interface V5Content {
  id: string;
  seoScore: number;
  aiScore: number;
  geoGrade: string;
  needsImprovement: boolean;
  missing: string[];
  template: {
    title: string;
    sections: string[];
  };
}

function buildTemplate(node: GraphNode) {
  const sections = ['definition'];
  if (node.features?.en?.length) sections.push('features');
  if (node.useCases?.en?.length) sections.push('use-cases');
  if (node.faq?.en?.length) sections.push('faq');
  sections.push('related');
  return {
    title: `What is ${node.name.en}?`,
    sections,
  };
}

export function generateV5Content(): V5Content[] {
  return nodes.map(node => {
    const analysis = analyzeNode(node);
    const geo = calculateGEOScore(analysis.score);

    return {
      id: node.id,
      seoScore: analysis.score.seo,
      aiScore: analysis.score.ai,
      geoGrade: geo.grade,
      needsImprovement: analysis.missing.length > 0,
      missing: analysis.missing,
      template: buildTemplate(node),
    };
  });
}
