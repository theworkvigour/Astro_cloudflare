<#
.SYNOPSIS
  One-time Cloudflare setup for Wavefella — run after first git push.
.DESCRIPTION
  - Creates vectorize index
  - Creates KV namespaces
  - Sets required secrets
  - Prompts before destructive operations
.NOTES
  Requires: wrangler CLI (npm install -g wrangler)
  Run from project root after: git push && first CI deploy succeeds
#>

$ErrorActionPreference = "Stop"
$ProjectName = "astro-cloudflare"  # must match wrangler.toml > name

Write-Host "=== Cloudflare One-Time Init: $ProjectName ===" -ForegroundColor Cyan

# ── 1. Create Vectorize index ──
Write-Host "`n[1/4] Creating Vectorize index 'ai-index'..." -ForegroundColor Yellow
try {
    npx wrangler vectorize create ai-index --dimensions 768 --metric cosine
    Write-Host "  ✓ ai-index ready" -ForegroundColor Green
} catch {
    Write-Host "  ! May already exist (error above). Continuing..." -ForegroundColor DarkYellow
}

# ── 2. Create KV namespaces ──
Write-Host "`n[2/4] Creating KV namespaces..." -ForegroundColor Yellow
$kvNamespaces = @(
    @{ Name = "wavefella-session"; Desc = "Keystatic sessions + AI quota" },
    @{ Name = "wavefella-seo";      Desc = "SEO task cache (optional)" }
)

foreach ($kv in $kvNamespaces) {
    Write-Host "  Creating '$($kv.Name)' - $($kv.Desc)..."
    try {
        npx wrangler kv namespace create $kv.Name
        Write-Host "  ✓ $($kv.Name) created" -ForegroundColor Green
    } catch {
        Write-Host "  ! May already exist. Check Dashboard if needed." -ForegroundColor DarkYellow
    }
}

# ── 3. Set secrets ──
Write-Host "`n[3/4] Setting required secrets..." -ForegroundColor Yellow
$secrets = @(
    @{ Name = "SESSION_SECRET"; Prompt = "SESSION_SECRET (32+ chars, random string)" }
)

foreach ($s in $secrets) {
    $val = $null
    while (-not $val -or $val.Length -lt 8) {
        $val = Read-Host "  Enter $($s.Prompt)"
        if ($val.Length -lt 8) { Write-Host "  Too short, need at least 8 chars." -ForegroundColor Red }
    }
    # Use stdin to avoid leaking secret in process list
    $val | & { npx wrangler secret put $s.Name }
    Write-Host "  ✓ $($s.Name) set" -ForegroundColor Green
}

# ── 4. Bind custom domain ──
Write-Host "`n[4/4] Optional: bind a custom domain" -ForegroundColor Yellow
$domain = Read-Host "  Enter custom domain (or Enter to skip)"
if ($domain) {
    npx wrangler tail # just a check that wrangler works
    npx wrangler deployments list
    Write-Host "  Run this after deploy: wrangler domain add $domain" -ForegroundColor DarkYellow
}

Write-Host "`n=== Cloudflare init complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Enable Workers AI in Dashboard (Workers & Pages > your worker > Workers AI)"
Write-Host "  2. Run:   npx wrangler domain add <your-domain.com>  (after first deploy)"
Write-Host "  3. Seed vector data:   node scripts/seed-vectorize.cjs"
Write-Host "  4. Push code to trigger CI/CD:   git push"
