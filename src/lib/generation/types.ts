// 中文注释：生成服务的通用类型定义

export type GenerateInput = {
  prompt: string;
  // 本地存储的文件路径（public 下），供上传到生成服务
  photoPath: string; // 用户现场照片
  refPath?: string;  // 参考风格图（可选）
  negativePrompt?: string;
  strength?: number; // img2img 强度 0-1
  seed?: number;
};

export type GenerateResult = {
  images: string[]; // 输出图片的可访问 URL（最终存到 public/uploads/* 或外链）
  meta?: Record<string, any>;
};

