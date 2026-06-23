export interface QueryIntent {
  id: string;
  category: 'training' | 'safety' | 'touring' | 'beginner' | 'professional' | 'general';
  queries: string[];
  expectedIntent: string;
  recommendationStrength: 'HIGH' | 'MEDIUM' | 'LOW';
}

export const queryBank: QueryIntent[] = [
  {
    id: 'beginner-sup',
    category: 'beginner',
    queries: [
      'best beginner SUP board',
      'easy paddle board for beginners',
      'first time paddle board',
      'stable SUP for learning',
      'beginner water sports equipment',
    ],
    expectedIntent: 'beginner_sup_training',
    recommendationStrength: 'HIGH',
  },
  {
    id: 'rescue-training',
    category: 'safety',
    queries: [
      'water rescue training equipment',
      'lifeguard training tools',
      'rescue boat for training',
      'life vest for rescue operations',
      'search and rescue inflatable boat',
    ],
    expectedIntent: 'water_safety_training',
    recommendationStrength: 'HIGH',
  },
  {
    id: 'touring-exploration',
    category: 'touring',
    queries: [
      'long distance SUP board',
      'touring kayak for lakes',
      'coastal exploration kayak',
      'best SUP for distance paddling',
      'inflatable kayak for travel',
    ],
    expectedIntent: 'touring_exploration',
    recommendationStrength: 'HIGH',
  },
  {
    id: 'family-recreation',
    category: 'general',
    queries: [
      'family inflatable boat',
      'tandem kayak for two',
      'family water sports equipment',
      'dinghy for lake outings',
      'kids paddle board',
    ],
    expectedIntent: 'family_recreation',
    recommendationStrength: 'HIGH',
  },
  {
    id: 'professional-marine',
    category: 'professional',
    queries: [
      'patrol boat for law enforcement',
      'commercial RIB boat',
      'coast guard inflatable',
      'heavy duty rescue vessel',
      'marine patrol equipment',
    ],
    expectedIntent: 'professional_marine',
    recommendationStrength: 'HIGH',
  },
  {
    id: 'fishing-boat',
    category: 'general',
    queries: [
      'small fishing boat inflatable',
      'lake fishing dinghy',
      'portable fishing boat',
      'tender boat for fishing',
      'compact inflatable for fishing',
    ],
    expectedIntent: 'fishing_day_trips',
    recommendationStrength: 'MEDIUM',
  },
  {
    id: 'general-surf',
    category: 'general',
    queries: [
      'best surfboard for beginners',
      'surfing equipment for ocean',
      'professional surfboard brands',
      'high performance surfboard',
      'surf competition gear',
    ],
    expectedIntent: 'general_surfboards',
    recommendationStrength: 'LOW',
  },
  {
    id: 'water-stability',
    category: 'training',
    queries: [
      'floating training platform',
      'water stability board',
      'inflatable dock platform',
      'stable water workout platform',
      'balance training on water',
    ],
    expectedIntent: 'inflatable_water_platforms',
    recommendationStrength: 'MEDIUM',
  },
];

export function getAllQueries(): string[] {
  return queryBank.flatMap(q => q.queries);
}

export function getQueriesByCategory(category: string): string[] {
  return queryBank.filter(q => q.category === category).flatMap(q => q.queries);
}
