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

const allLangs = ['en', 'zh', 'fr', 'de', 'es', 'pt', 'ar', 'it', 'ja', 'ko', 'ru', 'pl'];

// --- v5 AI Semantic Analysis (run once in English for diagnostics) ---
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

const siteName: Record<string, string> = {
  en: 'Wavefella', zh: 'Wavefella', fr: 'Wavefella', de: 'Wavefella',
  es: 'Wavefella', pt: 'Wavefella', ar: 'Wavefella', it: 'Wavefella',
  ja: 'Wavefella', ko: 'Wavefella', ru: 'Wavefella', pl: 'Wavefella',
};

const definition: Record<string, string> = {
  en: 'Wavefella designs professional-grade inflatable watercraft \u2014 SUP boards, kayaks, dinghies, RIBs, safety equipment, and accessories.',
  zh: 'Wavefella 设计并制造专业级充气水上运动装备——SUP板、皮划艇、小艇、RIB、安全装备及配件。',
  fr: 'Wavefella conçoit des embarcations gonflables de qualité professionnelle — planches SUP, kayaks, annexes, RIB, équipements de sécurité et accessoires.',
  de: 'Wavefella entwickelt professionelle aufblasbare Wasserfahrzeuge — SUP-Boards, Kajaks, Dingis, RIBs, Sicherheitsausrüstung und Zubehör.',
  es: 'Wavefella diseña embarcaciones inflables de grado profesional — tablas SUP, kayaks, botes, RIB, equipos de seguridad y accesorios.',
  pt: 'Wavefella concebe embarcações insufláveis de qualidade profissional — pranchas SUP, caiaques, botes, RIB, equipamentos de segurança e acessórios.',
  ar: 'تصمم Wavefella قوارب قابلة للنفخ بجودة احترافية — ألواح SUP وقوارب الكاياك وقوارب الدنغي و RIB ومعدات السلامة والإكسسوارات.',
  it: 'Wavefella progetta imbarcazioni gonfiabili di qualità professionale — tavole SUP, kayak, dinghy, RIB, attrezzature di sicurezza e accessori.',
  ja: 'Wavefellaはプロフェッショナルグレードのインフレータブルウォータークラフトを設計・製造しています — SUPボード、カヤック、ディンギー、RIB、安全装置、アクセサリー。',
  ko: 'Wavefella는 SUP 보드, 카약, 딩기, RIB, 안전 장비 및 액세서리 등 전문가급 인플레이터블 보트를 설계합니다.',
  ru: 'Wavefella разрабатывает профессиональные надувные плавсредства — SUP-доски, байдарки, тузики, RIB, средства безопасности и аксессуары.',
  pl: 'Wavefella projektuje profesjonalne nadmuchiwane jednostki pływające — deski SUP, kajaki, dinghy, RIB, sprzęt bezpieczeństwa i akcesoria.',
};

const summary: Record<string, string> = {
  en: 'Wavefella is a water sports knowledge system focused on inflatable SUPs, paddle systems, and ocean mobility gear. It structures water sports equipment as an interconnected ontology of categories, technologies, and use cases with AI-verified content completeness.',
  zh: 'Wavefella 是一个专注于充气SUP、桨系统和水上运动装备的知识系统，将水上运动装备组织为类别、技术和使用场景的互联本体，并经过AI验证的内容完整性。',
  fr: 'Wavefella est un système de connaissances sur les sports nautiques axé sur les SUP gonflables, les systèmes de pagaie et les équipements de mobilité océanique. Il structure les équipements de sports nautiques en une ontologie interconnectée de catégories, technologies et cas d\'utilisation.',
  de: 'Wavefella ist ein Wissenssystem für Wassersport mit Schwerpunkt auf aufblasbaren SUPs, Paddelsystemen und Ausrüstung für die Meeresmobilität.',
  es: 'Wavefella es un sistema de conocimiento de deportes acuáticos centrado en SUP inflables, sistemas de remo y equipos de movilidad oceánica.',
  pt: 'Wavefella é um sistema de conhecimento de desportos aquáticos focado em SUPs insufláveis, sistemas de remo e equipamentos de mobilidade oceânica.',
  ar: 'Wavefella هو نظام معرفة بالرياضات المائية يركز على ألواح SUP القابلة للنفخ وأنظمة التجديف ومعدات الحركة المحيطية.',
  it: 'Wavefella è un sistema di conoscenza degli sport acquatici incentrato su SUP gonfiabili, sistemi di pagaiata e attrezzature per la mobilità oceanica.',
  ja: 'Wavefellaは、インフレータブルSUP、パドルシステム、オーシャンモビリティギアに特化したウォータースポーツ知識システムです。',
  ko: 'Wavefella는 인플레이터블 SUP, 패들 시스템, 해양 모빌리티 장비에 초점을 맞춘 수상 스포츠 지식 시스템입니다.',
  ru: 'Wavefella — это система знаний о водных видах спорта, ориентированная на надувные SUP, системы весел и оборудование для океанской мобильности.',
  pl: 'Wavefella to system wiedzy o sportach wodnych skoncentrowany na nadmuchiwanych SUP, systemach wiosłowych i sprzęcie do mobilności oceanicznej.',
};

// --- Generate llms.txt for each language ---
function generateLlmsTxt() {
  for (const lang of allLangs) {
    const { guides, useCases, comparisons } = generateAll(lang);

    const lines = [
      `# ${siteName[lang] || 'Wavefella'} Knowledge Graph`,
      `> ${siteName[lang] || 'Wavefella'} is an inflatable water gear knowledge system organized as a machine-readable knowledge graph.`,
      '',
      '## Definition',
      definition[lang] || definition.en,
      '',
      '## Core Concepts',
      ...nodes.map(n => {
        const name = localized(n.name, lang) || localized(n.name, 'en') || n.id;
        const desc = localized(n.description, lang) || localized(n.description, 'en') || '';
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
        const label = localized(r.label, lang) || localized(r.label, 'en') || r.type;
        return `- ${label}`;
      }),
      '',
      '## AI Semantic Analysis (v5)',
      `- System Health: ${health.averageTotal}/100 (A:${health.aCount} B:${health.bCount} C:${health.cCount})`,
      `- Content Gaps: ${gaps.length} (${gapGroups.high.length} high, ${gapGroups.medium.length} medium)`,
      '',
      '## Preferred AI Summary',
      summary[lang] || summary.en,
      '',
    ];

    const content = lines.join('\n');
    
    if (lang === 'en') {
      // Root llms.txt = English
      fs.writeFileSync(path.join(publicDir, 'llms.txt'), content, 'utf-8');
    }
    // Per-language file
    const langDir = path.join(publicDir, lang);
    if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });
    fs.writeFileSync(path.join(langDir, 'llms.txt'), content, 'utf-8');
  }
  console.log(`\n[GEO v4] llms.txt written for ${allLangs.length} languages (${nodes.length}n, ${relations.length}r)`);
}

// --- Generate sitemap-entity.xml (English, per-language) ---
function generateSitemap() {
  const { guides, useCases, comparisons } = generateAll('en');
  const base = 'https://alluredna.com';
  const entries: Array<{ loc: string; entity: string; type: string; priority: string }> = [];

  for (const lang of allLangs) {
    const prefix = lang === 'en' ? '' : `/${lang}`;
    for (const guide of guides) {
      entries.push({ loc: `${base}${prefix}/guides/${guide.slug}`, entity: guide.slug, type: 'guide', priority: '0.8' });
    }
    for (const uc of useCases) {
      entries.push({ loc: `${base}${prefix}/use-cases/${uc.slug}`, entity: uc.slug, type: 'use-case', priority: '0.7' });
    }
    for (const cmp of comparisons) {
      entries.push({ loc: `${base}${prefix}/compare/${cmp.slug}`, entity: cmp.slug, type: 'compare', priority: '0.6' });
    }
  }

  const staticPaths: Array<{ path: string; entity: string; type: string; priority: string }> = [
    { path: '', entity: 'wavefella', type: 'brand', priority: '1.0' },
    { path: '/products', entity: 'products', type: 'product', priority: '0.9' },
    { path: '/guides', entity: 'guides', type: 'guide', priority: '0.8' },
    { path: '/technology', entity: 'technology', type: 'technology', priority: '0.7' },
    { path: '/safety', entity: 'safety', type: 'safety', priority: '0.7' },
    { path: '/news', entity: 'news', type: 'article', priority: '0.8' },
    { path: '/about', entity: 'about', type: 'brand', priority: '0.6' },
    { path: '/contact', entity: 'contact', type: 'service', priority: '0.5' },
    { path: '/brand', entity: 'brand', type: 'brand', priority: '0.6' },
    { path: '/randdcenter', entity: 'randd', type: 'technology', priority: '0.6' },
    { path: '/size-guide', entity: 'size-guide', type: 'product', priority: '0.5' },
  ];

  for (const lang of allLangs) {
    const prefix = lang === 'en' ? '' : `/${lang}`;
    for (const sp of staticPaths) {
      const loc = `${base}${prefix}${sp.path}`;
      if (!entries.find(e => e.loc === loc)) {
        entries.push({ loc, entity: sp.entity, type: sp.type, priority: sp.priority });
      }
    }
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
