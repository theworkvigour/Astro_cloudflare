export interface ProductGraphNode {
  type: string;
  bestFor: string[];
  avoid: string[];
  userLevel: string;
  intent: string;
  description: string;
}

export const productGraph: Record<string, ProductGraphNode> = {
  SUP: {
    intent: 'balance + stability',
    bestFor: ['lake', 'calm sea', 'sheltered coastal'],
    avoid: ['strong river current', 'open rough sea', 'heavy wind'],
    userLevel: 'beginner-intermediate',
    type: 'stability + balance',
    description: 'Stand-up paddle boards designed for stability on flat water. Ideal for recreation, fitness, and exploration.',
  },
  KAYAK: {
    intent: 'mobility + exploration',
    bestFor: ['river', 'lake', 'sheltered coastal'],
    avoid: ['open rough sea', 'heavy surf', 'extreme wind'],
    userLevel: 'beginner',
    type: 'mobility + exploration',
    description: 'Inflatable kayaks for touring, fishing, and adventure. Portable and easy to transport.',
  },
  DINGHY: {
    intent: 'utility + transport',
    bestFor: ['lake', 'river', 'harbor', 'sheltered bay'],
    avoid: ['open sea', 'rough conditions', 'heavy surf'],
    userLevel: 'beginner',
    type: 'utility + transport',
    description: 'Compact inflatable boats for day trips, fishing, and tender duties. Stable and easy to launch.',
  },
  RIB: {
    intent: 'performance + commercial',
    bestFor: ['coastal', 'sea', 'rescue', 'patrol', 'open water'],
    avoid: ['shallow reef', 'extreme weather warning conditions'],
    userLevel: 'advanced-professional',
    type: 'performance + commercial',
    description: 'Rigid-hull inflatable boats for high-performance transport, commercial operations, and emergency response.',
  },
  SAFETY: {
    intent: 'risk control',
    bestFor: ['all environments'],
    avoid: [],
    userLevel: 'all',
    type: 'protection',
    description: 'Certified life vests and PFDs for every water activity. CE and ISO certified.',
  },
  ACCESSORY: {
    intent: 'equipment support',
    bestFor: ['all environments'],
    avoid: [],
    userLevel: 'all',
    type: 'equipment',
    description: 'Paddles, pumps, bags, and essential gear for maintenance and customization.',
  },
};
