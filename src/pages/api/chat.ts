import type { APIRoute } from 'astro';
import { rag } from '~/lib/rag';
import { routeToLLM } from '~/lib/ai-gateway';

export const prerender = false;

interface ChatRequest {
  question: string;
  mode?: 'fast' | 'quality';
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env) {
    return new Response(JSON.stringify({ error: 'Runtime environment not available' }), { status: 500 });
  }

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

  try {
    const result = await rag(question, env, { topK: 5 });

    return new Response(
      JSON.stringify({
        answer: result.answer,
        sources: result.sources.map((s) => ({
          page: s.page,
          title: s.title,
          score: s.score,
        })),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';

    // Fallback: direct LLM call without RAG
    try {
      const fallback = await routeToLLM(
        { prompt: question, system: 'You are a helpful website assistant. Answer as best you can.' },
        env,
      );

      return new Response(
        JSON.stringify({ answer: fallback.answer, sources: [], note: 'RAG unavailable, used direct LLM' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        },
      );
    } catch {
      return new Response(
        JSON.stringify({ error: message }),
        { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } },
      );
    }
  }
};
