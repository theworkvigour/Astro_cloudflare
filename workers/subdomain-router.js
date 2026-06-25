const LANG_MAP = {
  de: 'de', fr: 'fr', es: 'es', pt: 'pt',
  it: 'it', pl: 'pl', ru: 'ru', ja: 'ja', ko: 'ko',
  ar: 'ar', zh: 'zh',
};

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

      // Skip static assets — they are NOT in lang subdirectories
      if (/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|eot|json|xml|mp4|webm)$/i.test(path)) {
        url.hostname = host.replace(`${subdomain}.`, '');
        return fetch(url.toString(), request);
      }

      // Strip lang prefix if already present (e.g. /de/products/ from nav click)
      const pathLang = path.split('/')[1];
      if (pathLang === lang) {
        path = path.slice(3) || '/';
      }

      url.pathname = `/${lang}${path}`;
      url.hostname = host.replace(`${subdomain}.`, '');
    }

    return fetch(url.toString(), request);
  },
};
