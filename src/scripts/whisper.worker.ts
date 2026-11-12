/// <reference lib="webworker" />
// Whisper modelini ayrı bir thread'de çalıştırır, böylece sayfa donmaz.
import { pipeline, WhisperTextStreamer, env } from '@huggingface/transformers';

env.allowLocalModels = false; // modeller Hugging Face CDN'den gelir, tarayıcı cache'ine yazılır

type Req = {
  type: 'transcribe';
  audio: Float32Array;
  duration: number;
  model: string;
  device: 'webgpu' | 'wasm';
  dtype: Record<string, string> | string;
  language: string | null;
  task: 'transcribe' | 'translate';
};

const post = (msg: unknown) => (self as unknown as Worker).postMessage(msg);

let asr: any = null;
let loadedKey = '';

async function getPipeline(req: Req) {
  const key = `${req.model}|${req.device}|${JSON.stringify(req.dtype)}`;
  if (asr && loadedKey === key) return asr;
  if (asr?.dispose) await asr.dispose();
  asr = null;
  post({ type: 'status', text: 'Downloading model (only the first time)…' });
  asr = await pipeline('automatic-speech-recognition', req.model, {
    device: req.device,
    dtype: req.dtype as any,
    progress_callback: (p: any) => {
      if (p.status === 'progress_total') {
        post({ type: 'load', progress: p.progress, loaded: p.loaded, total: p.total });
      }
    },
  });
  loadedKey = key;
  return asr;
}

self.onmessage = async (e: MessageEvent<Req>) => {
  const req = e.data;
  if (req.type !== 'transcribe') return;
  try {
    const transcriber = await getPipeline(req);
    post({ type: 'status', text: 'Transcribing…' });

    const CHUNK = 30;
    const STRIDE = 5;
    const step = CHUNK - 2 * STRIDE;
    const totalWindows = Math.max(1, Math.ceil(Math.max(0, req.duration - CHUNK) / step) + 1);
    let doneWindows = 0;

    const streamer = new WhisperTextStreamer(transcriber.tokenizer, {
      callback_function: (text: string) => post({ type: 'partial', text }),
      on_finalize: () => {
        doneWindows++;
        post({ type: 'progress', progress: Math.min(99, (doneWindows / totalWindows) * 100) });
        post({ type: 'partial', text: '\n' });
      },
    });

    const output = await transcriber(req.audio, {
      chunk_length_s: CHUNK,
      stride_length_s: STRIDE,
      return_timestamps: true,
      language: req.language,
      task: req.task,
      streamer,
    });

    post({ type: 'done', text: output.text, chunks: output.chunks ?? [] });
  } catch (err: any) {
    post({ type: 'error', message: err?.message ?? String(err) });
  }
};
