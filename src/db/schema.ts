// 中文注释：Better Auth + Drizzle 的基础表结构（PostgreSQL / Supabase 版本）
import { pgTable, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";

// 用户表（保持与 better-auth 默认命名一致：user）
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

// 会话表（保持与 better-auth 默认命名一致：session）
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

// 第三方/本地账号表（保持与 better-auth 默认命名一致：account）
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

// 业务侧扩展：项目/房间/资源/任务/计费
export const project = pgTable("project", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const room = pgTable("room", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => project.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  // 空间尺寸基础字段（后续可引入单位/坐标系）
  lengthMm: integer("length_mm"),
  widthMm: integer("width_mm"),
  heightMm: integer("height_mm"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const asset = pgTable("asset", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => project.id, { onDelete: "set null" }),
  roomId: text("room_id").references(() => room.id, { onDelete: "set null" }),
  kind: text("kind").notNull(), // image360 | photo | model | texture | plan | realsee_link
  url: text("url").notNull(),
  meta: text("meta"), // JSON 字符串：EXIF、相机参数、色板等
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const job = pgTable("job", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  projectId: text("project_id").references(() => project.id, { onDelete: "cascade" }),
  roomId: text("room_id").references(() => room.id, { onDelete: "set null" }),
  type: text("type").notNull(), // render2d | render360 | depth | inpaint | export
  status: text("status").notNull(), // queued | running | succeeded | failed
  input: text("input"), // JSON：提示词、参考图、参数
  output: text("output"), // JSON：结果 URL、度量
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const subscription = pgTable("subscription", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  plan: text("plan").notNull(), // monthly | yearly
  status: text("status").notNull(), // active | past_due | canceled | trialing
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  provider: text("provider"), // creem
  externalId: text("external_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const credit = pgTable("credit", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // 正数：充值；负数：消耗
  reason: text("reason"), // purchase | render | export | admin_adjust
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
