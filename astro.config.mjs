import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdir, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { SITE } from './src/config.ts';

// transformers.js ONNX runtime WASM'ını zaten jsDelivr CDN'den yüklüyor.
// Vite'ın dist'e kopyaladığı ~26 MB'lık kopya kullanılmıyor ve Cloudflare Pages'in
// 25 MiB dosya limitini aşıyor, o yüzden build sonunda siliyoruz.
const dropUnusedWasm = {
  name: 'drop-unused-ort-wasm',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const assets = fileURLToPath(new URL('_astro/', dir));
      for (const f of await readdir(assets)) {
        if (f.startsWith('ort-wasm') && f.endsWith('.wasm')) {
          await unlink(assets + f);
          logger.info(`removed unused ${f}`);
        }
      }
    },
  },
};

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'always',
  integrations: [sitemap(), dropUnusedWasm],
  vite: {
    worker: { format: 'es' },
    optimizeDeps: { exclude: ['@huggingface/transformers'] },
  },
});
