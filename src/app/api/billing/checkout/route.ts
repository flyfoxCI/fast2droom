// 中文注释：创建 creem.io 结账会话（订阅/积分）
import { NextRequest } from "next/server";
import { creemCheckout } from "@/lib/creem";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, kind, locale } = body || {};
    if (!userId || !kind) return new Response("缺少参数", { status: 400 });
    const session = await creemCheckout({ userId, kind, locale });
    return Response.json(session);
  } catch (e: any) {
    return new Response(e?.message || "checkout error", { status: 400 });
  }
}

