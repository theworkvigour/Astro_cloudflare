import fs from "fs";
import { glob } from "glob";
import matter from "gray-matter";

const contentDirs = [
  { base: "src/content/products", type: "product" },
  { base: "src/content/news", type: "article" },
  { base: "src/data/technology", type: "technology" },
  { base: "src/data/case-use", type: "case-use" },
];

const dir = import.meta.dirname;

const nodes = new Map();
const edges = [];

for (const { base, type } of contentDirs) {
  const files = glob.sync(`${base}/**/*.md`, { cwd: `${dir}/..` }).concat(
    glob.sync(`${base}/**/*.mdx`, { cwd: `${dir}/..` })
  );
  for (const file of files) {
    const raw = fs.readFileSync(`${dir}/../${file}`, "utf-8");
    const { data } = matter(raw);
    if (data.draft) continue;
    const id = data.id || file.replace(/.*[/\\]/, "").replace(/\.(md|mdx)$/i, "");
    const label = data.name || data.title || id;
    nodes.set(id, { id, type, label, category: data.category || type });

    if (type === "product") {
      const tags = Array.isArray(data.tags) ? data.tags : [];
      for (const tag of tags) {
        const tid = `tag:${tag}`;
        if (!nodes.has(tid)) nodes.set(tid, { id: tid, type: "tag", label: tag });
        edges.push({ from: id, to: tid, relation: "tagged" });
      }
    }
    if (type === "case-use") {
      const products = Array.isArray(data.products) ? data.products : [];
      for (const pid of products) {
        edges.push({ from: id, to: pid, relation: "recommends" });
      }
      if (data.environment) {
        const eid = `env:${data.environment}`;
        if (!nodes.has(eid)) nodes.set(eid, { id: eid, type: "environment", label: data.environment });
        edges.push({ from: id, to: eid, relation: "occurs_in" });
      }
      if (data.skill) {
        const sid = `skill:${data.skill}`;
        if (!nodes.has(sid)) nodes.set(sid, { id: sid, type: "skill", label: data.skill });
        edges.push({ from: id, to: sid, relation: "requires" });
      }
    }
    if (type === "technology") {
      const tags = Array.isArray(data.tags) ? data.tags : [];
      for (const tag of tags) {
        const tid = `tag:${tag}`;
        if (!nodes.has(tid)) nodes.set(tid, { id: tid, type: "tag", label: tag });
        edges.push({ from: id, to: tid, relation: "tagged" });
      }
    }
    if (type === "article") {
      const tags = Array.isArray(data.tags) ? data.tags : [];
      for (const tag of tags) {
        const tid = `tag:${tag}`;
        if (!nodes.has(tid)) nodes.set(tid, { id: tid, type: "tag", label: tag });
        edges.push({ from: id, to: tid, relation: "tagged" });
      }
    }
  }
}

const graph = {
  nodes: Array.from(nodes.values()),
  edges,
};

fs.mkdirSync(`${dir}/../public/ai`, { recursive: true });
fs.writeFileSync(
  `${dir}/../public/ai/entity-graph.json`,
  JSON.stringify(graph, null, 2)
);
console.log(`[GEO] entity-graph.json written (${graph.nodes.length} nodes, ${graph.edges.length} edges)`);
