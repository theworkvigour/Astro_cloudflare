export interface GraphNode {
  id: string;
  type: 'product-category' | 'technology' | 'material' | 'use-case' | 'component' | 'concept';
  name: Record<string, string>;
  description: Record<string, string>;
  features?: Record<string, string[]>;
  useCases?: Record<string, string[]>;
  faq?: Record<string, Array<{ q: string; a: string }>>;
  related: string[];
  slug: Record<string, string>;
}

export const nodes: GraphNode[] = [
  {
    id: 'inflatable-sup',
    type: 'product-category',
    name: {
  "en":"Inflatable SUP Board",
  "ko":"인플레이터블 패들보드",
  "ja":"インフレータブルSUPボード",
  "zh":"充气站立式桨板",
  "fr":"Inflatable SUP Board",
  "de":"Inflatable SUP Board",
  "es":"Inflatable SUP Board",
  "pt":"Inflatable SUP Board",
  "it":"Inflatable SUP Board",
  "ru":"Inflatable SUP Board",
  "pl":"Inflatable SUP Board",
  "ar":"Inflatable SUP Board"
},
    description: {"en":"Portable air-filled paddle board designed for surfing, touring, and recreation on flat water and small waves."},
    features: {
      en: ["Drop-stitch core for rigidity", "EVA foam deck pad for traction", "Removable fin system", "High-pressure inflation up to 15 PSI", "Packs into backpack for storage"],
    },
    useCases: {
      en: ["Flat water paddling", "Touring and distance paddling", "Small wave surfing", "Fishing from inflatable craft", "Fitness and SUP yoga"],
    },
    faq: {
      en: [
        { q: "Is an inflatable SUP as rigid as a hard board?", a: "At proper inflation (12-15 PSI), modern drop-stitch SUPs achieve comparable rigidity for recreational paddling." },
        { q: "How long does it take to inflate?", a: "With a dual-action pump, most boards reach 12-15 PSI in 3-5 minutes." },
        { q: "Can I take an inflatable SUP on an airplane?", a: "Yes. When deflated and rolled, most SUPs fit into a backpack that meets airline checked baggage requirements." }
      ],
    },
    related: ["drop-stitch-core", "eva-deck", "paddle", "touring", "beginner"],
    slug: {
      en: 'inflatable-sup',
      zh: 'inflatable-sup', ja: 'inflatable-sup', ko: 'inflatable-sup', ar: 'inflatable-sup', ru: 'inflatable-sup',
      fr: 'inflatable-sup-board', de: 'inflatable-sup-board', es: 'inflatable-sup-board', pt: 'inflatable-sup-board', it: 'inflatable-sup-board', pl: 'inflatable-sup-board'
    },
  },

  {
    id: 'inflatable-kayak',
    type: 'product-category',
    name: {
  "en":"Inflatable Kayak",
  "ko":"인플레이터블 카약",
  "ja":"インフレータブルカヤック",
  "zh":"充气皮划艇",
  "fr":"Inflatable Kayak",
  "de":"Inflatable Kayak",
  "es":"Inflatable Kayak",
  "pt":"Inflatable Kayak",
  "it":"Inflatable Kayak",
  "ru":"Inflatable Kayak",
  "pl":"Inflatable Kayak",
  "ar":"Inflatable Kayak"
},
    description: {"en":"Portable kayak that inflates for use on rivers, lakes, and coastal waters. Offers storage and transport convenience."},
    features: {
      en: ["Inflatable drop-stitch or air deck construction", "Multiple air chambers for safety", "Portable backpack storage", "Suitable for flat water and class II rapids"],
    },
    useCases: {
      en: ["River touring", "Lake paddling", "Coastal exploration", "Fishing from inflatable craft"],
    },
    faq: {
      en: [
        { q: "Are inflatable kayaks durable?", a: "Yes. Military-grade PVC construction resists punctures, impacts, and UV damage." },
        { q: "Can an inflatable kayak handle rapids?", a: "Many inflatable kayaks are rated for class I-II rapids and whitewater use." }
      ],
    },
    related: ["drop-stitch-core", "paddle", "river-touring", "beginner"],
    slug: {
      en: 'inflatable-kayak',
      zh: 'inflatable-kayak', ja: 'inflatable-kayak', ko: 'inflatable-kayak', ar: 'inflatable-kayak', ru: 'inflatable-kayak',
      fr: 'inflatable-kayak', de: 'inflatable-kayak', es: 'inflatable-kayak', pt: 'inflatable-kayak', it: 'inflatable-kayak', pl: 'inflatable-kayak'
    },
  },

  {
    id: 'dinghy',
    type: 'product-category',
    name: {
  "en":"Inflatable Dinghy",
  "ko":"인플레이터블 딩기",
  "ja":"インフレータブルディンギー",
  "zh":"充气小艇",
  "fr":"Inflatable Dinghy",
  "de":"Inflatable Dinghy",
  "es":"Inflatable Dinghy",
  "pt":"Inflatable Dinghy",
  "it":"Inflatable Dinghy",
  "ru":"Inflatable Dinghy",
  "pl":"Inflatable Dinghy",
  "ar":"Inflatable Dinghy"
},
    description: {"en":"Multi-purpose inflatable boat for tender duty, fishing, and family recreation on protected waters."},
    features: {
      en: ["Multiple air chambers", "Transom for outboard motor", "Air deck or slatted floor options", "Carrying bag included"],
    },
    useCases: {
      en: ["Dinghy tender for yachts", "Fishing from inflatable craft", "Family recreation on lakes", "Short-distance coastal cruising"],
    },
    faq: {
      en: [
        { q: "How many people can an inflatable dinghy carry?", a: "Capacity varies by size. A 2.7m dinghy typically carries 3-4 adults, while a 3.6m model can carry 5-6 adults with gear." },
        { q: "Can I leave my inflatable dinghy inflated?", a: "It is best to deflate and store your dinghy when not in use for extended periods, but it can remain inflated for several days during a trip." }
      ],
    },
    related: ["air-deck", "outboard-motor", "fishing", "family-recreation"],
    slug: {
      en: 'dinghy',
      zh: 'dinghy', ja: 'dinghy', ko: 'dinghy', ar: 'dinghy', ru: 'dinghy',
      fr: 'inflatable-dinghy', de: 'inflatable-dinghy', es: 'inflatable-dinghy', pt: 'inflatable-dinghy', it: 'inflatable-dinghy', pl: 'inflatable-dinghy'
    },
  },

  {
    id: 'rib',
    type: 'product-category',
    name: {
  "en":"Rigid Inflatable Boat (RIB)",
  "ko":"RIB(경질 고무보트)",
  "ja":"RIB(硬質インフレータブルボート)",
  "zh":"刚性充气艇",
  "fr":"Rigid Inflatable Boat (RIB)",
  "de":"Rigid Inflatable Boat (RIB)",
  "es":"Rigid Inflatable Boat (RIB)",
  "pt":"Rigid Inflatable Boat (RIB)",
  "it":"Rigid Inflatable Boat (RIB)",
  "ru":"Rigid Inflatable Boat (RIB)",
  "pl":"Rigid Inflatable Boat (RIB)",
  "ar":"Rigid Inflatable Boat (RIB)"
},
    description: {"en":"Professional-grade vessel combining a fiberglass deep-V hull with inflatable tubes for all-weather marine operations."},
    features: {
      en: ["Fiberglass deep-V hull", "Hypalon inflatable tubes", "High load capacity", "Planing hull design"],
    },
    useCases: {
      en: ["Search and rescue", "Law enforcement patrol", "Commercial marine operations", "Coastal security"],
    },
    faq: {
      en: [
        { q: "What is the advantage of a RIB over a traditional inflatable boat?", a: "RIBs combine a rigid fiberglass hull for superior handling and performance with inflatable tubes for stability and buoyancy at rest." },
        { q: "Can a RIB be trailered?", a: "Yes. Most RIBs are designed for trailering. The rigid hull allows for easy launching and retrieval from boat ramps." }
      ],
    },
    related: ["deep-v-hull", "hypalon-fabric", "rescue", "professional-operations"],
    slug: {
      en: 'rib',
      zh: 'rib', ja: 'rib', ko: 'rib', ar: 'rib', ru: 'rib',
      fr: 'rigid-inflatable-boat-rib', de: 'rigid-inflatable-boat-rib', es: 'rigid-inflatable-boat-rib', pt: 'rigid-inflatable-boat-rib', it: 'rigid-inflatable-boat-rib', pl: 'rigid-inflatable-boat-rib'
    },
  },

  {
    id: 'safety-equipment',
    type: 'product-category',
    name: {
  "en":"Safety Equipment",
  "ko":"안전 장비",
  "ja":"安全装備",
  "zh":"安全装备",
  "fr":"Safety Equipment",
  "de":"Safety Equipment",
  "es":"Safety Equipment",
  "pt":"Safety Equipment",
  "it":"Safety Equipment",
  "ru":"Safety Equipment",
  "pl":"Safety Equipment",
  "ar":"Safety Equipment"
},
    description: {"en":"CE-certified life vests, throw bags, and safety accessories for recreational and professional water activities."},
    features: {
      en: ["CE certified flotation", "Marine-grade buoyancy foam", "Adjustable fit", "Reflective trim for visibility"],
    },
    useCases: {
      en: ["All water activities", "Beginner water sports", "Professional rescue operations", "Family recreation"],
    },
    faq: {
      en: [
        { q: "What safety equipment is legally required on an inflatable boat?", a: "Requirements vary by jurisdiction, but typically include life vests, throw bag, whistle or horn, and navigation lights for operation after dark." },
        { q: "How often should I replace my life vest?", a: "Foam life vests should be replaced every 5-7 years or immediately if the fabric shows signs of wear, tears, or the foam has become waterlogged." }
      ],
    },
    related: ["buoyancy-foam", "rescue", "beginner"],
    slug: {
      en: 'safety-equipment',
      zh: 'safety-equipment', ja: 'safety-equipment', ko: 'safety-equipment', ar: 'safety-equipment', ru: 'safety-equipment',
      fr: 'safety-equipment', de: 'safety-equipment', es: 'safety-equipment', pt: 'safety-equipment', it: 'safety-equipment', pl: 'safety-equipment'
    },
  },

  {
    id: 'accessory',
    type: 'product-category',
    name: {
  "en":"Accessories",
  "ko":"액세서리",
  "ja":"アクセサリー",
  "zh":"配件",
  "fr":"Accessories",
  "de":"Accessories",
  "es":"Accessories",
  "pt":"Accessories",
  "it":"Accessories",
  "ru":"Accessories",
  "pl":"Accessories",
  "ar":"Accessories"
},
    description: {"en":"Pumps, paddles, fins, repair kits, and carrying bags that complete the inflatable watercraft system."},
    features: {
      en: ["Dual-action hand pumps", "Adjustable aluminum and carbon paddles", "Slide-in and snap-in fin systems", "Repair kits with PVC patches and valve tools"],
    },
    useCases: {
      en: ["SUP board setup and maintenance", "Kayak inflation and transport", "Field repair and emergency fixes"],
    },
    faq: {
      en: [
        { q: "What accessories do I need to get started with an inflatable SUP?", a: "At minimum you need a pump, paddle, leash, and life vest. A repair kit and carrying bag are also highly recommended." },
        { q: "Can I use any pump with any inflatable board?", a: "Most boards and pumps use compatible valve systems. However, high-pressure drop-stitch boards require a pump capable of reaching 15 PSI." }
      ],
    },
    related: ["paddle", "dual-action-pump", "eva-deck"],
    slug: {
      en: 'accessory',
      zh: 'accessory', ja: 'accessory', ko: 'accessory', ar: 'accessory', ru: 'accessory',
      fr: 'accessories', de: 'accessories', es: 'accessories', pt: 'accessories', it: 'accessories', pl: 'accessories'
    },
  },

  {
    id: 'paddle',
    type: 'component',
    name: {
  "en":"Paddle",
  "ko":"패들",
  "ja":"パドル",
  "zh":"桨",
  "fr":"Paddle",
  "de":"Paddle",
  "es":"Paddle",
  "pt":"Paddle",
  "it":"Paddle",
  "ru":"Paddle",
  "pl":"Paddle",
  "ar":"Paddle"
},
    description: {"en":"Manual propulsion tool used with SUP boards and kayaks. Available in adjustable aluminum and lightweight carbon fiber."},
    features: {
      en: ["Adjustable shaft length", "Aluminum or carbon fiber shaft", "Nylon or carbon blade", "Ergonomic handle grip"],
    },
    useCases: {
      en: ["SUP paddling", "Kayak paddling", "Touring and distance paddling"],
    },
    faq: {
      en: [
        { q: "What length paddle do I need?", a: "For SUP, a paddle should be 8-10 inches taller than your height. For kayak, the paddle length depends on boat width and paddling style." },
        { q: "Are adjustable paddles good for beginners?", a: "Yes. Adjustable paddles allow beginners to experiment with different lengths to find their optimal fit before investing in a fixed-length paddle." }
      ],
    },
    related: ["inflatable-sup", "inflatable-kayak", "carbon-fiber"],
    slug: {
      en: 'paddle',
      zh: 'paddle', ja: 'paddle', ko: 'paddle', ar: 'paddle', ru: 'paddle',
      fr: 'paddle', de: 'paddle', es: 'paddle', pt: 'paddle', it: 'paddle', pl: 'paddle'
    },
  },

  {
    id: 'carbon-paddle',
    type: 'component',
    name: {
  "en":"Carbon Fiber Paddle",
  "ko":"카본 패들",
  "ja":"カーボンパドル",
  "zh":"碳纤维桨",
  "fr":"Carbon Fiber Paddle",
  "de":"Carbon Fiber Paddle",
  "es":"Carbon Fiber Paddle",
  "pt":"Carbon Fiber Paddle",
  "it":"Carbon Fiber Paddle",
  "ru":"Carbon Fiber Paddle",
  "pl":"Carbon Fiber Paddle",
  "ar":"Carbon Fiber Paddle"
},
    description: {"en":"Lightweight, high-performance paddle made from carbon fiber composite for reduced fatigue during long sessions."},
    features: {
      en: ["Ultra-lightweight carbon shaft", "Stiff blade for maximum power transfer", "Reduced arm fatigue", "Premium finish"],
    },
    useCases: {
      en: ["Touring and distance paddling", "Racing performance", "Professional use"],
    },
    faq: {
      en: [
        { q: "How much lighter is a carbon paddle than aluminum?", a: "Carbon fiber paddles typically weigh 12-18 oz compared to 25-35 oz for aluminum, reducing fatigue significantly during long paddling sessions." },
        { q: "Is a carbon paddle worth the investment?", a: "For regular paddlers and touring enthusiasts, the weight reduction and improved performance of a carbon paddle justify the higher cost." }
      ],
    },
    related: ["paddle", "touring", "carbon-fiber"],
    slug: {
      en: 'carbon-paddle',
      zh: 'carbon-paddle', ja: 'carbon-paddle', ko: 'carbon-paddle', ar: 'carbon-paddle', ru: 'carbon-paddle',
      fr: 'carbon-fiber-paddle', de: 'carbon-fiber-paddle', es: 'carbon-fiber-paddle', pt: 'carbon-fiber-paddle', it: 'carbon-fiber-paddle', pl: 'carbon-fiber-paddle'
    },
  },

  {
    id: 'drop-stitch-core',
    type: 'technology',
    name: {
  "en":"Drop-Stitch Core",
  "ko":"드롭 스티치 코어",
  "ja":"ドロップステッチコア",
  "zh":"拉丝气垫技术",
  "fr":"Drop-Stitch Core",
  "de":"Drop-Stitch Core",
  "es":"Drop-Stitch Core",
  "pt":"Drop-Stitch Core",
  "it":"Drop-Stitch Core",
  "ru":"Drop-Stitch Core",
  "pl":"Drop-Stitch Core",
  "ar":"Drop-Stitch Core"
},
    description: {"en":"Connects thousands of polyester threads between top and bottom layers to achieve rigid platform shape under high inflation pressure."},
    features: {
      en: ["Thousands of polyester threads", "Fused or woven construction", "Withstands 12-15 PSI pressure", "Creates rigid flat platform"],
    },
    useCases: {
      en: ["Stand-up paddle boarding", "Touring and distance paddling", "SUP yoga and fitness", "Fishing platforms"],
    },
    faq: {
      en: [
        { q: "How does drop-stitch construction work?", a: "Thousands of polyester threads connect the top and bottom layers, allowing high-pressure inflation that creates a rigid, stable platform." },
        { q: "What PSI should I use for drop-stitch boards?", a: "Most drop-stitch inflatable boards perform best at 12-15 PSI for optimal rigidity." }
      ],
    },
    related: ["inflatable-sup", "inflatable-kayak", "military-grade-pvc", "high-pressure"],
    slug: {
      en: 'drop-stitch-core',
      zh: 'drop-stitch-core', ja: 'drop-stitch-core', ko: 'drop-stitch-core', ar: 'drop-stitch-core', ru: 'drop-stitch-core',
      fr: 'drop-stitch-core', de: 'drop-stitch-core', es: 'drop-stitch-core', pt: 'drop-stitch-core', it: 'drop-stitch-core', pl: 'drop-stitch-core'
    },
  },

  {
    id: 'air-deck',
    type: 'technology',
    name: {
  "en":"Air Deck",
  "ko":"에어 데크",
  "ja":"エアデッキ",
  "zh":"气垫地板",
  "fr":"Air Deck",
  "de":"Air Deck",
  "es":"Air Deck",
  "pt":"Air Deck",
  "it":"Air Deck",
  "ru":"Air Deck",
  "pl":"Air Deck",
  "ar":"Air Deck"
},
    description: {"en":"Inflatable flooring system that replaces traditional slatted floors in dinghies and small inflatable boats."},
    features: {
      en: ["High-pressure air chambers", "Reinforced fabric construction", "Flat surface when inflated", "Full deflation for compact storage"],
    },
    useCases: {
      en: ["Dinghy floor system", "Family recreation boating", "Fishing from inflatable craft", "Tender operations"],
    },
    faq: {
      en: [
        { q: "How does an air deck compare to a slatted floor?", a: "Air decks provide better comfort and cushioning than slatted floors, while still offering a rigid platform when fully inflated." },
        { q: "Can an air deck be repaired if punctured?", a: "Yes. Air decks use the same PVC material as the hull and can be patched with standard inflatable repair kits." }
      ],
    },
    related: ["dinghy", "military-grade-pvc", "high-pressure"],
    slug: {
      en: 'air-deck',
      zh: 'air-deck', ja: 'air-deck', ko: 'air-deck', ar: 'air-deck', ru: 'air-deck',
      fr: 'air-deck', de: 'air-deck', es: 'air-deck', pt: 'air-deck', it: 'air-deck', pl: 'air-deck'
    },
  },

  {
    id: 'dual-action-pump',
    type: 'component',
    name: {
  "en":"Dual-Action Pump",
  "ko":"듀얼 액션 펌프",
  "ja":"デュアルアクションポンプ",
  "zh":"双向气泵",
  "fr":"Dual-Action Pump",
  "de":"Dual-Action Pump",
  "es":"Dual-Action Pump",
  "pt":"Dual-Action Pump",
  "it":"Dual-Action Pump",
  "ru":"Dual-Action Pump",
  "pl":"Dual-Action Pump",
  "ar":"Dual-Action Pump"
},
    description: {"en":"Hand pump that inflates on both up and down strokes for faster, more efficient inflation of inflatable watercraft."},
    features: {
      en: ["Pumps on both up and down strokes", "Pressure gauge included", "Hose and valve adapters", "Ergonomic handle"],
    },
    useCases: {
      en: ["SUP board inflation", "Kayak inflation", "Dinghy inflation"],
    },
    faq: {
      en: [
        { q: "How long does it take to inflate a SUP board with a dual-action pump?", a: "Most dual-action pumps can inflate a standard SUP board from flat to 15 PSI in 3-5 minutes, roughly half the time of a single-action pump." },
        { q: "Do I need a pump with a pressure gauge?", a: "Yes. A pressure gauge is essential for achieving the optimal 12-15 PSI range without over-inflating or under-inflating your board." }
      ],
    },
    related: ["inflatable-sup", "inflatable-kayak", "high-pressure"],
    slug: {
      en: 'dual-action-pump',
      zh: 'dual-action-pump', ja: 'dual-action-pump', ko: 'dual-action-pump', ar: 'dual-action-pump', ru: 'dual-action-pump',
      fr: 'dual-action-pump', de: 'dual-action-pump', es: 'dual-action-pump', pt: 'dual-action-pump', it: 'dual-action-pump', pl: 'dual-action-pump'
    },
  },

  {
    id: 'high-pressure',
    type: 'concept',
    name: {
  "en":"High Pressure (12-15 PSI)",
  "ko":"고압(12-15 PSI)",
  "ja":"高圧(12-15 PSI)",
  "zh":"高压（12-15 PSI）",
  "fr":"High Pressure (12-15 PSI)",
  "de":"High Pressure (12-15 PSI)",
  "es":"High Pressure (12-15 PSI)",
  "pt":"High Pressure (12-15 PSI)",
  "it":"High Pressure (12-15 PSI)",
  "ru":"High Pressure (12-15 PSI)",
  "pl":"High Pressure (12-15 PSI)",
  "ar":"High Pressure (12-15 PSI)"
},
    description: {"en":"Optimal inflation range that maximizes board rigidity while remaining within safe operating limits for drop-stitch construction."},
    features: {
      en: ["Optimal 12-15 PSI range", "Maximizes board rigidity", "Drop-stitch compatible", "Requires compatible pump"],
    },
    useCases: {
      en: ["SUP board inflation", "Drop-stitch core performance", "Rigid platform for stand-up paddling"],
    },
    faq: {
      en: [
        { q: "Why is 12-15 PSI the ideal range?", a: "Below 12 PSI the board flexes excessively; above 15 PSI risks damaging the drop-stitch threads. 12-15 PSI provides the best balance of rigidity and safety." },
        { q: "Can I use any pump for high-pressure inflation?", a: "A dual-action pump with a pressure gauge is recommended. Most standard SUP pumps are rated for up to 15 PSI." }
      ],
    },
    related: ["drop-stitch-core", "dual-action-pump", "inflatable-sup"],
    slug: {
      en: 'high-pressure',
      zh: 'high-pressure', ja: 'high-pressure', ko: 'high-pressure', ar: 'high-pressure', ru: 'high-pressure',
      fr: 'high-pressure-12-15-psi', de: 'high-pressure-12-15-psi', es: 'high-pressure-12-15-psi', pt: 'high-pressure-12-15-psi', it: 'high-pressure-12-15-psi', pl: 'high-pressure-12-15-psi'
    },
  },

  {
    id: 'military-grade-pvc',
    type: 'material',
    name: {
  "en":"Military-Grade PVC",
  "ko":"군용 등급 PVC",
  "ja":"ミリタリーグレードPVC",
  "zh":"军用级PVC",
  "fr":"Military-Grade PVC",
  "de":"Military-Grade PVC",
  "es":"Military-Grade PVC",
  "pt":"Military-Grade PVC",
  "it":"Military-Grade PVC",
  "ru":"Military-Grade PVC",
  "pl":"Military-Grade PVC",
  "ar":"Military-Grade PVC"
},
    description: {"en":"High-density PVC fabric with UV-resistant coating used for durable inflatable boat and board construction."},
    features: {
      en: ["High-density PVC fabric", "UV resistant coating", "Abrasion resistant surface", "Marine-grade certification"],
    },
    useCases: {
      en: ["Inflatable SUP board construction", "Inflatable kayak manufacturing", "Dinghy and RIB tube material", "Heavy-duty marine applications"],
    },
    faq: {
      en: [
        { q: "How durable is military-grade PVC?", a: "Military-grade PVC is highly resistant to punctures, abrasion, and UV damage, making it suitable for prolonged marine use." },
        { q: "How does military-grade PVC compare to standard PVC?", a: "Military-grade PVC uses higher-density fabric and additional UV stabilizers, offering 2-3x better durability than standard PVC." }
      ],
    },
    related: ["drop-stitch-core", "hypalon-fabric", "inflatable-sup", "dinghy"],
    slug: {
      en: 'military-grade-pvc',
      zh: 'military-grade-pvc', ja: 'military-grade-pvc', ko: 'military-grade-pvc', ar: 'military-grade-pvc', ru: 'military-grade-pvc',
      fr: 'military-grade-pvc', de: 'military-grade-pvc', es: 'military-grade-pvc', pt: 'military-grade-pvc', it: 'military-grade-pvc', pl: 'military-grade-pvc'
    },
  },

  {
    id: 'hypalon-fabric',
    type: 'material',
    name: {
  "en":"Hypalon Fabric",
  "ko":"하이팔론 원단",
  "ja":"ハイパロン素材",
  "zh":"海帕伦面料",
  "fr":"Hypalon Fabric",
  "de":"Hypalon Fabric",
  "es":"Hypalon Fabric",
  "pt":"Hypalon Fabric",
  "it":"Hypalon Fabric",
  "ru":"Hypalon Fabric",
  "pl":"Hypalon Fabric",
  "ar":"Hypalon Fabric"
},
    description: {"en":"Chlorosulfonated polyethylene synthetic rubber fabric offering superior UV, ozone, and chemical resistance for professional-grade inflatable boats."},
    features: {
      en: ["Chlorosulfonated polyethylene", "Superior UV resistance", "Chemical and ozone resistant", "Professional marine grade"],
    },
    useCases: {
      en: ["Professional RIB construction", "Commercial marine vessels", "Search and rescue equipment", "Military inflatable craft"],
    },
    faq: {
      en: [
        { q: "What makes Hypalon better than PVC?", a: "Hypalon offers superior UV resistance, ozone resistance, and longevity compared to PVC, making it the preferred choice for professional-grade RIBs." },
        { q: "How long does Hypalon last?", a: "With proper care, Hypalon fabric can last 15-20 years, significantly longer than PVC which typically lasts 8-12 years." }
      ],
    },
    related: ["rib", "military-grade-pvc", "professional-operations"],
    slug: {
      en: 'hypalon-fabric',
      zh: 'hypalon-fabric', ja: 'hypalon-fabric', ko: 'hypalon-fabric', ar: 'hypalon-fabric', ru: 'hypalon-fabric',
      fr: 'hypalon-fabric', de: 'hypalon-fabric', es: 'hypalon-fabric', pt: 'hypalon-fabric', it: 'hypalon-fabric', pl: 'hypalon-fabric'
    },
  },

  {
    id: 'eva-deck',
    type: 'material',
    name: {
  "en":"EVA Foam Deck Pad",
  "ko":"EVA 폼 데크 패드",
  "ja":"EVAフォームデッキパッド",
  "zh":"EVA甲板垫",
  "fr":"EVA Foam Deck Pad",
  "de":"EVA Foam Deck Pad",
  "es":"EVA Foam Deck Pad",
  "pt":"EVA Foam Deck Pad",
  "it":"EVA Foam Deck Pad",
  "ru":"EVA Foam Deck Pad",
  "pl":"EVA Foam Deck Pad",
  "ar":"EVA Foam Deck Pad"
},
    description: {"en":"Non-slip, shock-absorbing foam deck covering that provides traction and comfort for stand-up watercraft."},
    features: {
      en: ["Non-slip textured surface", "Shock absorbing foam", "UV stable", "Full-length deck coverage"],
    },
    useCases: {
      en: ["SUP board traction pad", "Dinghy floor covering", "Kayak cockpit padding", "Dock and swim platform surface"],
    },
    faq: {
      en: [
        { q: "Is EVA foam deck pad slippery when wet?", a: "No. EVA foam is designed to provide excellent traction even when wet, with a textured surface that grips bare feet and booties." },
        { q: "How do I clean EVA foam deck pads?", a: "Mild soap and water with a soft brush is sufficient. Avoid harsh chemicals that can degrade the foam over time." }
      ],
    },
    related: ["inflatable-sup", "dinghy", "accessory"],
    slug: {
      en: 'eva-deck',
      zh: 'eva-deck', ja: 'eva-deck', ko: 'eva-deck', ar: 'eva-deck', ru: 'eva-deck',
      fr: 'eva-foam-deck-pad', de: 'eva-foam-deck-pad', es: 'eva-foam-deck-pad', pt: 'eva-foam-deck-pad', it: 'eva-foam-deck-pad', pl: 'eva-foam-deck-pad'
    },
  },

  {
    id: 'carbon-fiber',
    type: 'material',
    name: {
  "en":"Carbon Fiber",
  "ko":"카본 파이버",
  "ja":"カーボンファイバー",
  "zh":"碳纤维",
  "fr":"Carbon Fiber",
  "de":"Carbon Fiber",
  "es":"Carbon Fiber",
  "pt":"Carbon Fiber",
  "it":"Carbon Fiber",
  "ru":"Carbon Fiber",
  "pl":"Carbon Fiber",
  "ar":"Carbon Fiber"
},
    description: {"en":"Lightweight, high-strength composite material used in paddles, hulls, and performance marine equipment."},
    features: {
      en: ["High strength-to-weight ratio", "Stiff and responsive", "Fatigue resistant", "Premium appearance"],
    },
    useCases: {
      en: ["Paddle shaft construction", "RIB hull reinforcement", "High-performance equipment", "Lightweight structural components"],
    },
    faq: {
      en: [
        { q: "Is carbon fiber worth the extra cost?", a: "For serious paddlers, carbon fiber paddles reduce fatigue significantly during long sessions. The weight savings of 30-40% over aluminum justify the premium." },
        { q: "Is carbon fiber durable?", a: "Carbon fiber composites are extremely strong for their weight, but can be brittle under sharp impact. Proper care and storage will ensure longevity." }
      ],
    },
    related: ["paddle", "carbon-paddle", "rib"],
    slug: {
      en: 'carbon-fiber',
      zh: 'carbon-fiber', ja: 'carbon-fiber', ko: 'carbon-fiber', ar: 'carbon-fiber', ru: 'carbon-fiber',
      fr: 'carbon-fiber', de: 'carbon-fiber', es: 'carbon-fiber', pt: 'carbon-fiber', it: 'carbon-fiber', pl: 'carbon-fiber'
    },
  },

  {
    id: 'buoyancy-foam',
    type: 'material',
    name: {
  "en":"Marine Buoyancy Foam",
  "ko":"해양용 부력 폼",
  "ja":"海洋浮力フォーム",
  "zh":"船用浮力泡沫",
  "fr":"Marine Buoyancy Foam",
  "de":"Marine Buoyancy Foam",
  "es":"Marine Buoyancy Foam",
  "pt":"Marine Buoyancy Foam",
  "it":"Marine Buoyancy Foam",
  "ru":"Marine Buoyancy Foam",
  "pl":"Marine Buoyancy Foam",
  "ar":"Marine Buoyancy Foam"
},
    description: {"en":"Closed-cell foam that provides permanent flotation for life vests and safety equipment in fresh and salt water."},
    features: {
      en: ["Closed-cell construction", "Fresh and salt water rated", "Lightweight and durable", "CE certified"],
    },
    useCases: {
      en: ["Life vest flotation", "Safety equipment buoyancy", "Marine cushioning", "Emergency flotation devices"],
    },
    faq: {
      en: [
        { q: "What is the difference between closed-cell and open-cell foam?", a: "Closed-cell foam does not absorb water, making it ideal for flotation devices. Open-cell foam absorbs water and is used for cushioning." },
        { q: "How much buoyancy does marine-grade foam provide?", a: "Marine-grade closed-cell foam provides approximately 60 kg of buoyancy per cubic meter, sufficient to keep an adult afloat in any water conditions." }
      ],
    },
    related: ["safety-equipment"],
    slug: {
      en: 'buoyancy-foam',
      zh: 'buoyancy-foam', ja: 'buoyancy-foam', ko: 'buoyancy-foam', ar: 'buoyancy-foam', ru: 'buoyancy-foam',
      fr: 'marine-buoyancy-foam', de: 'marine-buoyancy-foam', es: 'marine-buoyancy-foam', pt: 'marine-buoyancy-foam', it: 'marine-buoyancy-foam', pl: 'marine-buoyancy-foam'
    },
  },

  {
    id: 'deep-v-hull',
    type: 'component',
    name: {
  "en":"Deep-V Hull",
  "ko":"딥 V 선체",
  "ja":"ディープVハル",
  "zh":"深V型船体",
  "fr":"Deep-V Hull",
  "de":"Deep-V Hull",
  "es":"Deep-V Hull",
  "pt":"Deep-V Hull",
  "it":"Deep-V Hull",
  "ru":"Deep-V Hull",
  "pl":"Deep-V Hull",
  "ar":"Deep-V Hull"
},
    description: {"en":"Fiberglass hull design with a sharp V-shaped entry that cuts through waves for smooth high-speed performance."},
    features: {
      en: ["Fiberglass construction", "Deep-V entry angle", "Planing hull design", "Wave-cutting bow shape"],
    },
    useCases: {
      en: ["High-speed RIB operations", "Open water traversing", "Rough weather marine operations", "Coastal patrol and rescue"],
    },
    faq: {
      en: [
        { q: "How does a deep-V hull improve ride quality?", a: "The deep-V shape cuts through waves rather than slapping against them, providing a smoother ride at high speeds in choppy conditions." },
        { q: "Is a deep-V hull less stable than a flat hull?", a: "Deep-V hulls have more initial roll tendency at rest but superior directional stability at speed. Modern designs balance both characteristics." }
      ],
    },
    related: ["rib", "outboard-motor", "professional-operations"],
    slug: {
      en: 'deep-v-hull',
      zh: 'deep-v-hull', ja: 'deep-v-hull', ko: 'deep-v-hull', ar: 'deep-v-hull', ru: 'deep-v-hull',
      fr: 'deep-v-hull', de: 'deep-v-hull', es: 'deep-v-hull', pt: 'deep-v-hull', it: 'deep-v-hull', pl: 'deep-v-hull'
    },
  },

  {
    id: 'outboard-motor',
    type: 'component',
    name: {
  "en":"Outboard Motor",
  "ko":"선외 모터",
  "ja":"船外機",
  "zh":"舷外发动机",
  "fr":"Outboard Motor",
  "de":"Outboard Motor",
  "es":"Outboard Motor",
  "pt":"Outboard Motor",
  "it":"Outboard Motor",
  "ru":"Outboard Motor",
  "pl":"Outboard Motor",
  "ar":"Outboard Motor"
},
    description: {"en":"Detachable marine engine mounted on the transom of dinghies and RIBs for propulsion."},
    features: {
      en: ["Detachable mounting system", "Transom bracket compatible", "Various horsepower options", "Tiller or remote steering"],
    },
    useCases: {
      en: ["Dinghy powered propulsion", "RIB primary power", "Tender operations", "Fishing boat motor"],
    },
    faq: {
      en: [
        { q: "What size outboard motor do I need for a dinghy?", a: "For most inflatable dinghies, 3-15 HP is sufficient. A 3-5 HP motor provides 5-8 knots for tender duties, while 10-15 HP offers planing capability." },
        { q: "Can I use an electric outboard on an inflatable boat?", a: "Yes. Electric outboards are increasingly popular for inflatables, offering quiet, emission-free operation ideal for fishing and leisure." }
      ],
    },
    related: ["dinghy", "rib", "fishing", "deep-v-hull"],
    slug: {
      en: 'outboard-motor',
      zh: 'outboard-motor', ja: 'outboard-motor', ko: 'outboard-motor', ar: 'outboard-motor', ru: 'outboard-motor',
      fr: 'outboard-motor', de: 'outboard-motor', es: 'outboard-motor', pt: 'outboard-motor', it: 'outboard-motor', pl: 'outboard-motor'
    },
  },

  {
    id: 'touring',
    type: 'use-case',
    name: {
  "en":"Touring & Distance Paddling",
  "ko":"투어링 및 장거리 패들링",
  "ja":"ツーリング＆長距離パドリング",
  "zh":"旅行与长途划桨",
  "fr":"Touring & Distance Paddling",
  "de":"Touring & Distance Paddling",
  "es":"Touring & Distance Paddling",
  "pt":"Touring & Distance Paddling",
  "it":"Touring & Distance Paddling",
  "ru":"Touring & Distance Paddling",
  "pl":"Touring & Distance Paddling",
  "ar":"Touring & Distance Paddling"
},
    description: {"en":"Extended paddling trips covering significant distance on lakes, rivers, and coastal waters."},
    features: {
      en: ["Long-distance board design", "Efficient hull shape", "Lightweight paddle", "Storage for gear"],
    },
    useCases: {
      en: ["Multi-day lake expeditions", "Coastal exploration", "River journeys", "Fitness training"],
    },
    faq: {
      en: [
        { q: "What board is best for touring?", a: "Longer, narrower boards with efficient hull shapes are ideal for touring. Inflatable SUPs with drop-stitch construction provide the rigidity needed for efficient long-distance paddling." },
        { q: "How far can you paddle in a day?", a: "With proper fitness and conditions, experienced paddlers can cover 15-25 miles (24-40 km) in a day of touring." }
      ],
    },
    related: ["inflatable-sup", "paddle", "carbon-paddle", "drop-stitch-core"],
    slug: {
      en: 'touring',
      zh: 'touring', ja: 'touring', ko: 'touring', ar: 'touring', ru: 'touring',
      fr: 'touring-distance-paddling', de: 'touring-distance-paddling', es: 'touring-distance-paddling', pt: 'touring-distance-paddling', it: 'touring-distance-paddling', pl: 'touring-distance-paddling'
    },
  },

  {
    id: 'beginner',
    type: 'use-case',
    name: {
  "en":"Beginner",
  "ko":"초보자",
  "ja":"初心者",
  "zh":"初学者",
  "fr":"Beginner",
  "de":"Beginner",
  "es":"Beginner",
  "pt":"Beginner",
  "it":"Beginner",
  "ru":"Beginner",
  "pl":"Beginner",
  "ar":"Beginner"
},
    description: {"en":"First-time paddlers learning the basics of inflatable watercraft operation, safety, and water navigation."},
    features: {
      en: ["Stable platform", "Easy inflate and setup", "Forgiving handling", "All-in-one kit available"],
    },
    useCases: {
      en: ["First time paddling", "Learning basic strokes", "Understanding water safety", "Building confidence on water"],
    },
    faq: {
      en: [
        { q: "Is an inflatable SUP good for beginners?", a: "Yes. Inflatable SUPs are stable, forgiving, and easier to transport and store than hard boards, making them excellent for beginners." },
        { q: "How long does it take to learn stand-up paddleboarding?", a: "Most beginners can stand up and paddle on flat water within their first session. Balance improves quickly with practice." }
      ],
    },
    related: ["inflatable-sup", "inflatable-kayak", "fishing", "family-recreation"],
    slug: {
      en: 'beginner',
      zh: 'beginner', ja: 'beginner', ko: 'beginner', ar: 'beginner', ru: 'beginner',
      fr: 'beginner', de: 'beginner', es: 'beginner', pt: 'beginner', it: 'beginner', pl: 'beginner'
    },
  },

  {
    id: 'fishing',
    type: 'use-case',
    name: {
  "en":"Fishing from Inflatable Craft",
  "ko":"낚시용 인플레이터블",
  "ja":"釣り用インフレータブル",
  "zh":"充气艇钓鱼",
  "fr":"Fishing from Inflatable Craft",
  "de":"Fishing from Inflatable Craft",
  "es":"Fishing from Inflatable Craft",
  "pt":"Fishing from Inflatable Craft",
  "it":"Fishing from Inflatable Craft",
  "ru":"Fishing from Inflatable Craft",
  "pl":"Fishing from Inflatable Craft",
  "ar":"Fishing from Inflatable Craft"
},
    description: {"en":"Using inflatable boats, kayaks, or SUPs as a stable, portable platform for recreational and serious fishing."},
    features: {
      en: ["Stable fishing platform", "Quiet approach", "Shallow water access", "Hands-free trolling"],
    },
    useCases: {
      en: ["Lake fishing", "Coastal fishing", "River fishing", "Fly fishing from SUP"],
    },
    faq: {
      en: [
        { q: "Can you fish from an inflatable SUP?", a: "Yes. Many anglers fish from inflatable SUPs, using the stable deck as a casting platform in shallow waters where motor boats cannot go." },
        { q: "What inflatable boat is best for fishing?", a: "A stable inflatable dinghy or wide SUP board works well. Features like rod holders, anchor points, and multiple air chambers enhance safety." }
      ],
    },
    related: ["inflatable-sup", "inflatable-kayak", "dinghy", "outboard-motor"],
    slug: {
      en: 'fishing',
      zh: 'fishing', ja: 'fishing', ko: 'fishing', ar: 'fishing', ru: 'fishing',
      fr: 'fishing-from-inflatable-craft', de: 'fishing-from-inflatable-craft', es: 'fishing-from-inflatable-craft', pt: 'fishing-from-inflatable-craft', it: 'fishing-from-inflatable-craft', pl: 'fishing-from-inflatable-craft'
    },
  },

  {
    id: 'family-recreation',
    type: 'use-case',
    name: {
  "en":"Family Recreation",
  "ko":"가족 레크리에이션",
  "ja":"ファミリーレクリエーション",
  "zh":"家庭休闲",
  "fr":"Family Recreation",
  "de":"Family Recreation",
  "es":"Family Recreation",
  "pt":"Family Recreation",
  "it":"Family Recreation",
  "ru":"Family Recreation",
  "pl":"Family Recreation",
  "ar":"Family Recreation"
},
    description: {"en":"Inflatable watercraft used for casual family outings on lakes, gentle rivers, and protected coastal waters."},
    features: {
      en: ["Large weight capacity", "Stable multi-person design", "Easy transport", "Multiple air chambers for safety"],
    },
    useCases: {
      en: ["Lake outings", "Beach days", "Gentle river floats", "Picnic trips by water"],
    },
    faq: {
      en: [
        { q: "Which inflatable boat is best for a family?", a: "A stable inflatable dinghy or kayak is ideal for family recreation. Look for models with multiple air chambers for safety and enough capacity for everyone." },
        { q: "Is an inflatable boat safe for children?", a: "Yes, with proper supervision and life vests. Inflatable boats are inherently stable and soft-sided, making them safer than hard-hulled boats for families." }
      ],
    },
    related: ["dinghy", "inflatable-kayak", "beginner", "fishing"],
    slug: {
      en: 'family-recreation',
      zh: 'family-recreation', ja: 'family-recreation', ko: 'family-recreation', ar: 'family-recreation', ru: 'family-recreation',
      fr: 'family-recreation', de: 'family-recreation', es: 'family-recreation', pt: 'family-recreation', it: 'family-recreation', pl: 'family-recreation'
    },
  },

  {
    id: 'professional-operations',
    type: 'use-case',
    name: {
  "en":"Professional Operations",
  "ko":"전문 작업",
  "ja":"プロフェッショナル運用",
  "zh":"专业作业",
  "fr":"Professional Operations",
  "de":"Professional Operations",
  "es":"Professional Operations",
  "pt":"Professional Operations",
  "it":"Professional Operations",
  "ru":"Professional Operations",
  "pl":"Professional Operations",
  "ar":"Professional Operations"
},
    description: {"en":"Inflatable and rigid inflatable boats used for search and rescue, law enforcement, and commercial marine operations."},
    features: {
      en: ["All-weather capability", "High load capacity", "Rapid deployment", "Consistent multi-unit performance"],
    },
    useCases: {
      en: ["Search and rescue", "Law enforcement patrol", "Coastal security", "Marine survey and research"],
    },
    faq: {
      en: [
        { q: "What makes a RIB suitable for professional use?", a: "RIBs offer all-weather capability, high load capacity, consistent multi-unit performance, and rapid deployment - essential features for professional marine operations." },
        { q: "Can inflatable boats be used for law enforcement?", a: "Yes. Many law enforcement agencies use RIBs and rigid inflatables for patrol, search and rescue, and interception operations due to their speed and versatility." }
      ],
    },
    related: ["rib", "rescue", "deep-v-hull", "hypalon-fabric"],
    slug: {
      en: 'professional-operations',
      zh: 'professional-operations', ja: 'professional-operations', ko: 'professional-operations', ar: 'professional-operations', ru: 'professional-operations',
      fr: 'professional-operations', de: 'professional-operations', es: 'professional-operations', pt: 'professional-operations', it: 'professional-operations', pl: 'professional-operations'
    },
  },

  {
    id: 'river-touring',
    type: 'use-case',
    name: {
  "en":"River Touring",
  "ko":"강 투어링",
  "ja":"リバーツーリング",
  "zh":"河流旅行",
  "fr":"River Touring",
  "de":"River Touring",
  "es":"River Touring",
  "pt":"River Touring",
  "it":"River Touring",
  "ru":"River Touring",
  "pl":"River Touring",
  "ar":"River Touring"
},
    description: {"en":"Navigating rivers with current, from gentle Class I stretches to more challenging Class II rapids."},
    features: {
      en: ["Maneuverable hull", "Impact resistant", "Quick drainage", "Whitewater capable"],
    },
    useCases: {
      en: ["Class I-II river running", "Scenic river floats", "Multi-day river trips", "Whitewater play"],
    },
    faq: {
      en: [
        { q: "What type of kayak is best for river touring?", a: "Inflatable kayaks are excellent for river touring as they are durable, maneuverable, and can handle impacts with rocks better than hard-shell kayaks." },
        { q: "What rapids can an inflatable kayak handle?", a: "Quality inflatable kayaks are rated for class I-II rapids, with some models capable of class III in experienced hands." }
      ],
    },
    related: ["inflatable-kayak", "paddle", "touring", "beginner"],
    slug: {
      en: 'river-touring',
      zh: 'river-touring', ja: 'river-touring', ko: 'river-touring', ar: 'river-touring', ru: 'river-touring',
      fr: 'river-touring', de: 'river-touring', es: 'river-touring', pt: 'river-touring', it: 'river-touring', pl: 'river-touring'
    },
  },

  {
    id: 'rescue',
    type: 'use-case',
    name: {
  "en":"Search & Rescue",
  "ko":"수색 및 구조",
  "ja":"捜索救助",
  "zh":"搜索与救援",
  "fr":"Search & Rescue",
  "de":"Search & Rescue",
  "es":"Search & Rescue",
  "pt":"Search & Rescue",
  "it":"Search & Rescue",
  "ru":"Search & Rescue",
  "pl":"Search & Rescue",
  "ar":"Search & Rescue"
},
    description: {"en":"Professional use of inflatable and RIB craft for emergency water rescue operations in all weather conditions."},
    features: {
      en: ["Rapid deployment", "High stability at rest", "Excellent load capacity", "All-weather construction"],
    },
    useCases: {
      en: ["Swiftwater rescue", "Flood response", "Maritime SAR", "Ice rescue support"],
    },
    faq: {
      en: [
        { q: "Why are inflatable boats used for search and rescue?", a: "Inflatable boats offer rapid deployment, high stability at rest for retrieval operations, and excellent load-carrying capacity for equipment and personnel." },
        { q: "What type of boat is best for water rescue?", a: "RIBs are the preferred choice for professional water rescue due to their combination of speed, stability, and all-weather capability." }
      ],
    },
    related: ["rib", "professional-operations", "safety-equipment", "deep-v-hull"],
    slug: {
      en: 'rescue',
      zh: 'rescue', ja: 'rescue', ko: 'rescue', ar: 'rescue', ru: 'rescue',
      fr: 'search-rescue', de: 'search-rescue', es: 'search-rescue', pt: 'search-rescue', it: 'search-rescue', pl: 'search-rescue'
    },
  },
];