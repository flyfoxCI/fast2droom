// 中文注释：计费抽象层（等待确认实际支付服务商："creem"？）

export type Plan = "monthly" | "yearly";
export type PurchaseKind = { type: "subscription"; plan: Plan } | { type: "credits"; quantity: number };

export interface CheckoutSessionInput {
  userId: string;
  purchase: PurchaseKind;
  locale?: string;
}

export interface CheckoutSession {
  id: string;
  url: string;
}

// 占位：实际实现需对接支付网关（creem/stripe/paddle等）
export async function createCheckoutSession(_input: CheckoutSessionInput): Promise<CheckoutSession> {
  throw new Error("计费服务未配置（需确认 creem/stripe/paddle 等）");
}

export async function verifyWebhook(_payload: ArrayBuffer, _signature: string | null) {
  // TODO: 校验签名并返回事件对象
  throw new Error("计费 Webhook 未配置");
}

