import type { SeoTask } from './task-list';
import type { GeoOutput } from './geo-generator';

export interface SeoKvEnv {
  SEO_KV?: {
    get: (key: string) => Promise<string | null>;
    put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>;
    list: (options?: { prefix?: string }) => Promise<{ keys: { name: string }[] }>;
  };
}

const TTL_30_DAYS = 2592000;

export function tasksKey(date?: string): string {
  return `seo:tasks:${date || new Date().toISOString().split('T')[0]}`;
}

export function historyKey(date: string): string {
  return `seo:history:${date}`;
}

export function geoKey(slug: string): string {
  return `geo:pages:${slug}`;
}

export function latestTasksKey(): string {
  return 'seo:tasks:latest';
}

export async function saveTasksToKv(env: SeoKvEnv, tasks: { high: SeoTask[]; medium: SeoTask[]; low: SeoTask[] }): Promise<void> {
  if (!env.SEO_KV) return;
  const payload = JSON.stringify({ timestamp: new Date().toISOString(), tasks });
  await env.SEO_KV.put(latestTasksKey(), payload, { expirationTtl: TTL_30_DAYS });
  await env.SEO_KV.put(tasksKey(), payload, { expirationTtl: TTL_30_DAYS });
}

export async function saveHistoryToKv(env: SeoKvEnv, date: string, data: { impressions: number; clicks: number; avgCtr: number; avgPosition: number }): Promise<void> {
  if (!env.SEO_KV) return;
  await env.SEO_KV.put(historyKey(date), JSON.stringify(data), { expirationTtl: TTL_30_DAYS });
}

export async function saveGeoToKv(env: SeoKvEnv, geo: GeoOutput): Promise<void> {
  if (!env.SEO_KV) return;
  await env.SEO_KV.put(geoKey(geo.slug), JSON.stringify(geo), { expirationTtl: TTL_30_DAYS });
}

export async function getLatestTasks(env: SeoKvEnv): Promise<{ high: SeoTask[]; medium: SeoTask[]; low: SeoTask[] } | null> {
  if (!env.SEO_KV) return null;
  const raw = await env.SEO_KV.get(latestTasksKey());
  if (!raw) return null;
  return JSON.parse(raw).tasks;
}

export async function getHistory(env: SeoKvEnv, date: string): Promise<{ impressions: number; clicks: number; avgCtr: number; avgPosition: number } | null> {
  if (!env.SEO_KV) return null;
  const raw = await env.SEO_KV.get(historyKey(date));
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function listHistoryKeys(env: SeoKvEnv): Promise<string[]> {
  if (!env.SEO_KV) return [];
  const result = await env.SEO_KV.list({ prefix: 'seo:history:' });
  return result.keys.map(k => k.name);
}
