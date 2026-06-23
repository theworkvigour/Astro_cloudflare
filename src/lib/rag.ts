/**
 * rag.ts — Core RAG engine
 *
 * chunk, embed, vector search, context assembly, answer generation.
 *
 * Two providers are supported:
 *   primary   → OpenAI  (text-embedding-3-small + gpt-4o-mini)
 *   fallback  → Workers AI (bge-base-en-v1.5 + @cf/meta/llama-3.1-8b-instruct)
 *
 * Set OPENAI_API_KEY via wrangler secret for primary mode.
 * Without it the system falls back to Workers AI (free, slower).
 */

import type { Ai } from '/.astro/ai';

// ─── Types ─────────────────────────────────────────────────────

export interface EnvBindings {
  VECTORIZE: FnVectorize;
  AI: Ai;
  OPENAI_API_KEY?: string;
  AI_GATEWAY?: string;
}

export interface Chunk {
  id: string;
  text: string;
  page: string;
  title: string;
}

export interface SearchResult {
  id: string;
  score: number;
  text: string;
  page: string;
  title: string;
}

interface FnVectorize {
  query(vector: number[], options: { topK: number; filter?: Record<string, string> }): Promise<{ matches: Array<{ id: string; score: number; metadata?: Record<string, unknown> }> }>;
  insert(vectors: Array<{ id: string; values: number[]; metadata?: Record<string, unknown> }>): Promise<void>;
  upsert(vectors: Array<{ id: string; values: number[]; metadata?: Record<string, unknown> }>): Promise<void>;
  deleteByIds(ids: string[]): Promise<void>;
  describe(): Promise<{ dimensions: number; metric: string; count: number }>;
}

// ─── Text Chunking ─────────────────────────────────────────────

export function chunkText(text: string, maxLength = 500, overlap = 50): Array<{ id: number; text: string }> {
  const chunks: Array<{ id: number; text: string }> = [];
  const paragraphs = text.split(/\n\s*\n/);
  let buffer = '';
  let chunkId = 0;

  for (const p of paragraphs) {
    const trimmed = p.trim();
    if (!trimmed) continue;

    if (buffer.length + trimmed.length > maxLength && buffer.length > 0) {
      chunks.push({ id: chunkId++, text: buffer.trim() });
      buffer = buffer.slice(-overlap) + '\n';
    }
    buffer += (buffer ? '\n\n' : '') + trimmed;
  }

  if (buffer.trim()) {
    chunks.push({ id: chunkId, text: buffer.trim() });
  }

  return chunks;
}

// ─── Embedding ─────────────────────────────────────────────────

async function embedOpenAI(text: string, apiKey: string): Promise<number[]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
      dimensions: 768,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI embedding error (${res.status}): ${err}`);
  }

  const data = await res.json() as { data: Array<{ embedding: number[] }> };
  return data.data[0].embedding;
}

async function embedWorkersAI(text: string, ai: Ai): Promise<number[]> {
  const res = await ai.run('@cf/baai/bge-base-en-v1.5', {
    text: [text],
  }) as { data: Array<number[]> };

  return res.data[0];
}

export async function embed(text: string, env: EnvBindings): Promise<number[]> {
  if (env.OPENAI_API_KEY) {
    return embedOpenAI(text, env.OPENAI_API_KEY);
  }
  return embedWorkersAI(text, env.AI);
}

// ─── Vector Search ─────────────────────────────────────────────

export async function searchSimilar(
  query: string,
  env: EnvBindings,
  topK = 5,
  filter?: Record<string, string>,
): Promise<SearchResult[]> {
  const qVector = await embed(query, env);
  const results = await env.VECTORIZE.query(qVector, { topK, filter });

  return results.matches
    .filter((m) => m.score > 0.25)
    .map((m) => ({
      id: m.id,
      score: m.score,
      text: (m.metadata?.text as string) || '',
      page: (m.metadata?.page as string) || '',
      title: (m.metadata?.title as string) || '',
    }));
}

// ─── Context Assembly ──────────────────────────────────────────

export function assembleContext(results: SearchResult[], maxChars = 6000): string {
  return results
    .map((r, i) => `[${i + 1}] ${r.title} (${r.page})\n${r.text}`)
    .join('\n\n')
    .slice(0, maxChars);
}

// ─── LLM Answer ────────────────────────────────────────────────

async function answerOpenAI(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful website assistant. Answer based on the provided context. If the context does not contain enough information, say so.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI chat error (${res.status}): ${err}`);
  }

  const data = await res.json() as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices[0].message.content;
}

async function answerWorkersAI(prompt: string, ai: Ai): Promise<string> {
  const res = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
      { role: 'system', content: 'You are a helpful website assistant. Answer based on the provided context.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 1024,
    temperature: 0.3,
  }) as { response: string };

  return res.response;
}

export async function generateAnswer(
  systemPrompt: string,
  userPrompt: string,
  env: EnvBindings,
): Promise<string> {
  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  if (env.OPENAI_API_KEY) {
    return answerOpenAI(fullPrompt, env.OPENAI_API_KEY);
  }
  return answerWorkersAI(fullPrompt, env.AI);
}

// ─── Full RAG Pipeline ─────────────────────────────────────────

export async function rag(
  question: string,
  env: EnvBindings,
  options?: { topK?: number; filter?: Record<string, string> },
): Promise<{ answer: string; sources: SearchResult[] }> {
  const topK = options?.topK || 5;

  const results = await searchSimilar(question, env, topK, options?.filter);
  const context = assembleContext(results);

  const systemPrompt = `You are a website assistant for Vectoflare. Answer concisely based on the context below. If the context doesn't answer the question, say you don't know. Include relevant product names and page references when appropriate.`;

  const userPrompt = `Context:\n${context || '(no relevant context found)'}\n\nQuestion:\n${question}`;

  const answer = await generateAnswer(systemPrompt, userPrompt, env);

  return { answer, sources: results };
}

// ─── Index a Page ──────────────────────────────────────────────

export interface IndexablePage {
  id: string;
  url: string;
  title: string;
  content: string;
  updated?: string;
}

export async function indexPage(page: IndexablePage, env: EnvBindings): Promise<number> {
  const chunks = chunkText(page.content, 500);

  const vectors = await Promise.all(
    chunks.map(async (chunk) => ({
      id: `${page.id}-${chunk.id}`,
      values: await embed(chunk.text, env),
      metadata: {
        text: chunk.text,
        page: page.url,
        title: page.title,
      },
    })),
  );

  await env.VECTORIZE.upsert(vectors);
  return vectors.length;
}
