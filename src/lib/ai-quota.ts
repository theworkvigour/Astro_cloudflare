export interface QuotaEnv {
  AI_QUOTA?: KVNamespace;
}

interface ModelCost {
  input: number;
  output: number;
}

const NEURON_COST: Record<string, ModelCost> = {
  '@cf/meta/llama-3.2-1b-instruct':       { input: 2457, output: 18252 },
  '@cf/meta/llama-3.2-3b-instruct':       { input: 4625, output: 30475 },
  '@cf/meta/llama-3.1-8b-instruct':       { input: 25608, output: 75147 },
  '@cf/meta/llama-3.1-8b-instruct-fp8-fast': { input: 4119, output: 34868 },
  '@cf/meta/llama-3.3-70b-instruct-fp8-fast': { input: 26668, output: 204805 },
  '@cf/meta/llama-4-scout-17b-16e-instruct':  { input: 24545, output: 77273 },
  '@cf/baai/bge-base-en-v1.5':            { input: 6058, output: 0 },
  '@cf/baai/bge-small-en-v1.5':           { input: 1841, output: 0 },
  '@cf/meta/m2m100-1.2b':                 { input: 31050, output: 31050 },
  '@cf/microsoft/resnet-50':              { input: 228055, output: 0 },
};

export function getModelCost(model: string): ModelCost {
  return NEURON_COST[model] || { input: 10000, output: 50000 };
}

export const DAILY_NEURON_LIMIT = 9000;

const memCache = new Map<string, { neurons: number; ts: number }>();

function todayKey(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

export async function getDailyNeuronUsage(env?: QuotaEnv): Promise<number> {
  const key = todayKey();
  const cached = memCache.get(key);
  if (cached && Date.now() - cached.ts < 60_000) return cached.neurons;
  let neurons = 0;
  if (env?.AI_QUOTA) {
    try {
      const val = await env.AI_QUOTA.get(key);
      if (val) neurons = Number(val);
    } catch {
      /* KV unavailable, use in-memory only */
    }
  }
  memCache.set(key, { neurons, ts: Date.now() });
  return neurons;
}

export async function getRemainingNeurons(env?: QuotaEnv): Promise<number> {
  const used = await getDailyNeuronUsage(env);
  return Math.max(0, DAILY_NEURON_LIMIT - used);
}

export async function checkNeuronQuota(env?: QuotaEnv): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: string;
}> {
  const remaining = await getRemainingNeurons(env);
  return {
    allowed: remaining > 0,
    remaining,
    limit: DAILY_NEURON_LIMIT,
    resetAt: '00:00 UTC daily',
  };
}

export function estimateNeurons(model: string, inputTokens: number, outputTokens = 0): number {
  const cost = getModelCost(model);
  const inputNeurons = (cost.input * inputTokens) / 1_000_000;
  const outputNeurons = (cost.output * outputTokens) / 1_000_000;
  return Math.ceil(inputNeurons + outputNeurons);
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export async function consumeNeurons(
  model: string,
  inputTokens: number,
  outputTokens = 0,
  env?: QuotaEnv,
): Promise<{ allowed: boolean; remaining: number; cost: number }> {
  const cost = estimateNeurons(model, inputTokens, outputTokens);
  if (cost <= 0) return { allowed: true, remaining: await getRemainingNeurons(env), cost: 0 };

  const used = await getDailyNeuronUsage(env);
  const newTotal = used + cost;

  if (newTotal > DAILY_NEURON_LIMIT) {
    return { allowed: false, remaining: Math.max(0, DAILY_NEURON_LIMIT - used), cost };
  }

  const key = todayKey();
  if (env?.AI_QUOTA) {
    try {
      await env.AI_QUOTA.put(key, String(Math.round(newTotal)));
    } catch {
      /* KV write failed */
    }
  }
  memCache.set(key, { neurons: newTotal, ts: Date.now() });

  return { allowed: true, remaining: Math.max(0, DAILY_NEURON_LIMIT - newTotal), cost };
}

export function quotaResponseHeaders(remaining: number, limit: number): Record<string, string> {
  return {
    'X-AI-Quota-Remaining': String(remaining),
    'X-AI-Quota-Limit': String(limit),
  };
}
