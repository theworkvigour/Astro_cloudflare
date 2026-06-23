import type { APIRoute } from 'astro';
import { searchSimilar } from '~/lib/rag';

export const prerender = false;

interface SearchRequest {
  query: string;
  topK?: number;
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env) {
    return new Response(JSON.stringify({ error: 'Runtime environment not available' }), { status: 500 });
  }

  let body: SearchRequest;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const query = body.query?.trim();
  if (!query) {
    return new Response(JSON.stringify({ error: 'query is required' }), { status: 400 });
  }

  try {
    const results = await searchSimilar(query, env, body.topK || 10);

    return new Response(
      JSON.stringify({
        query,
        results: results.map((r) => ({
          id: r.id,
          page: r.page,
          title: r.title,
          text: r.text.slice(0, 300),
          score: r.score,
        })),
        total: results.length,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } },
    );
  }
};
