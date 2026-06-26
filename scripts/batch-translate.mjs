#!/usr/bin/env node
/**
 * batch-translate.mjs
 *
 * Batch-fills missing translations across all 12 languages.
 *
 * What it does:
 *   nav    – Creates navigation.{lang}.yaml for 9 missing languages
 *            (de, pt, ar, it, ja, ko, ru, pl, zh) seeded from English
 *   config – Appends siteSettings block to all 11 per-language config files
 *   all    – Both of the above (default)
 *
 * Usage:
 *   node scripts/batch-translate.mjs [nav|config|all]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Languages ────────────────────────────────────────────────────────────────
const MISSING_NAV_LANGS = ['de', 'pt', 'ar', 'it', 'ja', 'ko', 'ru', 'pl', 'zh'];
const CONFIG_LANGS = ['fr', 'de', 'es', 'pt', 'it', 'ja', 'ko', 'ru', 'pl', 'zh', 'ar'];

const LANG_LABELS = {
  en: 'English', fr: 'Français', de: 'Deutsch', es: 'Español',
  pt: 'Português', it: 'Italiano', ja: '日本語', ko: '한국어',
  ru: 'Русский', pl: 'Polski', zh: '中文', ar: 'العربية',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function read(filename) {
  return fs.readFileSync(path.resolve(ROOT, filename), 'utf-8');
}

function write(filename, content) {
  const full = path.resolve(ROOT, filename);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf-8');
  console.log(`  ✔ ${filename}`);
}

function exists(filename) {
  return fs.existsSync(path.resolve(ROOT, filename));
}

// ── 1. Navigation ────────────────────────────────────────────────────────────

function generateNavForLang(code) {
  const base = read('src/data/site/navigation.yaml');
  const label = LANG_LABELS[code] || code;
  // Insert a header comment and mark all `text:` values with a TODO prefix
  const lines = base.split('\n');
  const header = `# Navigation for ${code} locale (${label})\n# AUTO-GENERATED from English template — TODO: translate text values below\n`;
  const body = lines
    .map((l) => {
      // Mark every `text:` line with a TODO unless it's already translated
      if (/^\s+text:/.test(l) && !l.trim().startsWith('#') && !l.includes('TODO')) {
        const indent = l.match(/^\s*/)[0];
        const val = l.replace(/^(\s+text:\s*['"]?)(.*?)(['"]?\s*)$/, '$2').trim();
        return `${indent}text: '${val}'  # TODO translate to ${label}`;
      }
      return l;
    })
    .join('\n');
  return header + body;
}

function createMissingNavs() {
  console.log('\n── Navigation ──────────────────────────────');
  let count = 0;
  for (const code of MISSING_NAV_LANGS) {
    const file = `src/data/site/navigation.${code}.yaml`;
    if (exists(file)) {
      console.log(`  ○ ${file} (already exists, skipped)`);
      continue;
    }
    write(file, generateNavForLang(code));
    count++;
  }
  console.log(`  Created ${count} navigation file(s)`);
}

// ── 2. Config siteSettings ───────────────────────────────────────────────────

function generateSiteSettingsBlock(code) {
  const label = LANG_LABELS[code] || code;
  const isRtl = code === 'ar';
  const siteName = code === 'zh' ? 'Wavefella 威弗拉'
    : code === 'ja' ? 'Wavefella（ウェーブフェラ）'
      : code === 'ko' ? 'Wavefella (웨이브펠라)'
        : code === 'ar' ? 'Wavefella — ويففيلا'
          : code === 'ru' ? 'Wavefella — Вейвфелла'
            : code === 'pl' ? 'Wavefella'
              : code === 'it' ? 'Wavefella'
                : code === 'pt' ? 'Wavefella'
                  : code === 'es' ? 'Wavefella'
                    : code === 'de' ? 'Wavefella'
                      : 'Wavefella';

  return `
# ── Per-language site settings ─────────────────────────────────
siteSettings:
  siteName: '${siteName}'
  siteTagline: '${siteName} — TODO: translate tagline to ${label}'
  siteDescription: 'TODO: translate site description to ${label}'
  organization:
    name: '${siteName}'
    logo: ''
    contactEmail: info@wavefella.com
    contactPhone: '+1 (213) 557-7888'
    address: '5067 Saddleback St, Montclair, CA 91763, USA'  # TODO: translate address to ${label} if localized address exists
  i18n:
    language: ${code}${isRtl ? '\n    textDirection: rtl' : ''}
  socialLinks:
    - platform: youtube
      url: 'https://www.youtube.com/@Wavefella'
    - platform: x
      url: 'https://x.com/wavefella'
    - platform: instagram
      url: 'https://www.instagram.com/wavefellaco'
    - platform: facebook
      url: 'https://www.facebook.com/wavefella'
    - platform: rss
      url: /rss.xml
`;
}

function addSiteSettingsToConfigs() {
  console.log('\n── Config siteSettings ───────────────────────');
  let count = 0;
  for (const code of CONFIG_LANGS) {
    const file = `src/config.${code}.yaml`;
    if (!exists(file)) {
      console.log(`  ✗ ${file} (not found, skipped)`);
      continue;
    }
    const content = read(file);
    if (content.includes('siteSettings:')) {
      console.log(`  ○ ${file} (already has siteSettings, skipped)`);
      continue;
    }
    // Append siteSettings before the last line (usually blank line at end)
    const trimmed = content.replace(/\s*$/, '');
    const block = generateSiteSettingsBlock(code);
    write(file, trimmed + '\n' + block);
    count++;
  }
  console.log(`  Updated ${count} config file(s)`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

const mode = (process.argv[2] || 'all').toLowerCase();

console.log('=== Batch Translation Fix ===\n');

if (mode === 'nav' || mode === 'all') createMissingNavs();
if (mode === 'config' || mode === 'all') addSiteSettingsToConfigs();

console.log('\n=== Done ===');
console.log('Review the TODO comments and replace with real translations before deploying.');
