import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken } from '~/lib/auth';
import { languages, defaultLang } from '~/i18n/config';
import { getLangFromUrl, removeLang, localizePath } from '~/i18n/utils';

const protectedPrefixes = ['/keystatic', '/admin'];
const publicPaths = [
  '/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/change-password',
];

const geoApiPaths = ['/api/geo-score', '/api/site-audit', '/api/page-inspect'];
const geoInternalPrefixes = ['/internal'];

const i18nExcludedPrefixes = ['/api', '/keystatic', '/admin', '/login', '/internal', '/images', '/assets', '/favicon'];

function shouldSkipI18n(url: string): boolean {
  const hasExtension = /\.[a-z0-9]+(\?.*)?$/i.test(url);
  if (hasExtension) return true;
  return i18nExcludedPrefixes.some(p => url === p || url.startsWith(p + '/'));
}

function getPreferredLang(accept: string | null): string {
  if (!accept) return defaultLang;
  const tags = accept.split(',').map(t => {
    const parts = t.trim().split(';q=');
    return { lang: parts[0].split('-')[0], q: parseFloat(parts[1]) || 1 };
  });
  tags.sort((a, b) => b.q - a.q);
  for (const t of tags) {
    if (languages[t.lang]) return t.lang;
  }
  return defaultLang;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const url = context.url.pathname;

  // Auth protection
  const isProtected = protectedPrefixes.some((p) => url === p || url.startsWith(p + '/') || (p.endsWith('/') && url.startsWith(p)));
  const isPublic = publicPaths.some((p) => url === p || url.startsWith(p + '/'));

  if (isProtected && !isPublic) {
    const sessionCookie = context.cookies.get('ks-admin-session')?.value;
    const session = sessionCookie ? verifySessionToken(sessionCookie) : null;
    if (!session) {
      return context.redirect('/login');
    }
  }

  // GEO API auth
  const isGeoApi = geoApiPaths.some((p) => url === p || url.startsWith(p + '/'));
  const isGeoInternal = geoInternalPrefixes.some((p) => url === p || url.startsWith(p + '/'));

  if (isGeoApi) {
    const { authorizeGeoApi } = await import('~/lib/geo-auth');
    const auth = authorizeGeoApi(context.request);
    if (!auth.ok) {
      return new Response(JSON.stringify({ error: auth.error }), {
        status: auth.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (isGeoInternal) {
    const { authorizeGeoDashboard } = await import('~/lib/geo-auth');
    const sessionCookie = context.cookies.get('ks-admin-session')?.value;
    const auth = authorizeGeoDashboard(sessionCookie);
    if (!auth.ok) {
      if (context.request.headers.get('accept')?.includes('json')) {
        return new Response(JSON.stringify({ error: auth.error }), {
          status: auth.status,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return context.redirect('/login');
    }
  }

  // i18n: root path redirect to preferred language
  if (!shouldSkipI18n(url) && !languages[url.split('/')[1]?.split('?')[0] || '']) {
    // If it's not a language-prefixed path, check Accept-Language and redirect
    if (url === '/' || url === '') {
      const preferredLang = getPreferredLang(context.request.headers.get('accept-language'));
      const targetPath = localizePath('/', preferredLang);
      if (targetPath !== '/') {
        return context.redirect(targetPath, 302);
      }
    }
    // For non-root paths without lang prefix, we still render them as-is
    // (backward compatibility with existing URLs)
  }

  // Store language in locals for downstream use
  const lang = getLangFromUrl(context.url);
  context.locals.lang = lang;

  return next();
});
