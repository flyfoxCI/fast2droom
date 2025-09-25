// next-intl 配置：按请求 locale 加载对应消息
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // 兜底到 zh
  const lc = (locale === 'en' ? 'en' : 'zh');
  const messages = (await import(`../messages/${lc}.json`)).default;
  return {messages};
});

