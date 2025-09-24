# 推荐模型清单（Replicate）

说明：具体可用模型与版本以 Replicate 平台为准，以下仅为常见选择方向与示例命名，实际填入 `.env` 前请在 Replicate 搜索并确认模型 slug 与版本。

## 深度估计（`REPLICATE_DEPTH_MODEL`）
- Depth Anything（示例：`depth-anything` 系列）
- MiDaS（示例：`midas` 系列）

## ControlNet-Depth（`REPLICATE_CONTROLNET_MODEL`）
- SDXL ControlNet-Depth（示例：`sdxl-controlnet-depth` 系列，键常见：`prompt, image/init_image, control_image, style_image, strength`）

## 通用 img2img 回退（`REPLICATE_MODEL`）
- FLUX 1.1 Pro（`black-forest-labs/flux-1.1-pro`）
- SDXL img2img（相应的 img2img 变体）

## 参数建议
- `strength`：0.5~0.7（越高风格越强，但可能破坏结构）
- `negative_prompt`：移除不合理材质/畸形（如：低质、畸形、重复、文字、logo 等）
- `seed`：固定可复现

