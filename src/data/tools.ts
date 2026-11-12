// Ana sayfadaki araç listesi. Yeni araç ekledikçe buraya bir satır ekle.
export interface ToolCard {
  title: string;
  description: string;
  href?: string; // yoksa "Coming soon" gösterilir
  icon: string;
}

export const TOOLS: ToolCard[] = [
  {
    title: 'Audio to Text',
    description: 'Transcribe audio and video files with Whisper AI. Free, unlimited, no upload.',
    href: '/audio-to-text/',
    icon: '🎙️',
  },
  {
    title: 'SRT Subtitle Generator',
    description: 'Create SRT or VTT subtitles for any video automatically.',
    href: '/srt-subtitle-generator/',
    icon: '💬',
  },
  {
    title: 'Video to Text',
    description: 'Turn MP4, MOV and WebM videos into a text transcript.',
    href: '/video-to-text/',
    icon: '🎬',
  },
  {
    title: 'Background Remover',
    description: 'Remove image backgrounds in full resolution, right in your browser.',
    icon: '🖼️',
  },
  {
    title: 'Photo Metadata Remover',
    description: 'Strip EXIF, GPS location and hidden data from your photos.',
    icon: '📍',
  },
  {
    title: 'HEIC to JPG',
    description: 'Convert iPhone photos to JPG in bulk without uploading them.',
    icon: '📱',
  },
];
