// 中文注释：应用运行时配置（可由环境变量覆盖）

export const config = {
  // 生成任务：每次消耗积分（默认 1）
  creditCostPerRender: Number(process.env.CREDIT_COST_PER_RENDER || 1),
  // 是否强制检查订阅/积分
  paywallEnforce: String(process.env.PAYWALL_ENFORCE || "false").toLowerCase() === "true",
  // 上传限制（开发阶段放宽）
  upload: {
    maxBytes: Number(process.env.UPLOAD_MAX_BYTES || 10 * 1024 * 1024), // 10MB
    allowed: (process.env.UPLOAD_ALLOWED || "image/jpeg,image/png,image/webp").split(","),
  },
  // 若生成服务未配置，是否使用本地占位回退（返回原图），便于演示不中断
  fakeGenerationFallback: String(process.env.GENERATION_FAKE_FALLBACK || "true").toLowerCase() === "true",
};
