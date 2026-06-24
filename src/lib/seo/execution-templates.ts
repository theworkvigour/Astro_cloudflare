import type { ContentV2Record } from '~/data/content-v2';
import { TIER_A_SLUGS } from './constants';

export interface TitleTemplate {
  original: string;
  rewrite: string;
  pattern: string;
}

export interface ContentExpansionPlan {
  slug: string;
  currentFaqCount: number;
  sectionsToAdd: string[];
  faqsToAdd: string[];
  comparisonNeeded: boolean;
  internalLinksToAdd: string[];
}

export interface LinkInjectionPlan {
  from: string;
  to: string;
  anchorText: string;
  reason: string;
}

const TITLE_PATTERNS: Record<string, string> = {
  beginner: 'Keyword + Benefit + "Avoid These Common Mistakes"',
  safety: 'Keyword + "What You MUST Know Before Paddling Out"',
  guide: 'Keyword + "What Actually Works"',
  comparison: 'Keyword + "The Honest Answer Nobody Gives You"',
  default: 'Keyword + Benefit + Warning/Conflict',
};

export function getTitlePattern(entry: ContentV2Record): string {
  if (entry.slug.includes('beginner') || entry.difficulty === 'beginner') return TITLE_PATTERNS.beginner;
  if (entry.slug.includes('safety')) return TITLE_PATTERNS.safety;
  if (entry.category === 'comparison' || entry.slug.includes('vs')) return TITLE_PATTERNS.comparison;
  if (entry.category === 'guide' || entry.type === 'buying-guide') return TITLE_PATTERNS.guide;
  return TITLE_PATTERNS.default;
}

export function generateTitleRewrite(entry: ContentV2Record): string | null {
  const clean = entry.title.replace(/\(.*?\)/g, '').trim();
  if (entry.slug.includes('beginner')) return `${clean} (Avoid These Common Mistakes)`;
  if (entry.slug.includes('safety')) return `${clean} (What You MUST Know Before Paddling Out)`;
  if (entry.category === 'comparison' || entry.slug.includes('vs')) return `${clean} (The Honest Answer Nobody Gives You)`;
  if (entry.category === 'guide' || entry.type === 'buying-guide') return `${clean} (What Actually Works)`;
  if (entry.slug.includes('etiquette')) return `${clean} (How to Not Be the Person Everyone Avoids)`;
  if (entry.slug.includes('brand') || entry.slug.includes('exists')) return `${clean} (The Problem With Most Water Sports Brands)`;
  return `${clean} (Avoid These Mistakes)`;
}

export function generateContentExpansionPlan(entry: ContentV2Record): ContentExpansionPlan {
  const sectionsToAdd: string[] = [];
  const faqsToAdd: string[] = [];

  if (!entry.tldr || entry.tldr.length < 60) sectionsToAdd.push('TLDR summary block (2-3 sentences)');
  if (!entry.definition || entry.definition.length < 50) sectionsToAdd.push('Definition block with key terminology');
  if (entry.explanation.length < 300) sectionsToAdd.push('Expanded explanation section (+30% depth with examples)');
  if (!entry.solution || entry.solution.length < 100) sectionsToAdd.push('Step-by-step solution section');
  if (entry.faq.length < 3) {
    sectionsToAdd.push('FAQ section with 3+ items');
    faqsToAdd.push('What is the most important factor for beginners?');
    faqsToAdd.push('How long does it take to see results?');
    faqsToAdd.push('What is the most common mistake people make?');
  }
  if (entry.category === 'comparison') sectionsToAdd.push('Comparison table with pros/cons');

  const internalLinksToAdd: string[] = [];
  if (!entry.relatedGuides.some(s => TIER_A_SLUGS.includes(s))) {
    internalLinksToAdd.push(TIER_A_SLUGS[0]);
  }
  if (entry.relatedProducts.length === 0) {
    internalLinksToAdd.push('Add product link for conversion path');
  }

  return {
    slug: entry.slug,
    currentFaqCount: entry.faq.length,
    sectionsToAdd,
    faqsToAdd,
    comparisonNeeded: entry.category === 'comparison',
    internalLinksToAdd,
  };
}

export function generateLinkInjectionPlans(entries: ContentV2Record[], allEntries: ContentV2Record[]): LinkInjectionPlan[] {
  const plans: LinkInjectionPlan[] = [];
  for (const entry of entries) {
    const hasCoreLink = entry.relatedGuides.some(s => TIER_A_SLUGS.includes(s));
    if (!hasCoreLink && !TIER_A_SLUGS.includes(entry.slug)) {
      plans.push({
        from: entry.slug,
        to: TIER_A_SLUGS[0],
        anchorText: 'how to choose a surfboard for beginners',
        reason: 'Missing link to Tier A core guide — add authority flow',
      });
    }
    const allTargetSlugs = allEntries.map(e => e.slug);
    const existingSlugs = new Set([entry.slug, ...entry.relatedGuides]);
    const candidates = allTargetSlugs.filter(s => !existingSlugs.has(s) && !TIER_A_SLUGS.includes(s));
    if (candidates.length > 0 && entry.relatedGuides.length < 3) {
      const pick = candidates[0];
      plans.push({
        from: entry.slug,
        to: pick,
        anchorText: pick.replace(/-/g, ' '),
        reason: `Low link count (${entry.relatedGuides.length}) — add related content link`,
      });
    }
  }
  return plans;
}

export const EXECUTION_STEPS: Record<string, string[]> = {
  TITLE_FIX: [
    'Remove weak title structure (generic "How to X")',
    'Add emotional trigger: "Avoid These Mistakes" / "What You MUST Know"',
    'Add benefit promise: "What Actually Works" / "The Honest Answer"',
    'Keep keyword at the front of the title',
    'Keep title under 65 characters',
  ],
  CONTENT_EXPANSION: [
    'Add TLDR block (2-3 sentences, bullet-free)',
    'Add Definition block with data-ai-block="definition"',
    'Expand explanation section (+30%, add real examples)',
    'Add FAQ section with 3+ items and schema.org markup',
    'Add comparison table if applicable',
    'Add 2-3 internal links to related guides and products',
  ],
  LINK_INJECT: [
    'Add link to Tier A core guide (surfboard, wetsuit, or beginner surfing)',
    'Use descriptive anchor text (not "click here")',
    'Place link in natural context within explanation or solution section',
    'Add product link for conversion path if missing',
    'Verify total links per page ≥ 5',
  ],
  NEW_SECTION: [
    'Identify the long-tail keyword gap',
    'Add a dedicated section (300+ words) targeting the keyword',
    'Include H2 heading with the keyword phrase',
    'Add internal links from this section to related content',
    'Add FAQ entry if the keyword is question-based',
  ],
};
