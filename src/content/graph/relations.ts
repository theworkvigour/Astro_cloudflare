export interface GraphRelation {
  id: string;
  source: string;
  target: string;
  type: 'is-used-for' | 'is-compatible-with' | 'compares-to' | 'improves-on' | 'requires' | 'enhances';
  label: Record<string, string>;
}

export const relations: GraphRelation[] = [
  {
    id: 'sup-is-used-for-touring',
    source: 'inflatable-sup',
    target: 'touring',
    type: 'is-used-for',
    label: { en: 'SUP boards are used for touring and distance paddling', ko: '', ja: '', zh: '' },
  },
  {
    id: 'sup-is-used-for-beginner',
    source: 'inflatable-sup',
    target: 'beginner',
    type: 'is-used-for',
    label: { en: 'Inflatable SUPs are ideal for beginners due to stability', ko: '', ja: '', zh: '' },
  },
  {
    id: 'kayak-is-used-for-river',
    source: 'inflatable-kayak',
    target: 'river-touring',
    type: 'is-used-for',
    label: { en: 'Inflatable kayaks excel on river touring', ko: '', ja: '', zh: '' },
  },
  {
    id: 'dinghy-is-used-for-fishing',
    source: 'dinghy',
    target: 'fishing',
    type: 'is-used-for',
    label: { en: 'Dinghies are commonly used for fishing', ko: '', ja: '', zh: '' },
  },
  {
    id: 'dinghy-is-used-for-family',
    source: 'dinghy',
    target: 'family-recreation',
    type: 'is-used-for',
    label: { en: 'Dinghies are ideal for family recreation', ko: '', ja: '', zh: '' },
  },
  {
    id: 'rib-is-used-for-professional',
    source: 'rib',
    target: 'professional-operations',
    type: 'is-used-for',
    label: { en: 'RIBs are built for professional marine operations', ko: '', ja: '', zh: '' },
  },
  {
    id: 'rib-is-used-for-rescue',
    source: 'rib',
    target: 'rescue',
    type: 'is-used-for',
    label: { en: 'RIBs are deployed for search and rescue missions', ko: '', ja: '', zh: '' },
  },
  {
    id: 'safety-used-for-all',
    source: 'safety-equipment',
    target: 'beginner',
    type: 'is-used-for',
    label: { en: 'Safety equipment is essential for all water activities', ko: '', ja: '', zh: '' },
  },
  {
    id: 'drop-stitch-compatible-sup',
    source: 'drop-stitch-core',
    target: 'inflatable-sup',
    type: 'is-compatible-with',
    label: { en: 'Drop-stitch core is the primary construction method for rigid SUPs', ko: '', ja: '', zh: '' },
  },
  {
    id: 'eva-compatible-sup',
    source: 'eva-deck',
    target: 'inflatable-sup',
    type: 'is-compatible-with',
    label: { en: 'EVA foam deck pads provide traction on SUP boards', ko: '', ja: '', zh: '' },
  },
  {
    id: 'pump-compatible-sup',
    source: 'dual-action-pump',
    target: 'inflatable-sup',
    type: 'is-compatible-with',
    label: { en: 'Dual-action pumps are the standard inflation tool for SUPs', ko: '', ja: '', zh: '' },
  },
  {
    id: 'hypalon-compatible-rib',
    source: 'hypalon-fabric',
    target: 'rib',
    type: 'is-compatible-with',
    label: { en: 'Hypalon fabric is the preferred material for professional RIB tubes', ko: '', ja: '', zh: '' },
  },
  {
    id: 'carbon-paddle-compatible-touring',
    source: 'carbon-paddle',
    target: 'touring',
    type: 'is-compatible-with',
    label: { en: 'Carbon fiber paddles reduce fatigue on long touring sessions', ko: '', ja: '', zh: '' },
  },
  {
    id: 'drop-stitch-improves-rigidity',
    source: 'drop-stitch-core',
    target: 'air-deck',
    type: 'improves-on',
    label: { en: 'Drop-stitch construction provides superior rigidity compared to traditional air deck floors', ko: '', ja: '', zh: '' },
  },
  {
    id: 'carbon-paddle-improves-aluminum',
    source: 'carbon-paddle',
    target: 'paddle',
    type: 'improves-on',
    label: { en: 'Carbon fiber paddles are lighter and stiffer than standard aluminum paddles', ko: '', ja: '', zh: '' },
  },
  {
    id: 'hypalon-improves-pvc',
    source: 'hypalon-fabric',
    target: 'military-grade-pvc',
    type: 'improves-on',
    label: { en: 'Hypalon offers superior UV and chemical resistance compared to PVC', ko: '', ja: '', zh: '' },
  },
];
