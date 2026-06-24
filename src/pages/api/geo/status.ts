import type { APIRoute } from 'astro';
import { checkNeuronQuota, DAILY_NEURON_LIMIT } from '../../../lib/ai-quota';

export const prerender = false;

export const GET: APIRoute = async () => {
  const quota = await checkNeuronQuota();
  return new Response(
    JSON.stringify({
      service: 'geo-engine',
      version: '2.0',
      status: 'production-safe',
      dailyNeuronLimit: DAILY_NEURON_LIMIT,
      remaining: quota.remaining,
      allowed: quota.allowed,
      resetAt: quota.resetAt,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  );
};
