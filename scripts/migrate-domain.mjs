#!/usr/bin/env node

/**
 * migrate-domain.mjs
 *
 * One-time migration script for forks of the Wavefella site.
 * Replaces all hardcoded references to the original domain with the fork's domain.
 *
 * Usage:
 *   node scripts/migrate-domain.mjs                   # interactive
 *   node scripts/migrate-domain.mjs --domain mydomain.com --yes   # silent
 *
 * What it changes:
 *   - src/config.yaml + 11 locale configs   → site URL
 *   - public/sitemap-entity.xml              → all ~600+ URLs
 *   - src/workers/ingest.ts                  → fetch target
 *   - src/pages/[lang]/sitemap.xml.ts        → base URL
 *   - src/pages/guides/*.astro (16 files)    → JsonLd data.url
 *   - src/pages/index.astro                  → JSON-LD url
 *   - src/pages/internal/geo-dashboard.astro → siteOrigin
 *   - src/pages/keystatic/seo.astro          → site URL
 *   - wrangler.toml                          → worker name + compatibility_date
 *   - src/data/site/branding.yaml            → contact email
 *   - src/data/admin-auth.json               → credentials
 */

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const OLD_DOMAIN = 'https://alluredna.com';
const OLD_HOST = 'alluredna.com';
const OLD_WORKER = 'wavefella';
const OLD_EMAIL = 'info@wavefella.com';
const OLD_DATE = '2026-06-05';
const OLD_ADMIN_USER = 'Admin';
const OLD_ADMIN_PASS = 'Aa123456#';

// ── file definitions ──────────────────────────────────────────────
const REPLACE_DOMAIN_FILES = [
  // 12 config files
  ...['', '.de', '.es', '.fr', '.it', '.ja', '.ko', '.pl', '.pt', '.ru', '.zh']
    .map(suf => `src/config${suf}.yaml`),
  // sitemap
  'public/sitemap-entity.xml',
  // worker
  'src/workers/ingest.ts',
  // sitemap xml builder
  'src/pages/[lang]/sitemap.xml.ts',
  // homepage
  'src/pages/index.astro',
  // admin pages
  'src/pages/internal/geo-dashboard.astro',
  'src/pages/keystatic/seo.astro',
  // 16 guide pages
  ...['beginner-guide', 'choosing-paddle', 'how-to-choose-your-sup',
     'inflatable-repair', 'inflatable-vs-hard', 'kayak-techniques',
     'multi-day-trip', 'paddling-techniques', 'safety-tips',
     'sup-fishing', 'sup-fitness', 'sup-maintenance',
     'sup-with-kids', 'sup-yoga', 'understanding-specs',
     'weather-conditions'].map(s => `src/pages/guides/${s}.astro`),
];

// ── helpers ───────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = q => new Promise(r => rl.question(q, r));

function cyan(s) { return `\x1b[36m${s}\x1b[0m`; }
function green(s) { return `\x1b[32m${s}\x1b[0m`; }
function yellow(s) { return `\x1b[33m${s}\x1b[0m`; }
function red(s) { return `\x1b[31m${s}\x1b[0m`; }
function bold(s) { return `\x1b[1m${s}\x1b[0m`; }

async function readFile(p) {
  return await fsp.readFile(path.join(ROOT, p), 'utf-8');
}

async function writeFile(p, content) {
  await fsp.writeFile(path.join(ROOT, p), content, 'utf-8');
}

function countMatches(content, pattern) {
  return (content.match(pattern) || []).length;
}

// ── preview ───────────────────────────────────────────────────────
async function previewDomainChanges(newDomain) {
  console.log(`\n${bold('Preview:')} Replacing ${yellow(OLD_DOMAIN)} → ${green(newDomain)}\n`);
  let total = 0;
  for (const fp of REPLACE_DOMAIN_FILES) {
    const full = path.join(ROOT, fp);
    if (!fs.existsSync(full)) continue;
    const content = await readFile(fp);
    const n = countMatches(content, new RegExp(OLD_DOMAIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
    if (n > 0) {
      console.log(`  ${cyan(fp.padEnd(45))} ${n} match(es)`);
      total += n;
    }
  }
  console.log(`\n  ${bold('Total:')} ${yellow(total)} domain references to update\n`);
  return total;
}

// ── apply domain replacement ──────────────────────────────────────
async function applyDomainChanges(newDomain, dryRun = false) {
  const changed = [];
  for (const fp of REPLACE_DOMAIN_FILES) {
    const full = path.join(ROOT, fp);
    if (!fs.existsSync(full)) continue;
    const content = await readFile(fp);
    const updated = content.replaceAll(OLD_DOMAIN, newDomain);
    if (updated !== content) {
      if (!dryRun) await writeFile(fp, updated);
      changed.push(fp);
    }
  }
  return changed;
}

// ── wrangler.toml ─────────────────────────────────────────────────
async function getWranglerContent() {
  return await readFile('wrangler.toml');
}

async function updateWranglerName(newName, dryRun = false) {
  const content = await getWranglerContent();
  const updated = content.replace(/^name\s*=\s*"[\w-]+"/m, `name = "${newName}"`);
  if (updated !== content) {
    if (!dryRun) await writeFile('wrangler.toml', updated);
    return true;
  }
  return false;
}

async function updateWranglerDate(newDate, dryRun = false) {
  const content = await getWranglerContent();
  const updated = content.replace(/^compatibility_date\s*=\s*"\d{4}-\d{2}-\d{2}"/m, `compatibility_date = "${newDate}"`);
  if (updated !== content) {
    if (!dryRun) await writeFile('wrangler.toml', updated);
    return true;
  }
  return false;
}

async function updateWranglerCiName(newName, dryRun = false) {
  const fp = '.github/workflows/actions.yaml';
  const full = path.join(ROOT, fp);
  if (!fs.existsSync(full)) return false;
  const content = await readFile(fp);
  const updated = content.replace(/--name\s+[\w-]+/g, `--name ${newName}`);
  if (updated !== content) {
    if (!dryRun) await writeFile(fp, updated);
    return true;
  }
  return false;
}

async function updateWranglerCiNewWorkerName(newName, dryRun = false) {
  const fp = '.github/workflows/actions.yaml';
  const full = path.join(ROOT, fp);
  if (!fs.existsSync(full)) return false;
  const content = await readFile(fp);
  const updated = content.replace(/new-worker-name:\s*[\w-]+/g, `new-worker-name: ${newName}`);
  if (updated !== content) {
    if (!dryRun) await writeFile(fp, updated);
    return true;
  }
  return false;
}

// ── branding ──────────────────────────────────────────────────────
async function updateBrandingEmail(newEmail, dryRun = false) {
  const fp = 'src/data/site/branding.yaml';
  const content = await readFile(fp);
  const updated = content
    .replace(/^contact_email_to:\s.*/m, `contact_email_to: ${newEmail}`)
    .replace(/^contact_from_email:\s.*/m, `contact_from_email: ${newEmail}`);
  if (updated !== content) {
    if (!dryRun) await writeFile(fp, updated);
    return true;
  }
  return false;
}

// ── admin-auth ────────────────────────────────────────────────────
function generatePassword(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
  let result = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

async function updateAdminAuth(newUser, newPass, dryRun = false) {
  const fp = 'src/data/admin-auth.json';
  const content = JSON.parse(await readFile(fp));
  content.username = newUser;
  content.password = newPass;
  if (!dryRun) await writeFile(fp, JSON.stringify(content, null, 2) + '\n');
}

// ── main ──────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const idx = i => { const v = args.find(a => a.startsWith(`--${i}=`)); return v ? v.split('=')[1] : null; };
  const hasFlag = f => args.includes(`--${f}`) || args.some(a => a.startsWith(`--${f}=`));

  const newDomainRaw = idx('domain');
  const autoYes = hasFlag('yes') || hasFlag('y');

  console.log(bold('\n╔══════════════════════════════════════════╗'));
  console.log(bold('║   Wavefella → Fork Domain Migration     ║'));
  console.log(bold('╚══════════════════════════════════════════╝'));

  // ── 1. Domain ──────────────────────────────────────────────
  const domain = newDomainRaw || (await ask(`\n${cyan('?')} New domain (e.g. https://myfork.pages.dev, without trailing slash):\n  ${cyan('>')} `));
  const cleanedDomain = domain.replace(/\/+$/, ''); // strip trailing slash
  console.log(`\n  Domain: ${green(cleanedDomain)}`);

  const matchCount = await previewDomainChanges(cleanedDomain);
  if (matchCount === 0) {
    console.log(yellow('  No domain references found — maybe already migrated?\n'));
  }

  // ── 2. Worker name ─────────────────────────────────────────
  const newWorker = idx('worker') || (await ask(`\n${cyan('?')} New Cloudflare Worker name (must be globally unique, default: ${OLD_WORKER}-fork):\n  ${cyan('>')} `)) || `${OLD_WORKER}-fork`;

  // ── 3. Compatibility date ──────────────────────────────────
  const today = new Date();
  const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const compatDate = idx('date') || (await ask(`\n${cyan('?')} Wrangler compatibility_date (default: ${defaultDate}):\n  ${cyan('>')} `)) || defaultDate;

  // ── 4. Contact email ──────────────────────────────────────
  const newEmail = idx('email') || (await ask(`\n${cyan('?')} Contact email for the fork (default: admin@${new URL(cleanedDomain).hostname}):\n  ${cyan('>')} `)) || `admin@${new URL(cleanedDomain).hostname}`;

  // ── 5. Admin credentials ──────────────────────────────────
  const adminUser = idx('admin-user') || 'Admin';
  const adminPass = idx('admin-pass') || generatePassword();
  const changeAdmin = hasFlag('admin-user') || hasFlag('admin-pass') || false;
  const shouldChangeAdmin = changeAdmin || (autoYes ? false : (await ask(`\n${cyan('?')} Generate random admin password? (current: ${OLD_ADMIN_PASS}) [Y/n]\n  ${cyan('>')} `)).toLowerCase() !== 'n');

  // ── Summary ────────────────────────────────────────────────
  console.log(`\n${bold('Summary of changes:')}`);
  console.log(`  ${'Domain:'.padEnd(20)} ${yellow(OLD_DOMAIN)} → ${green(cleanedDomain)}`);
  console.log(`  ${'Worker name:'.padEnd(20)} ${yellow(OLD_WORKER)} → ${green(newWorker)}`);
  console.log(`  ${'compatibility_date:'.padEnd(20)} ${yellow(OLD_DATE)} → ${green(compatDate)}`);
  console.log(`  ${'Contact email:'.padEnd(20)} ${yellow(OLD_EMAIL)} → ${green(newEmail)}`);
  if (shouldChangeAdmin) {
    console.log(`  ${'Admin password:'.padEnd(20)} ${yellow(OLD_ADMIN_PASS)} → ${green(adminPass)}`);
  }

  if (!autoYes) {
    const proceed = (await ask(`\n${cyan('?')} Apply these changes? [Y/n]\n  ${cyan('>')} `)).toLowerCase();
    if (proceed === 'n') {
      console.log(yellow('\n  Aborted. No changes made.\n'));
      rl.close();
      return;
    }
  }

  // ── Apply ──────────────────────────────────────────────────
  console.log(bold('\n  Applying changes...\n'));

  const changedFiles = await applyDomainChanges(cleanedDomain);
  console.log(`  ${green('✓')} Domain: ${changedFiles.length} files updated`);
  for (const f of changedFiles) console.log(`      ${cyan(f)}`);

  if (await updateWranglerName(newWorker)) console.log(`  ${green('✓')} Worker name → ${green(newWorker)}`);
  if (await updateWranglerDate(compatDate)) console.log(`  ${green('✓')} compatibility_date → ${green(compatDate)}`);
  if (await updateWranglerCiName(newWorker)) console.log(`  ${green('✓')} CI --name → ${green(newWorker)}`);
  if (await updateWranglerCiNewWorkerName(newWorker)) console.log(`  ${green('✓')} CI new-worker-name → ${green(newWorker)}`);

  if (await updateBrandingEmail(newEmail)) console.log(`  ${green('✓')} Branding email → ${green(newEmail)}`);

  // ── Write credentials file ────────────────────────────────
  const credFile = '.env.local';
  let wroteCreds = false;
  if (shouldChangeAdmin) {
    await updateAdminAuth(adminUser, adminPass);

    // Load existing .env.local or create fresh
    let credContent = '';
    const credFull = path.join(ROOT, credFile);
    if (fs.existsSync(credFull)) {
      credContent = await fsp.readFile(credFull, 'utf-8');
      // Remove old entries if present
      credContent = credContent
        .split('\n')
        .filter(l => !l.startsWith('ADMIN_USERNAME=') && !l.startsWith('ADMIN_PASSWORD='))
        .join('\n')
        .replace(/\n{3,}/g, '\n\n');
    }
    credContent += `\n# Admin credentials (generated by migrate-domain.mjs)\nADMIN_USERNAME=${adminUser}\nADMIN_PASSWORD=${adminPass}\n`;
    await fsp.writeFile(credFull, credContent.trimStart() + '\n', 'utf-8');
    wroteCreds = true;

    console.log(`  ${green('✓')} Admin credentials updated (user: ${adminUser})`);
  }

  // ── Ensure .gitignore has .env.local ──────────────────────
  const giPath = path.join(ROOT, '.gitignore');
  let giContent = '';
  if (fs.existsSync(giPath)) {
    giContent = await fsp.readFile(giPath, 'utf-8');
    if (!giContent.includes('.env.local')) {
      giContent += '\n# local credential file (generated by migrate-domain.mjs)\n.env.local\n';
      await fsp.writeFile(giPath, giContent, 'utf-8');
      console.log(`  ${green('✓')} Added .env.local to .gitignore`);
    }
  }

  // ── Post-migration notes ───────────────────────────────────
  const credNote = wroteCreds
    ? `║  Admin credentials saved to .env.local (gitignored).                    ║\n`
    : '';
  const dockerNote = wroteCreds
    ? `║  For production, set ADMIN_PASSWORD as a Cloudflare secret              ║\n`
    : '';

  console.log(`\n${bold('╔══════════════════════════════════════════════════════════════╗')}`);
  console.log(bold('║  Migration complete!                                        ║'));
  console.log(bold('╠══════════════════════════════════════════════════════════════╣'));
  console.log(bold(`${credNote}║                                                            ║`));
  console.log(bold('║  Manual steps still needed:                                 ║'));
  console.log(bold('║                                                            ║'));
  console.log(bold('║  1. Set GitHub Secrets (repo → Settings → Secrets):        ║'));
  console.log(bold('║     - CLOUDFLARE_ACCOUNT_ID                                 ║'));
  console.log(bold('║     - CLOUDFLARE_API_TOKEN                                 ║'));
  console.log(bold('║     - SESSION_SECRET (generate a random 32+ char string)   ║'));
  console.log(bold('║                                                            ║'));
  console.log(bold('║  2. Run the Cloudflare init script:                        ║'));
  console.log(bold('║     .\\scripts\\cloudflare-init.ps1                           ║'));
  console.log(bold('║     (creates Vectorize index + KV namespaces)              ║'));
  console.log(bold('║                                                            ║'));
  console.log(bold('║  3. Enable Workers AI in Cloudflare Dashboard:             ║'));
  console.log(bold(`║     Workers & Pages → ${newWorker} → Workers AI              ║`));
  console.log(bold('║                                                            ║'));
  console.log(bold(`${dockerNote}║  4. (Optional) Update SEO KV reference in CI if needed     ║`));
  console.log(bold('║  5. (Optional) Configure contact form PAT via /keystatic   ║'));
  console.log(bold('╚══════════════════════════════════════════════════════════════╝'));
  console.log();

  rl.close();
}

main().catch(err => {
  console.error(red('\n  Error:'), err);
  process.exit(1);
});
