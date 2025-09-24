// 中文注释：Drizzle PostgreSQL（Supabase）数据库实例
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
let dbInstance: any;
if (connectionString) {
  // Supabase 连接池（Transaction 模式）通常不支持 prepare，需要关闭
  const client = postgres(connectionString, { prepare: false });
  dbInstance = drizzle(client, { schema });
} else {
  // 构建期可能未提供数据库连接，导出一个惰性失败的占位符，运行期使用前请配置 env
  console.warn("[db] DATABASE_URL/SUPABASE_DB_URL 未配置，导出占位 db。运行期请设置 env。");
  dbInstance = new Proxy(
    {},
    {
      get() {
        throw new Error("数据库未配置（缺少 DATABASE_URL 或 SUPABASE_DB_URL）");
      },
    }
  );
}

export const db = dbInstance as ReturnType<typeof drizzle>;

export type DbType = typeof db;
export * as DbSchema from "./schema";
