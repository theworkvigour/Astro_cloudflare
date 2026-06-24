import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { checkNeuronQuota, consumeNeurons, estimateTokens, quotaResponseHeaders, DAILY_NEURON_LIMIT } from '../../lib/ai-quota';

export const prerender = false;

const EMBED_MODEL = '@cf/baai/bge-base-en-v1.5';
const MODEL_COST: Record<string, string> = {
  fast: '@cf/meta/llama-3.2-3b-instruct',
  quality: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
};

interface ChatRequest {
  question: string;
  mode?: 'fast' | 'quality';
}

interface Source {
  url: string;
  title: string;
  text: string;
}

async function embedQuery(query: string, env: any): Promise<number[]> {
  const res = await env.AI.run(EMBED_MODEL, { text: [query] }) as { data: Array<number[]> };
  return res.data[0];
}

async function callLLM(prompt: string, env: any, mode: string): Promise<string> {
  const workersModel = MODEL_COST[mode];
  const res = await env.AI.run(workersModel, {
    messages: [
      { role: 'system', content: 'You are a helpful website assistant. Answer based on the provided context.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 1024,
    temperature: 0.3,
  }) as { response: string };
  return res.response;
}

export const POST: APIRoute = async ({ request }) => {

  let body: ChatRequest;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const question = body.question?.trim();
  if (!question) {
    return new Response(JSON.stringify({ error: 'question is required' }), { status: 400 });
  }

  const mode = body.mode || 'fast';

  const quota = await checkNeuronQuota(env as any);
  if (!quota.allowed) {
    return new Response(
      JSON.stringify({ error: 'Daily AI quota exceeded', ...quota }),
      { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8', ...quotaResponseHeaders(quota.remaining, DAILY_NEURON_LIMIT) } },
    );
  }

  try {
    const embedInputTokens = estimateTokens(question);
    const embedConsume = await consumeNeurons(EMBED_MODEL, embedInputTokens, 0, env as any);
    if (!embedConsume.allowed) {
      return new Response(
        JSON.stringify({ error: 'Daily AI quota exceeded', remaining: embedConsume.remaining, limit: DAILY_NEURON_LIMIT }),
        { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8', ...quotaResponseHeaders(embedConsume.remaining, DAILY_NEURON_LIMIT) } },
      );
    }

    const vector = await embedQuery(question, env);
    const searchResults = await env.VECTORIZE.query(vector, { topK: 5 });

    const sources: Source[] = (searchResults.matches || [])
      .filter((m: any) => m.score > 0.25)
      .map((m: any) => ({
        url: (m.metadata as any)?.url || '',
        title: (m.metadata as any)?.title || '',
        text: ((m.metadata as any)?.text || '').slice(0, 600),
      }));

    const context = sources
      .map((s, i) => `[${i + 1}] ${s.title} (${s.url})\n${s.text}`)
      .join('\n\n');

    const prompt = `You are a search assistant for Wavefella.

Use ONLY the context below to answer the question. If the context does not contain enough information, say so.

Context:
${context || '(no relevant context found)'}

Question:
${question}

Provide a concise answer with references to the sources when appropriate.`;

    const llmModel = MODEL_COST[mode];
    const llmInputTokens = estimateTokens(prompt + 'You are a helpful website assistant. Answer based on the provided context.');
    const llmConsume = await consumeNeurons(llmModel, llmInputTokens, 1024, env as any);
    if (!llmConsume.allowed) {
      return new Response(
        JSON.stringify({ error: 'Daily AI quota exceeded', remaining: llmConsume.remaining, limit: DAILY_NEURON_LIMIT }),
        { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8', ...quotaResponseHeaders(llmConsume.remaining, DAILY_NEURON_LIMIT) } },
      );
    }

    const answer = await callLLM(prompt, env, mode);

    return new Response(
      JSON.stringify({
        answer,
        sources: sources.map((s) => ({ url: s.url, title: s.title })),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8', ...quotaResponseHeaders(llmConsume.remaining, DAILY_NEURON_LIMIT) } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    try {
      const llmModel = MODEL_COST[mode];
      const llmInputTokens = estimateTokens(question + 'You are a helpful website assistant. Answer based on the provided context.');
      const llmConsume = await consumeNeurons(llmModel, llmInputTokens, 1024, env as any);
      if (!llmConsume.allowed) {
        return new Response(
          JSON.stringify({ error: 'Daily AI quota exceeded', remaining: llmConsume.remaining, limit: DAILY_NEURON_LIMIT }),
          { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8', ...quotaResponseHeaders(llmConsume.remaining, DAILY_NEURON_LIMIT) } },
        );
      }

      const fallback = await callLLM(question, env, mode);
      return new Response(
        JSON.stringify({ answer: fallback, sources: [], note: 'RAG unavailable, used direct LLM' }),
        { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8', ...quotaResponseHeaders(llmConsume.remaining, DAILY_NEURON_LIMIT) } },
      );
    } catch {
      return new Response(
        JSON.stringify({ error: message }),
        { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } },
      );
    }
  }
};
