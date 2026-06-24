import fs from "fs";
import { glob } from "glob";
import matter from "gray-matter";

const dir = import.meta.dirname;

const knowledge = {
  brand: {
    name: "Wavefella",
    description: "Water sports equipment manufacturer — inflatable SUP boards, kayaks, dinghies, RIBs, safety equipment, and accessories.",
    founded: 2012,
    certifications: ["CE", "ISO 12402", "SOLAS (Life Vest Pro)"],
    materials: ["Marine-grade PVC", "Hypalon"],
    warranty: "2-year manufacturer warranty",
  },
  products: [],
  technologies: [],
  useCases: [],
  articles: [],
};

for (const file of glob.sync("src/content/products/*.md*", { cwd: `${dir}/..` })) {
  const raw = fs.readFileSync(`${dir}/../${file}`, "utf-8");
  const { data } = matter(raw);
  if (data.draft) continue;
  knowledge.products.push({
    id: data.id || data.sku || file.replace(/.*[/\\]/, "").replace(/\.md$/, ""),
    name: data.name || data.title,
    summary: data.summary || "",
    description: data.description || "",
    category: data.category || "",
    tags: data.tags || [],
    specs: (data.specs || []).map(s => ({ label: s.label, value: String(s.value) })),
    price: data.price?.amount || "",
    currency: data.price?.currency || "USD",
    inStock: data.inStock !== false,
    featured: data.featured === true,
    image: data.image || "",
  });
}

for (const file of glob.sync("src/data/technology/*.md", { cwd: `${dir}/..` })) {
  const raw = fs.readFileSync(`${dir}/../${file}`, "utf-8");
  const { data } = matter(raw);
  if (data.draft) continue;
  knowledge.technologies.push({
    id: file.replace(/.*[/\\]/, "").replace(/\.md$/, ""),
    title: data.title,
    summary: data.summary || "",
    description: data.description || "",
    category: data.category || "",
    tags: data.tags || [],
  });
}

for (const file of glob.sync("src/data/case-use/*.md", { cwd: `${dir}/..` })) {
  const raw = fs.readFileSync(`${dir}/../${file}`, "utf-8");
  const { data } = matter(raw);
  if (data.draft) continue;
  knowledge.useCases.push({
    id: file.replace(/.*[/\\]/, "").replace(/\.md$/, ""),
    title: data.title,
    summary: data.summary || "",
    description: data.description || "",
    category: data.category || "",
    environment: data.environment || "",
    skill: data.skill || "",
    products: data.products || [],
    tags: data.tags || [],
  });
}

for (const file of glob.sync("src/content/news/*.md*", { cwd: `${dir}/..` })) {
  const raw = fs.readFileSync(`${dir}/../${file}`, "utf-8");
  const { data } = matter(raw);
  if (data.draft) continue;
  knowledge.articles.push({
    id: file.replace(/.*[/\\]/, "").replace(/\.(md|mdx)$/i, ""),
    title: data.title,
    excerpt: data.excerpt || data.description || "",
    category: data.category || "",
    tags: data.tags || [],
    publishDate: data.publishDate ? new Date(data.publishDate).toISOString() : "",
  });
}

fs.mkdirSync(`${dir}/../public/ai`, { recursive: true });
fs.writeFileSync(
  `${dir}/../public/ai/knowledge.json`,
  JSON.stringify(knowledge, null, 2)
);
console.log(`[GEO] knowledge.json written (${knowledge.products.length} products, ${knowledge.technologies.length} technologies, ${knowledge.useCases.length} use cases, ${knowledge.articles.length} articles)`);
