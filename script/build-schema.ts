import * as fs from "node:fs";
import * as path from "node:path";
import * as url from 'node:url'

async function buildSchema(db: string) {
  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename)
  const modelsDir = path.resolve(__dirname, `../prisma/${db}-models`);
  const outputFile = path.resolve(__dirname, `../prisma/${db}.schema.prisma`);

  const files = fs.readdirSync(modelsDir).filter((f) => f.endsWith(".prisma"));

  const schemaFile = files.find((f) => f === "schema.prisma");
  const otherFiles = files.filter((f) => f !== "schema.prisma").sort();

  const orderedFiles = [...(schemaFile ? [schemaFile] : []), ...otherFiles];

  if (orderedFiles.length === 0) {
    console.error("❌ 没有找到任何 .prisma 文件");
    process.exit(1);
  }

  console.info("🔧 合并以下文件顺序：");
  orderedFiles.forEach((f) => console.info("  -", f));

  const mergedContent = orderedFiles
      .map((f) => fs.readFileSync(path.join(modelsDir, f), "utf8"))
      .join("\n\n");

  fs.writeFileSync(outputFile, mergedContent, "utf8");
  console.info(`✅ 已生成合并文件: ${outputFile}`);
}

try {
  buildSchema('mysql')
  // buildSchema('postgresql')
} catch (err) {
  console.error("❌ 构建 schema 失败:", err);
  process.exit(1);
}
