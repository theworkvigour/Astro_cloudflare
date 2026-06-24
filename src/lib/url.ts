export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string, base?: string): string {
  if (url.startsWith('//')) url = 'https:' + url;
  if (!url.startsWith('http')) {
    if (base && url.startsWith('/')) {
      const origin = new URL(base).origin;
      return origin + url;
    }
    return url;
  }
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    return parsed.href.replace(/\/$/, '');
  } catch {
    return url;
  }
}

export function isSameOrigin(url1: string, url2: string): boolean {
  try {
    return new URL(url1).origin === new URL(url2).origin;
  } catch {
    return false;
  }
}
