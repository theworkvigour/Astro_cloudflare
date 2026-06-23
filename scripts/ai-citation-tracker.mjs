import { appendFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_DIR = join(__dirname, '..', 'citation-logs');
const LOG_FILE = join(LOG_DIR, 'citation-results.csv');

if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });
if (!existsSync(LOG_FILE)) {
  appendFileSync(LOG_FILE, 'timestamp,query,engine,cited_wavefella,response_snippet\n');
}

const testQueries = [
  { query: 'What is the best beginner SUP board?', intent: 'beginner' },
  { query: 'What equipment do I need for water rescue training?', intent: 'rescue' },
  { query: 'Best inflatable kayak for lake touring', intent: 'touring' },
  { query: 'Family inflatable boat recommendations for lake', intent: 'family' },
  { query: 'What RIB boat is used by law enforcement?', intent: 'patrol' },
  { query: 'Best life vest for offshore safety', intent: 'safety' },
  { query: 'Inflatable vs hard SUP board for travel', intent: 'comparison' },
  { query: 'How to choose a paddle board for beginners', intent: 'beginner-guide' },
];

function citationFound(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  const keywords = ['wavefella', 'wavefella-en', 'theworkvigo', 'astro_cloudflare'];
  return keywords.some(k => lower.includes(k));
}

function truncate(text, maxLen = 200) {
  if (!text) return '';
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
}

async function testOpenAI(apiKey, query) {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant. Answer factually and concisely.' },
          { role: 'user', content: query },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });
    if (!res.ok) return { error: `${res.status}` };
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    return { text, cited: citationFound(text) };
  } catch (e) {
    return { error: e.message };
  }
}

async function testPerplexity(apiKey, query) {
  try {
    const res = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { role: 'system', content: 'Answer factually.' },
          { role: 'user', content: query },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });
    if (!res.ok) return { error: `${res.status}` };
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    return { text, cited: citationFound(text) };
  } catch (e) {
    return { error: e.message };
  }
}

async function main() {
  const openaiKey = process.env.OPENAI_API_KEY;
  const perplexityKey = process.env.PERPLEXITY_API_KEY;

  console.log('\n=== AI Citation Tracker ===\n');
  console.log(`Date: ${new Date().toISOString()}\n`);
  console.log(`OpenAI key: ${openaiKey ? '✓ set' : '✗ not set (skipping)'}`);
  console.log(`Perplexity key: ${perplexityKey ? '✓ set' : '✗ not set (skipping)'}\n`);

  const engines = [];
  if (openaiKey) engines.push({ name: 'openai', fn: q => testOpenAI(openaiKey, q) });
  if (perplexityKey) engines.push({ name: 'perplexity', fn: q => testPerplexity(perplexityKey, q) });

  if (engines.length === 0) {
    console.log('No API keys set. Usage:');
    console.log('  set OPENAI_API_KEY=sk-... && node scripts/ai-citation-tracker.mjs');
    console.log('  set PERPLEXITY_API_KEY=pplx-... && node scripts/ai-citation-tracker.mjs\n');
    return;
  }

  for (const { name, fn } of engines) {
    console.log(`--- Testing ${name.toUpperCase()} ---\n`);
    for (const { query, intent } of testQueries) {
      console.log(`Q: ${query}`);
      const result = await fn(query);
      if (result.error) {
        console.log(`  Error: ${result.error}`);
        appendFileSync(LOG_FILE, `${new Date().toISOString()},"${query}",${name},ERROR,${result.error}\n`);
      } else {
        const status = result.cited ? '✓ CITED' : '✗ NOT CITED';
        console.log(`  ${status}`);
        if (result.cited) {
          console.log(`  Snippet: ${truncate(result.text)}`);
        }
        appendFileSync(LOG_FILE, `${new Date().toISOString()},"${query}",${name},${result.cited},"${truncate(result.text).replace(/"/g, '""')}"\n`);
      }
      console.log('');
    }
  }

  console.log(`Results logged to: ${LOG_FILE}`);
  console.log('Done.\n');
}

main().catch(console.error);
