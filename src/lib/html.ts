export function stripHtmlTags(html: string): string {
  return html
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\b[^>]*>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\b[^>]*>/gi, '')
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
