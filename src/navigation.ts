import { getPermalink, getAsset } from './utils/permalinks';

import navData from '~/data/site/navigation.yaml';

const PRODUCT_LIST = '/products';

const headerData = {
  topBarLinks: navData?.header?.topBar ?? [],
  links:
    navData?.header?.links?.map((entry) => ({
      text: entry?.text,
      links: (entry?.links ?? []).map((l) => ({ text: l?.text, href: l?.href })),
    })) ?? [
      {
        text: 'Products',
        links: [
          { text: 'All Products', href: getPermalink(PRODUCT_LIST) },
          { text: 'RIB Boats', href: getPermalink(`${PRODUCT_LIST}?category=rib`) },
          { text: 'Inflatable Boats', href: getPermalink(`${PRODUCT_LIST}?category=inflatable`) },
          { text: 'Accessories', href: getPermalink(`${PRODUCT_LIST}?category=accessory`) },
        ],
      },
    ],
  actions: navData?.header?.actions ?? [
    { text: 'Get a quote', href: getPermalink('/contact'), variant: 'primary' as const },
  ],
};

export { headerData };

export const footerData = {
  links: navData?.footer?.links ?? [
    {
      title: 'Products',
      links: [
        { text: 'All Products', href: getPermalink(PRODUCT_LIST) },
        { text: 'RIB Boats', href: getPermalink(`${PRODUCT_LIST}?category=rib`) },
        { text: 'Inflatable Boats', href: getPermalink(`${PRODUCT_LIST}?category=inflatable`) },
        { text: 'Accessories', href: getPermalink(`${PRODUCT_LIST}?category=accessory`) },
      ],
    },
  ],
  secondaryLinks: navData?.footer?.secondaryLinks ?? [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: navData?.footer?.socialLinks ?? [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: 'https://github.com/theworkvigour' },
  ],
};
