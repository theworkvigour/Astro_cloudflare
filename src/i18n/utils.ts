import { defaultLang, showDefaultLang, languages } from './config';

export function getLangFromUrl(url: URL): string {
  const [, lang] = url.pathname.split('/');
  if (lang && lang in languages) return lang;
  return defaultLang;
}

export function getLangFromPath(path: string): string {
  const parts = path.split('/').filter(Boolean);
  if (parts.length > 0 && parts[0] in languages) return parts[0];
  return defaultLang;
}

export function replaceLang(url: string, lang: string): string {
  const parts = url.split('/');
  const first = parts[1]?.split('?')[0];
  if (first && first in languages) {
    parts[1] = lang;
  } else {
    parts.splice(1, 0, lang);
  }
  return parts.join('/');
}

export function removeLang(path: string): string {
  const parts = path.split('/').filter(Boolean);
  if (parts.length > 0 && parts[0] in languages) {
    return '/' + parts.slice(1).join('/');
  }
  return path.startsWith('/') ? path : '/' + path;
}

export function localizePath(path: string, lang: string): string {
  if (!showDefaultLang && lang === defaultLang) {
    return removeLang(path);
  }
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return '/' + lang + '/' + clean;
}

export function getHreflangLinks(url: URL): Array<{ lang: string; href: string }> {
  const base = getLangFromUrl(url);
  const pathWithoutLang = removeLang(url.pathname);
  const result: Array<{ lang: string; href: string }> = [];
  for (const lang of Object.keys(languages)) {
    result.push({ lang, href: localizePath(pathWithoutLang, lang) });
  }
  result.push({ lang: 'x-default', href: localizePath(pathWithoutLang, defaultLang) });
  return result;
}
