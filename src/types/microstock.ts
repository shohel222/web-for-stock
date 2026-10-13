export type ActiveView = 'portal' | 'general' | 'png' | 'animation';

export type GeneralCategory = 'all' | 'vector' | 'photo' | 'template' | 'illustration';

export interface GeneralAsset {
  id: string;
  title: string;
  category: 'vector' | 'photo' | 'template' | 'illustration';
  formats: ('EPS' | 'AI' | 'JPG' | 'SVG' | 'PSD')[];
  resolution: string;
  aspectRatio: string;
  keywords: string[];
  downloads: number;
  rating: number;
  license: 'Commercial' | 'Editorial' | 'Extended';
  author: string;
  image: string;
  fileSize: string;
  colorPalette: string[];
}

export interface PngAsset {
  id: string;
  title: string;
  category: '3d-glass' | 'badges' | 'nature' | 'shapes' | 'icons';
  resolution: string;
  dimensions: string;
  keywords: string[];
  downloads: number;
  dpi: number;
  image: string;
  fileSize: string;
  hasAlphaChannel: boolean;
  author: string;
}

export interface AnimationAsset {
  id: string;
  title: string;
  category: 'loop' | 'ui' | 'particles' | 'typography' | 'badges';
  fps: number;
  duration: number; // in seconds
  dimensions: string;
  formats: ('LOTTIE' | 'MP4' | 'WEBM' | 'GIF' | 'SVG')[];
  previewImage: string;
  isSeamlessLoop: boolean;
  downloads: number;
  fileSize: string;
  author: string;
  animationType: 'wave' | 'infinity' | 'pulse' | 'orbit' | 'sparkle';
}
