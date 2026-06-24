import type { PageAnalysis, GeoRuleResult } from './types';

const RULES: { name: string; weight: number; fn: (p: PageAnalysis) => { passed: boolean; detail: string } }[] = [
  {
    name: 'has-title',
    weight: 8,
    fn: (p) => ({ passed: p.title.length > 0, detail: p.title ? `Title: "${p.title.slice(0, 60)}"` : 'Missing <title>' }),
  },
  {
    name: 'title-length',
    weight: 5,
    fn: (p) => ({ passed: p.title.length >= 10 && p.title.length <= 70, detail: `Title length: ${p.title.length}` }),
  },
  {
    name: 'has-meta-description',
    weight: 8,
    fn: (p) => ({ passed: p.metaDescription.length > 0, detail: p.metaDescription ? 'Has meta description' : 'Missing meta description' }),
  },
  {
    name: 'meta-description-length',
    weight: 4,
    fn: (p) => ({ passed: p.metaDescription.length >= 50 && p.metaDescription.length <= 160, detail: `Meta desc length: ${p.metaDescription.length}` }),
  },
  {
    name: 'has-h1',
    weight: 7,
    fn: (p) => {
      const h1 = p.headings.filter((h) => h.level === 1);
      return { passed: h1.length === 1, detail: h1.length === 1 ? `One H1: "${h1[0].text.slice(0, 50)}"` : `H1 count: ${h1.length}` };
    },
  },
  {
    name: 'heading-hierarchy',
    weight: 6,
    fn: (p) => {
      const levels = p.headings.map((h) => h.level);
      let valid = true;
      for (let i = 1; i < levels.length; i++) {
        if (levels[i] > levels[i - 1] + 1) { valid = false; break; }
      }
      return { passed: valid, detail: `Heading depth valid: ${valid}` };
    },
  },
  {
    name: 'has-semantic-main',
    weight: 6,
    fn: (p) => ({ passed: p.hasMain, detail: p.hasMain ? 'Has <main>' : 'Missing <main>' }),
  },
  {
    name: 'has-semantic-nav',
    weight: 4,
    fn: (p) => ({ passed: p.hasNav, detail: p.hasNav ? 'Has <nav>' : 'Missing <nav>' }),
  },
  {
    name: 'has-semantic-article',
    weight: 5,
    fn: (p) => ({ passed: p.hasArticle, detail: p.hasArticle ? 'Has <article>' : 'Missing <article>' }),
  },
  {
    name: 'has-lang-attr',
    weight: 4,
    fn: (p) => ({ passed: p.hasLangAttr, detail: p.hasLangAttr ? 'Has lang attr' : 'Missing lang attr' }),
  },
  {
    name: 'has-viewport',
    weight: 3,
    fn: (p) => ({ passed: p.hasViewport, detail: p.hasViewport ? 'Has viewport meta' : 'Missing viewport' }),
  },
  {
    name: 'has-canonical',
    weight: 5,
    fn: (p) => ({ passed: p.hasCanonical, detail: p.hasCanonical ? 'Has canonical URL' : 'Missing canonical' }),
  },
  {
    name: 'json-ld-present',
    weight: 9,
    fn: (p) => ({
      passed: p.jsonLdTypes.length > 0,
      detail: p.jsonLdTypes.length > 0 ? `JSON-LD types: ${p.jsonLdTypes.join(', ')}` : 'No JSON-LD found',
    }),
  },
  {
    name: 'og-title',
    weight: 5,
    fn: (p) => ({ passed: 'title' in p.ogTags, detail: 'title' in p.ogTags ? 'Has og:title' : 'Missing og:title' }),
  },
  {
    name: 'og-description',
    weight: 5,
    fn: (p) => ({ passed: 'description' in p.ogTags, detail: 'description' in p.ogTags ? 'Has og:description' : 'Missing og:description' }),
  },
  {
    name: 'og-image',
    weight: 4,
    fn: (p) => ({ passed: 'image' in p.ogTags, detail: 'image' in p.ogTags ? 'Has og:image' : 'Missing og:image' }),
  },
  {
    name: 'content-length',
    weight: 6,
    fn: (p) => ({ passed: p.wordCount >= 100, detail: `Word count: ${p.wordCount}` }),
  },
  {
    name: 'internal-links',
    weight: 5,
    fn: (p) => {
      const internal = p.links.filter((l) => l.isInternal).length;
      return { passed: internal >= 2, detail: `Internal links: ${internal}` };
    },
  },
  {
    name: 'external-links',
    weight: 3,
    fn: (p) => {
      const external = p.links.filter((l) => !l.isInternal).length;
      return { passed: external > 0, detail: `External links: ${external}` };
    },
  },
  {
    name: 'images-have-alt',
    weight: 4,
    fn: (p) => {
      const withAlt = p.images.filter((img) => img.alt.length > 0).length;
      const total = p.images.length;
      const ratio = total > 0 ? withAlt / total : 1;
      return { passed: ratio >= 0.5, detail: `Alt text on ${withAlt}/${total} images` };
    },
  },
  {
    name: 'llms-txt-referenced',
    weight: 2,
    fn: (p) => ({ passed: p.hasLLMsTxt, detail: p.hasLLMsTxt ? 'References llms.txt' : 'No llms.txt reference' }),
  },
];

export function runRules(analysis: PageAnalysis): GeoRuleResult[] {
  return RULES.map((rule) => {
    const result = rule.fn(analysis);
    return {
      rule: rule.name,
      passed: result.passed,
      score: result.passed ? rule.weight : 0,
      weight: rule.weight,
      detail: result.detail,
    };
  });
}

export function getMaxScore(): number {
  return RULES.reduce((sum, r) => sum + r.weight, 0);
}
