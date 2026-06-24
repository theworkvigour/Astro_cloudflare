export const GEO_WEIGHTS = {
  semantic: 0.25,
  metadata: 0.20,
  content: 0.25,
  entities: 0.15,
  links: 0.15,
} as const;

export const GEO_THRESHOLDS = {
  A: 85,
  B: 65,
  C: 45,
  D: 25,
} as const;

export const CRAWLER_CONFIG = {
  maxPages: 50,
  concurrency: 5,
  timeout: 10000,
  maxContentLength: 500_000,
} as const;
