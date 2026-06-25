import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken } from '~/lib/auth';
import { languages, defaultLang } from '~/i18n/config';
import { resolveLocale, getCookieLocale } from '~/lib/geo/localeResolver';

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

function detectLocale(request: Request): string {
  const cookie = request.headers.get('cookie') || '';

  // Priority 1: user manual override (cookie)
  const cookieLocale = getCookieLocale(cookie);
  if (cookieLocale && languages[cookieLocale]) return cookieLocale;

  // Priority 2: Geo IP + Accept-Language
  const country = request.headers.get('cf-ipcountry');
  const accept = request.headers.get('accept-language');
  const detected = resolveLocale(country, accept);

  return detected in languages ? detected : defaultLang;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const url = context.url.pathname;

  const isProtected = protectedPrefixes.some((p) => url === p || url.startsWith(p + '/') || (p.endsWith('/') && url.startsWith(p)));
  const isPublic = publicPaths.some((p) => url === p || url.startsWith(p + '/'));

  if (isProtected && !isPublic) {
    const sessionCookie = context.cookies.get('ks-admin-session')?.value;
    const session = sessionCookie ? verifySessionToken(sessionCookie) : null;
    if (!session) return context.redirect('/login');
  }

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

  if (!shouldSkipI18n(url)) {
    const pathLang = url.split('/')[1]?.split('?')[0] || '';
    const hasLangPrefix = pathLang in languages;

    if (!hasLangPrefix) {
      const detected = detectLocale(context.request);

      if (detected !== defaultLang) {
        const hostname = context.url.hostname;
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';

        if (isLocalhost) {
          const dest = url === '/' || url === '' ? `/${detected}/` : `/${detected}${url}`;
          return context.redirect(dest, 302);
        }

        const domain = hostname.replace(/^www\./, '');
        const dest = url === '/' || url === '' ? '/' : url;
        return context.redirect(`https://${detected}.${domain}${dest}`, 302);
      }
    }

    const lang = hasLangPrefix ? pathLang : defaultLang;
    context.locals.lang = lang;
    context.locals.locale = lang;
    context.locals.isEN = lang === 'en';
  } else {
    context.locals.lang = defaultLang;
    context.locals.locale = defaultLang;
    context.locals.isEN = true;
  }

  return next();
});
