import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { checkNeuronQuota, consumeNeurons, estimateTokens, quotaResponseHeaders, DAILY_NEURON_LIMIT } from '../../lib/ai-quota';

export const prerender = false;

const EMBED_MODEL = '@cf/baai/bge-base-en-v1.5';

export const POST: APIRoute = async ({ request }) => {
  let body: { query?: string; topK?: number };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const query = body.query?.trim();
  if (!query) {
    return new Response(JSON.stringify({ error: 'query is required' }), { status: 400 });
  }

  const topK = Math.min(body.topK || 5, 20);

  const quota = await checkNeuronQuota(env as any);
  if (!quota.allowed) {
    return new Response(
      JSON.stringify({ error: 'Daily AI quota exceeded', ...quota }),
      { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8', ...quotaResponseHeaders(quota.remaining, DAILY_NEURON_LIMIT) } },
    );
  }

  try {
    const inputTokens = estimateTokens(query);
    const consume = await consumeNeurons(EMBED_MODEL, inputTokens, 0, env as any);
    if (!consume.allowed) {
      return new Response(
        JSON.stringify({ error: 'Daily AI quota exceeded', remaining: consume.remaining, limit: DAILY_NEURON_LIMIT }),
        { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8', ...quotaResponseHeaders(consume.remaining, DAILY_NEURON_LIMIT) } },
      );
    }

    const aiRes = await env.AI.run(EMBED_MODEL, { text: [query] }) as { data: Array<number[]> };
    const vector = aiRes.data[0];

    const results = await env.VECTORIZE.query(vector, { topK });

    const matches = (results.matches || [])
      .filter((m: any) => m.score > 0.25)
      .map((m: any) => ({
        id: m.id,
        score: Math.round(m.score * 10000) / 10000,
        title: (m.metadata as any)?.title || '',
        url: (m.metadata as any)?.url || '',
        text: ((m.metadata as any)?.text || '').slice(0, 400),
      }));

    return new Response(
      JSON.stringify({ query, results: matches, total: matches.length }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8', ...quotaResponseHeaders(consume.remaining, DAILY_NEURON_LIMIT) } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } },
    );
  }
};
