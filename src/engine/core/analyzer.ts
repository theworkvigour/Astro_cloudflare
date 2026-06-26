import type { PageAnalysis } from './types';

export function analyzeHTML(html: string, url: string): PageAnalysis {
  const lower = html.toLowerCase();

  const title = extractMetaContent(html, 'title') || '';
  const metaDescription = extractMetaContent(html, 'description');
  const headings = extractHeadings(html);
  const semanticElements = extractSemanticElements(lower);
  const jsonLdTypes = extractJsonLdTypes(html);
  const ogTags = extractOgTags(html);
  const links = extractLinks(html, url);
  const images = extractImages(html);
  const wordCount = countWords(stripHtml(html));

  return {
    url,
    title,
    metaDescription,
    headings,
    semanticElements,
    jsonLdTypes,
    ogTags,
    links,
    images,
    wordCount,
    contentLength: html.length,
    hasMain: lower.includes('<main'),
    hasNav: lower.includes('<nav'),
    hasArticle: lower.includes('<article'),
    hasLangAttr: hasAttribute(html, 'lang'),
    hasViewport: lower.includes('viewport'),
    hasCanonical: lower.includes('rel="canonical"') || lower.includes("rel='canonical'"),
    hasLLMsTxt: lower.includes('llms.txt'),
  };
}

function extractMetaContent(html: string, name: string): string {
  const regex = new RegExp(`<meta\\s[^>]*?(?:name|property)=["']${name}["'][^>]*?content=["']([^"']+)["']`, 'i');
  const match = html.match(regex);
  if (match) return match[1];
  const alt = new RegExp(`<meta\\s[^>]*?content=["']([^"']+)["'][^>]*?(?:name|property)=["']${name}["']`, 'i');
  const altMatch = html.match(alt);
  return altMatch ? altMatch[1] : '';
}

function extractHeadings(html: string): { level: number; text: string }[] {
  const headings: { level: number; text: string }[] = [];
  for (let i = 1; i <= 6; i++) {
    const regex = new RegExp(`<h${i}[^>]*>([\\s\\S]*?)<\\/h${i}>`, 'gi');
    let match;
    while ((match = regex.exec(html)) !== null) {
      headings.push({ level: i, text: stripHtml(match[1]).trim().slice(0, 100) });
    }
  }
  return headings;
}

function extractSemanticElements(lower: string): string[] {
  const elements = ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer', 'figure', 'figcaption'];
  return elements.filter((el) => lower.includes(`<${el}`) || lower.includes(`<${el} `));
}

function extractJsonLdTypes(html: string): string[] {
  const types: string[] = [];
  const regex = /"@type"\s*:\s*"([^"]+)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    if (!types.includes(match[1])) types.push(match[1]);
  }
  return types;
}

function extractOgTags(html: string): Record<string, string> {
  const tags: Record<string, string> = {};
  const regex = /<meta\s[^>]*?property=["']og:([^"']+)["'][^>]*?content=["']([^"']+)["']/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    tags[match[1]] = match[2];
  }
  return tags;
}

function extractLinks(html: string, baseUrl: string): { href: string; text: string; isInternal: boolean }[] {
  const links: { href: string; text: string; isInternal: boolean }[] = [];
  const regex = /<a\s[^>]*?href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  const base = new URL(baseUrl).origin;
  while ((match = regex.exec(html)) !== null) {
    const href = match[1].trim();
    const normalizedHref = href.toLowerCase();
    if (
      !href ||
      href.startsWith('#') ||
      normalizedHref.startsWith('javascript:') ||
      normalizedHref.startsWith('data:') ||
      normalizedHref.startsWith('vbscript:')
    ) continue;
    const isInternal = href.startsWith('/') || href.startsWith(base);
    links.push({ href, text: stripHtml(match[2]).trim().slice(0, 60), isInternal });
  }
  return links;
}

function extractImages(html: string): { src: string; alt: string }[] {
  const images: { src: string; alt: string }[] = [];
  const regex = /<img\s[^>]*?src=["']([^"']+)["'][^>]*?(?:alt=["']([^"']*)["'])?/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    images.push({ src: match[1], alt: match[2] || '' });
  }
  return images;
}

function hasAttribute(html: string, attr: string): boolean {
  const regex = new RegExp(`<html[^>]*?\\s${attr}\\s*=`, 'i');
  return regex.test(html);
}

export function stripHtml(text: string): string {
  let sanitized = text
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

  let previous: string;
  do {
    previous = sanitized;
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  } while (sanitized !== previous);

  return sanitized;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}
