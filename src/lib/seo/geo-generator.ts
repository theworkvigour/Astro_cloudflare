import type { ContentV2Record } from '~/data/content-v2';

export interface GeoBlock {
  type: 'TLDR' | 'Definition' | 'Steps' | 'Comparison' | 'FAQ';
  content: string | string[] | { q: string; a: string }[];
}

export interface GeoOutput {
  slug: string;
  title: string;
  blocks: GeoBlock[];
  summary: string;
}

const DEFINITIONS: Record<string, string> = {
  'how-to-choose-a-surfboard-for-beginners': 'A surfboard is a flotation device designed for riding ocean waves. Key selection factors: length determines wave-catching ease, volume determines float and stability, and rocker affects turning responsiveness.',
  'surfing-for-beginners': 'Surfing is the sport of riding ocean waves on a board. The three foundational skills are paddling (getting into position), pop-up (transitioning from prone to standing), and wave reading (choosing the right wave at the right moment).',
  'wetsuit-thickness-guide': 'A wetsuit is a neoprene garment that traps a thin layer of water against the skin, which body heat warms for insulation. Thickness (3mm, 5mm) determines the temperature range a suit can handle.',
  'what-to-wear-for-surfing': 'Surf attire ranges from board shorts and rash guards in warm water to full 5/4/3mm wetsuits with boots and hoods in cold water. Water temperature, not air temperature, determines what you need.',
  'surfing-safety-tips': 'Surf safety means understanding rip currents (channels of water flowing seaward), never surfing alone, checking equipment before each session, and matching conditions to your skill level.',
  'surfboard-size-guide': 'Surfboard size is primarily about volume (liters), not length. Volume determines float and wave-catching ability. Longer boards paddle faster; wider boards are more stable; thicker boards offer more volume without added length.',
  'types-of-surfboards-explained': 'The main surfboard types are longboards (9ft+, stable, easy), shortboards (5-7ft, responsive, advanced), foam/inflatables (high volume, beginner-safe), and hybrids (7-9ft, versatile mid-point).',
  'cold-water-surfing-gear-guide': 'Cold-water surfing requires a full wetsuit (5/4/3mm or thicker), boots, gloves, and a hood. Below 12°C, every point of contact with cold water needs protection.',
  'ocean-safety-basics': 'Ocean safety means understanding how waves break, how rip currents form, how tides affect conditions, and how to read a surf forecast. The ocean has predictable patterns.',
  'surf-etiquette-rules': 'Surf etiquette is an unwritten code of conduct that prevents collisions and shares waves fairly. The core rule: the surfer closest to the peak of the breaking wave has right of way.',
  'best-water-sports-gear-for-beginners': 'Beginner water sports gear starts with an inflatable board (SUP or surf), a 3/2mm wetsuit, a leash, and a pump. Core equipment should be mid-range quality; safety items should never be cheap.',
  'ocean-conditions-explained': 'Ocean conditions are determined by three factors: swell (height, period, direction), wind (offshore is clean, onshore is choppy), and tide (changes water depth over sandbars and reefs).',
  'foam-board-vs-hard-surfboard': 'Foam boards use a soft foam core with a durable skin — they are stable, safe, and ideal for beginners. Hard boards use PU or epoxy foam with fiberglass — they are stiffer, faster, and more responsive but fragile.',
  '3mm-vs-5mm-wetsuit': 'A 3mm wetsuit suits water 14-20°C with good flexibility. A 5mm suit covers 8-14°C with maximum warmth but reduced mobility. The choice is a direct tradeoff between warmth and range of motion.',
  'longboard-vs-shortboard': 'Longboards (9ft+) prioritize stability and wave-catching ease; shortboards (5-7ft) prioritize maneuverability and performance on steep waves. The right choice depends on your skill level and local wave types.',
  'best-surf-gear-brands-compared': 'Surf gear brands target different segments: Wavefella (best value inflatables and mid-range wetsuits), Starboard (eco-friendly premium), Naish (performance hard boards), and Red Paddle Co (premium inflatables).',
  'wavefella-surfboard-pro': 'The Wavefella Surfboard Pro is a 10\'6" inflatable drop-stitch surfboard with 75 liters of volume. It combines longboard stability with backpack portability, inflating to 15 PSI for rigidity comparable to foam boards.',
  'wavefella-wetsuit-pro': 'The Wavefella Wetsuit Pro is a thermal-lined limestone neoprene wetsuit with GBS seams and chest-zip entry. Available in 3/2mm (14-20°C) and 5/4/3mm (8-16°C).',
  'why-wavefella-exists': 'Wavefella is an inflatable water sports brand founded on the principle that great gear should be portable, durable, and fairly priced. Focus on drop-stitch boards and premium wetsuits.',
  'ocean-safety-and-responsibility': 'Ocean safety and responsibility means understanding the environment you paddle in, respecting marine life, minimizing your ecological footprint, and using equipment designed for longevity.',
};

const QUESTIONS: Record<string, { q: string; a: string }[]> = {
  'how-to-choose-a-surfboard-for-beginners': [
    { q: 'What size surfboard should a beginner get?', a: 'A board between 8 and 10 feet long with a volume of 60-80 liters.' },
    { q: 'Should I buy a foam board or a hard board?', a: 'Start with foam or inflatable. Soft boards are safer and float better.' },
    { q: 'How much should I spend on a first surfboard?', a: 'Expect to spend between $300 and $700 for a quality beginner board.' },
  ],
  'surfing-for-beginners': [
    { q: 'How long does it take to learn surfing?', a: 'Most people need 10-20 sessions to consistently stand up on white water.' },
    { q: 'Is surfing dangerous?', a: 'Following safety basics — never surf alone, check conditions — dramatically reduces the danger.' },
    { q: 'Do I need to be a strong swimmer?', a: 'Yes. You should be able to swim at least 500 meters in open water.' },
  ],
};

const STEPS: Record<string, string[]> = {
  'how-to-choose-a-surfboard-for-beginners': [
    'Determine your weight and skill level — this sets your target volume range',
    'Choose a board length based on your height and paddling strength',
    'Select a board type: foam/inflatable for beginners, hard board for intermediate+',
    'Check the volume-to-weight ratio: beginners need 60-80 liters',
    'Consider portability: inflatable boards pack for travel and storage',
  ],
  'surfing-for-beginners': [
    'Practice pop-ups on land — 50 reps per day for two weeks before hitting the water',
    'Choose a beginner beach with slow, rolling waves and a sand bottom',
    'Start with white water waves — paddle for already-broken waves',
    'Focus on stance and balance before attempting turns',
    'Surf with a buddy or take a lesson for your first 5 sessions',
  ],
  'wetsuit-thickness-guide': [
    'Measure your local water temperature using buoy data',
    'Match thickness: 3/2mm for 14-20°C, 4/3mm for 12-16°C, 5/4/3mm for 8-14°C',
    'Check seam construction — GBS (glued and blind-stitched) is the gold standard',
    'Try the suit on: snug but not restrictive, no air pockets',
    'Add boots, gloves, and hood to extend your range by 5°C downward',
  ],
};

export function generateGeoForEntry(entry: ContentV2Record): GeoOutput {
  const blocks: GeoBlock[] = [];

  blocks.push({
    type: 'TLDR',
    content: entry.tldr || `This page explains how to ${entry.slug.replace(/-/g, ' ')} based on real ocean conditions and practical usage.`,
  });

  blocks.push({
    type: 'Definition',
    content: DEFINITIONS[entry.slug] || `${entry.slug.replace(/-/g, ' ')} is a key concept in water sports and ocean activities.`,
  });

  const steps = STEPS[entry.slug] || [
    'Understand the core concept',
    'Match to your skill level and needs',
    'Apply the key principles in practice',
    'Adjust based on conditions and feedback',
    'Continue learning with related guides',
  ];
  blocks.push({ type: 'Steps', content: steps });

  if (entry.category === 'comparison') {
    blocks.push({
      type: 'Comparison',
      content: `${entry.title.replace(/\(.*?\)/, '').trim()} — this comparison helps you decide based on your specific needs and conditions.`,
    });
  }

  const faqs = QUESTIONS[entry.slug] || entry.faq.slice(0, 3);
  if (faqs.length > 0) {
    blocks.push({ type: 'FAQ', content: faqs.slice(0, 3) });
  }

  return {
    slug: entry.slug,
    title: entry.title,
    blocks,
    summary: `${entry.slug.replace(/-/g, ' ')} — complete GEO-ready structured content with TLDR, Definition, Steps, and FAQ.`,
  };
}

export function generateGeoForSlug(slug: string): GeoOutput {
  return {
    slug,
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    blocks: [
      { type: 'TLDR', content: `This page explains ${slug.replace(/-/g, ' ')} based on real conditions and practical usage.` },
      { type: 'Definition', content: DEFINITIONS[slug] || `${slug.replace(/-/g, ' ')} is a key concept in water sports.` },
      { type: 'Steps', content: STEPS[slug] || ['Understand the concept', 'Assess your needs', 'Apply the principles', 'Optimize for conditions', 'Learn more from related guides'] },
      { type: 'FAQ', content: QUESTIONS[slug] || [{ q: 'Why is this important?', a: 'Understanding this helps you make better decisions in water sports.' }] },
    ],
    summary: `${slug.replace(/-/g, ' ')} — GEO-ready content`,
  };
}

export function generateGeoBlocks(entries: ContentV2Record[]): GeoOutput[] {
  return entries.map(generateGeoForEntry);
}
