// 中文注释：将上传的文件保存到 public/uploads 下（开发用，生产建议使用对象存储）
import fs from "node:fs";
import path from "node:path";

export function saveToPublicUploads(nameHint: string, data: Buffer) {
  const dir = path.resolve("public/uploads");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const ts = Date.now();
  const safe = nameHint.replace(/[^a-zA-Z0-9_.-]+/g, "_");
  const fileName = `${ts}_${safe}`;
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, data);
  const url = `/uploads/${fileName}`; // Next.js 静态可访问
  return { filePath: filePath, url };
}

