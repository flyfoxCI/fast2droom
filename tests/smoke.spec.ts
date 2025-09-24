import { test, expect } from '@playwright/test';

test('home zh loads', async ({ page }) => {
  await page.goto('/zh');
  await expect(page.getByText('面向非设计师的室内设计助手')).toBeVisible();
});

test('design page loads', async ({ page }) => {
  await page.goto('/zh/design');
  await expect(page.getByText('生成装修效果图（MVP）')).toBeVisible();
});

test('vr page loads', async ({ page }) => {
  await page.goto('/zh/vr');
  await expect(page.getByText('嵌入 RealSee/贝壳 VR 链接')).toBeVisible();
});

test('billing page loads', async ({ page }) => {
  await page.goto('/zh/billing');
  await expect(page.getByText('订阅与积分')).toBeVisible();
});

