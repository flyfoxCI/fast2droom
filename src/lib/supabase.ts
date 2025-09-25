// 中文注释：Supabase JS 客户端（参考官方文档 https://supabase.com/docs/reference/javascript/start）
import { createClient } from '@supabase/supabase-js'

export const supabase = (() => {
  const url = process.env.SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY;
  if (!url || !anon) {
    // 非强依赖：未配置时仅返回占位，避免构建失败
    return null as unknown as ReturnType<typeof createClient>;
  }
  return createClient(url, anon);
})();

export const hasSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
