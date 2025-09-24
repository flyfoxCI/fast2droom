// 中文注释：creem.io 支付封装（需根据官方文档细化字段）
// 文档：https://docs.creem.io/introduction

export type PurchaseKind = { type: "subscription"; plan: "monthly" | "yearly" } | { type: "credits"; quantity: number };

export interface CreateCheckoutInput {
  userId: string;
  kind: PurchaseKind;
  locale?: string;
}

export interface CreateCheckoutResult { id: string; url: string }

const CREEM_API = "https://api.creem.io"; // 以官方文档为准（可能不同环境 baseURL）

function requireEnv(key: string) {
  const v = process.env[key];
  if (!v) throw new Error(`缺少 ${key} 环境变量`);
  return v;
}

export async function creemCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
  const apiKey = requireEnv("CREEM_API_KEY");
  const monthly = process.env.CREEM_MONTHLY_PRICE_ID || "";
  const yearly = process.env.CREEM_YEARLY_PRICE_ID || "";
  const credits = process.env.CREEM_CREDITS_SKU_ID || "";

  // 根据 kind 选择不同的商品/价格 ID（仅示例，占位）
  const payload: any = { userId: input.userId };
  if (input.kind.type === "subscription") {
    payload.mode = "subscription";
    payload.priceId = input.kind.plan === "monthly" ? monthly : yearly;
  } else {
    payload.mode = "payment";
    payload.skuId = credits;
    payload.quantity = input.kind.quantity;
  }
  if (input.locale) payload.locale = input.locale;

  const base = process.env.APP_BASE_URL || "http://localhost:3000";
  payload.successUrl = `${base}/${input.locale || "zh"}/billing/success`;
  payload.cancelUrl = `${base}/${input.locale || "zh"}/billing/cancel`;

  const res = await fetch(`${CREEM_API}/checkout/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`creem checkout 创建失败：${res.status} ${txt}`);
  }
  const data = await res.json();
  return { id: data.id, url: data.url };
}

export async function creemVerifyWebhook(payload: ArrayBuffer, signature: string | null) {
  const secret = process.env.CREEM_WEBHOOK_SECRET;
  if (!secret) throw new Error("缺少 CREEM_WEBHOOK_SECRET 环境变量");
  if (!signature) throw new Error("缺少签名头");
  // 通用 HMAC-SHA256 校验：具体验证方式以 creem 文档为准
  const crypto = await import("node:crypto");
  const buf = Buffer.from(payload);
  const computed = crypto.createHmac("sha256", secret).update(buf).digest("hex");
  if (computed !== signature) throw new Error("签名不匹配");
  try {
    const json = JSON.parse(buf.toString("utf-8"));
    return json;
  } catch (e) {
    return { type: "unknown", raw: buf.toString("utf-8") };
  }
}
