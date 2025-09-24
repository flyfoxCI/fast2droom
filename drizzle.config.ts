import { defineConfig } from "drizzle-kit";
import * as path from "node:path";

// 切换为 PostgreSQL（Supabase）
// DATABASE_URL 或 SUPABASE_DB_URL（postgres 连接串）
const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || "";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
  verbose: true,
  strict: true,
});
