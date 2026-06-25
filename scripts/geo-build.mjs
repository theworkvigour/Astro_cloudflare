import { execSync } from "child_process";

const dir = import.meta.dirname;
const scripts = [
  "build-geo-v4.ts",
];

console.log("=== GEO v4 Build Pipeline ===");
for (const script of scripts) {
  console.log(`\n▶ Running ${script}...`);
  execSync(`npx tsx "${dir}/${script}"`, { stdio: "inherit", cwd: `${dir}/..` });
}
console.log("\n=== GEO v4 Build Complete ===");
