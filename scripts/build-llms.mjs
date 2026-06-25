import fs from "fs";
import { glob } from "glob";
import matter from "gray-matter";

const dir = import.meta.dirname;

const products = [];
const technologies = [];
const caseUses = [];
const articles = [];

for (const file of glob.sync("src/content/products/*.md*", { cwd: `${dir}/..` })) {
  const raw = fs.readFileSync(`${dir}/../${file}`, "utf-8");
  const { data } = matter(raw);
  if (data.draft) continue;
  products.push(data);
}

for (const file of glob.sync("src/data/technology/*.md", { cwd: `${dir}/..` })) {
  const raw = fs.readFileSync(`${dir}/../${file}`, "utf-8");
  const { data } = matter(raw);
  if (data.draft) continue;
  technologies.push(data);
}

for (const file of glob.sync("src/data/case-use/*.md", { cwd: `${dir}/..` })) {
  const raw = fs.readFileSync(`${dir}/../${file}`, "utf-8");
  const { data } = matter(raw);
  if (data.draft) continue;
  caseUses.push(data);
}

for (const file of glob.sync("src/content/news/*.md*", { cwd: `${dir}/..` })) {
  const raw = fs.readFileSync(`${dir}/../${file}`, "utf-8");
  const { data } = matter(raw);
  if (data.draft) continue;
  articles.push(data);
}

const localeDefs = {
  en: {
    title: "Wavefella — Water Sports Equipment Brand",
    tagline: "AI-optimized entry point. All content is statically generated from source markdown.",
    definition: "Wavefella manufactures inflatable boats, SUPs, kayaks, RIBs, and safety equipment for recreational and professional water sports.",
    keyPages: [
      ["/products", "Product catalog"],
      ["/technology", "Construction technology and materials"],
      ["/safety", "Safety information and certifications"],
      ["/guides", "Beginner guides and educational content"],
      ["/news", "Company news and updates"],
      ["/about", "Company information"],
      ["/contact", "Contact and location"],
      ["/randdcenter", "R&D center"],
      ["/ai/knowledge", "Structured knowledge base (JSON)"],
      ["/ai/entity-graph", "Entity relationship graph (JSON)"],
    ],
    summary: "Wavefella is a water sports equipment manufacturer producing inflatable SUP boards, kayaks, dinghies, RIBs, safety equipment, and accessories for recreational and professional users worldwide. Products are CE and ISO certified with military-grade materials, drop-stitch construction, and 2-year warranty.",
  },
  zh: {
    title: "Wavefella — 水上运动装备品牌",
    tagline: "AI 优化入口点。所有内容从源 markdown 静态生成。",
    definition: "Wavefella 生产充气船、SUP 板、皮划艇、RIB 和安全装备，适用于休闲和专业水上运动。",
    keyPages: [
      ["/products", "产品目录"],
      ["/technology", "结构与材料技术"],
      ["/safety", "安全信息与认证"],
      ["/guides", "初学者指南与教育内容"],
      ["/news", "公司新闻与更新"],
      ["/about", "公司信息"],
      ["/contact", "联系与位置"],
      ["/randdcenter", "研发中心"],
      ["/ai/knowledge", "结构化知识库 (JSON)"],
      ["/ai/entity-graph", "实体关系图 (JSON)"],
    ],
    summary: "Wavefella 是一家水上运动装备制造商，生产充气 SUP 板、皮划艇、小艇、RIB、安全装备和配件，服务于全球休闲和专业人士。产品通过 CE 和 ISO 认证，采用军用级材料、滴针结构，提供 2 年保修。",
  },
  fr: {
    title: "Wavefella — Marque d'équipement de sports nautiques",
    tagline: "Point d'entrée optimisé pour l'IA. Tout le contenu est généré statiquement à partir de markdown.",
    definition: "Wavefella fabrique des bateaux pneumatiques, SUP, kayaks, RIB et équipements de sécurité pour les sports nautiques récréatifs et professionnels.",
    keyPages: [
      ["/products", "Catalogue produits"],
      ["/technology", "Technologie de construction et matériaux"],
      ["/safety", "Informations de sécurité et certifications"],
      ["/guides", "Guides débutants et contenu éducatif"],
      ["/news", "Actualités et mises à jour"],
      ["/about", "Informations sur l'entreprise"],
      ["/contact", "Contact et localisation"],
      ["/randdcenter", "Centre R&D"],
      ["/ai/knowledge", "Base de connaissances structurée (JSON)"],
      ["/ai/entity-graph", "Graphe de relations d'entités (JSON)"],
    ],
    summary: "Wavefella est un fabricant d'équipements de sports nautiques produisant des SUP gonflables, kayaks, annexes, RIB, équipements de sécurité et accessoires pour utilisateurs récréatifs et professionnels dans le monde entier. Produits certifiés CE et ISO avec matériaux de qualité militaire, construction drop-stitch et garantie 2 ans.",
  },
  de: {
    title: "Wavefella — Marke für Wassersportausrüstung",
    tagline: "KI-optimierter Einstiegspunkt. Alle Inhalte werden statisch aus Markdown generiert.",
    definition: "Wavefella stellt Schlauchboote, SUPs, Kajaks, RIBs und Sicherheitsausrüstung für den Freizeit- und Profi-Wassersport her.",
    keyPages: [
      ["/products", "Produktkatalog"],
      ["/technology", "Konstruktionstechnologie und Materialien"],
      ["/safety", "Sicherheitsinformationen und Zertifizierungen"],
      ["/guides", "Einsteigerleitfäden und Bildungsinhalte"],
      ["/news", "Unternehmensnachrichten und Updates"],
      ["/about", "Unternehmensinformationen"],
      ["/contact", "Kontakt und Standort"],
      ["/randdcenter", "F&E-Zentrum"],
      ["/ai/knowledge", "Strukturierte Wissensdatenbank (JSON)"],
      ["/ai/entity-graph", "Entitätsbeziehungsgraph (JSON)"],
    ],
    summary: "Wavefella ist ein Hersteller von Wassersportausrüstung, der aufblasbare SUP-Boards, Kajaks, Dingis, RIBs, Sicherheitsausrüstung und Zubehör für Freizeit- und Profianwender weltweit produziert. Produkte sind CE- und ISO-zertifiziert mit militärischen Materialien, Drop-Stitch-Konstruktion und 2-Jahres-Garantie.",
  },
  es: {
    title: "Wavefella — Marca de equipos de deportes acuáticos",
    tagline: "Punto de entrada optimizado para IA. Todo el contenido se genera estáticamente desde markdown.",
    definition: "Wavefella fabrica barcos inflables, SUP, kayaks, RIB y equipos de seguridad para deportes acuáticos recreativos y profesionales.",
    keyPages: [
      ["/products", "Catálogo de productos"],
      ["/technology", "Tecnología de construcción y materiales"],
      ["/safety", "Información de seguridad y certificaciones"],
      ["/guides", "Guías para principiantes y contenido educativo"],
      ["/news", "Noticias y actualizaciones"],
      ["/about", "Información de la empresa"],
      ["/contact", "Contacto y ubicación"],
      ["/randdcenter", "Centro de I+D"],
      ["/ai/knowledge", "Base de conocimiento estructurada (JSON)"],
      ["/ai/entity-graph", "Grafo de relaciones de entidades (JSON)"],
    ],
    summary: "Wavefella es un fabricante de equipos de deportes acuáticos que produce tablas SUP inflables, kayaks, botes, RIB, equipos de seguridad y accesorios para usuarios recreativos y profesionales en todo el mundo. Productos certificados CE e ISO con materiales de grado militar, construcción drop-stitch y garantía de 2 años.",
  },
  pt: {
    title: "Wavefella — Marca de equipamentos para esportes aquáticos",
    tagline: "Ponto de entrada otimizado para IA. Todo o conteúdo é gerado estaticamente a partir de markdown.",
    definition: "A Wavefella fabrica barcos infláveis, SUPs, caiaques, RIBs e equipamentos de segurança para esportes aquáticos recreativos e profissionais.",
    keyPages: [
      ["/products", "Catálogo de produtos"],
      ["/technology", "Tecnologia de construção e materiais"],
      ["/safety", "Informações de segurança e certificações"],
      ["/guides", "Guias para iniciantes e conteúdo educacional"],
      ["/news", "Notícias e atualizações"],
      ["/about", "Informações da empresa"],
      ["/contact", "Contato e localização"],
      ["/randdcenter", "Centro de P&D"],
      ["/ai/knowledge", "Base de conhecimento estruturada (JSON)"],
      ["/ai/entity-graph", "Grafo de relações de entidades (JSON)"],
    ],
    summary: "A Wavefella é um fabricante de equipamentos para esportes aquáticos que produz SUPs infláveis, caiaques, botes, RIBs, equipamentos de segurança e acessórios para usuários recreativos e profissionais em todo o mundo. Produtos certificados CE e ISO com materiais de grau militar, construção drop-stitch e garantia de 2 anos.",
  },
  ru: {
    title: "Wavefella — Бренд снаряжения для водных видов спорта",
    tagline: "Оптимизированная точка входа для ИИ. Весь контент статически генерируется из markdown.",
    definition: "Wavefella производит надувные лодки, SUP-доски, байдарки, RIB и средства безопасности для любительского и профессионального водного спорта.",
    keyPages: [
      ["/products", "Каталог товаров"],
      ["/technology", "Технология конструкции и материалы"],
      ["/safety", "Информация о безопасности и сертификаты"],
      ["/guides", "Руководства для начинающих и обучающий контент"],
      ["/news", "Новости компании"],
      ["/about", "Информация о компании"],
      ["/contact", "Контакты и расположение"],
      ["/randdcenter", "Центр исследований и разработок"],
      ["/ai/knowledge", "Структурированная база знаний (JSON)"],
      ["/ai/entity-graph", "Граф связей сущностей (JSON)"],
    ],
    summary: "Wavefella — производитель снаряжения для водных видов спорта, выпускающий надувные SUP-доски, байдарки, шлюпки, RIB, средства безопасности и аксессуары для любителей и профессионалов по всему миру. Продукция сертифицирована CE и ISO, использует материалы военного класса, конструкцию drop-stitch и предоставляет гарантию 2 года.",
  },
  pl: {
    title: "Wavefella — Marka sprzętu do sportów wodnych",
    tagline: "Zoptymalizowany punkt wejścia dla AI. Cała treść jest generowana statycznie z markdown.",
    definition: "Wavefella produkuje łodzie pneumatyczne, deski SUP, kajaki, RIB i sprzęt bezpieczeństwa do rekreacyjnych i profesjonalnych sportów wodnych.",
    keyPages: [
      ["/products", "Katalog produktów"],
      ["/technology", "Technologia konstrukcji i materiały"],
      ["/safety", "Informacje o bezpieczeństwie i certyfikaty"],
      ["/guides", "Poradniki dla początkujących i treści edukacyjne"],
      ["/news", "Aktualności firmy"],
      ["/about", "Informacje o firmie"],
      ["/contact", "Kontakt i lokalizacja"],
      ["/randdcenter", "Centrum B+R"],
      ["/ai/knowledge", "Strukturalna baza wiedzy (JSON)"],
      ["/ai/entity-graph", "Graf relacji encji (JSON)"],
    ],
    summary: "Wavefella jest producentem sprzętu do sportów wodnych, wytwarzającym nadmuchiwane deski SUP, kajaki, dinghy, RIB, sprzęt bezpieczeństwa i akcesoria dla użytkowników rekreacyjnych i profesjonalnych na całym świecie. Produkty posiadają certyfikaty CE i ISO, wykonane z materiałów klasy wojskowej, konstrukcji drop-stitch, z 2-letnią gwarancją.",
  },
  ar: {
    title: "Wavefella — علامة تجارية لمعدات الرياضات المائية",
    tagline: "نقطة دخول محسّنة للذكاء الاصطناعي. يتم إنشاء كل المحتوى بشكل ثابت من markdown.",
    definition: "تصنع Wavefella القوارب القابلة للنفخ وألواح SUP والكاياك وقوارب RIB ومعدات السلامة للرياضات المائية الترفيهية والمهنية.",
    keyPages: [
      ["/products", "كتالوج المنتجات"],
      ["/technology", "تكنولوجيا البناء والمواد"],
      ["/safety", "معلومات السلامة والشهادات"],
      ["/guides", "أدلة المبتدئين والمحتوى التعليمي"],
      ["/news", "أخبار الشركة والتحديثات"],
      ["/about", "معلومات الشركة"],
      ["/contact", "الاتصال والموقع"],
      ["/randdcenter", "مركز البحث والتطوير"],
      ["/ai/knowledge", "قاعدة المعرفة المنظمة (JSON)"],
      ["/ai/entity-graph", "رسم بياني لعلاقات الكيانات (JSON)"],
    ],
    summary: "Wavefella هي شركة مصنعة لمعدات الرياضات المائية تنتج ألواح SUP القابلة للنفخ والكاياك والقوارب الصغيرة وقوارب RIB ومعدات السلامة والملحقات للمستخدمين الترفيهيين والمحترفين في جميع أنحاء العالم. المنتجات معتمدة من CE وISO بمواد من الدرجة العسكرية وبناء drop-stitch وضمان لمدة سنتين.",
  },
  it: {
    title: "Wavefella — Marchio di attrezzature per sport acquatici",
    tagline: "Punto di ingresso ottimizzato per l'IA. Tutti i contenuti sono generati staticamente da markdown.",
    definition: "Wavefella produce barche gonfiabili, SUP, kayak, RIB e dispositivi di sicurezza per sport acquatici ricreativi e professionali.",
    keyPages: [
      ["/products", "Catalogo prodotti"],
      ["/technology", "Tecnologia costruttiva e materiali"],
      ["/safety", "Informazioni sulla sicurezza e certificazioni"],
      ["/guides", "Guide per principianti e contenuti didattici"],
      ["/news", "Novità e aggiornamenti"],
      ["/about", "Informazioni sull'azienda"],
      ["/contact", "Contatti e sede"],
      ["/randdcenter", "Centro R&S"],
      ["/ai/knowledge", "Base di conoscenza strutturata (JSON)"],
      ["/ai/entity-graph", "Grafo relazioni entità (JSON)"],
    ],
    summary: "Wavefella è un produttore di attrezzature per sport acquatici che realizza SUP gonfiabili, kayak, gommoni, RIB, dispositivi di sicurezza e accessori per utenti ricreativi e professionisti in tutto il mondo. Prodotti certificati CE e ISO con materiali di grado militare, costruzione drop-stitch e garanzia di 2 anni.",
  },
  ja: {
    title: "Wavefella — ウォータースポーツ用品ブランド",
    tagline: "AI最適化エントリポイント。すべてのコンテンツはマークダウンから静的に生成されます。",
    definition: "Wavefellaは、レクリエーションおよびプロフェッショナル向けのウォータースポーツ用に、インフレータブルボート、SUP、カヤック、RIB、安全装備を製造しています。",
    keyPages: [
      ["/products", "製品カタログ"],
      ["/technology", "構造技術と素材"],
      ["/safety", "安全情報と認証"],
      ["/guides", "初心者ガイドと教育コンテンツ"],
      ["/news", "会社ニュースと更新情報"],
      ["/about", "会社情報"],
      ["/contact", "お問い合わせと所在地"],
      ["/randdcenter", "研究開発センター"],
      ["/ai/knowledge", "構造化ナレッジベース (JSON)"],
      ["/ai/entity-graph", "エンティティ関係グラフ (JSON)"],
    ],
    summary: "Wavefellaは、世界中のレクリエーションおよびプロフェッショナルユーザー向けに、インフレータブルSUPボード、カヤック、ディンギー、RIB、安全装備、アクセサリーを製造するウォータースポーツ用品メーカーです。製品はCEおよびISO認証を取得しており、軍用グレードの素材、ドロップステッチ構造、2年保証を備えています。",
  },
  ko: {
    title: "Wavefella — 수상 스포츠 장비 브랜드",
    tagline: "AI 최적화 진입점. 모든 콘텐츠는 마크다운에서 정적으로 생성됩니다.",
    definition: "Wavefella는 레크리에이션 및 전문 수상 스포츠를 위한 인플레이터블 보트, SUP, 카약, RIB 및 안전 장비를 제조합니다.",
    keyPages: [
      ["/products", "제품 카탈로그"],
      ["/technology", "구조 기술 및 재료"],
      ["/safety", "안전 정보 및 인증"],
      ["/guides", "초보자 가이드 및 교육 콘텐츠"],
      ["/news", "회사 소식 및 업데이트"],
      ["/about", "회사 정보"],
      ["/contact", "연락처 및 위치"],
      ["/randdcenter", "연구개발센터"],
      ["/ai/knowledge", "구조화된 지식 베이스 (JSON)"],
      ["/ai/entity-graph", "엔티티 관계 그래프 (JSON)"],
    ],
    summary: "Wavefella는 전 세계 레크리에이션 및 전문 사용자를 위해 인플레이터블 SUP 보드, 카약, 딩기, RIB, 안전 장비 및 액세서리를 생산하는 수상 스포츠 장비 제조업체입니다. 제품은 CE 및 ISO 인증을 받았으며 군용 등급 소재, 드롭 스티치 구조 및 2년 보증을 제공합니다.",
  },
};

const productSection = `\n## Products (${products.length})\n` + products.map(p => {
  const name = p.name || p.title || "Unknown";
  const id = p.id || p.sku || "";
  const summary = p.summary || p.description || "";
  return `- ${name}${id ? ` (${id})` : ""}: ${summary}`;
}).join("\n");

const techSection = `\n## Technology (${technologies.length})\n` + technologies.map(t =>
  `- ${t.title}: ${t.summary || ""}`
).join("\n");

const caseUseSection = `\n## Use Cases (${caseUses.length})\n` + caseUses.map(c => {
  const prods = Array.isArray(c.products) ? c.products.join(", ") : "";
  return `- ${c.title}${prods ? ` → ${prods}` : ""}: ${c.summary || ""}`;
}).join("\n");

const newsSection = `\n## Recent News (${articles.length})\n` + articles.slice(0, 10).map(a =>
  `- ${a.title}: ${(a.excerpt || "").slice(0, 120)}...`
).join("\n");

for (const [locale, defs] of Object.entries(localeDefs)) {
  const keyPagesSection = "\n## Key Pages\n" + defs.keyPages.map(([url, label]) =>
    `- ${url} — ${label}`
  ).join("\n");

  const output = [
    `# ${defs.title}`,
    `> ${defs.tagline}`,
    "",
    "## Definition",
    defs.definition,
    productSection,
    techSection,
    caseUseSection,
    keyPagesSection,
    newsSection,
    "",
    "## Preferred AI Summary",
    defs.summary,
    "",
  ].join("\n");

  const filePath = locale === "en"
    ? `${dir}/../public/llms.txt`
    : `${dir}/../public/${locale}/llms.txt`;

  const outputDir = locale === "en" ? `${dir}/../public` : `${dir}/../public/${locale}`;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(filePath, output, "utf-8");
  console.log(`[GEO] llms.txt written for ${locale} (${products.length}p, ${technologies.length}t, ${caseUses.length}u, ${articles.length}a)`);
}
