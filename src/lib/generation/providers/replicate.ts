// 中文注释：Replicate 生成 provider（模型/版本通过环境变量可配置）
import Replicate from "replicate";
import fs from "node:fs";
import path from "node:path";
import { GenerateInput, GenerateResult } from "../types";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN || "" });

function ensureEnv() {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("缺少 REPLICATE_API_TOKEN，请在环境变量中配置");
  }
  if (!process.env.REPLICATE_MODEL) {
    throw new Error("缺少 REPLICATE_MODEL，请在环境变量中配置（例如 sdxl img2img 或 flux）");
  }
}

async function uploadLocalFile(absPath: string) {
  const buf = fs.readFileSync(absPath);
  const file = await replicate.files.create(buf);
  // 多数模型接受可访问的 URL
  return (file as any).url as string;
}

async function tryGenerateWithControlnetDepth(
  input: GenerateInput,
  initImageUrl: string,
  styleImageUrl?: string
): Promise<GenerateResult> {
  const cModel = process.env.REPLICATE_CONTROLNET_MODEL; // 例：sdxl-controlnet-depth
  const cVersion = process.env.REPLICATE_CONTROLNET_VERSION;
  const dModel = process.env.REPLICATE_DEPTH_MODEL; // 例：depth-anything
  const dVersion = process.env.REPLICATE_DEPTH_VERSION;

  if (!cModel || !dModel) {
    throw new Error("未配置 REPLICATE_CONTROLNET_MODEL / REPLICATE_DEPTH_MODEL");
  }

  // 1) 先跑深度估计
  const depthModelId = (dVersion
    ? (`${dModel}:${dVersion}` as `${string}/${string}:${string}`)
    : (dModel as `${string}/${string}`));
  const depthOutput: any = await replicate.run(depthModelId, {
    input: { image: initImageUrl },
  });
  const depthImageUrl = Array.isArray(depthOutput) ? depthOutput[0] : depthOutput;
  if (!depthImageUrl) throw new Error("深度估计无输出");

  // 2) ControlNet-Depth 生成（键名根据常见约定，具体以所选模型为准）
  const payload: Record<string, any> = {
    prompt: input.prompt,
    control_image: depthImageUrl,
    // 常见键名：image/init_image + strength
    image: initImageUrl,
    strength: input.strength ?? 0.6,
  };
  if (input.negativePrompt) payload["negative_prompt"] = input.negativePrompt;
  if (input.seed != null) payload["seed"] = input.seed;
  if (styleImageUrl) payload["style_image"] = styleImageUrl; // 若模型支持 IP-Adapter 风格图

  const cnetModelId = (cVersion
    ? (`${cModel}:${cVersion}` as `${string}/${string}:${string}`)
    : (cModel as `${string}/${string}`));
  const output = await replicate.run(cnetModelId, {
    input: payload,
  });
  const images = Array.isArray(output) ? output : [output];
  return { images, meta: { depthImageUrl } };
}

export async function generateWithReplicate(input: GenerateInput): Promise<GenerateResult> {
  ensureEnv();

  const photoAbs = path.resolve(input.photoPath);
  if (!fs.existsSync(photoAbs)) {
    throw new Error("现场照片不存在：" + photoAbs);
  }

  const initImage = await uploadLocalFile(photoAbs);
  const refImage = input.refPath ? await uploadLocalFile(path.resolve(input.refPath)) : undefined;

  // 优先走 ControlNet-Depth + style_image（若配置了相关模型）
  if (process.env.REPLICATE_CONTROLNET_MODEL && process.env.REPLICATE_DEPTH_MODEL) {
    try {
      return await tryGenerateWithControlnetDepth(input, initImage, refImage);
    } catch (e) {
      // 降级到通用 img2img
      console.warn("ControlNet-Depth 生成失败，降级到通用 img2img：", e);
    }
  }

  // 通用 img2img（单模型）
  const model = process.env.REPLICATE_MODEL!;
  const version = process.env.REPLICATE_VERSION;
  const payload: Record<string, any> = {
    prompt: input.prompt,
    image: initImage,
    strength: input.strength ?? 0.6,
  };
  if (input.negativePrompt) payload["negative_prompt"] = input.negativePrompt;
  if (input.seed != null) payload["seed"] = input.seed;
  if (refImage) payload["style_image"] = refImage;

  const modelId = (version
    ? (`${model}:${version}` as `${string}/${string}:${string}`)
    : (model as `${string}/${string}`));
  const output = await replicate.run(modelId, { input: payload });
  const images = Array.isArray(output) ? output : [output];
  return { images };
}
