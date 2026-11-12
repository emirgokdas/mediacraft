import { SITE } from '../config';
// AdSense kimliği config.ts'e girilince ads.txt otomatik doğru içerikle üretilir.
export const GET = () => {
  const pub = SITE.adsenseClient.replace(/^ca-/, '');
  const body = pub ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n` : '# AdSense publisher ID not set yet\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
