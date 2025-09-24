import { NextRequest } from "next/server";
import { db } from "@/db";
import { job, credit, subscription } from "@/db/schema";
import { eq, and, gte, lte, sql as dsql } from "drizzle-orm";
import { saveToPublicUploads } from "@/lib/upload";
import { generate } from "@/lib/generation";
import { config } from "@/config/app";

// 创建生成任务（上传图片 + prompt）并立即执行（MVP 简化版）
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const prompt = String(form.get("prompt") || "").trim();
    const userId = String(form.get("userId") || "").trim() || undefined;
    if (!prompt) return new Response("缺少 prompt", { status: 400 });

    const photo = form.get("photo");
    if (!(photo instanceof File)) return new Response("缺少现场照片", { status: 400 });
    if (!config.upload.allowed.includes(photo.type)) return new Response("图片格式不支持", { status: 400 });
    if (photo.size > config.upload.maxBytes) return new Response("图片过大", { status: 400 });
    const photoBuf = Buffer.from(await photo.arrayBuffer());
    const savedPhoto = saveToPublicUploads(photo.name || "photo.jpg", photoBuf);

    const ref = form.get("ref");
    let savedRefPath: string | undefined = undefined;
    let savedRefUrl: string | undefined = undefined;
    if (ref instanceof File && ref.size > 0) {
      if (!config.upload.allowed.includes(ref.type)) return new Response("参考图格式不支持", { status: 400 });
      if (ref.size > config.upload.maxBytes) return new Response("参考图过大", { status: 400 });
      const refBuf = Buffer.from(await ref.arrayBuffer());
      const savedRef = saveToPublicUploads(ref.name || "ref.jpg", refBuf);
      savedRefPath = savedRef.filePath;
      savedRefUrl = savedRef.url;
    }

    const negativePrompt = String(form.get("negativePrompt") || "").trim() || undefined;
    const strengthStr = String(form.get("strength") || "").trim();
    const strength = strengthStr ? Number(strengthStr) : undefined;

    // 订阅/积分校验（仅在开启 paywall 时）
    let hasSubscription = false;
    let balance = 0;
    if (config.paywallEnforce) {
      if (!userId) {
        return new Response("未登录或缺少用户ID", { status: 401 });
      }
      const now = new Date();
      const subs = await db
        .select()
        .from(subscription)
        .where(
          and(
            eq(subscription.userId, userId),
            eq(subscription.provider, "creem"),
            eq(subscription.status, "active" as any),
          ),
        );
      hasSubscription = subs.some((s) => !s.periodStart || !s.periodEnd || (s.periodStart! <= now && now <= s.periodEnd!));

      if (!hasSubscription) {
        const rows = await db
          .select({ sum: dsql<number>`coalesce(sum(${credit.amount}), 0)` })
          .from(credit)
          .where(eq(credit.userId, userId));
        balance = Number(rows[0]?.sum || 0);
        if (balance < config.creditCostPerRender) {
          return new Response("积分不足，请购买积分或订阅", { status: 402 });
        }
      }
    }

    // 记录任务
    const [created] = await db
      .insert(job)
      .values({
        id: crypto.randomUUID(),
        type: "render2d",
        userId,
        status: "queued",
        input: JSON.stringify({ prompt, photo: savedPhoto.url, ref: savedRefPath ? savedRefPath : null }),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: job.id });

    // 立刻执行（MVP）
    try {
      const base = process.env.APP_BASE_URL || req.nextUrl.origin;
      const initUrl = new URL(savedPhoto.url, base).toString();
      const refUrl = savedRefUrl ? new URL(savedRefUrl, base).toString() : undefined;

      const result = await generate({
        prompt,
        // 注意：OpenRouter 需要公网 URL，这里传入完整 URL；Replicate 分支会忽略 URL，用本地路径
        photoPath: process.env.OPENROUTER_API_KEY ? initUrl : savedPhoto.filePath,
        refPath: process.env.OPENROUTER_API_KEY ? refUrl : savedRefPath,
        negativePrompt,
        strength,
      });

      await db
        .update(job)
        .set({
          status: "succeeded",
          output: JSON.stringify({ images: result.images }),
          updatedAt: new Date(),
        })
        .where(eq(job.id, created.id));

      // 成功后扣费（无订阅时）
      if (config.paywallEnforce && userId && !hasSubscription) {
        await db.insert(credit).values({
          id: crypto.randomUUID(),
          userId,
          amount: -config.creditCostPerRender,
          reason: "render",
          createdAt: new Date(),
        });
      }
    } catch (e: any) {
      if (config.fakeGenerationFallback) {
        await db
          .update(job)
          .set({
            status: "succeeded",
            output: JSON.stringify({ images: [savedPhoto.url] }),
            updatedAt: new Date(),
          })
          .where(eq(job.id, created.id));
      } else {
        await db
          .update(job)
          .set({ status: "failed", error: e?.message || "generate error", updatedAt: new Date() })
          .where(eq(job.id, created.id));
      }
    }

    return Response.json({ id: created.id });
  } catch (e: any) {
    return new Response(e?.message || "bad request", { status: 400 });
  }
}

// 查询任务结果
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return new Response("缺少 id", { status: 400 });
  const rows = await db.select().from(job).where(eq(job.id, id));
  if (!rows.length) return new Response("not found", { status: 404 });
  return Response.json(rows[0]);
}
