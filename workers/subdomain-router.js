const LANG_MAP = {
  de: 'de', fr: 'fr', es: 'es', pt: 'pt',
  it: 'it', pl: 'pl', ru: 'ru', ja: 'ja', ko: 'ko',
  ar: 'ar', zh: 'zh',
};

// Routes that exist under [lang]/ and should get /{lang}/ prefix
const LANG_PREFIX_ROUTES = new Set([
  '', 'faq', 'guides', 'use-cases', 'products', 'compare',
  'geo-report', 'llms.txt', 'sitemap.xml', 'v2',
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname;
    const parts = host.split('.');
    const subdomain = parts[0];
    const lang = LANG_MAP[subdomain];

    if (subdomain === 'www') {
      url.hostname = host.replace('www.', '');
      return Response.redirect(url.toString(), 301);
    }

    if (parts.length >= 3 && lang) {
      let path = url.pathname;

      // Static assets — proxy without lang prefix
      if (/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|eot|json|xml|mp4|webm)$/i.test(path)) {
        url.hostname = host.replace(`${subdomain}.`, '');
        return fetch(url.toString(), request);
      }

      const firstSegment = path.split('/')[1] || '';

      // Strip lang prefix if already present (e.g. /de/products/ from nav click)
      if (firstSegment === lang) {
        path = '/' + path.split('/').slice(2).join('/');
      }

      if (LANG_PREFIX_ROUTES.has(firstSegment)) {
        // Route has [lang]/ equivalent — add /{lang}/ prefix
        const rest = path === '/' ? '' : path;
        url.pathname = `/${lang}${rest}`;
      }
      // else: SSR/admin/api route without [lang]/ — proxy as-is

      url.hostname = host.replace(`${subdomain}.`, '');
    }

    return fetch(url.toString(), request);
  },
};
