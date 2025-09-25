import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  const lc = (locale === 'en' ? 'en' : 'zh');
  const messages = (await import(`../src/messages/${lc}.json`)).default;
  return {messages};
});

