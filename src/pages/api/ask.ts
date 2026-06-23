import type { APIRoute } from 'astro';
import { products } from '../../data/products';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env) {
    return new Response(JSON.stringify({ error: 'Runtime environment not available' }), { status: 500 });
  }

  let body: { question?: string };
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
    const productContext = products.map(p =>
      `Product: ${p.name}
Category: ${p.category}
Region: ${p.region.join(', ')}
Skill: ${p.skill}
Water: ${p.water.join(', ')}
Safety: ${p.safety.length ? p.safety.join('; ') : 'none'}
Description: ${p.desc}`
    ).join('\n\n');

    let ragContext = '';
    if (env.AI && env.VECTORIZE) {
      const aiRes = await env.AI.run('@cf/baai/bge-base-en-v1.5', { text: [question] }) as { data: Array<number[]> };
      const vector = aiRes.data[0];
      const searchResults = await env.VECTORIZE.query(vector, { topK: 5 });
      const sources = (searchResults.matches || [])
        .filter((m: any) => m.score > 0.25)
        .map((m: any) => ((m.metadata as any)?.text || '').slice(0, 600));
      if (sources.length) {
        ragContext = '\n\nAdditional context from knowledge base:\n' + sources.map((s: any, i: number) => `[${i + 1}] ${s}`).join('\n\n');
      }
    }

    const prompt = `You are a product selection assistant for Wavefella.

Below is the structured product catalog. Only recommend based on this data.
Do NOT use marketing language. Be neutral, educational, and safety-conscious.

Structured product catalog:
${productContext}${ragContext}

Question: ${question}

If the user asks about product selection, compare relevant products by category, skill level, and water type.
If the user asks about safety, reference the safety requirements listed for each product.
If the question is outside the catalog, say you can only answer about Wavefella products.`;

    const workersModel = '@cf/meta/llama-3.1-8b-instruct';
    const llmRes = await env.AI.run(workersModel, {
      messages: [
        { role: 'system', content: 'You are Wavefella\'s product selection assistant. Only recommend based on product data. No marketing language.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1024,
      temperature: 0.3,
    }) as { response: string };

    return new Response(
      JSON.stringify({ answer: llmRes.response }),
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
