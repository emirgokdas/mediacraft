# MediaCraft (getmediacraft.com)

Tarayıcıda çalışan, dosya yüklemeyen ücretsiz araç sitesi. İlk araç: Whisper ile ses/video → metin/SRT/VTT.

## Çalıştırma

```bash
npm install          # .npmrc'deki ignore-scripts, onnxruntime-node'un gereksiz indirmesini atlar
npm run dev          # http://localhost:4321
npm run build        # çıktı: dist/
```

## Domain alınca

1. `src/config.ts` → `name`, `url`, `contactEmail` alanlarını güncelle.
2. Cloudflare Pages: GitHub reposunu bağla, build komutu `npm run build`, output `dist`.
3. Google Search Console'a domaini ekle, `sitemap-index.xml` gönder.

## AdSense

1. Siteyi yayına al, birkaç hafta içerik/trafik biriksin, sonra başvur.
2. Onay gelince `src/config.ts` → `adsenseClient: 'ca-pub-…'` ve `adSlots` ID'lerini gir.
   - Reklam script'i, reklam alanları ve `ads.txt` otomatik aktif olur.
3. AdSense → Privacy & messaging bölümünden AB/UK için Google'ın consent (CMP) mesajını aç.
   Gizlilik politikası bunu zaten anlatıyor.

Dev modunda reklam alanları kesikli kutu olarak görünür; production'da ID yoksa hiç render edilmez.

## Yapı

```
src/config.ts                  site adı, domain, AdSense ID'leri
src/data/tools.ts              ana sayfadaki araç kartları (yeni araç = yeni satır)
src/layouts/ToolPage.astro     araç sayfası şablonu (SEO, schema.org, FAQ, reklam yerleri)
src/components/Transcriber.astro  Whisper arayüzü (dosya, model, dil, TXT/SRT/VTT)
src/scripts/whisper.worker.ts  modeli Web Worker'da çalıştırır
src/pages/                     audio-to-text, srt-subtitle-generator, video-to-text + yasal sayfalar
```

Aynı araç 3 farklı arama niyetine 3 ayrı sayfa ile hedefleniyor (farklı başlık, metin, FAQ, varsayılan format).
Yeni bir varyasyon eklemek için `src/pages/` altına benzer bir sayfa kopyala ve içeriği o aramaya göre yaz.

## Teknik notlar

- **WebGPU** varsa (Chrome/Edge masaüstü) GPU'da çalışır: encoder fp32, decoder q4.
  Large v3 Turbo sadece `shader-f16` destekleyen GPU'larda açılır (encoder fp16).
- **WebGPU yoksa** WASM (CPU) + q8. COOP/COEP header'ları **bilerek eklenmedi**: cross-origin isolation
  çok thread'li WASM'ı hızlandırır ama AdSense iframe'lerini bozar.
- Modeller Hugging Face'ten ilk kullanımda iner ve tarayıcı cache'inde kalır. ONNX runtime WASM'ı jsDelivr'den gelir;
  Vite'ın kopyaladığı ~26 MB'lık kullanılmayan dosya build sonunda silinir (Cloudflare Pages'in 25 MiB limiti).
