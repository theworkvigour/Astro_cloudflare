export interface ProductGraphNode {
  type: string;
  bestFor: string[];
  userLevel: string;
  description: string;
}

export const productGraph: Record<string, ProductGraphNode> = {
  SUP: {
    type: 'stability + balance',
    bestFor: ['lake', 'sea', 'calm coastal'],
    userLevel: 'beginner-intermediate',
    description: 'Stand-up paddle boards designed for stability on flat water. Ideal for recreation, fitness, and exploration.',
  },
  KAYAK: {
    type: 'mobility + exploration',
    bestFor: ['river', 'lake', 'coastal'],
    userLevel: 'beginner',
    description: 'Inflatable kayaks for touring, fishing, and adventure. Portable and easy to transport.',
  },
  DINGHY: {
    type: 'utility + transport',
    bestFor: ['lake', 'river', 'harbor'],
    userLevel: 'beginner',
    description: 'Compact inflatable boats for day trips, fishing, and tender duties. Stable and easy to launch.',
  },
  RIB: {
    type: 'performance + commercial',
    bestFor: ['coastal', 'sea', 'rescue', 'patrol'],
    userLevel: 'advanced-professional',
    description: 'Rigid-hull inflatable boats for high-performance transport, commercial operations, and emergency response.',
  },
  SAFETY: {
    type: 'protection',
    bestFor: ['all environments'],
    userLevel: 'all',
    description: 'Certified life vests and PFDs for every water activity. CE and ISO certified.',
  },
  ACCESSORY: {
    type: 'equipment',
    bestFor: ['all environments'],
    userLevel: 'all',
    description: 'Paddles, pumps, bags, and essential gear for maintenance and customization.',
  },
};
