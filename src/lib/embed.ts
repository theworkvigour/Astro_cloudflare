import { VECTOR_DIM, toVectorInput } from './vector';

const embedCache = new Map<string, { embedding: number[]; cachedAt: number }>();
const CACHE_TTL = 86400000; // 24h

export interface EmbedEnv {
  AI_GATEWAY?: string;
  OPENAI_API_KEY?: string;
  AI?: any;
}

export async function embed(text: string, env: EmbedEnv): Promise<number[]> {
  const normalized = toVectorInput(text);

  const cached = embedCache.get(normalized);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL) {
    return cached.embedding;
  }

  let vector: number[];

  if (env.AI_GATEWAY) {
    const res = await fetch(env.AI_GATEWAY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'embed', prompt: text }),
    });
    if (!res.ok) throw new Error(`AI_GATEWAY embed error (${res.status})`);
    const data = await res.json() as { data?: Array<{ embedding: number[] }> };
    vector = data.data?.[0]?.embedding || [];
  } else if (env.OPENAI_API_KEY) {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: 'text-embedding-3-small', input: text, dimensions: VECTOR_DIM }),
    });
    if (!res.ok) throw new Error(`OpenAI embed error (${res.status})`);
    const data = await res.json() as { data: Array<{ embedding: number[] }> };
    vector = data.data[0].embedding;
  } else if (env.AI) {
    const res = await env.AI.run('@cf/baai/bge-base-en-v1.5', { text: [text] }) as { data: Array<number[]> };
    vector = res.data[0];
  } else {
    throw new Error('No embedding provider available. Set AI_GATEWAY, OPENAI_API_KEY, or AI binding.');
  }

  if (vector.length !== VECTOR_DIM) {
    console.warn(`embed: expected ${VECTOR_DIM} dims, got ${vector.length}`);
  }

  embedCache.set(normalized, { embedding: vector, cachedAt: Date.now() });
  return vector;
}

export function clearEmbedCache(): void {
  embedCache.clear();
}
