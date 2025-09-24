import { NextRequest } from "next/server";
import { db } from "@/db";
import { job } from "@/db/schema";
import { eq } from "drizzle-orm";
import { saveToPublicUploads } from "@/lib/upload";
import { generateWithReplicate } from "@/lib/generation/providers/replicate";
import { config } from "@/config/app";

// 创建生成任务（上传图片 + prompt）并立即执行（MVP 简化版）
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const prompt = String(form.get("prompt") || "").trim();
    if (!prompt) return new Response("缺少 prompt", { status: 400 });

    const photo = form.get("photo");
    if (!(photo instanceof File)) return new Response("缺少现场照片", { status: 400 });
    if (!config.upload.allowed.includes(photo.type)) return new Response("图片格式不支持", { status: 400 });
    if (photo.size > config.upload.maxBytes) return new Response("图片过大", { status: 400 });
    const photoBuf = Buffer.from(await photo.arrayBuffer());
    const savedPhoto = saveToPublicUploads(photo.name || "photo.jpg", photoBuf);

    const ref = form.get("ref");
    let savedRefPath: string | undefined = undefined;
    if (ref instanceof File && ref.size > 0) {
      if (!config.upload.allowed.includes(ref.type)) return new Response("参考图格式不支持", { status: 400 });
      if (ref.size > config.upload.maxBytes) return new Response("参考图过大", { status: 400 });
      const refBuf = Buffer.from(await ref.arrayBuffer());
      const savedRef = saveToPublicUploads(ref.name || "ref.jpg", refBuf);
      savedRefPath = savedRef.filePath;
    }

    const negativePrompt = String(form.get("negativePrompt") || "").trim() || undefined;
    const strengthStr = String(form.get("strength") || "").trim();
    const strength = strengthStr ? Number(strengthStr) : undefined;

    // TODO：当 config.paywallEnforce 为 true：检查订阅/积分（留待 creem 打通后开启）

    // 记录任务
    const [created] = await db
      .insert(job)
      .values({
        id: crypto.randomUUID(),
        type: "render2d",
        status: "queued",
        input: JSON.stringify({ prompt, photo: savedPhoto.url, ref: savedRefPath ? savedRefPath : null }),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: job.id });

    // 立刻执行（MVP）
    try {
      const result = await generateWithReplicate({
        prompt,
        photoPath: savedPhoto.filePath,
        refPath: savedRefPath,
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
