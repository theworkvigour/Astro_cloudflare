import { generateAll } from '../src/lib/geo-v4/generator.js';
import { localized } from '../src/lib/geo-v4/i18n.js';
import { nodes } from '../src/content/graph/nodes.js';
import { relations } from '../src/content/graph/relations.js';
import { analyzeAll } from '../src/lib/geo-v5/semanticEngine.js';
import { scoreAllNodes, systemHealth } from '../src/lib/geo-v5/scoring.js';
import { clusterTopics } from '../src/lib/geo-v5/topicCluster.js';
import { detectContentGaps, gapsBySeverity } from '../src/lib/geo-v5/gapDetector.js';
import fs from 'fs';
import path from 'path';

const dir = import.meta.dirname;
const root = path.resolve(dir, '..');
const publicDir = path.join(root, 'public');

const lang = 'en';
const { guides, useCases, comparisons } = generateAll(lang);

// --- v5 AI Semantic Analysis ---
const analysis = analyzeAll(nodes);
const scores = scoreAllNodes(analysis.map(a => ({ id: a.id, score: a.score })));
const health = systemHealth(scores);
const clusters = clusterTopics(nodes);
const gaps = detectContentGaps(nodes);
const gapGroups = gapsBySeverity(gaps);

console.log(`\n[GEO v5] AI Semantic Analysis:`);
console.log(`  System Health: ${health.averageTotal}/100`);
console.log(`  Grade Distribution: A=${health.aCount} B=${health.bCount} C=${health.cCount}`);
console.log(`  Weakest Node: ${health.weakest?.id} (${health.weakest?.total})`);
console.log(`  Strongest Node: ${health.strongest?.id} (${health.strongest?.total})`);
console.log(`  Content Gaps: ${gaps.length} high=${gapGroups.high.length} medium=${gapGroups.medium.length}`);
console.log(`  Topic Clusters: ${Object.entries(clusters).map(([k, v]) => `${k}=${v.length}`).join(', ')}`);

if (gapGroups.high.length > 0) {
  console.log(`\n  \u26a0 High Severity Gaps:`);
  for (const g of gapGroups.high) {
    console.log(`    - ${g.node}: ${g.issue}`);
  }
}

// --- Generate llms.txt (English, machine-readable) ---
function generateLlmsTxt() {
  const lines = [
    '# Wavefella Knowledge Graph',
    '> Wavefella is an inflatable water gear knowledge system organized as a machine-readable knowledge graph.',
    '',
    '## Definition',
    'Wavefella designs professional-grade inflatable watercraft \u2014 SUP boards, kayaks, dinghies, RIBs, safety equipment, and accessories.',
    '',
    '## Core Concepts',
    ...nodes.map(n => {
      const name = localized(n.name, lang) || n.id;
      const desc = localized(n.description, lang) || '';
      return `- ${name}: ${desc.split('.')[0]}`;
    }),
    '',
    '## Guides',
    ...guides.map(g => `- ${g.title}`),
    '',
    '## Use Cases',
    ...useCases.map(u => `- ${u.title}`),
    '',
    '## Comparisons',
    ...comparisons.map(c => `- ${c.title}`),
    '',
    '## Relations',
    ...relations.map(r => {
      const label = localized(r.label, lang) || r.type;
      return `- ${label}`;
    }),
    '',
    '## AI Semantic Analysis (v5)',
    `- System Health: ${health.averageTotal}/100 (A:${health.aCount} B:${health.bCount} C:${health.cCount})`,
    `- Content Gaps: ${gaps.length} (${gapGroups.high.length} high, ${gapGroups.medium.length} medium)`,
    '',
    '## Preferred AI Summary',
    'Wavefella is a water sports knowledge system focused on inflatable SUPs, paddle systems, and ocean mobility gear. It structures water sports equipment as an interconnected ontology of categories, technologies, and use cases with AI-verified content completeness.',
    '',
  ];

  const content = lines.join('\n');
  fs.writeFileSync(path.join(publicDir, 'llms.txt'), content, 'utf-8');
  console.log(`\n[GEO v4] llms.txt written (${nodes.length}n, ${relations.length}r, ${guides.length}g, ${useCases.length}u, ${comparisons.length}c)`);
}

// --- Generate sitemap-entity.xml (English) ---
function generateSitemap() {
  const base = 'https://alluredna.com';
  const entries: Array<{ loc: string; entity: string; type: string; priority: string }> = [];

  for (const guide of guides) {
    entries.push({ loc: `${base}/guides/${guide.slug}`, entity: guide.slug, type: 'guide', priority: '0.8' });
  }
  for (const uc of useCases) {
    entries.push({ loc: `${base}/use-cases/${uc.slug}`, entity: uc.slug, type: 'use-case', priority: '0.7' });
  }
  for (const cmp of comparisons) {
    entries.push({ loc: `${base}/compare/${cmp.slug}`, entity: cmp.slug, type: 'compare', priority: '0.6' });
  }

  const staticPages = [
    { loc: `${base}/`, entity: 'wavefella', type: 'brand', priority: '1.0' },
    { loc: `${base}/products`, entity: 'products', type: 'product', priority: '0.9' },
    { loc: `${base}/guides`, entity: 'guides', type: 'guide', priority: '0.8' },
    { loc: `${base}/technology`, entity: 'technology', type: 'technology', priority: '0.7' },
    { loc: `${base}/safety`, entity: 'safety', type: 'safety', priority: '0.7' },
    { loc: `${base}/news`, entity: 'news', type: 'article', priority: '0.8' },
    { loc: `${base}/about`, entity: 'about', type: 'brand', priority: '0.6' },
    { loc: `${base}/contact`, entity: 'contact', type: 'service', priority: '0.5' },
    { loc: `${base}/brand`, entity: 'brand', type: 'brand', priority: '0.6' },
    { loc: `${base}/randdcenter`, entity: 'randd', type: 'technology', priority: '0.6' },
    { loc: `${base}/size-guide`, entity: 'size-guide', type: 'product', priority: '0.5' },
  ];

  for (const s of staticPages) {
    if (!entries.find(e => e.loc === s.loc)) entries.push(s);
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:x="https://wavefella.com/geo">\n`;
  for (const e of entries) {
    xml += `  <url>\n    <loc>${e.loc}</loc>\n    <x:entity>${e.entity}</x:entity>\n    <x:type>${e.type}</x:type>\n    <priority>${e.priority}</priority>\n  </url>\n`;
  }
  xml += `</urlset>\n`;

  fs.writeFileSync(path.join(publicDir, 'sitemap-entity.xml'), xml);
  console.log(`[GEO v4] sitemap-entity.xml written (${entries.length} entries)`);
}

console.log('=== GEO v4 + v5 Build Pipeline ===');
generateLlmsTxt();
generateSitemap();
console.log('\n=== GEO v4 + v5 Build Complete ===');
