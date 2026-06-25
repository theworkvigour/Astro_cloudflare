export function organizationSchema(opts: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  email?: string;
  telephone?: string;
  address?: Record<string, string>;
  sameAs?: string[];
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: opts.name,
    url: opts.url,
  };
  if (opts.logo) schema.logo = opts.logo;
  if (opts.description) schema.description = opts.description;
  if (opts.email) schema.email = opts.email;
  if (opts.telephone) schema.telephone = opts.telephone;
  if (opts.address) schema.address = opts.address;
  if (opts.sameAs?.length) schema.sameAs = opts.sameAs;
  return schema;
}

export function webSiteSchema(opts: {
  name: string;
  url: string;
  description?: string;
  searchUrl?: string;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: opts.name,
    url: opts.url,
  };
  if (opts.description) schema.description = opts.description;
  if (opts.searchUrl) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: opts.searchUrl,
      },
      'query-input': 'required name=search_term_string',
    };
  }
  return schema;
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function productSchema(opts: {
  name: string;
  description: string;
  sku?: string;
  image?: string;
  url?: string;
  category?: string;
  brand: string;
  price?: number;
  currency?: string;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    description: opts.description,
    brand: { '@type': 'Brand', name: opts.brand },
  };
  if (opts.sku) schema.sku = opts.sku;
  if (opts.image) schema.image = opts.image;
  if (opts.url) schema.url = opts.url;
  if (opts.category) schema.category = opts.category;
  if (opts.price !== undefined) {
    schema.offers = {
      '@type': 'Offer',
      price: opts.price,
      priceCurrency: opts.currency || 'USD',
      availability: 'https://schema.org/InStock',
    };
  }
  return schema;
}

export function articleSchema(opts: {
  headline: string;
  description?: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  publisher: string;
  url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    image: opts.image,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified || opts.datePublished,
    author: { '@type': 'Person', name: opts.author },
    publisher: { '@type': 'Organization', name: opts.publisher },
    url: opts.url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url },
  };
}
