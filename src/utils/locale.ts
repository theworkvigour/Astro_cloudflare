import langs from '~/data/site/languages.yaml';

type LangEntry = { code: string; name: string; locale: string; textDirection: string };
const langList = langs as LangEntry[];

export const AVAILABLE_LOCALES = langList.map((l) => l.locale) as [string, ...string[]];
