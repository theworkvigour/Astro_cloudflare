import type { APIRoute } from 'astro';
import { analyzePage } from '../../engine/geo/pageScore';
import { generatePageReport } from '../../engine/report/pageReport';
import { isValidUrl } from '../../lib/url';
import { checkNeuronQuota, consumeNeurons, estimateTokens, quotaResponseHeaders, DAILY_NEURON_LIMIT } from '../../lib/ai-quota';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const target = url.searchParams.get('url');
  if (!target || !isValidUrl(target)) {
    return new Response(JSON.stringify({ error: 'Valid url parameter required' }), { status: 400 });
  }

  const quota = await checkNeuronQuota();
  if (!quota.allowed) {
    return new Response(
      JSON.stringify({ error: 'Daily AI quota exceeded', ...quota }),
      { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8', ...quotaResponseHeaders(quota.remaining, DAILY_NEURON_LIMIT) } },
    );
  }

  try {
    const res = await fetch(target, { signal: AbortSignal.timeout(10000) });
    const html = await res.text();

    const inputTokens = estimateTokens(html);
    const consume = await consumeNeurons('@cf/meta/llama-3.2-3b-instruct', inputTokens, 0);
    if (!consume.allowed) {
      return new Response(
        JSON.stringify({ error: 'Daily AI quota exceeded', remaining: consume.remaining, limit: DAILY_NEURON_LIMIT }),
        { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8', ...quotaResponseHeaders(consume.remaining, DAILY_NEURON_LIMIT) } },
      );
    }

    const { analysis, score } = analyzePage(html, target);
    const report = generatePageReport(analysis, score);

    return new Response(
      JSON.stringify(report),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8', ...quotaResponseHeaders(consume.remaining, DAILY_NEURON_LIMIT) } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Fetch failed';
    return new Response(JSON.stringify({ error: message }), { status: 502 });
  }
};
