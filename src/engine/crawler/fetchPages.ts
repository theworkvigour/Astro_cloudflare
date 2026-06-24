import { CRAWLER_CONFIG } from '../geo/geoWeights';

export async function fetchPage(url: string): Promise<{ url: string; html: string; ok: boolean }> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(CRAWLER_CONFIG.timeout) });
    const html = await res.text();
    return { url, html: html.slice(0, CRAWLER_CONFIG.maxContentLength), ok: res.ok };
  } catch {
    return { url, html: '', ok: false };
  }
}

export async function fetchPages(urls: string[]): Promise<{ url: string; html: string; ok: boolean }[]> {
  const results: { url: string; html: string; ok: boolean }[] = [];
  const queue = [...urls];

  while (queue.length > 0) {
    const batch = queue.splice(0, CRAWLER_CONFIG.concurrency);
    const batchResults = await Promise.all(batch.map((url) => fetchPage(url)));
    results.push(...batchResults);
  }

  return results;
}
