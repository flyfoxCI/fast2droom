// 中文注释：统一的生成入口，根据环境变量选择 Provider
import { GenerateInput, GenerateResult } from "./types";
import { generateWithReplicate } from "./providers/replicate";
import { generateWithOpenRouter } from "./providers/openrouter";

export async function generate(input: GenerateInput): Promise<GenerateResult> {
  const provider = (process.env.GEN_PROVIDER || "OPENROUTER").toUpperCase();

  if (provider === "OPENROUTER" && process.env.OPENROUTER_API_KEY) {
    try {
      return await generateWithOpenRouter(input);
    } catch (e) {
      console.warn("OpenRouter 生成失败，降级到 Replicate：", e);
    }
  }

  if (process.env.REPLICATE_API_TOKEN) {
    return await generateWithReplicate(input);
  }

  throw new Error("未配置生成服务（OPENROUTER_API_KEY 或 REPLICATE_API_TOKEN）");
}

