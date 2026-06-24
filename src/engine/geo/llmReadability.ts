import type { PageAnalysis, LlmReadabilityScore } from '../core/types';

export function calculateLlmReadability(analysis: PageAnalysis): LlmReadabilityScore {
  const signals = {
    semanticStructure: scoreSemanticStructure(analysis),
    metadata: scoreMetadata(analysis),
    contentQuality: scoreContentQuality(analysis),
    entityRichness: scoreEntityRichness(analysis),
    linkHealth: scoreLinkHealth(analysis),
  };

  const overall = Math.round(
    (signals.semanticStructure * 0.25 +
      signals.metadata * 0.20 +
      signals.contentQuality * 0.25 +
      signals.entityRichness * 0.15 +
      signals.linkHealth * 0.15) * 100,
  );

  return {
    score: overall,
    grade: overall >= 85 ? 'A' : overall >= 65 ? 'B' : overall >= 45 ? 'C' : 'D',
    signals,
  };
}

function scoreSemanticStructure(p: PageAnalysis): number {
  let score = 0;
  if (p.hasMain) score += 0.25;
  if (p.hasNav) score += 0.15;
  if (p.hasArticle) score += 0.20;
  if (p.hasLangAttr) score += 0.10;
  if (p.headings.filter((h) => h.level === 1).length === 1) score += 0.15;
  if (p.semanticElements.length >= 4) score += 0.15;
  return Math.min(score, 1);
}

function scoreMetadata(p: PageAnalysis): number {
  let score = 0;
  if (p.title.length > 0) score += 0.20;
  if (p.metaDescription.length > 0) score += 0.20;
  if (p.hasCanonical) score += 0.15;
  if (p.hasViewport) score += 0.10;
  if (p.jsonLdTypes.length > 0) score += 0.20;
  if ('title' in p.ogTags && 'description' in p.ogTags && 'image' in p.ogTags) score += 0.15;
  return Math.min(score, 1);
}

function scoreContentQuality(p: PageAnalysis): number {
  let score = 0;
  if (p.wordCount >= 300) score += 0.30;
  else if (p.wordCount >= 100) score += 0.15;
  if (p.headings.length >= 3) score += 0.25;
  else if (p.headings.length >= 1) score += 0.10;
  const hierarchy = p.headings.every((h, i) => i === 0 || h.level <= p.headings[i - 1].level + 1);
  if (hierarchy) score += 0.20;
  if (p.images.length > 0) score += 0.15;
  if (p.hasLLMsTxt) score += 0.10;
  return Math.min(score, 1);
}

function scoreEntityRichness(p: PageAnalysis): number {
  let score = 0;
  const uniqueTypes = new Set(p.jsonLdTypes);
  if (uniqueTypes.size >= 2) score += 0.35;
  else if (uniqueTypes.size === 1) score += 0.15;
  const semanticCount = p.semanticElements.length;
  if (semanticCount >= 5) score += 0.30;
  else if (semanticCount >= 3) score += 0.15;
  if (p.links.filter((l) => l.isInternal).length >= 5) score += 0.20;
  if (p.hasArticle) score += 0.15;
  return Math.min(score, 1);
}

function scoreLinkHealth(p: PageAnalysis): number {
  let score = 0;
  const internal = p.links.filter((l) => l.isInternal).length;
  const external = p.links.filter((l) => !l.isInternal).length;
  if (internal >= 3) score += 0.30;
  else if (internal >= 1) score += 0.10;
  if (external >= 1) score += 0.20;
  const total = internal + external;
  if (total > 0 && internal / total >= 0.4) score += 0.25;
  if (p.images.filter((img) => img.alt.length > 0).length / Math.max(p.images.length, 1) >= 0.5) score += 0.25;
  return Math.min(score, 1);
}
