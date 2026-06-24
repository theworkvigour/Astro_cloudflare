export function stripHtmlTags(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

export function extractTextContent(html: string): string {
  return stripHtmlTags(html).replace(/\s+/g, ' ').trim();
}

export function isHtmlResponse(headers: Headers): boolean {
  const ct = headers.get('content-type') || '';
  return ct.includes('text/html') || ct.includes('application/xhtml');
}
