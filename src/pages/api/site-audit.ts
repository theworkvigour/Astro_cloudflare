import type { APIRoute } from 'astro';
import { fetchSitemap } from '../../engine/crawler/sitemap';
import { fetchPages } from '../../engine/crawler/fetchPages';
import { analyzePage } from '../../engine/geo/pageScore';
import { calculateSiteScore } from '../../engine/geo/siteScore';
import { buildLinkGraph } from '../../engine/crawler/linkGraph';
import { generateSiteReport } from '../../engine/report/siteReport';
import { generateInsights } from '../../engine/report/insights';
import { isValidUrl } from '../../lib/url';
import { checkNeuronQuota, consumeNeurons, estimateTokens, quotaResponseHeaders, DAILY_NEURON_LIMIT } from '../../lib/ai-quota';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const site = url.searchParams.get('site');
  if (!site || !isValidUrl(site)) {
    return new Response(JSON.stringify({ error: 'Valid site parameter required' }), { status: 400 });
  }

  const quota = await checkNeuronQuota();
  if (!quota.allowed) {
    return new Response(
      JSON.stringify({ error: 'Daily AI quota exceeded', ...quota }),
      { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8', ...quotaResponseHeaders(quota.remaining, DAILY_NEURON_LIMIT) } },
    );
  }

  try {
    const pageUrls = await fetchSitemap(site);
    const pages = (await fetchPages(pageUrls)).filter((p) => p.ok);
    const results = pages.map((p) => analyzePage(p.html, p.url));
    const siteScore = calculateSiteScore(results);
    const linkGraph = buildLinkGraph(results.map((r) => r.analysis), site);
    const report = generateSiteReport(results, siteScore, linkGraph);
    const insights = generateInsights(results.map((r) => r.score));

    return new Response(
      JSON.stringify({ ...report, insights }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8', ...quotaResponseHeaders(quota.remaining, DAILY_NEURON_LIMIT) } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Audit failed';
    return new Response(JSON.stringify({ error: message }), { status: 502 });
  }
};
