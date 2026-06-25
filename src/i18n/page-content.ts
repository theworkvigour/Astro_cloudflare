import pageContentData from 'astro:page-content';

const cache = new Map<string, any>();

export function getPageContent(lang: string, page: string = 'home'): any {
  const key = `${lang}/${page}`;
  if (cache.has(key)) return cache.get(key);
  const data = (pageContentData as any)[key] || (pageContentData as any)[`en/${page}`] || {};
  cache.set(key, data);
  return data;
}
