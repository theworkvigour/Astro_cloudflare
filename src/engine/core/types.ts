export interface GeoRuleResult {
  rule: string;
  passed: boolean;
  score: number;
  weight: number;
  detail: string;
}

export interface PageAnalysis {
  url: string;
  title: string;
  metaDescription: string;
  headings: { level: number; text: string }[];
  semanticElements: string[];
  jsonLdTypes: string[];
  ogTags: Record<string, string>;
  links: { href: string; text: string; isInternal: boolean }[];
  images: { src: string; alt: string }[];
  wordCount: number;
  contentLength: number;
  hasMain: boolean;
  hasNav: boolean;
  hasArticle: boolean;
  hasLangAttr: boolean;
  hasViewport: boolean;
  hasCanonical: boolean;
  hasLLMsTxt: boolean;
}

export interface GeoScore {
  overall: number;
  grade: string;
  categories: Record<string, number>;
  rules: GeoRuleResult[];
  llmReadability: LlmReadabilityScore;
}

export interface LlmReadabilityScore {
  score: number;
  grade: string;
  signals: {
    semanticStructure: number;
    metadata: number;
    contentQuality: number;
    entityRichness: number;
    linkHealth: number;
  };
}

export interface SiteAuditResult {
  site: string;
  pagesAnalyzed: number;
  pageResults: PageAnalysis[];
  siteScore: GeoScore;
  linkGraph: LinkGraph;
  generatedAt: string;
}

export interface LinkGraph {
  totalInternal: number;
  totalExternal: number;
  brokenLinks: { href: string; sourceUrl: string }[];
  internalGraph: Record<string, string[]>;
}

export interface GeoDashboardData {
  lastAudit: SiteAuditResult | null;
  recentScores: { url: string; score: number; grade: string; timestamp: string }[];
  quota: { remaining: number; limit: number };
}
