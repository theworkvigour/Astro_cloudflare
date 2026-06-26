import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { checkNeuronQuota, consumeNeurons, estimateTokens, quotaResponseHeaders, DAILY_NEURON_LIMIT } from '../../lib/ai-quota';

export const prerender = false;

const EMBED_MODEL = '@cf/baai/bge-base-en-v1.5';

export const POST: APIRoute = async ({ request }) => {

  let body: { text?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const text = body.text?.trim();
  if (!text) {
    return new Response(JSON.stringify({ error: 'text is required' }), { status: 400 });
  }

  const quota = await checkNeuronQuota(env as any);
  if (!quota.allowed) {
    return new Response(
      JSON.stringify({ error: 'Daily AI quota exceeded', ...quota }),
      { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8', ...quotaResponseHeaders(quota.remaining, DAILY_NEURON_LIMIT) } },
    );
  }

  try {
    const inputTokens = estimateTokens(text);
    const consume = await consumeNeurons(EMBED_MODEL, inputTokens, 0, env as any);
    if (!consume.allowed) {
      return new Response(
        JSON.stringify({ error: 'Daily AI quota exceeded', remaining: consume.remaining, limit: DAILY_NEURON_LIMIT }),
        { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8', ...quotaResponseHeaders(consume.remaining, DAILY_NEURON_LIMIT) } },
      );
    }

    const res = await (env as any).AI.run(EMBED_MODEL, { text: [text] }) as { data: Array<number[]> };
    const vector = res.data[0];

    return new Response(
      JSON.stringify({ dimensions: vector.length, vector }),
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
