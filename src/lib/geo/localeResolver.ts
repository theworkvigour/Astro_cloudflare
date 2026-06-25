const localeMap: Record<string, string> = {
  KR: 'ko', JP: 'ja', CN: 'zh', TW: 'zh',
  FR: 'fr', DE: 'de', ES: 'es',
  PT: 'pt', BR: 'pt',
  IT: 'it', PL: 'pl', RU: 'ru',
  SA: 'ar', AE: 'ar', EG: 'ar',
};

const acceptLangMap: Record<string, string> = {
  ko: 'ko', ja: 'ja', zh: 'zh',
  fr: 'fr', de: 'de', es: 'es',
  pt: 'pt', it: 'it', pl: 'pl', ru: 'ru',
  ar: 'ar',
};

export function resolveLocale(country: string | null, acceptLang: string | null): string {
  if (country && localeMap[country]) return localeMap[country];

  if (acceptLang) {
    const tags = acceptLang.split(',').map(t => {
      const parts = t.trim().split(';q=');
      return { lang: parts[0].split('-')[0], q: parseFloat(parts[1]) || 1 };
    });
    tags.sort((a, b) => b.q - a.q);
    for (const t of tags) {
      if (acceptLangMap[t.lang]) return acceptLangMap[t.lang];
    }
  }

  return 'en';
}

export function getCookieLocale(cookie: string): string | null {
  const match = cookie.match(/(?:^|;\s*)x-user-locale=([a-z]{2})(?:;|$)/);
  return match ? match[1] : null;
}
