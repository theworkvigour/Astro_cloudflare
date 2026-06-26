#!/usr/bin/env bash
set -euo pipefail
PROJECT="astro-cloudflare"

echo "=== Cloudflare One-Time Init: $PROJECT ==="

# 1. Vectorize index
echo "[1/4] Creating Vectorize index 'ai-index'..."
npx wrangler vectorize create ai-index --dimensions 768 --metric cosine || echo "  (may already exist)"

# 2. KV namespaces
echo "[2/4] Creating KV namespaces..."
npx wrangler kv namespace create "wavefella-session" || true
npx wrangler kv namespace create "wavefella-seo" || true

# 3. Secrets
echo "[3/4] Setting secrets..."
echo -n "SESSION_SECRET (32+ chars): "; read -s SECRET; echo
echo "$SECRET" | npx wrangler secret put SESSION_SECRET

# 4. Domain (optional)
echo "[4/4] Custom domain (optional)"
echo -n "Domain (enter to skip): "; read DOMAIN
if [ -n "$DOMAIN" ]; then
  echo "Run later: npx wrangler domain add $DOMAIN"
fi

echo ""
echo "=== Done ==="
echo "Then:  1. Enable Workers AI in Dashboard"
echo "       2. npx wrangler domain add <domain>"
echo "       3. node scripts/seed-vectorize.cjs"
echo "       4. git push"
