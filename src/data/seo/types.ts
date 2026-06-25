export interface GscQuery {
  query: string;
  page?: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
}

export interface GscPage {
  path: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  category: 'high-impression-low-ctr' | 'mid-rank' | 'no-exposure';
}

export interface AiCitationSignal {
  platform: 'ChatGPT' | 'Perplexity' | 'Google SGE' | 'Gemini';
  referenced: boolean;
  lastDetected?: string;
  snippet?: string;
}

export interface PositionChange {
  slug: string;
  title: string;
  previousPosition: number;
  currentPosition: number;
  delta: number;
  week: string;
}

export interface PageHealthScore {
  slug: string;
  title: string;
  ctrScore: number;
  positionScore: number;
  contentDepthScore: number;
  internalLinksScore: number;
  aiStructureScore: number;
  total: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface WeeklyWorkflow {
  week: string;
  day1: { task: string; status: 'done' | 'pending' | 'skipped' };
  day2: { task: string; status: 'done' | 'pending' | 'skipped' };
  day3_4: { task: string; status: 'done' | 'pending' | 'skipped' };
  day5: { task: string; status: 'done' | 'pending' | 'skipped' };
  day6_7: { task: string; status: 'done' | 'pending' | 'skipped' };
}

export type OptimizationType = 'ctr' | 'content' | 'links' | 'structure' | 'none';

export interface OptimizationSuggestion {
  slug: string;
  title: string;
  type: OptimizationType;
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  currentValue: string;
  expectedImpact: string;
}

export interface SeoSnapshot {
  week: string;
  impressions: number;
  clicks: number;
  avgCtr: number;
  avgPosition: number;
  topQueries: GscQuery[];
  lowCtrPages: GscPage[];
  healthScores: PageHealthScore[];
}
