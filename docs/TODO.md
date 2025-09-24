# 模块 TODO（按优先）

## 生成（ControlNet-Depth + style_image）
- [x] 生成 API（保存上传、建任务、调用 provider、更新结果）
- [x] React 页面（上传现场图/参考图、输入提示，轮询状态显示）
- [x] Provider 适配器：深度→ControlNet，降级通用模型
- [ ] 增加高级参数（负面提示、强度、seed 已支持；下一步补 UI）
- [ ] 结果管理：保存到 `asset` 表并与 `project/room` 关联

## 支付/订阅（creem.io）
- [x] checkout API + 封装
- [x] webhook 路由（签名校验留位）
- [ ] 签名校验实现（需 `CREEM_WEBHOOK_SECRET`）
- [ ] 事件落库：订阅状态更新、积分入账
- [ ] 前端：购买跳转/回跳页面状态（success/cancel）

## 积分
- [ ] 生成前扣费：`PAYWALL_ENFORCE=true` 时检查订阅/积分
- [ ] 扣费策略：失败回滚 or 成功后扣费（默认成功后扣费）
- [ ] 可视化：显示当前积分、订阅状态

## VR 嵌入
- [x] 粘贴 RealSee 链接 iframe 嵌入
- [ ] 保存至数据库并归档到项目

## UI（shadcn）
- [ ] Button/Input/Textarea/Card/Label 组件
- [ ] 导航条 + 布局
- [ ] 主题/暗色

## 仪表盘
- [ ] `/[locale]/dashboard` 列表展示最近任务（状态、结果图）
- [ ] 任务筛选与查看详情

## 文档与配置
- [x] README 增补
- [x] .env.example 补全
- [x] 产品/技术计划（本文件 + PLAN.md）
- [ ] 推荐模型清单（建议填入 `.env` 的示例）

