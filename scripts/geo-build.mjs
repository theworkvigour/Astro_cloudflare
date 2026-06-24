import { execSync } from "child_process";

const dir = import.meta.dirname;
const scripts = [
  "build-entity-graph.mjs",
  "build-llms.mjs",
  "build-knowledge.mjs",
  "build-sitemap.mjs",
];

console.log("=== GEO Build Pipeline ===");
for (const script of scripts) {
  console.log(`\n▶ Running ${script}...`);
  execSync(`node "${dir}/${script}"`, { stdio: "inherit", cwd: `${dir}/..` });
}
console.log("\n=== GEO Build Complete ===");
