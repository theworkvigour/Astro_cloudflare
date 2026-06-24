import { CRAWLER_CONFIG } from '../geo/geoWeights';

export async function fetchSitemap(site: string): Promise<string[]> {
  const urls: string[] = [];
  const sitemapUrls = [
    `${site}/sitemap-index.xml`,
    `${site}/sitemap.xml`,
    `${site}/sitemap-0.xml`,
  ];

  for (const sitemapUrl of sitemapUrls) {
    try {
      const res = await fetch(sitemapUrl, { signal: AbortSignal.timeout(CRAWLER_CONFIG.timeout) });
      if (!res.ok) continue;
      const xml = await res.text();
      const locs = extractLocs(xml);
      urls.push(...locs);
      if (urls.length >= CRAWLER_CONFIG.maxPages) break;
    } catch {
      continue;
    }
  }

  const unique = [...new Set(urls)].slice(0, CRAWLER_CONFIG.maxPages);
  return unique;
}

function extractLocs(xml: string): string[] {
  const locs: string[] = [];
  const regex = /<loc>([^<]+)<\/loc>/gi;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    locs.push(match[1].trim());
  }
  return locs;
}
