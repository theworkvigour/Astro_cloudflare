import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env) {
    return new Response(JSON.stringify({ error: 'Runtime environment not available' }), { status: 500 });
  }

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

  try {
    let vector: number[];

    if (env.AI_GATEWAY) {
      const res = await fetch(env.AI_GATEWAY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'embed', prompt: text }),
      });
      if (!res.ok) throw new Error(`Gateway embed error (${res.status})`);
      const data = await res.json() as { data?: Array<{ embedding: number[] }> };
      vector = data.data?.[0]?.embedding || [];
    } else if (env.OPENAI_API_KEY) {
      const res = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'text-embedding-3-small', input: text, dimensions: 1536 }),
      });
      if (!res.ok) throw new Error(`OpenAI embed error (${res.status})`);
      const data = await res.json() as { data: Array<{ embedding: number[] }> };
      vector = data.data[0].embedding;
    } else if (env.AI) {
      const res = await env.AI.run('@cf/baai/bge-base-en-v1.5', { text: [text] }) as { data: Array<number[]> };
      vector = res.data[0];
    } else {
      throw new Error('No embedding provider available');
    }

    return new Response(
      JSON.stringify({ dimensions: vector.length, vector }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } },
    );
  }
};
