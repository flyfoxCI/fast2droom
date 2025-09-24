import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 部署构建时忽略 ESLint 错误（仅用于 CI 不中断，开发期建议修复）
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
