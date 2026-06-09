import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { file, glob } from 'astro/loaders';

const AVAILABLE_LOCALES = ['en', 'fr', 'de', 'es', 'pt', 'zh'] as const;

const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),
      canonical: z.string().optional(),
      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),
      description: z.string().optional(),
      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),
      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

const imageSchema = z.object({
  src: z.string().optional(),
  alt: z.string().optional(),
}).optional();

const actionSchema = z.object({
  text: z.string().optional(),
  href: z.string().optional(),
  variant: z.string().optional(),
  icon: z.string().optional(),
}).optional();

const itemSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
});

const heroSection = z.object({
  tagline: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  actions: z.array(actionSchema).optional(),
  image: imageSchema,
}).optional();

const heroTextSection = z.object({
  tagline: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.string().optional(),
}).optional();

const heroCarouselSection = z.object({
  autoplay_interval: z.number().optional(),
  slides: z.array(z.object({
    image: imageSchema,
    tagline: z.string().optional(),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    actions: z.array(actionSchema).optional(),
  })).optional(),
}).optional();

const featuresSection = z.object({
  id: z.string().optional(),
  tagline: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  columns: z.number().optional(),
  items: z.array(itemSchema).optional(),
}).optional();

const features2Section = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),
  columns: z.number().optional(),
  items: z.array(itemSchema).optional(),
}).optional();

const features3Section = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),
  columns: z.number().optional(),
  isBeforeContent: z.boolean().optional(),
  isAfterContent: z.boolean().optional(),
  items: z.array(itemSchema).optional(),
  image: imageSchema,
}).optional();

const contentSection = z.object({
  isReversed: z.boolean().optional(),
  tagline: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.string().optional(),
  items: z.array(itemSchema).optional(),
  image: imageSchema,
}).optional();

const stepsSection = z.object({
  tagline: z.string().optional(),
  title: z.string().optional(),
  isReversed: z.boolean().optional(),
  items: z.array(itemSchema).optional(),
  image: imageSchema,
}).optional();

const steps2Section = z.object({
  tagline: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  isReversed: z.boolean().optional(),
  items: z.array(itemSchema).optional(),
}).optional();

const statsSection = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  columns: z.number().optional(),
  stats: z.array(z.object({
    title: z.string().optional(),
    amount: z.string().optional(),
    icon: z.string().optional(),
  })).optional(),
}).optional();

const faqsSection = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  columns: z.number().optional(),
  items: z.array(itemSchema).optional(),
}).optional();

const testimonialsSection = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  testimonials: z.array(z.object({
    testimonial: z.string().optional(),
    name: z.string().optional(),
    job: z.string().optional(),
    image: imageSchema,
  })).optional(),
}).optional();

const pricingSection = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  prices: z.array(z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    price: z.string().optional(),
    period: z.string().optional(),
    hasRibbon: z.boolean().optional(),
    ribbonTitle: z.string().optional(),
    items: z.array(z.object({ description: z.string().optional() })).optional(),
    callToAction: z.object({
      text: z.string().optional(),
      href: z.string().optional(),
      target: z.string().optional(),
    }).optional(),
  })).optional(),
}).optional();

const ctaSection = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  actions: z.array(actionSchema).optional(),
}).optional();

const featuredProductsSection = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  linkText: z.string().optional(),
  linkUrl: z.string().optional(),
}).optional();

const blogLatestSection = z.object({
  title: z.string().optional(),
  information: z.string().optional(),
}).optional();

const contactFormSection = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  email_to: z.string().optional(),
  submit_button: z.string().optional(),
  success_message: z.string().optional(),
  error_message: z.string().optional(),
  default_country_code: z.string().optional(),
  captcha: z.object({ label: z.string().optional() }).optional(),
  fields: z.array(z.object({
    name: z.string().optional(),
    label: z.string().optional(),
    type: z.string().optional(),
    row: z.number().optional(),
    rows: z.number().optional(),
    withCountryCode: z.boolean().optional(),
  })).optional(),
}).optional();

const mapSection = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  address: z.string().optional(),
  embedUrl: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  zoom: z.number().optional(),
}).optional();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createLocaleSchema = <T extends z.ZodRawShape>(sectionSchemas: T): z.ZodObject<any> => {
  const localeMap: Record<string, z.ZodObject<any>> = {};
  for (const locale of AVAILABLE_LOCALES) {
    localeMap[locale] = z.object(sectionSchemas).partial();
  }
  return z.object(localeMap).partial();
};

const postCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/post' }),
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),
    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    metadata: metadataDefinition(),
  }),
});

const productSpecSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]).transform((v) => String(v)),
});

const productPriceSchema = z
  .object({
    amount: z.string().optional(),
    currency: z.string().optional(),
    note: z.string().optional(),
  })
  .optional();

const productImageSchema = z.object({
  url: z.string(),
  alt: z.string().optional(),
});

const productCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/product' }),
  schema: z.object({
    publishDate: z.date().optional(),
    draft: z.boolean().optional(),
    title: z.string(),
    sku: z.string().optional(),
    summary: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    gallery: z.array(productImageSchema).optional(),
    category: z.enum(['rib', 'inflatable', 'accessory', 'service']).optional(),
    tags: z.array(z.string()).optional(),
    specs: z.array(productSpecSchema).optional(),
    price: productPriceSchema,
    inStock: z.boolean().optional(),
    featured: z.boolean().optional(),
    metadata: metadataDefinition(),
  }),
});

const homepageCollection = defineCollection({
  loader: file('src/content/homepage/index.json'),
  schema: createLocaleSchema({
    hero: heroSection,
    hero_carousel: heroCarouselSection,
    features: featuresSection,
    featured_products: featuredProductsSection,
    content_workshop: contentSection,
    steps: stepsSection,
    blog_latest: blogLatestSection,
    faqs: faqsSection,
    cta: ctaSection,
  }),
});

const aboutCollection = defineCollection({
  loader: file('src/content/about/index.json'),
  schema: createLocaleSchema({
    hero: heroSection,
    stats: statsSection,
    features3_what_we_build: features3Section,
    features3_more: features3Section,
    steps2_values: steps2Section,
    steps2_milestones: steps2Section,
    features2_locations: features2Section,
  }),
});

const servicesCollection = defineCollection({
  loader: file('src/content/services/index.json'),
  schema: createLocaleSchema({
    hero: heroSection,
    features2_what_we_do: features2Section,
    content_service: contentSection,
    testimonials: testimonialsSection,
    cta: ctaSection,
  }),
});

const pricingCollection = defineCollection({
  loader: file('src/content/pricing/index.json'),
  schema: createLocaleSchema({
    hero_text: heroTextSection,
    pricing_packages: pricingSection,
    features3_included: features3Section,
    steps_process: stepsSection,
    faqs: faqsSection,
    cta: ctaSection,
  }),
});

const contactCollection = defineCollection({
  loader: file('src/content/contact/index.json'),
  schema: createLocaleSchema({
    hero_text: heroTextSection,
    contact_form: contactFormSection,
    features2_other_ways: features2Section,
    map: mapSection,
  }),
});

const newsCollection = defineCollection({
  loader: file('src/content/news/index.json'),
  schema: createLocaleSchema({
    hero_text: heroTextSection,
  }),
});

const navigationCollection = defineCollection({
  loader: file('src/content/navigation/index.json'),
  schema: createLocaleSchema({
    header: z.object({
      topBar: z.array(z.object({ text: z.string().optional(), href: z.string().optional() })).optional(),
      links: z.array(z.object({
        text: z.string().optional(),
        links: z.array(z.object({ text: z.string().optional(), href: z.string().optional() })).optional(),
      })).optional(),
      actions: z.array(actionSchema).optional(),
    }).optional(),
    footer: z.object({
      links: z.array(z.object({
        title: z.string().optional(),
        links: z.array(z.object({ text: z.string().optional(), href: z.string().optional() })).optional(),
      })).optional(),
      secondaryLinks: z.array(z.object({ text: z.string().optional(), href: z.string().optional() })).optional(),
      socialLinks: z.array(z.object({ ariaLabel: z.string().optional(), icon: z.string().optional(), href: z.string().optional() })).optional(),
      footNote: z.string().optional(),
    }).optional(),
  }),
});

const globalCollection = defineCollection({
  loader: file('src/content/global/index.json'),
  schema: createLocaleSchema({
    site_name: z.string().optional(),
    site_tagline: z.string().optional(),
    site_description: z.string().optional(),
    copyright: z.string().optional(),
  }),
});

export const collections = {
  post: postCollection,
  product: productCollection,
  homepage: homepageCollection,
  about: aboutCollection,
  services: servicesCollection,
  pricing: pricingCollection,
  contact: contactCollection,
  news: newsCollection,
  navigation: navigationCollection,
  global: globalCollection,
};
