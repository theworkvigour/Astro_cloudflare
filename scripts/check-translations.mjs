#!/usr/bin/env node
/**
 * check-translations.mjs
 *
 * Self-check: audit all 12 languages for untranslated elements, missing
 * files, and TODO placeholders.
 *
 * Usage:
 *   node scripts/check-translations.mjs
 *   node scripts/check-translations.mjs --json
 *   node scripts/check-translations.mjs --fail
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const LOCALES = ['en', 'fr', 'de', 'es', 'pt', 'it', 'ja', 'ko', 'ru', 'pl', 'zh', 'ar'];
const PAGE_TYPES = ['home', 'about', 'contact', 'news'];
const issues = [];
const warns = [];

function ok(m)  { if (!process.argv.includes('--json')) console.log('  [OK] ' + m); }
function fail(m) { issues.push(m); if (!process.argv.includes('--json')) console.log('  [FAIL] ' + m); }
function warn(m) { warns.push(m); if (!process.argv.includes('--json')) console.log('  [WARN] ' + m); }

function exists(p) { return fs.existsSync(path.resolve(ROOT, p)); }
function read(p) { try { return fs.readFileSync(path.resolve(ROOT, p), 'utf-8'); } catch { return ''; } }

// ── 1. Navigation files ──
function checkNav() {
  const navCount = LOCALES.filter(function (l) {
    if (l === 'en') return exists('src/data/site/navigation.yaml');
    return exists('src/data/site/navigation.' + l + '.yaml');
  }).length;
  if (navCount === LOCALES.length) ok('Navigation: all 12 languages present');
  else fail('Navigation: only ' + navCount + '/' + LOCALES.length + ' languages');
}

// ── 2. Config files ──
function checkConfig() {
  for (const l of LOCALES) {
    if (l === 'en') continue;
    const f = 'src/config.' + l + '.yaml';
    if (!exists(f)) { fail('Config missing: ' + f); continue; }
    const c = read(f);
    if (!c.includes('siteSettings:')) fail('Config missing siteSettings: ' + f);
    if (c.includes('TODO:')) warn('TODO in ' + f);
  }
  ok('Config files checked');
}

// ── 3. Page content YAML ──
function checkPageContent() {
  for (const page of PAGE_TYPES) {
    for (const l of LOCALES) {
      const dir = l === 'en' ? 'src/data/pages' : 'src/data/pages/' + l;
      const f = dir + '/' + page + '.yaml';
      if (!exists(f)) { fail('Page missing: ' + f); continue; }
      const c = read(f);
      if (c.includes('TODO:')) warn('TODO in ' + f);
      if (c.trim() === '' || c.trim() === '{}') warn(f + ' appears empty');
    }
  }
  ok('Page content YAML checked');
}

// ── 4. Product texts ──
function checkProductTexts() {
  const pContent = read('src/data/products.ts');
  const ids = [...pContent.matchAll(/id:\s+'([^']+)'/g)].map(function (m) { return m[1]; });
  if (ids.length === 0) { fail('Could not parse product IDs'); return; }

  const ptContent = read('src/data/product-texts.ts');
  const nonEn = LOCALES.filter(function (l) { return l !== 'en'; });
  let missing = 0;

  for (const l of nonEn) {
    for (const id of ids) {
      const re = new RegExp("'" + id + "'\\s*:\\s*\\{[^}]*name:", '');
      if (!re.test(ptContent)) {
        fail('Product text missing: ' + l + '/' + id);
        missing++;
      }
    }
  }
  if (missing === 0) ok('Product texts: ' + ids.length + ' products x ' + nonEn.length + ' languages complete');
}

// ── 5. TODO placeholders in YAML data files ──
function checkTodos() {
  const yamlFiles = globSync('src/data/**/*.yaml', { cwd: ROOT });
  let todoCount = 0;
  for (const f of yamlFiles) {
    const c = read(f);
    const m = c.match(/#\s*TODO[^\n]*/g);
    if (m) {
      warn(f + ' has ' + m.length + ' TODO(s)');
      todoCount += m.length;
    }
  }
  if (todoCount === 0) ok('No TODO placeholders in data YAML files');
}

// ── 6. Check config YAML files for TODO ──
function checkConfigTodos() {
  const configFiles = globSync('src/config.*.yaml', { cwd: ROOT });
  let todoCount = 0;
  for (const f of configFiles) {
    const c = read(f);
    const m = c.match(/#\s*TODO[^\n]*/g);
    if (m) {
      warn(f + ' has ' + m.length + ' TODO(s)');
      todoCount += m.length;
    }
  }
  if (todoCount === 0) ok('No TODO placeholders in config files');
}

// ── 7. Check knowledge graph nodes for per-language fields ──
function checkGraphNodes() {
  const content = read('src/content/graph/nodes.ts');
  const nodes = content.split(/\n\s*\{/);
  let nodesWithIssues = 0;
  for (const block of nodes) {
    if (!block.includes("id:")) continue;
    const idMatch = block.match(/id:\s+'([^']+)'/);
    if (!idMatch) continue;
    const id = idMatch[1];
    // Check that 'name:' has entries for all non-en locales
    const nameBlock = block.match(/name:\s*\{[^}]+\}/);
    if (!nameBlock) { fail('Node ' + id + ' has no name'); nodesWithIssues++; continue; }
    for (const l of LOCALES) {
      if (l === 'en') continue;
      if (!nameBlock[0].includes('"' + l + '"')) {
        warn('Node ' + id + ' missing name for ' + l);
        nodesWithIssues++;
      }
    }
    // Check slug has all languages
    const slugBlock = block.match(/slug:\s*\{[^}]+\}/);
    if (slugBlock) {
      for (const l of LOCALES) {
        if (!slugBlock[0].includes(l + ':')) {
          warn('Node ' + id + ' missing slug for ' + l);
          nodesWithIssues++;
        }
      }
    }
  }
  if (nodesWithIssues === 0) ok('Knowledge graph nodes: all language fields present');
}

// ── 8. Check for hardcoded English in [lang] pages ──
function checkHardcodedEnglish() {
  const astroFiles = globSync('src/pages/[lang]/**/*.astro', { cwd: ROOT });
  for (const f of astroFiles) {
    const c = read(f);
    // Skip files that clearly use t() or ui lookups
    if (c.includes('const t =') || c.includes('getPageContent') || c.includes('localizeProduct')) continue;
    // If the file generates paths for all languages but has hardcoded text, flag it
    if (c.includes('getStaticPaths') && c.includes("languages") && c.includes('<p') && !c.includes("t(")) {
      warn(f + ' may have hardcoded English text behind [lang] routes');
    }
  }
}

// ── Summary ──
function summary() {
  console.log('\n=== Summary ===');
  console.log('  Issues (FAIL): ' + issues.length);
  console.log('  Warnings:      ' + warns.length);
  if (issues.length === 0) console.log('  All translations checks passed.');
  else {
    console.log('  Failing checks:');
    for (const i of issues) console.log('    - ' + i);
  }

  if (process.argv.includes('--json')) {
    const result = {
      passed: issues.length === 0,
      issues: issues,
      warnings: warns,
      totalIssues: issues.length,
      totalWarnings: warns.length,
    };
    console.log(JSON.stringify(result, null, 2));
  }

  if (process.argv.includes('--fail') && issues.length > 0) process.exit(1);
}

// ── Main ──
console.log('=== Translation Self-Check ===\n');
checkNav();
checkConfig();
checkPageContent();
checkProductTexts();
checkTodos();
checkConfigTodos();
checkGraphNodes();
checkHardcodedEnglish();
summary();
