import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken } from '~/lib/auth';

const protectedPrefixes = ['/keystatic', '/admin'];
const publicPaths = [
  '/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/change-password',
];

const geoApiPaths = ['/api/geo-score', '/api/site-audit', '/api/page-inspect'];
const geoInternalPrefixes = ['/internal'];

export const onRequest = defineMiddleware(async (context, next) => {
  const url = context.url.pathname;

  const isProtected = protectedPrefixes.some((p) => url === p || url.startsWith(p + '/') || (p.endsWith('/') && url.startsWith(p)));
  const isPublic = publicPaths.some((p) => url === p || url.startsWith(p + '/'));

  if (isProtected && !isPublic) {
    const sessionCookie = context.cookies.get('ks-admin-session')?.value;
    const session = sessionCookie ? verifySessionToken(sessionCookie) : null;

    if (!session) {
      return context.redirect('/login');
    }
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

  return next();
});
