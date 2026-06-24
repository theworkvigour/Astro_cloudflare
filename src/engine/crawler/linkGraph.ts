import type { LinkGraph, PageAnalysis } from '../core/types';

export function buildLinkGraph(pages: PageAnalysis[], baseUrl: string): LinkGraph {
  const internalGraph: Record<string, string[]> = {};
  const brokenLinks: { href: string; sourceUrl: string }[] = [];
  const internalUrls = new Set(pages.map((p) => p.url));

  for (const page of pages) {
    const outgoing: string[] = [];
    for (const link of page.links) {
      if (link.isInternal) {
        const normalized = normalizeUrl(link.href, baseUrl);
        outgoing.push(normalized);
        if (!internalUrls.has(normalized) && !normalized.startsWith('#') && !link.href.startsWith('/api/')) {
          brokenLinks.push({ href: link.href, sourceUrl: page.url });
        }
      }
    }
    internalGraph[page.url] = outgoing;
  }

  const allInternal = pages.flatMap((p) => p.links.filter((l) => l.isInternal));
  const allExternal = pages.flatMap((p) => p.links.filter((l) => !l.isInternal));

  return {
    totalInternal: allInternal.length,
    totalExternal: allExternal.length,
    brokenLinks,
    internalGraph,
  };
}

function normalizeUrl(href: string, base: string): string {
  if (href.startsWith('/')) {
    const origin = new URL(base).origin;
    return origin + href;
  }
  return href;
}
