export interface FaqRecord {
  id: string;
  question: string;
  answer: string;
  category: 'product' | 'shipping' | 'safety' | 'maintenance' | 'general';
  relatedProducts: string[];
  relatedGuides: string[];
}

export const faqs: FaqRecord[] = [
  {
    id: 'sup-learning',
    question: 'Is SUP hard to learn?',
    answer: 'Not at all. Most beginners stand up and paddle within their first session. Our All-Around SUP series features extra-wide stable platforms designed specifically for first-time paddlers. Start on calm water and you will be cruising in minutes.',
    category: 'general',
    relatedProducts: ['sup-explorer-11'],
    relatedGuides: ['beginner-guide'],
  },
  {
    id: 'ocean-use',
    question: 'Can I use it in the ocean?',
    answer: 'Yes. Wavefella SUP boards are built for ocean, lake, and river use. Our Touring series handles coastal chop, and all boards use marine-grade PVC that resists saltwater corrosion. Rinse with fresh water after ocean use.',
    category: 'general',
    relatedProducts: ['sup-explorer-11', 'sup-tour-12'],
    relatedGuides: ['weather-conditions'],
  },
  {
    id: 'inflation-time',
    question: 'How long does it take to inflate?',
    answer: 'With the included dual-action pump, most boards inflate to 12–15 PSI in under 5 minutes. Our electric pump option cuts that to under 2 minutes. Deflation and packing take about 3 minutes.',
    category: 'product',
    relatedProducts: ['pump-dual'],
    relatedGuides: ['sup-maintenance'],
  },
  {
    id: 'travel-sup',
    question: 'Can I travel with an inflatable SUP?',
    answer: 'Absolutely. Every Wavefella board packs into a backpack-sized carrying case that meets airline luggage requirements. At just 18–22 lbs, it is easy to carry to the beach, lake, or through airport terminals.',
    category: 'general',
    relatedProducts: ['sup-explorer-11', 'sup-tour-12'],
    relatedGuides: [],
  },
  {
    id: 'weight-limit',
    question: 'What is the weight limit?',
    answer: 'Our All-Around SUPs support up to 220 lbs. The Touring and Yoga series support up to 250 lbs. For tandem use or heavier loads, our Kayak and Dinghy products offer higher capacity options.',
    category: 'product',
    relatedProducts: ['sup-explorer-11', 'sup-tour-12', 'kayak-tandem', 'airdeck-360'],
    relatedGuides: ['understanding-specs'],
  },
  {
    id: 'box-contents',
    question: 'What comes in the box?',
    answer: 'Every Wavefella SUP includes the board, a travel backpack, dual-action hand pump, removable fin, coil leash, and repair kit. Some models also include a carbon paddle upgrade option.',
    category: 'product',
    relatedProducts: ['sup-explorer-11', 'sup-tour-12'],
    relatedGuides: [],
  },
  {
    id: 'bundle-deals',
    question: 'Do you offer bundle deals?',
    answer: 'Yes. We offer curated bundles like the Explorer Starter Pack and Family Fun Pack that save you up to $198 compared to buying items separately. Browse all bundles at the Bundle Deals page.',
    category: 'shipping',
    relatedProducts: [],
    relatedGuides: [],
  },
  {
    id: 'pfd-requirement',
    question: 'Do I need a life vest on a SUP?',
    answer: 'Yes. Many jurisdictions legally require a life vest on any watercraft, including SUPs. Even where not required, a CE-certified life vest is essential safety equipment.',
    category: 'safety',
    relatedProducts: ['life-vest-classic', 'life-vest-pro'],
    relatedGuides: ['safety-tips'],
  },
  {
    id: 'puncture-repair',
    question: 'How do I repair a puncture?',
    answer: 'Clean the area, cut a patch with rounded corners, apply PVC adhesive, press firmly, and wait 24 hours before inflating. Wavefella boards include a repair kit. For detailed instructions, see our inflatable repair guide.',
    category: 'maintenance',
    relatedProducts: ['sup-explorer-11'],
    relatedGuides: ['inflatable-repair', 'sup-maintenance'],
  },
  {
    id: 'storage',
    question: 'How should I store my inflatable SUP?',
    answer: 'Rinse with fresh water, dry completely, deflate fully, roll loosely from the nose, and store in the carry bag in a cool dry place away from direct sunlight. Never store wet or in extreme temperatures.',
    category: 'maintenance',
    relatedProducts: [],
    relatedGuides: ['sup-maintenance'],
  },
  {
    id: 'sup-vs-hard',
    question: 'Inflatable or hard SUP board?',
    answer: 'Inflatable boards offer portability, storage convenience, and impact absorption. Hard boards offer maximum rigidity and speed. For most recreational users, a quality inflatable with drop-stitch core is the practical choice.',
    category: 'general',
    relatedProducts: ['sup-explorer-11', 'sup-tour-12'],
    relatedGuides: ['inflatable-vs-hard', 'how-to-choose-your-sup'],
  },
  {
    id: 'wind-safety',
    question: 'What wind speed is too high for SUP?',
    answer: 'Beginners: over 10 mph (8 knots). Intermediate: over 15 mph (13 knots). Advanced: over 20 mph (17 knots). If in doubt, do not go out. Offshore wind (blowing from land to sea) is dangerous at any skill level.',
    category: 'safety',
    relatedProducts: [],
    relatedGuides: ['weather-conditions', 'safety-tips'],
  },
  {
    id: 'warranty',
    question: 'What is the Wavefella warranty?',
    answer: 'All Wavefella products are backed by a 2-year comprehensive manufacturer warranty covering manufacturing defects in materials and workmanship.',
    category: 'shipping',
    relatedProducts: [],
    relatedGuides: [],
  },
  {
    id: 'shipping-info',
    question: 'How long does shipping take?',
    answer: 'US domestic orders ship within 2-3 business days and arrive in 5-10 business days. International orders ship within 3-5 business days and arrive in 10-20 business days depending on destination.',
    category: 'shipping',
    relatedProducts: [],
    relatedGuides: [],
  },
  {
    id: 'paddle-length',
    question: 'What paddle length do I need?',
    answer: 'For SUP: the paddle should be 6-8 inches taller than your height. For kayak: paddle length depends on boat width and torso length. See our paddle guide for detailed sizing.',
    category: 'product',
    relatedProducts: ['paddle-carbon'],
    relatedGuides: ['choosing-paddle'],
  },
];
