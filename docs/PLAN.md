# AI Room Helper — 产品与技术计划（MVP→Beta）

目标：在 6 小时内完成一个可交付版本，支持“生成（ControlNet-Depth + style_image 默认）→ 订阅（creem）→ 积分→ VR 嵌入”的核心闭环，并具备基础的仪表盘与文档。

## 里程碑

1. 规划与TODO落盘（本文件 + docs/TODO.md）
2. 生成：ControlNet-Depth + style_image 默认链路，回退至通用 img2img
3. 计费：creem checkout API + webhook 占位与事件处理框架
4. 积分：生成任务扣费（可开关），不足跳转购买
5. VR：RealSee 链接嵌入，支持记忆
6. UI：shadcn 样式组件 + 导航 + 仪表盘（任务结果总览）
7. 文档：安装、配置、运行、验证说明

## 设计要点

- 生成链路：
  - 深度估计（`REPLICATE_DEPTH_MODEL`）→ ControlNet-Depth（`REPLICATE_CONTROLNET_MODEL`，含 `style_image`）
  - 失败或未配置则降级至单模型 img2img（`REPLICATE_MODEL`）
  - 一切模型参数通过 env 控制，代码适配器隔离
- 支付/订阅：
  - creem.io：创建 checkout session，webhook 事件框架（签名验证函数留位）
  - 订阅状态/积分入账更新数据库
- 积分：
  - 每次生成消耗 `CREDIT_COST_PER_RENDER`（默认 1）
  - 可通过 `PAYWALL_ENFORCE` 开关控制强制扣费/放行（默认开发放行）
- VR：
  - 直接 iframe 嵌入 RealSee 分享链接（快速交付），保存最近一次
- UI：
  - 基础导航（首页、生成、VR、计费、仪表盘、登录）
  - shadcn 风格 Button/Input/Textarea/Card/Label
- 安全：
  - 上传白名单、容量限制（后续接云存储）
  - webhook 签名验证（待 key）

## 验证方案

- 本地：`.env` 仅配 Replicate；访问 `/zh/design` 生成成功 → `/zh/billing` 按钮可出链接（无key会报错，流程不崩）
- 模型：未配 ControlNet 时，降级为通用模型也可产出
- VR：粘贴 RealSee 链接可预览
- 仪表盘：`/zh/dashboard` 可看到任务列表与结果

