export interface BundleProductRef {
  slug: string;
  qty: number;
}

export interface Bundle {
  id: string;
  name: string;
  summary: string;
  description: string;
  image: string;
  products: BundleProductRef[];
  totalPrice: string;
  bundlePrice: string;
  currency: string;
  savings: string;
  badge: string;
  featured: boolean;
}

export const bundles: Bundle[] = [
  {
    id: 'explorer-starter',
    name: 'Explorer Starter Pack',
    summary: 'Everything a first-time paddler needs in one package.',
    description: 'The perfect introduction to stand-up paddleboarding. Includes the SUP Explorer 11, a comfortable Life Vest Classic for safety, the Dual-Action Pump for fast inflation, and the Carbon Paddle — all the gear you need to hit the water on day one.',
    image: '/images/wavefella/products/sup-allround.jpg',
    products: [
      { slug: 'sup-explorer-11', qty: 1 },
      { slug: 'life-vest-classic', qty: 1 },
      { slug: 'pump-dual', qty: 1 },
      { slug: 'paddle-carbon', qty: 1 },
    ],
    totalPrice: '876',
    bundlePrice: '749',
    currency: 'USD',
    savings: '127',
    badge: 'Best for Beginners',
    featured: true,
  },
  {
    id: 'touring-pro',
    name: 'Touring Pro Pack',
    summary: 'Serious touring setup for distance paddlers.',
    description: 'Built for paddlers who want to cover distance. The SUP Tour 12 with its displacement hull pairs perfectly with the ultra-light Carbon Paddle. The Life Vest Pro provides SOLAS-certified safety for offshore and open-water touring.',
    image: '/images/wavefella/products/sup-touring.jpg',
    products: [
      { slug: 'sup-tour-12', qty: 1 },
      { slug: 'paddle-carbon', qty: 1 },
      { slug: 'life-vest-pro', qty: 1 },
    ],
    totalPrice: '1197',
    bundlePrice: '999',
    currency: 'USD',
    savings: '198',
    badge: 'Best Value',
    featured: true,
  },
  {
    id: 'family-fun',
    name: 'Family Fun Pack',
    summary: 'Two-person paddling for the whole family.',
    description: 'Designed for family outings on lakes and calm waters. The Kayak Tandem offers two separate cockpits with adjustable seats, while two Life Vest Classics keep everyone safe. The Dual-Action Pump inflates both vessels quickly.',
    image: '/images/wavefella/products/rk-expedition.jpg',
    products: [
      { slug: 'kayak-tandem', qty: 1 },
      { slug: 'life-vest-classic', qty: 2 },
      { slug: 'pump-dual', qty: 1 },
    ],
    totalPrice: '826',
    bundlePrice: '699',
    currency: 'USD',
    savings: '127',
    badge: 'Top Rated',
    featured: true,
  },
  {
    id: 'solo-adventure',
    name: 'Solo Adventure Pack',
    summary: 'Lightweight solo kayaking for travelers.',
    description: 'The ultimate portable paddling package. The Kayak Lite at just 15 lbs packs into a backpack for airline travel. The Carbon Paddle saves weight and reduces fatigue. Ideal for backpackers, travelers, and solo explorers.',
    image: '/images/wavefella/products/rk-river.jpg',
    products: [
      { slug: 'kayak-lite', qty: 1 },
      { slug: 'paddle-carbon', qty: 1 },
      { slug: 'life-vest-classic', qty: 1 },
    ],
    totalPrice: '677',
    bundlePrice: '579',
    currency: 'USD',
    savings: '98',
    badge: 'Travel Ready',
    featured: false,
  },
  {
    id: 'safety-essentials',
    name: 'Safety Essentials Kit',
    summary: 'Complete flotation and safety gear for any vessel.',
    description: 'Every watercraft needs proper safety equipment. This bundle includes the Life Vest Classic for recreational users and the Life Vest Pro for offshore operations, plus the Dual-Action Pump for your inflatable. One size fits most scenarios.',
    image: '/images/wavefella/products/life-jacket.png',
    products: [
      { slug: 'life-vest-classic', qty: 2 },
      { slug: 'life-vest-pro', qty: 1 },
      { slug: 'pump-dual', qty: 1 },
    ],
    totalPrice: '505',
    bundlePrice: '449',
    currency: 'USD',
    savings: '56',
    badge: 'Essential',
    featured: false,
  },
  {
    id: 'fishing-ready',
    name: 'Fishing Ready Pack',
    summary: 'Everything for a day of SUP or dinghy fishing.',
    description: 'Built for anglers who want to fish from the water. The AirDeck 270 provides a stable fishing platform with its air deck floor. The Life Vest Classic keeps you safe while casting. Add the Carbon Paddle for quiet, efficient movement between fishing spots.',
    image: '/images/wavefella/products/airdeck-270.jpg',
    products: [
      { slug: 'airdeck-270', qty: 1 },
      { slug: 'life-vest-classic', qty: 1 },
      { slug: 'paddle-carbon', qty: 1 },
    ],
    totalPrice: '727',
    bundlePrice: '629',
    currency: 'USD',
    savings: '98',
    badge: 'Angler Choice',
    featured: false,
  },
];
