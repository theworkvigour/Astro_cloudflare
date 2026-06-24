import type { APIRoute } from 'astro';
import { contentV2Records } from '~/data/content-v2';
import { generateGeoForEntry, generateGeoForSlug } from '~/lib/seo/geo-generator';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const slug = url.searchParams.get('slug');
  const format = url.searchParams.get('format') || 'json';

  if (slug) {
    const entry = contentV2Records.find(e => e.slug === slug);
    if (!entry) {
      const geo = generateGeoForSlug(slug);
      return new Response(JSON.stringify(geo, null, 2), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }
    const geo = generateGeoForEntry(entry);
    return new Response(JSON.stringify(geo, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const allGeo = contentV2Records.map(generateGeoForEntry);

  if (format === 'tldr') {
    const tldrs = allGeo.map(g => ({ slug: g.slug, tldr: g.blocks.find(b => b.type === 'TLDR')?.content }));
    return new Response(JSON.stringify(tldrs, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  return new Response(JSON.stringify({
    version: 'v3.4',
    timestamp: new Date().toISOString(),
    count: allGeo.length,
    pages: allGeo,
  }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
