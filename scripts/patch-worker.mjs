import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENTRY_PATH = path.resolve(__dirname, '../dist/server/entry.mjs');

console.log('✓ patch-worker.mjs is a no-op (subdomain routing removed). All URLs use path-based locale: /de/, /fr/, etc.');
