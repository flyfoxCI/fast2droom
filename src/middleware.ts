// 中文注释：next-intl 中间件，用于自动检测与路由 locale
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['zh', 'en'],
  defaultLocale: 'zh'
});

export const config = {
  matcher: [
    '/',
    '/(zh|en)/:path*'
  ]
};

