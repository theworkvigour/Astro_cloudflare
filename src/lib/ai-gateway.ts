export type AiMode = 'fast' | 'quality';
export type AiProvider = 'openai' | 'workers-ai' | 'ai-gateway';

export interface GatewayRequest {
  prompt: string;
  system?: string;
  mode?: AiMode;
  maxTokens?: number;
  temperature?: number;
}

export interface GatewayResponse {
  answer: string;
  provider: AiProvider;
  model: string;
  tokens?: number;
}

const MODELS: Record<AiMode, { openai: string; workers: string }> = {
  fast: { openai: 'gpt-4o-mini', workers: '@cf/meta/llama-3.1-8b-instruct' },
  quality: { openai: 'gpt-4.1', workers: '@cf/meta/llama-3.3-70b-instruct-fp8-fast' },
};

export async function routeToLLM(
  req: GatewayRequest,
  env: { AI_GATEWAY?: string; OPENAI_API_KEY?: string; AI: any },
): Promise<GatewayResponse> {
  const mode = req.mode || 'fast';
  const system = req.system || 'You are a helpful website assistant.';
  const maxTokens = req.maxTokens || 1024;
  const temperature = req.temperature ?? 0.3;

  if (env.AI_GATEWAY) {
    const res = await fetch(env.AI_GATEWAY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'chat',
        prompt: `${system}\n\n${req.prompt}`,
        model: MODELS[mode].openai,
        max_tokens: maxTokens,
        temperature,
      }),
    });
    if (!res.ok) throw new Error(`Gateway error (${res.status})`);
    const data = await res.json() as { response?: string; text?: string };
    return { answer: data.response || data.text || '', provider: 'ai-gateway', model: MODELS[mode].openai };
  }

  if (env.OPENAI_API_KEY) {
    const model = MODELS[mode].openai;
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: req.prompt },
        ],
        max_tokens: maxTokens,
        temperature,
      }),
    });
    if (!res.ok) throw new Error(`OpenAI error (${res.status})`);
    const data = await res.json() as { choices: Array<{ message: { content: string } }>; usage?: { total_tokens: number } };
    return { answer: data.choices[0].message.content, provider: 'openai', model, tokens: data.usage?.total_tokens };
  }

  const model = MODELS[mode].workers;
  const res = await env.AI.run(model, {
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: req.prompt },
    ],
    max_tokens: maxTokens,
    temperature,
  }) as { response: string };

  return { answer: res.response, provider: 'workers-ai', model };
}

export function getProvider(env: { AI_GATEWAY?: string; OPENAI_API_KEY?: string }): AiProvider {
  if (env.AI_GATEWAY) return 'ai-gateway';
  if (env.OPENAI_API_KEY) return 'openai';
  return 'workers-ai';
}
