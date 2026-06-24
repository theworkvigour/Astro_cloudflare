import { fetchGSC } from './gsc-fetch.js';
import { runRules } from './rule-engine.js';
import { generateGEO } from './geo-generator.js';

export default {
  async scheduled(_event, env, ctx) {
    console.log('[cron] Starting SEO pipeline at', new Date().toISOString());
    ctx.waitUntil(runPipeline(env));
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/run') {
      const result = await runPipeline(env);
      return new Response(JSON.stringify(result, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname === '/tasks') {
      const raw = await env.SEO_KV?.get('seo:tasks:latest');
      return new Response(raw || '[]', {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Wavefella v3.6 SEO Factory Worker', { status: 200 });
  },
};

async function runPipeline(env) {
  const gscData = await fetchGSC(env);
  const tasks = runRules(gscData);
  const geo = generateGEO(gscData);

  const payload = JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      queries: gscData.length,
      tasks: tasks.high.length + tasks.medium.length,
      geo: geo.length,
    },
    tasks,
    geo,
  });

  if (env.SEO_KV) {
    await env.SEO_KV.put('seo:tasks:latest', payload);
    await env.SEO_KV.put('seo:geo:latest', JSON.stringify(geo));
  }

  return { version: 'v3.6', ...JSON.parse(payload) };
}
