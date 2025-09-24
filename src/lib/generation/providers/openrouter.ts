// 中文注释：OpenRouter 接入 Google Gemini 2.5 Flash Image
// 文档参考：https://openrouter.ai/docs (Responses API)

import { GenerateInput, GenerateResult } from "../types";

function requireEnv(key: string) {
  const v = process.env[key];
  if (!v) throw new Error(`缺少环境变量：${key}`);
  return v;
}

function buildPrompt(input: GenerateInput) {
  const lines = [
    "你是一名室内设计改造专家。",
    "要求：在严格保留原始空间几何结构与主布局的前提下，按照提示词与参考风格进行风格化重绘。",
    "重点：",
    "1) 保留墙体/门窗/主要家具相对位置与尺度关系",
    "2) 色彩方案与材质尽可能向参考图靠拢",
    "3) 光照方向保持一致，避免明显失真",
    "4) 输出一张完成度高、可落地的效果图。",
  ];
  if (input.negativePrompt) {
    lines.push(`请避免：${input.negativePrompt}`);
  }
  lines.push("用户需求：" + input.prompt);
  return lines.join("\n");
}

export async function generateWithOpenRouter(input: GenerateInput): Promise<GenerateResult> {
  const apiKey = requireEnv("OPENROUTER_API_KEY");
  const model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash-image";
  const referer = process.env.OPENROUTER_REFERRER || process.env.APP_BASE_URL || "http://localhost:3000";
  const xTitle = process.env.OPENROUTER_TITLE || "AI Room Helper";

  // OpenRouter Responses API：支持 multimodal input（文本 + 图片）
  const content: any[] = [
    { type: "input_text", text: buildPrompt(input) },
  ];

  // 这里要求传入可公网访问的 image_url（由上层构造）
  // 注意：Gemini 图像生成的具体参数可能受平台更新影响，这里采用通用 multimodal 约定
  // image 1: 原始现场照片（保持几何）
  content.push({ type: "input_image", image_url: input.photoPath });
  // image 2: 参考风格图（可选）
  if (input.refPath) content.push({ type: "input_image", image_url: input.refPath });

  const body = {
    model,
    input: [
      {
        role: "user",
        content,
      },
    ],
  } as any;

  const res = await fetch("https://openrouter.ai/api/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": referer,
      "X-Title": xTitle,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter 响应失败：${res.status} ${text}`);
  }
  const data = await res.json();

  // 兼容多种返回结构，提取图片 URL
  const images: string[] = [];
  // Responses API 可能返回在 data.response.content 中
  const tryCollect = (node: any) => {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach(tryCollect);
      return;
    }
    if (node.type && String(node.type).includes("image") && (node.image_url || node.url)) {
      images.push(node.image_url || node.url);
    }
    if (typeof node === "object") {
      for (const k of Object.keys(node)) tryCollect(node[k]);
    }
  };
  tryCollect(data);

  if (!images.length) {
    throw new Error("OpenRouter 返回中未找到图片。请检查模型是否支持图片生成。");
  }

  return { images };
}

