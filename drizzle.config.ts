import { defineConfig } from "drizzle-kit";
import * as path from "node:path";

// 使用 SQLite 本地开发，生产可切换到 Postgres/PlanetScale
export default defineConfig({
  out: path.resolve("./drizzle"),
  schema: path.resolve("./src/db/schema.ts"),
  dialect: "sqlite",
  dbCredentials: {
    url: path.resolve(process.env.DATABASE_URL || "./data/db.sqlite"),
  },
  verbose: true,
  strict: true,
});
