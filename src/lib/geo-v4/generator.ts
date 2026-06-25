import { nodes } from '../../content/graph/nodes';
import { guideFromNode, useCaseFromNode, compareTemplate, type GeneratedGuide, type GeneratedPage } from './templates';

function notNull<T>(x: T | null | undefined): x is T {
  return x != null;
}

export function generateGuides(lang: string = 'en'): GeneratedGuide[] {
  return nodes
    .map(node => guideFromNode(node, lang))
    .filter(notNull);
}

export function generateUseCases(lang: string = 'en'): GeneratedPage[] {
  return nodes
    .filter(n => n.type === 'use-case')
    .map(node => useCaseFromNode(node, lang))
    .filter(notNull);
}

export function generateComparisons(lang: string = 'en') {
  const productNodes = nodes.filter(n => n.type === 'product-category');
  const results: GeneratedPage[] = [];

  for (let i = 0; i < productNodes.length; i++) {
    for (let j = i + 1; j < productNodes.length; j++) {
      results.push(compareTemplate(productNodes[i], productNodes[j], lang));
    }
  }

  return results;
}

export function generateAll(lang: string = 'en') {
  return {
    guides: generateGuides(lang),
    useCases: generateUseCases(lang),
    comparisons: generateComparisons(lang),
  };
}
