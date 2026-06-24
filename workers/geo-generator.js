const SEO_TEMPLATES = {
  '/en/guides/beginner-guide': {
    tldr: 'A complete beginner guide to stand-up paddle boarding, covering gear selection, basic techniques, and safety tips for first-timers.',
    definition: 'Stand-up paddle boarding (SUP) is a water sport where you stand on a board and propel yourself with a paddle.',
    steps: [
      'Choose a wide, stable inflatable board (10-11 feet, 32+ inches wide)',
      'Select an adjustable aluminum paddle at least 6-8 inches taller than your height',
      'Practice kneeling on the board before standing up',
      'Keep your feet parallel, shoulder-width apart, knees slightly bent',
    ],
    faq: [
      { q: 'Is SUP harder than surfing?', a: 'No. SUP on flat water is easier to learn than surfing since there are no waves to manage.' },
      { q: 'Do I need a lesson?', a: 'Not required, but a 1-hour lesson accelerates learning significantly.' },
    ],
  },
  '/en/guides/sup-fishing': {
    tldr: 'Everything you need to know about fishing from a stand-up paddle board, including gear, techniques, and safety.',
    definition: 'SUP fishing combines stand-up paddle boarding with angling, offering a quiet, stable platform for accessing shallow waters.',
    steps: [
      'Use a fishing-specific SUP with mounting points for rod holders',
      'Attach a cooler or crate with bungee cords for catches and gear',
      'Anchor in calm, shallow waters (2-6 feet deep)',
      'Cast parallel to the board to avoid hooking the deck',
    ],
    faq: [
      { q: 'Can I stand and fish?', a: 'Yes. A wide fishing SUP (34+ inches) provides ample stability.' },
      { q: 'What fish can I catch?', a: 'Redfish, trout, bass, and panfish are common SUP targets.' },
    ],
  },
  '/en/guides/sup-yoga': {
    tldr: 'Combine paddle boarding with yoga for a full-body workout that challenges balance, core strength, and focus.',
    definition: 'SUP yoga is the practice of yoga on a stand-up paddle board, adding an instability element that engages deeper stabilizer muscles.',
    steps: [
      'Choose a calm day with no wind or current',
      'Use a wide, thick board (32+ inches wide, 6+ inches thick)',
      'Start with kneeling poses (Cat-Cow, Child\'s Pose)',
      'Progress to standing poses (Warrior II, Tree Pose) on the board',
    ],
    faq: [
      { q: 'Is SUP yoga dangerous?', a: 'No more than regular yoga. Falling in water is softer than falling on a mat.' },
    ],
  },
};

export function generateGEO(data) {
  const pages = new Set();
  for (const d of data) {
    if (d.page) pages.add(d.page);
  }

  return Array.from(pages).map(page => {
    const tmpl = SEO_TEMPLATES[page] || {
      tldr: `Practical guide and best practices for ${page.split('/').pop().replace(/-/g, ' ')}.`,
      definition: 'Structured content designed to answer common user questions about this topic.',
      steps: [
        'Assess your skill level and goals',
        'Research the appropriate gear for your needs',
        'Follow safety guidelines for your chosen activity',
        'Practice regularly and refine your technique',
      ],
      faq: [
        { q: 'What is the best way to get started?', a: 'Begin with the fundamentals and gradually build your skills.' },
      ],
    };

    return { page, ...tmpl };
  });
}
