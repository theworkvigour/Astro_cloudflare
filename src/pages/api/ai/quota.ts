import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { checkNeuronQuota, DAILY_NEURON_LIMIT } from '../../../lib/ai-quota';

export const prerender = false;

export const GET: APIRoute = async () => {
  const quota = await checkNeuronQuota(env as any);
  return new Response(
    JSON.stringify({
      service: 'workers-ai',
      plan: 'free',
      dailyLimit: DAILY_NEURON_LIMIT,
      remaining: quota.remaining,
      allowed: quota.allowed,
      resetAt: quota.resetAt,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    },
  );
};
