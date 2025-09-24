// 中文注释：Better Auth 核心实例配置（Next.js App Router）
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";

export const auth = betterAuth({
  // 数据库适配（Drizzle + SQLite）
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  // 启用邮箱+密码（后续可扩展 OAuth / Passkey / Magic Link）
  emailAndPassword: {
    enabled: true,
  },
  // 确保在 Next.js Server Actions/Route Handler 自动处理 Set-Cookie
  plugins: [nextCookies()],
});

