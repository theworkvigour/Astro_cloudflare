import { defaultLang, showDefaultLang, languages } from './config';

export function getLangFromUrl(url: URL): string {
  const [, lang] = url.pathname.split('/');
  if (lang && lang in languages) return lang;
  return defaultLang;
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
