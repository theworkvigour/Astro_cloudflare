import type { APIRoute } from 'astro';
import { authorizeAdmin, errorResponse, jsonResponse } from './_guard';

export const prerender = false;

const PAGE_FILES_GLOB = ['home.yaml', 'about.yaml', 'contact.yaml', 'news.yaml'];
const ALLOWED_SECTION_TYPES = [
  'hero', 'hero_text', 'hero_carousel', 'features', 'features2', 'features3',
  'content', 'steps', 'steps2', 'stats', 'faqs', 'testimonials', 'pricing',
  'contact', 'cta', 'featured_products', 'blog_latest', 'map',
];

function emptySectionTemplate(type: string): Record<string, unknown> {
  const base: Record<string, unknown> = {};
  if (['hero', 'hero_text', 'hero_carousel', 'features', 'features2', 'features3', 'content', 'steps', 'steps2', 'cta'].includes(type)) {
    base.title = '';
    base.subtitle = '';
  }
  if (['hero', 'hero_text', 'cta'].includes(type)) {
    base.tagline = '';
  }
  return base;
}

async function tryRead(client: import('~/lib/github').GitHubClient, path: string): Promise<string | null> {
  try {
    const r = await client.readFile(path);
    return r.content;
  } catch {
    return null;
  }
}

async function getFileSha(client: import('~/lib/github').GitHubClient, path: string): Promise<string | undefined> {
  try {
    const r = await client.readFile(path);
    return r.sha;
  } catch {
    return undefined;
  }
}

/** Load page definitions from src/data/site/pages.yaml on GitHub */
async function loadPageDefs(client: import('~/lib/github').GitHubClient): Promise<any[]> {
  const content = await tryRead(client, 'src/data/site/pages.yaml');
  if (!content) return [];
  const yamlMod = await import('js-yaml');
  const parsed = yamlMod.load(content);
  return Array.isArray(parsed) ? parsed : [];
}

/** Save page definitions to src/data/site/pages.yaml */
async function savePageDefs(client: import('~/lib/github').GitHubClient, defs: any[], message: string): Promise<void> {
  const yamlMod = await import('js-yaml');
  const content = yamlMod.dump(defs, { lineWidth: 120, noRefs: true, sortKeys: false, quotingType: "'" });
  const sha = await getFileSha(client, 'src/data/site/pages.yaml');
  if (sha) {
    await client.updateFile('src/data/site/pages.yaml', content, sha, message);
  } else {
    await client.createFile('src/data/site/pages.yaml', content, message);
  }
}

export const GET: APIRoute = async ({ cookies }) => {
  const auth = authorizeAdmin(cookies);
  if (!auth.ok) return errorResponse(auth.error, auth.status);

  const client = auth.ctx.github;

  // 1. Load known page definitions from pages.yaml
  let knownDefs = await loadPageDefs(client);
  if (!Array.isArray(knownDefs)) knownDefs = [];
  const knownSlugs = new Set(knownDefs.map((d: any) => d.slug));

  // 2. Discover YAML files in src/data/pages/ (top level only)
  let discovered: Array<{ name: string; slug: string; defined: boolean }> = [];
  try {
    const files = await client.listFiles('src/data/pages/');
    for (const f of files) {
      if (!/\.ya?ml$/i.test(f.name)) continue;
      const slug = f.name.replace(/\.(ya?ml)$/i, '');
      if (!knownSlugs.has(slug)) {
        discovered.push({ name: f.name, slug, defined: false });
      }
    }
  } catch {}

  // 3. Build response: known definitions + discovered pages
  const pages = knownDefs.map((d: any) => ({
    slug: d.slug,
    label: d.label || d.slug,
    path: d.path || '/',
    permalink: d.permalink || '/',
    file: d.file || `src/data/pages/${d.slug}.yaml`,
    sections: Array.isArray(d.sections) ? d.sections : [],
    defined: true,
    isNew: false,
  }));
  for (const d of discovered) {
    pages.push({
      slug: d.slug,
      label: d.slug.charAt(0).toUpperCase() + d.slug.slice(1),
      path: '/' + d.slug,
      permalink: '/' + d.slug,
      file: `src/data/pages/${d.name}`,
      sections: [],
      defined: false,
      isNew: true,
    });
  }

  return jsonResponse({ pages });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = authorizeAdmin(cookies);
  if (!auth.ok) return errorResponse(auth.error, auth.status);

  let body: {
    slug?: string;
    label?: string;
    path?: string;
    permalink?: string;
    sections?: Array<{ key: string; type: string; label: string }>;
  };
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid request', 400);
  }

  const slug = body.slug?.trim().toLowerCase();
  const label = body.label?.trim();
  const path = body.path?.trim() || `/${slug}`;
  const permalink = body.permalink?.trim() || path;
  const sections = Array.isArray(body.sections) ? body.sections : [];

  if (!slug || !/^[a-z][a-z0-9_-]*$/.test(slug)) {
    return errorResponse('Slug must start with a letter and contain only lowercase letters, numbers, hyphens, and underscores', 400);
  }
  if (!label) {
    return errorResponse('Label is required', 400);
  }
  for (const s of sections) {
    if (!s.key || !s.type || !ALLOWED_SECTION_TYPES.includes(s.type)) {
      return errorResponse(`Invalid section: "${s.key}" with type "${s.type}"`, 400);
    }
  }

  const client = auth.ctx.github;

  // 1. Check if page already exists
  const existingFile = `src/data/pages/${slug}.yaml`;
  const existingContent = await tryRead(client, existingFile);
  if (existingContent) {
    // Page content exists - add definition only
  }

  try {
    // 2. Load and update page definitions
    const defs = await loadPageDefs(client);
    const existingIdx = defs.findIndex((d: any) => d.slug === slug);
    const newDef: any = { slug, label, path, permalink, file: existingFile, sections };
    if (existingIdx >= 0) {
      defs[existingIdx] = newDef;
    } else {
      defs.push(newDef);
    }
    defs.sort((a: any, b: any) => a.slug.localeCompare(b.slug));
    await savePageDefs(client, defs, `feat: add page definition for "${slug}"`);

    // 3. Create content YAML file if it doesn't exist
    if (!existingContent) {
      const defaultContent: Record<string, any> = {};
      for (const sec of sections) {
        defaultContent[sec.key] = emptySectionTemplate(sec.type);
      }
      const yamlMod = await import('js-yaml');
      const contentYaml = yamlMod.dump(defaultContent, { lineWidth: 120, noRefs: true, sortKeys: false });
      await client.createFile(existingFile, contentYaml, `feat: add page content for "${slug}"`);
    }

    // 4. Also create placeholder in locale subdirectories
    try {
      const langYaml = await tryRead(client, 'src/data/site/languages.yaml');
      if (langYaml) {
        const yamlMod = await import('js-yaml');
        const langs = yamlMod.load(langYaml) as Array<{ locale: string }> || [];
        for (const lang of langs) {
          if (lang.locale === 'en') continue;
          const localePath = `src/data/pages/${lang.locale}/${slug}.yaml`;
          const exists = await tryRead(client, localePath);
          if (!exists) {
            await client.createFile(localePath, existingContent || '# TODO: translate this page\n', `feat: add placeholder for "${slug}" in ${lang.locale}`);
          }
        }
      }
    } catch {}

    return jsonResponse({
      success: true,
      slug,
      message: existingContent
        ? `Page definition for "${slug}" updated`
        : `Page "${slug}" created`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create page';
    return errorResponse(message, 500);
  }
};
