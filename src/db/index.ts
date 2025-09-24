// 中文注释：Drizzle SQLite 数据库实例
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "node:path";
import fs from "node:fs";

const dbFile = path.resolve(process.env.DATABASE_URL || "./data/db.sqlite");
const dir = path.dirname(dbFile);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

export const sqlite = new Database(dbFile);
export const db = drizzle(sqlite, { schema });

export type DbType = typeof db;
export * as DbSchema from "./schema";

