// 中文注释：支付 Webhook 占位（待选定实际支付服务商后补全）
import { creemVerifyWebhook } from "@/lib/creem";
import { db } from "@/db";
import { subscription, credit, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const payload = await req.arrayBuffer();
    const sig = req.headers.get("stripe-signature") || req.headers.get("x-creem-signature") || null;
    const event: any = await creemVerifyWebhook(payload, sig);

    // 粗略事件处理（以 creem 文档为准）：
    // 期望 event = { type: 'subscription.updated'|'payment.succeeded', data: {...} }
    // data: { userId, plan, status, credits, externalId }
    const data = event?.data || {};
    const uid = data.userId as string | undefined;
    const plan = data.plan as string | undefined;
    const status = data.status as string | undefined;
    const creditsAmount = Number(data.credits || 0);
    const externalId = data.externalId as string | undefined;

    if (event?.type?.includes("subscription")) {
      if (uid) {
        const users = await db.select().from(user).where(eq(user.id, uid));
        if (users.length) {
          // upsert：若存在相同 userId 的订阅，更新状态
          await db.insert(subscription).values({
            id: crypto.randomUUID(),
            userId: uid,
            plan: (plan || "monthly") as any,
            status: (status || "active") as any,
            provider: "creem",
            externalId: externalId || null,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    } else if (event?.type?.includes("payment") && creditsAmount > 0 && uid) {
      const users = await db.select().from(user).where(eq(user.id, uid));
      if (users.length) {
        await db.insert(credit).values({
          id: crypto.randomUUID(),
          userId: uid,
          amount: creditsAmount,
          reason: "purchase",
          createdAt: new Date(),
        });
      }
    }

    return new Response("ok");
  } catch (e: any) {
    return new Response(e?.message || "webhook error", { status: 400 });
  }
}
