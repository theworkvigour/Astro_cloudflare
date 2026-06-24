import { consumeNeurons, estimateTokens, estimateNeurons, quotaResponseHeaders, type QuotaEnv, DAILY_NEURON_LIMIT } from './ai-quota';

export type AiMode = 'fast' | 'quality';
export type AiProvider = 'workers-ai';

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
  quotaHeaders: Record<string, string>;
}

const MODELS: Record<AiMode, string> = {
  fast: '@cf/meta/llama-3.1-8b-instruct',
  quality: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
};

export async function routeToLLM(
  req: GatewayRequest,
  env: { AI: any } & QuotaEnv,
): Promise<GatewayResponse> {
  const mode = req.mode || 'fast';
  const system = req.system || 'You are a helpful website assistant.';
  const maxTokens = req.maxTokens || 1024;
  const temperature = req.temperature ?? 0.3;

  const model = MODELS[mode];
  const inputTokens = estimateTokens(system + '\n' + req.prompt);

  const quota = await consumeNeurons(model, inputTokens, maxTokens, env);
  if (!quota.allowed) {
    return {
      answer: '',
      provider: 'workers-ai',
      model,
      tokens: 0,
      quotaHeaders: quotaResponseHeaders(quota.remaining, DAILY_NEURON_LIMIT),
    };
  }

  const res = await env.AI.run(model, {
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: req.prompt },
    ],
    max_tokens: maxTokens,
    temperature,
  }) as { response: string };

  const outputTokens = estimateTokens(res.response);

  return {
    answer: res.response,
    provider: 'workers-ai',
    model,
    tokens: outputTokens,
    quotaHeaders: quotaResponseHeaders(Math.max(0, quota.remaining - estimateNeurons(model, 0, outputTokens)), DAILY_NEURON_LIMIT),
  };
}

export function getProvider(): AiProvider {
  return 'workers-ai';
}
