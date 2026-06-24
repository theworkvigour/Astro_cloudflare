import fs from "fs";
import { glob } from "glob";
import matter from "gray-matter";

const dir = import.meta.dirname;
const base = "https://en.alluredna.com";

const entries = [];

for (const file of glob.sync("src/content/products/*.md*", { cwd: `${dir}/..` })) {
  const raw = fs.readFileSync(`${dir}/../${file}`, "utf-8");
  const { data } = matter(raw);
  if (data.draft) continue;
  const id = file.replace(/.*[/\\]/, "").replace(/\.md$/, "");
  entries.push({
    loc: `${base}/products/${id}`,
    entity: id,
    type: data.category || "product",
    priority: data.featured ? "0.9" : "0.7",
  });
}

for (const file of glob.sync("src/content/news/*.md*", { cwd: `${dir}/..` })) {
  const raw = fs.readFileSync(`${dir}/../${file}`, "utf-8");
  const { data } = matter(raw);
  if (data.draft) continue;
  const id = file.replace(/.*[/\\]/, "").replace(/\.(md|mdx)$/i, "");
  entries.push({
    loc: `${base}/news/${id}`,
    entity: id,
    type: "article",
    priority: "0.6",
  });
}

for (const file of glob.sync("src/data/technology/*.md", { cwd: `${dir}/..` })) {
  const raw = fs.readFileSync(`${dir}/../${file}`, "utf-8");
  const { data } = matter(raw);
  if (data.draft) continue;
  const id = file.replace(/.*[/\\]/, "").replace(/\.md$/, "");
  entries.push({
    loc: `${base}/technology`,
    entity: id,
    type: "technology",
    priority: "0.7",
  });
}

for (const file of glob.sync("src/data/case-use/*.md", { cwd: `${dir}/..` })) {
  const raw = fs.readFileSync(`${dir}/../${file}`, "utf-8");
  const { data } = matter(raw);
  if (data.draft) continue;
  const id = file.replace(/.*[/\\]/, "").replace(/\.md$/, "");
  entries.push({
    loc: `${base}/products`,
    entity: id,
    type: "case-use",
    priority: "0.6",
  });
}

const staticPages = [
  { loc: `${base}/`, entity: "wavefella", type: "brand", priority: "1.0" },
  { loc: `${base}/products`, entity: "products", type: "product", priority: "0.9" },
  { loc: `${base}/technology`, entity: "technology", type: "technology", priority: "0.7" },
  { loc: `${base}/safety`, entity: "safety", type: "safety", priority: "0.7" },
  { loc: `${base}/guides`, entity: "guides", type: "guide", priority: "0.8" },
  { loc: `${base}/news`, entity: "news", type: "article", priority: "0.8" },
  { loc: `${base}/about`, entity: "about", type: "brand", priority: "0.6" },
  { loc: `${base}/services`, entity: "services", type: "service", priority: "0.5" },
  { loc: `${base}/contact`, entity: "contact", type: "service", priority: "0.5" },
  { loc: `${base}/randdcenter`, entity: "randd", type: "technology", priority: "0.6" },
  { loc: `${base}/distributors`, entity: "distributors", type: "service", priority: "0.5" },
  { loc: `${base}/products/compare`, entity: "compare", type: "product", priority: "0.5" },
  { loc: `${base}/products/bundles`, entity: "bundles", type: "product", priority: "0.6" },
  { loc: `${base}/size-guide`, entity: "size-guide", type: "product", priority: "0.5" },
];

for (const s of staticPages) {
  if (!entries.find(e => e.loc === s.loc)) entries.push(s);
}

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
xml += `        xmlns:x="https://wavefella.com/geo">\n`;

for (const e of entries) {
  xml += `  <url>\n`;
  xml += `    <loc>${e.loc}</loc>\n`;
  xml += `    <x:entity>${e.entity}</x:entity>\n`;
  xml += `    <x:type>${e.type}</x:type>\n`;
  xml += `    <priority>${e.priority}</priority>\n`;
  xml += `  </url>\n`;
}

xml += `</urlset>\n`;

fs.writeFileSync(`${dir}/../public/sitemap-entity.xml`, xml);
console.log(`[GEO] sitemap-entity.xml written (${entries.length} entries)`);
