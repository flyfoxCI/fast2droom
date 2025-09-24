AI Room Helper（MVP）

面向非设计师的室内设计助手。技术栈：Next.js(App Router) + Drizzle + Supabase Postgres + better-auth + next-intl + Tailwind + three.js（R3F）。

快速开始

- Node 18+
- 数据库：Supabase PostgreSQL（也可使用任意 PostgreSQL）

命令：

    npm install
    # 首次生成迁移（本地不需连库）
    npm run db:generate
    # 连接 Supabase 并执行迁移（需在 .env 设置 SUPABASE_DB_URL 或 DATABASE_URL）
    npm run db:migrate
    npm run dev

启动后访问：
- 主页（含多语言路由）`http://localhost:3000/`（会被中间件重定向到 `zh/`）
- 登录页 `/{locale}/auth/sign-in`
- 3D 预览 `/{locale}/viewer`
- 生成页面 `/{locale}/design`（上传现场照片与参考图，调用可配置 Replicate 模型生成）
- VR 嵌入 `/{locale}/vr`（粘贴 RealSee/贝壳分享链接直接嵌入）
- 订阅/积分 `/{locale}/billing`（配置 creem 后可直达支付页）

模块说明

- 鉴权：better-auth + drizzle 适配，API 路由 `src/app/api/auth/[...all]/route.ts`
- 数据库：drizzle-orm（PostgreSQL / Supabase），表定义在 `src/db/schema.ts`
- 多语言：next-intl，中间件 `src/middleware.ts`，消息文件 `src/messages/*.json`
- 三维预览：@react-three/fiber + three，页面 `src/app/[locale]/viewer/page.tsx`
- 计费抽象：`src/lib/billing.ts`（占位，待确认实际支付服务商 creem/stripe/paddle）

下一步路线（建议按阶段推进）

1. 核心基建完善
   - [ ] 确认支付服务商（“creem” 的准确名称/SDK/文档）。
   - [ ] 对接支付创建订阅（月/年）与购买积分，落库并实现 Webhook。
   - [ ] UI 体系：接入 shadcn/ui 组件库，统一设计风格与暗色主题。
2. 2D 设计生成（MVP）
   - [ ] 用户上传現场照片 + 参考风格图，调用外部生成服务（如 Replicate/Stable Diffusion + IP-Adapter/Inpaint）。
   - [ ] 颜色/尺寸校验：集成单目深度估计（MiDaS）与色板约束，输出可比对的前后图。
   - [ ] 任务队列与进度轮询：`job` 表记录，前端提示状态。
3. 360/VR 场景
   - [ ] 上传 equirectangular 全景或分片，贴图到球体/立方体进行预览。
   - [ ] 基于同场景生成“契合 VR 的效果图”并无缝过渡预览。
4. 专业设计图/导出
   - [ ] 规范中间格式（glTF/GLB + DXF），并研究“三维家”可导入格式与限制（待沟通）。
   - [ ] 从尺寸参数快速生成可编辑模型/平面图，支持二次调整。

环境变量（示例）

    # 数据库（Supabase PostgreSQL 连接串，至少设置其一）
    SUPABASE_DB_URL=postgresql://user:password@host:port/dbname?sslmode=require
    DATABASE_URL=
    APP_BASE_URL=http://localhost:3000
    
    # 生成（Replicate）
    REPLICATE_API_TOKEN=...
    REPLICATE_MODEL=black-forest-labs/flux-1.1-pro
    REPLICATE_VERSION=

    # ControlNet-Depth（推荐）
    REPLICATE_DEPTH_MODEL=   # 深度估计，如 depth-anything / midas
    REPLICATE_DEPTH_VERSION=
    REPLICATE_CONTROLNET_MODEL=  # SDXL ControlNet-Depth 模型
    REPLICATE_CONTROLNET_VERSION=

    # 支付（creem.io）
    CREEM_API_KEY=...
    CREEM_WEBHOOK_SECRET=...
    CREEM_MONTHLY_PRICE_ID=...
    CREEM_YEARLY_PRICE_ID=...
    CREEM_CREDITS_SKU_ID=...

    # 积分/计费控制
    CREDIT_COST_PER_RENDER=1
    PAYWALL_ENFORCE=false

    # 上传限制
    UPLOAD_MAX_BYTES=10485760
    UPLOAD_ALLOWED=image/jpeg,image/png,image/webp

    # 回退策略：未配置生成服务时使用原图占位，不中断体验
    GENERATION_FAKE_FALLBACK=true

目录结构（关键）

- `src/db/`：Drizzle 实例与表（PostgreSQL）
- `src/lib/auth.ts`：better-auth 实例
- `src/app/api/auth/[...all]/route.ts`：鉴权 API
- `src/app/[locale]/*`：多语言路由下的页面
- `src/messages/*`：i18n 文本

——

若需要我继续：
- 接入支付并打通订阅/积分
- 加入 shadcn/ui 并搭建基础导航与表单组件
- 打通首个“上传一张照片 → 生成风格效果图”的端到端流程

欢迎随时提出偏好与约束（支付平台、导出格式、目标市场语言等）。
