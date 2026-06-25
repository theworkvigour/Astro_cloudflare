export function localized<T>(field: Record<string, T> | undefined, lang: string): T | undefined {
  if (!field) return undefined;
  return field[lang] ?? field.en;
}

export function localizeUrl(slug: Record<string, string> | undefined, lang: string): string {
  if (!slug) return '';
  return slug[lang] ?? slug.en ?? '';
}

const diacriticsMap: Record<string, string> = {
  'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss',
  'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
  'à': 'a', 'â': 'a', 'ç': 'c', 'î': 'i',
  'ï': 'i', 'ô': 'o', 'ù': 'u', 'û': 'u',
};

export function slugify(text: string): string {
  let s = text.toLowerCase().trim();
  for (const [char, repl] of Object.entries(diacriticsMap)) {
    s = s.replace(new RegExp(char, 'g'), repl);
  }
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  s = s.replace(/[^a-z0-9]+/g, '-');
  s = s.replace(/^-+|-+$/g, '');
  return s || 'untitled';
}

export const nonLatinLangs = new Set(['zh', 'ja', 'ko', 'ar', 'ru']);
export const latinLangs = new Set(['en', 'fr', 'de', 'es', 'pt', 'it', 'pl']);

export function isLatinLang(lang: string): boolean {
  return latinLangs.has(lang);
}

export function slugForLang(id: string, name: Record<string, string>, lang: string): string {
  if (!isLatinLang(lang)) return id;
  const localizedName = name[lang] || name.en || '';
  return slugify(localizedName) || id;
}
