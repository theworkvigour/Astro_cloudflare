import type { APIRoute } from 'astro';

export const prerender = false;

interface AskRequest {
  question: string;
}

interface Source {
  url: string;
  title: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!env) {
    return new Response(JSON.stringify({ error: 'Runtime environment not available' }), { status: 500 });
  }

  let body: AskRequest;
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
    let vector: number[];

    if (env.AI) {
      const aiRes = await env.AI.run('@cf/baai/bge-base-en-v1.5', { text: [question] }) as { data: Array<number[]> };
      vector = aiRes.data[0];
    } else {
      return new Response(JSON.stringify({ error: 'AI binding not available' }), { status: 500 });
    }

    const searchResults = await env.VECTORIZE.query(vector, { topK: 10 });

    const sources: Source[] = (searchResults.matches || [])
      .filter((m: any) => m.score > 0.25)
      .map((m: any) => ({
        url: (m.metadata as any)?.url || '',
        title: (m.metadata as any)?.title || '',
        text: ((m.metadata as any)?.text || '').slice(0, 800),
        type: (m.metadata as any)?.type || '',
      }));

    const context = sources
      .map((s: any, i: number) => `[${i + 1}] ${s.title} (${s.url})\n${s.text}`)
      .join('\n\n');

    const prompt = `You are Wavefella's Product Guide Assistant.

Your role:
- Help users understand water sports products
- Compare SUP, kayak, RIB, dinghy, and safety equipment
- Recommend suitable use scenarios based on user needs
- Educate users about safety requirements

Capabilities:
1. Product selection explanation — explain which products suit different skill levels and activities
2. Comparison analysis — compare different product types (e.g. SUP vs kayak, RIB vs dinghy)
3. Use case recommendation — suggest equipment for specific scenarios (lake trip, fishing, rescue)
4. Safety guidance — advise on life vests, PFDs, and safe practices

Rules:
- Do NOT sell or push purchase
- Do NOT use marketing language ("best", "perfect", "must-have", "top")
- Be neutral, structured, and educational
- Always prioritize safety
- If the user asks about suitability, explain what each product does and let them decide
- If context is insufficient, say so clearly
- Base your answer only on the provided context

Context:
${context || '(no relevant context found)'}

Question:
${question}

Provide a clear, structured answer. If comparing products, use a balanced format. If giving safety advice, be explicit.`;

    const workersModel = '@cf/meta/llama-3.1-8b-instruct';
    const llmRes = await env.AI.run(workersModel, {
      messages: [
        { role: 'system', content: 'You are Wavefella\'s Product Guide Assistant. Help users understand products, compare options, recommend use scenarios, and educate on safety. Never sell or market.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1024,
      temperature: 0.3,
    }) as { response: string };

    return new Response(
      JSON.stringify({
        answer: llmRes.response,
        sources: sources.map((s: any) => ({ url: s.url, title: s.title })),
      }),
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
