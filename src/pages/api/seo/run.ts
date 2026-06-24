import type { APIRoute } from 'astro';
import { contentV2Records } from '~/data/content-v2';
import { sampleTopQueries, sampleLowCtrPages } from '~/data/seo/sample-data';
import { runAllRules } from '~/lib/seo/rule-engine';
import { generateTaskList } from '~/lib/seo/task-list';
import { generateGeoBlocks } from '~/lib/seo/geo-generator';
import { exportTasksMarkdown, exportTasksJson, exportTasksCsv } from '~/lib/seo/task-exporter';
import { saveTasksToKv, saveGeoToKv, saveHistoryToKv, getLatestTasks } from '~/lib/seo/kv-store';

export const prerender = false;

export const GET: APIRoute = async ({ url, locals }) => {
  const format = url.searchParams.get('format') || 'json';
  const env = (locals as any).runtime?.env || {};

  const formatQ = url.searchParams.get('format') || 'json';

  const rules = runAllRules(sampleTopQueries, sampleLowCtrPages, contentV2Records);
  const tasks = generateTaskList(sampleTopQueries, sampleLowCtrPages, contentV2Records);
  const geoPages = generateGeoBlocks(contentV2Records);

  await saveTasksToKv(env, tasks);
  for (const g of geoPages.slice(0, 3)) {
    await saveGeoToKv(env, g);
  }

  const output = {
    version: 'v3.5',
    timestamp: new Date().toISOString(),
    freeTier: true,
    kvConnected: !!env.SEO_KV,
    summary: {
      totalRules: rules.length,
      highPriorityTasks: tasks.high.length,
      mediumPriorityTasks: tasks.medium.length,
      lowPriorityTasks: tasks.low.length,
      geoPagesGenerated: geoPages.length,
    },
    seo: { rules, tasks },
    geo: geoPages.slice(0, 5),
  };

  if (format === 'markdown') {
    const md = exportTasksMarkdown(tasks);
    return new Response(md, {
      status: 200,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  }

  if (format === 'csv') {
    const csv = exportTasksCsv(tasks);
    return new Response(csv, {
      status: 200,
      headers: { 'Content-Type': 'text/csv; charset=utf-8' },
    });
  }

  return new Response(JSON.stringify(output, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const gscData = body.queries || sampleTopQueries;
    const pageData = body.pages || sampleLowCtrPages;
    const env = (locals as any).runtime?.env || {};

    const rules = runAllRules(gscData, pageData, contentV2Records);
    const tasks = generateTaskList(gscData, pageData, contentV2Records);
    const geoPages = generateGeoBlocks(contentV2Records);

    await saveTasksToKv(env, tasks);

    return new Response(JSON.stringify({
      version: 'v3.5',
      timestamp: new Date().toISOString(),
      freeTier: true,
      kvConnected: !!env.SEO_KV,
      summary: {
        rules: rules.length,
        highPriorityTasks: tasks.high.length,
        geoPages: geoPages.length,
      },
      seo: { rules, tasks },
      geo: geoPages.slice(0, 5),
    }, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
};
