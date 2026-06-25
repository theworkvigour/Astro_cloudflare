import type { GraphNode } from '../../content/graph/nodes';
import { localized } from './i18n';

export interface GuideSection {
  h2: string;
  content: string[] | string;
}

export interface GeneratedGuide {
  slug: string;
  title: string;
  description: string;
  sections: GuideSection[];
  faq: Array<{ q: string; a: string }>;
}

export interface GeneratedPage {
  slug: string;
  title: string;
  description: string;
  sections: GuideSection[];
  faq: Array<{ q: string; a: string }>;
}

export function guideFromNode(node: GraphNode, lang: string = 'en'): GeneratedGuide | null {
  if (node.type !== 'product-category' && node.type !== 'technology' && node.type !== 'material' && node.type !== 'component') return null;

  const name = localized(node.name, lang) || localized(node.name, 'en') || '';
  const desc = localized(node.description, lang) || localized(node.description, 'en') || '';
  const features = localized(node.features, lang) || localized(node.features, 'en') || [];
  const useCases = localized(node.useCases, lang) || localized(node.useCases, 'en') || [];
  const faq = localized(node.faq, lang) || localized(node.faq, 'en') || [];

  const sections: GuideSection[] = [
    { h2: 'Definition', content: desc },
  ];

  if (features.length) {
    sections.push({ h2: 'Key Features', content: features.map(f => `- ${f}`) });
  }

  if (useCases.length) {
    sections.push({ h2: 'Use Cases', content: useCases.map(u => `- ${u}`) });
  }

  const related = (node.related || []).map(id => `- ${id}`);
  if (related.length) {
    sections.push({ h2: 'Related Components', content: related });
  }

  return {
    slug: (node.slug && node.slug[lang]) || node.id,
    title: `What is ${name}?`,
    description: desc,
    sections,
    faq,
  };
}

export function useCaseFromNode(node: GraphNode, lang: string = 'en'): GeneratedPage | null {
  if (node.type !== 'use-case') return null;

  const name = localized(node.name, lang) || localized(node.name, 'en') || '';
  const desc = localized(node.description, lang) || localized(node.description, 'en') || '';
  const features = localized(node.features, lang) || localized(node.features, 'en') || [];
  const useCases = localized(node.useCases, lang) || localized(node.useCases, 'en') || [];
  const faq = localized(node.faq, lang) || localized(node.faq, 'en') || [];

  const sections: GuideSection[] = [
    { h2: 'What is this use case?', content: desc },
  ];

  if (features.length) {
    sections.push({ h2: 'Key Features', content: features.map(f => `- ${f}`) });
  }

  if (useCases.length) {
    sections.push({ h2: 'Scenarios', content: useCases.map(u => `- ${u}`) });
  }

  const related = (node.related || []).map(id => `- ${id}`);
  if (related.length) {
    sections.push({ h2: 'Recommended Equipment', content: related });
  }

  return {
    slug: (node.slug && node.slug[lang]) || node.id,
    title: name,
    description: desc,
    sections,
    faq,
  };
}

export function compareTemplate(a: GraphNode, b: GraphNode, lang: string = 'en'): GeneratedPage {
  const aName = localized(a.name, lang) || localized(a.name, 'en') || a.id;
  const bName = localized(b.name, lang) || localized(b.name, 'en') || b.id;
  const aDesc = localized(a.description, lang) || localized(a.description, 'en') || '';
  const bDesc = localized(b.description, lang) || localized(b.description, 'en') || '';
  const aFeatures = localized(a.features, lang) || localized(a.features, 'en') || [];
  const bFeatures = localized(b.features, lang) || localized(b.features, 'en') || [];
  const aUseCases = localized(a.useCases, lang) || localized(a.useCases, 'en') || [];
  const bUseCases = localized(b.useCases, lang) || localized(b.useCases, 'en') || [];

  const sections: GuideSection[] = [
    {
      h2: 'Comparison Overview',
      content: [`Comparing **${aName}** vs **${bName}** across key factors.`],
    },
    {
      h2: 'Quick Comparison Table',
      content: [
        `| Factor | ${aName} | ${bName} |`,
        `|---|---|---|`,
        `| Type | ${a.type} | ${b.type} |`,
        `| Portability | Inflatable | Varies |`,
        `| Best For | ${(aUseCases || []).slice(0, 3).join(', ')} | ${(bUseCases || []).slice(0, 3).join(', ')} |`,
      ],
    },
    {
      h2: `About ${aName}`,
      content: [aDesc],
    },
    {
      h2: `About ${bName}`,
      content: [bDesc],
    },
  ];

  if (aFeatures.length && bFeatures.length) {
    sections.push({
      h2: 'Feature Comparison',
      content: [
        `**${aName}:** ${aFeatures.slice(0, 4).join(', ')}`,
        '',
        `**${bName}:** ${bFeatures.slice(0, 4).join(', ')}`,
      ],
    });
  }

  sections.push({
    h2: 'Which Should You Choose?',
    content: [
      `Choose **${aName}** if you prioritize ${(aFeatures || ['versatility']).slice(0, 2).join(' and ')}.`,
      '',
      `Choose **${bName}** if you need ${(bFeatures || ['performance']).slice(0, 2).join(' and ')}.`,
    ],
  });

  return {
    slug: `${a.id}-vs-${b.id}`,
    title: `${aName} vs ${bName}: Comparison Guide`,
    description: `Compare ${aName} and ${bName} across portability, performance, features, and use cases.`,
    sections,
    faq: [],
  };
}
