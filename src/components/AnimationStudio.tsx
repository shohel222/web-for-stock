import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Play, Pause, RotateCcw, Download, Sparkles, Shuffle, 
  Maximize2, Sliders, Palette, Layers, Upload, Clock, Eye, Film, Check, Type,
  Move, Shield, Compass, Sparkle, Sun
} from 'lucide-react';

export interface AnimPreset {
  id: string;
  ratio: string;
  label: string;
  width: number;
  height: number;
}

export const ANIM_PRESETS: AnimPreset[] = [
  { id: '16-9-4k', ratio: '16:9', label: '16:9 (3840 × 2160 · 4K UHD)', width: 3840, height: 2160 },
  { id: '1-1-4k', ratio: '1:1', label: '1:1 (3840 × 3840 · 4K Square)', width: 3840, height: 3840 },
  { id: '9-16-4k', ratio: '9:16', label: '9:16 (2160 × 3840 · 4K Story)', width: 2160, height: 3840 },
  { id: '4-3-4k', ratio: '4:3', label: '4:3 (3840 × 2880 · 4K Screen)', width: 3840, height: 2880 },
  { id: '3-4-4k', ratio: '3:4', label: '3:4 (2880 × 3840 · 4K Portrait)', width: 2880, height: 3840 },
];

export interface AnimStyleItem {
  id: string;
  name: string;
  category: 'Smoke & Fog' | 'Text Animations' | 'Text Inside Animation' | 'Text Outside Animation' | 'Abstract Shapes' | 'Animated Gradients' | 'Timers & Countdown' | 'Clocks & Timepieces' | 'Radar & Scanners' | 'Energy & Particles';
  defaultBg: string;
  defaultPrimary: string;
  defaultSecondary: string;
  description: string;
}

// 52 distinct animation styles (keeping #08 and #48 strictly as requested!)
export const ANIM_STYLES: AnimStyleItem[] = [
  // 1. Smoke (ধোঁয়া) & Fog (কুয়াশা)
  { id: 'thick-billowing-smoke', name: '01. Thick Billowing Smoke Plumes', category: 'Smoke & Fog', defaultBg: '#090d16', defaultPrimary: '#e2e8f0', defaultSecondary: '#94a3b8', description: 'Heavy curling organic smoke billows rising with turbulent multi-layer density' },
  { id: 'incense-stream-smoke', name: '02. Silky Rising Incense Smoke Strand', category: 'Smoke & Fog', defaultBg: '#121218', defaultPrimary: '#f8fafc', defaultSecondary: '#cbd5e1', description: 'Delicate laminar-to-turbulent incense smoke stream dancing upward' },
  { id: 'smoke-grenade-blast', name: '03. Radial Smoke Grenade Blast Ring', category: 'Smoke & Fog', defaultBg: '#0b0f19', defaultPrimary: '#cbd5e1', defaultSecondary: '#64748b', description: 'Expanding high-velocity smoke shockwave dispersing outward' },
  { id: 'ground-mist-rolling', name: '04. Rolling Dense Atmospheric Ground Fog', category: 'Smoke & Fog', defaultBg: '#070a12', defaultPrimary: '#94a3b8', defaultSecondary: '#64748b', description: 'Heavy creeping fog layer undulating across the bottom half' },
  { id: 'spectral-forest-fog', name: '05. Spectral Multi-Layer Horizontal Fog Bands', category: 'Smoke & Fog', defaultBg: '#080d1a', defaultPrimary: '#cbd5e1', defaultSecondary: '#475569', description: 'Sliding horizontal fog sheets with variable density & depth' },
  { id: 'volumetric-cloud-fog', name: '06. Volumetric Cloud Vapor Clusters', category: 'Smoke & Fog', defaultBg: '#060a14', defaultPrimary: '#e2e8f0', defaultSecondary: '#94a3b8', description: '3D puffy volumetric fog clusters drifting with atmospheric soft lighting' },

  // 2. Text Animations (টেক্সট অ্যানিমেশন)
  { id: 'kinetic-neon-glitch-text', name: '07. Kinetic Cyber Neon Glitch Text', category: 'Text Animations', defaultBg: '#030712', defaultPrimary: '#38bdf8', defaultSecondary: '#ec4899', description: 'Electric neon typography with chromatic pulse, flicker, and laser edge' },
  { id: 'digital-hud-timer', name: '08. Millisecond Digital Cyber Clock', category: 'Clocks & Timepieces', defaultBg: '#030712', defaultPrimary: '#38bdf8', defaultSecondary: '#0284c7', description: 'Glow numeric stopwatch with synchronized rotating telemetry (KEPT)' },
  { id: 'typewriter-matrix-text', name: '09. Retro Terminal Typewriter with Blinking Cursor', category: 'Text Animations', defaultBg: '#021008', defaultPrimary: '#22c55e', defaultSecondary: '#15803d', description: 'Rhythmic typing text animation with glowing neon box terminal cursor' },
  { id: 'split-kinetic-typography', name: '10. Kinetic Stretching Typographic Rhythms', category: 'Text Animations', defaultBg: '#0a0a0f', defaultPrimary: '#f8fafc', defaultSecondary: '#38bdf8', description: 'Bold contemporary kinetic typography sliding & scaling in unison' },

  // 3. Text Inside Animation (টেক্সটের ভিতরে অ্যানিমেশন - Masked Inside Letters)
  { id: 'text-inside-fire-magma', name: '11. Molten Fire & Magma Flow Inside Text', category: 'Text Inside Animation', defaultBg: '#050202', defaultPrimary: '#f97316', defaultSecondary: '#ef4444', description: 'Churning burning liquid fire and embers circulating inside the letterforms' },
  { id: 'text-inside-ocean-waves', name: '12. Rolling Ocean Waves & Bubbles Inside Text', category: 'Text Inside Animation', defaultBg: '#020b14', defaultPrimary: '#0ea5e9', defaultSecondary: '#0284c7', description: 'Undulating deep blue ocean water ripples washing inside the text characters' },
  { id: 'text-inside-aurora-borealis', name: '13. Aurora Borealis Chromatic Flow Inside Text', category: 'Text Inside Animation', defaultBg: '#030712', defaultPrimary: '#10b981', defaultSecondary: '#ec4899', description: 'Luminescent Northern Lights spectrum curtains flowing through letter bodies' },
  { id: 'text-inside-cosmic-galaxy', name: '14. Starlight Nebula & Galaxy Dust Inside Text', category: 'Text Inside Animation', defaultBg: '#02020a', defaultPrimary: '#8b5cf6', defaultSecondary: '#38bdf8', description: 'Drifting starfield cosmos and glowing galactic dust swirling inside letters' },

  // 4. Text Outside Animation (টেক্সটের বাইরে অ্যানিমেশন - Radiating Around Letters)
  { id: 'text-outside-electric-plasma', name: '15. High-Voltage Electric Plasma Arcs Around Text', category: 'Text Outside Animation', defaultBg: '#030712', defaultPrimary: '#38bdf8', defaultSecondary: '#818cf8', description: 'Bold centered text radiating branching electric discharge bolts from borders' },
  { id: 'text-outside-shockwave-burst', name: '16. Explosive Radial Shockwave Rings Around Text', category: 'Text Outside Animation', defaultBg: '#090d16', defaultPrimary: '#a855f7', defaultSecondary: '#ec4899', description: 'Circular energy blast rings expanding outward from the text perimeter' },
  { id: 'text-outside-orbit-neon-rings', name: '17. Luminous Orbiting Photon Rings Around Text', category: 'Text Outside Animation', defaultBg: '#020617', defaultPrimary: '#06b6d4', defaultSecondary: '#ec4899', description: 'Glowing orbital light filaments revolving in 3D around the typography' },
  { id: 'text-outside-heavy-smoke-aura', name: '18. Billowing Smoke Plumes Pouring from Text', category: 'Text Outside Animation', defaultBg: '#0a0a14', defaultPrimary: '#cbd5e1', defaultSecondary: '#64748b', description: 'Volumetric atmospheric smoke clouds rising from behind the text edges' },

  // 5. Abstract Shape Backgrounds (অ্যাবস্ট্রাক্ট শেপ ব্যাকগ্রাউন্ড)
  { id: 'bauhaus-memphis-morph', name: '19. Bauhaus & Memphis Geometric Shape Morph', category: 'Abstract Shapes', defaultBg: '#0f172a', defaultPrimary: '#f43f5e', defaultSecondary: '#38bdf8', description: 'Dynamic circles, squiggles, triangles and pill capsules floating and morphing' },
  { id: 'floating-3d-polyhedra', name: '20. Floating 3D Prismatic Crystal Polyhedrons', category: 'Abstract Shapes', defaultBg: '#030712', defaultPrimary: '#38bdf8', defaultSecondary: '#818cf8', description: 'Faceted glass geometric solids rotating with dynamic specular highlights' },
  { id: 'organic-blob-metaballs', name: '21. Viscous Liquid Metaball Blob Fusion', category: 'Abstract Shapes', defaultBg: '#020617', defaultPrimary: '#ec4899', defaultSecondary: '#8b5cf6', description: 'Smooth gelatinous fluid drops merging, stretching and separating organically' },
  { id: 'generative-math-ribbons', name: '22. Generative 3D Undulating Mathematical Ribbons', category: 'Abstract Shapes', defaultBg: '#090d16', defaultPrimary: '#06b6d4', defaultSecondary: '#3b82f6', description: 'Complex multi-frequency geometric wave ribbons undulating in 3D space' },
  { id: 'brutalist-block-matrix', name: '23. Isometric Architectural Blocks Wave Matrix', category: 'Abstract Shapes', defaultBg: '#18181b', defaultPrimary: '#a1a1aa', defaultSecondary: '#f43f5e', description: 'Grid of 3D brutalist pillars rising and descending rhythmically' },

  // 6. Animated Gradients (গ্রেডিয়েন্ট কালার বানাই সেটার অ্যানিমেশন)
  { id: 'liquid-mesh-aurora-gradient', name: '24. Fluid Liquid Mesh Aurora Gradient Flow', category: 'Animated Gradients', defaultBg: '#0f172a', defaultPrimary: '#10b981', defaultSecondary: '#6366f1', description: 'Multi-node moving color gradient smoothly blending and circulating' },
  { id: 'sunset-chromatic-wave', name: '25. Sunset Horizon Chromatic Gradient Waves', category: 'Animated Gradients', defaultBg: '#180408', defaultPrimary: '#f43f5e', defaultSecondary: '#fb923c', description: 'Deep crimson, vibrant orange and royal violet flowing in glowing harmony' },
  { id: 'holographic-foil-sheen', name: '26. Prismatic Iridescent Holographic Foil Sheen', category: 'Animated Gradients', defaultBg: '#030712', defaultPrimary: '#38bdf8', defaultSecondary: '#f472b6', description: 'Diagonal rainbow prism shimmer sweeping with metallic luster' },
  { id: 'cyberpunk-duotone-vortex', name: '27. Cyberpunk Cyan & Magenta Vortex Duotone', category: 'Animated Gradients', defaultBg: '#05021a', defaultPrimary: '#06b6d4', defaultSecondary: '#d946ef', description: 'High-contrast neon cyan and hot pink spiraling in deep contrast' },
  { id: 'noir-monochrome-shadow-pulse', name: '28. Deep Velvet Noir Monochrome Shadow Pulse', category: 'Animated Gradients', defaultBg: '#0a0a0a', defaultPrimary: '#e2e8f0', defaultSecondary: '#475569', description: 'Subtle high-luxury dark charcoal shadows undulating smoothly' },

  // 7. Timers & Countdowns (টাইমারের অ্যানিমেশন)
  { id: 'circular-arc-timer', name: '29. Precision 360° Circular Arc Countdown Gauge', category: 'Timers & Countdown', defaultBg: '#0f172a', defaultPrimary: '#ef4444', defaultSecondary: '#f97316', description: 'Smooth circular progress meter with countdown seconds and percentage' },
  { id: 'split-flap-mechanical-timer', name: '30. Split-Flap Mechanical Airport Board Countdown', category: 'Timers & Countdown', defaultBg: '#18181b', defaultPrimary: '#f8fafc', defaultSecondary: '#fbbf24', description: 'Retro mechanical split-flap tiles flipping sequentially with shadows' },
  { id: 'hourglass-sand-flow', name: '31. Kinetic Hourglass Sand Particle Stream', category: 'Timers & Countdown', defaultBg: '#1c1917', defaultPrimary: '#f59e0b', defaultSecondary: '#d97706', description: 'Gravity sand grains falling through glass neck with dynamic heap accumulation' },
  { id: 'tachometer-speed-gauge', name: '32. High-RPM Sports Car Tachometer Redline', category: 'Timers & Countdown', defaultBg: '#111827', defaultPrimary: '#ef4444', defaultSecondary: '#3b82f6', description: 'Precision dial gauge needle surging with peak warning shift-light' },
  { id: 'rocket-launch-countdown-hud', name: '33. Mission Control Rocket Launch Countdown HUD', category: 'Timers & Countdown', defaultBg: '#020617', defaultPrimary: '#38bdf8', defaultSecondary: '#22c55e', description: 'Military telemetry countdown with bracket indicators and status blinks' },

  // 8. Clocks & Timepieces (বিভিন্ন ধরনের ক্লক একেকটা স্টাইলে)
  { id: 'luxury-swiss-chronograph', name: '34. Luxury Swiss Roman Numeral Chronograph', category: 'Clocks & Timepieces', defaultBg: '#181205', defaultPrimary: '#fbbf24', defaultSecondary: '#fef08a', description: 'Gold Roman dial with moving tourbillon escapement and sweeping hands' },
  { id: 'minimalist-bauhaus-wall-clock', name: '35. Minimalist Swiss Bauhaus Wall Clock', category: 'Clocks & Timepieces', defaultBg: '#0f172a', defaultPrimary: '#f8fafc', defaultSecondary: '#ef4444', description: 'Clean monochrome dial with ticking hour marks and red sweeping second hand' },
  { id: 'cyber-holographic-hud-clock', name: '36. Cyberpunk Holographic HUD Concentric Clock', category: 'Clocks & Timepieces', defaultBg: '#030712', defaultPrimary: '#38bdf8', defaultSecondary: '#818cf8', description: 'Concentric rotating telemetry rings with digital brackets and time tags' },
  { id: 'grandfather-pendulum-clock', name: '37. Antique Brass Pendulum Grandfather Clock', category: 'Clocks & Timepieces', defaultBg: '#17120e', defaultPrimary: '#d97706', defaultSecondary: '#f59e0b', description: 'Oscillating heavy brass bob swinging smoothly with gravity drop shadow' },
  { id: 'nixie-tube-neon-clock', name: '38. Retro 1970s Nixie Tube Glass Filament Clock', category: 'Clocks & Timepieces', defaultBg: '#050201', defaultPrimary: '#f97316', defaultSecondary: '#ea580c', description: 'Glowing warm orange neon cathode numbers inside vacuum glass tubes' },
  { id: 'binary-led-matrix-clock', name: '39. Computer Science Binary LED Matrix Clock', category: 'Clocks & Timepieces', defaultBg: '#020f06', defaultPrimary: '#22c55e', defaultSecondary: '#4ade80', description: 'Glowing binary bit columns ticking in real-time hexadecimal rhythm' },

  // 9. Radar Systems & Scanners (রাডার সিস্টেম ও স্ক্যানার)
  { id: 'military-sonar-radar', name: '40. Military Sonar Green Phosphor Radar Sweep', category: 'Radar & Scanners', defaultBg: '#041c10', defaultPrimary: '#22c55e', defaultSecondary: '#ef4444', description: 'Circular rotating radar beam uncovering glowing target blips with fade trail' },
  { id: 'satellite-target-lock-radar', name: '41. Orbital Satellite Target-Lock Crosshair HUD', category: 'Radar & Scanners', defaultBg: '#030712', defaultPrimary: '#38bdf8', defaultSecondary: '#ef4444', description: 'Rotating compass coordinate rings tracking locked targets on grid' },
  { id: 'concentric-seismic-echo-radar', name: '42. Concentric Acoustic Sonar Echo Rings', category: 'Radar & Scanners', defaultBg: '#021526', defaultPrimary: '#0ea5e9', defaultSecondary: '#38bdf8', description: 'Continuous pulsating circular acoustic shockwaves rippling across depth grid' },
  { id: 'sci-fi-biometric-laser-scanner', name: '43. Sci-Fi Biometric Laser Scanner Bar', category: 'Radar & Scanners', defaultBg: '#090d16', defaultPrimary: '#06b6d4', defaultSecondary: '#3b82f6', description: 'Glowing vertical laser sweep plane analyzing target with waveform readouts' },

  // 10. Energy, Particles & Special Themes
  { id: 'tesla-plasma-sphere', name: '44. Tesla Coil High-Voltage Plasma Globe', category: 'Energy & Particles', defaultBg: '#08051a', defaultPrimary: '#c084fc', defaultSecondary: '#38bdf8', description: 'Branching plasma filaments dancing inside a transparent energy orb' },
  { id: 'matrix-digital-code-rain', name: '45. Cascading Matrix Green Digital Code Rain', category: 'Energy & Particles', defaultBg: '#021008', defaultPrimary: '#22c55e', defaultSecondary: '#16a34a', description: 'Vertical streaming green digital glyphs falling with glowing leading heads' },
  { id: 'synthwave-neon-grid-horizon', name: '46. 80s Synthwave Wireframe Horizon & Neon Sun', category: 'Energy & Particles', defaultBg: '#150024', defaultPrimary: '#d946ef', defaultSecondary: '#f43f5e', description: 'Infinite perspective road grid scrolling under glowing retro striped sun' },
  { id: 'quantum-arc-reactor-core', name: '47. Pulsing Quantum Arc Reactor Aperture Core', category: 'Energy & Particles', defaultBg: '#030712', defaultPrimary: '#06b6d4', defaultSecondary: '#38bdf8', description: 'Interlocking geometric aperture iris rotating over blinding cyan reactor' },
  { id: 'torus-knot-ribbon', name: '48. Complex Torus Knot Winding Loop', category: 'Energy & Particles', defaultBg: '#0b0c16', defaultPrimary: '#38bdf8', defaultSecondary: '#ec4899', description: 'Self-intersecting continuous ribbon revolving on 3 spatial axes (KEPT)' },
  { id: 'hyperspace-warp-tunnel', name: '49. Hyperspace Warp Speed Star Velocity Streaks', category: 'Energy & Particles', defaultBg: '#02020a', defaultPrimary: '#38bdf8', defaultSecondary: '#f8fafc', description: 'Relativistic 3D starfield stretching into infinite velocity streaks' },
  { id: 'sacred-mandala-bloom', name: '50. Sacred Geometry Kaleidoscopic Mandala Bloom', category: 'Energy & Particles', defaultBg: '#08081a', defaultPrimary: '#8b5cf6', defaultSecondary: '#f59e0b', description: 'Expanding multi-faceted symmetrical sacred polygons unfolding in harmony' },
  { id: 'audio-equalizer-spectrum', name: '51. Dynamic Graphic Audio Equalizer Spectrum', category: 'Energy & Particles', defaultBg: '#090d16', defaultPrimary: '#22c55e', defaultSecondary: '#eab308', description: 'Jumping vertical frequency histogram bars with floating peak indicators' },
  { id: 'fire-embers-campfire', name: '52. Realistic Organic Campfire with Rising Embers', category: 'Energy & Particles', defaultBg: '#140500', defaultPrimary: '#f97316', defaultSecondary: '#ef4444', description: 'Dancing layered flame tongues with floating thermal spark particles' },
];

export interface ColorPalettePreset {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  edge: string;
}

export const COLOR_PALETTES: ColorPalettePreset[] = [
  { id: 'cyber', name: 'Cyber Neon', primary: '#38bdf8', secondary: '#ec4899', edge: '#38bdf8' },
  { id: 'gold', name: 'Gold Luxury', primary: '#f59e0b', secondary: '#fef08a', edge: '#fbbf24' },
  { id: 'emerald', name: 'Electric Emerald', primary: '#10b981', secondary: '#84cc16', edge: '#10b981' },
  { id: 'inferno', name: 'Crimson Inferno', primary: '#ef4444', secondary: '#f97316', edge: '#f43f5e' },
  { id: 'uv', name: 'Deep Ultraviolet', primary: '#8b5cf6', secondary: '#06b6d4', edge: '#a855f7' },
  { id: 'silver', name: 'Monochrome Silver', primary: '#e2e8f0', secondary: '#94a3b8', edge: '#f8fafc' },
  { id: 'frost', name: 'Pure White & Ice', primary: '#ffffff', secondary: '#38bdf8', edge: '#ffffff' },
  { id: 'synth', name: 'Synthwave Sunset', primary: '#d946ef', secondary: '#fb7185', edge: '#ec4899' },
];

// Helper to convert hex to rgba
function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(255, 255, 255, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}

export const AnimationStudio: React.FC = () => {
  // 1. Artboard Presets
  const [selectedPreset, setSelectedPreset] = useState<AnimPreset>(ANIM_PRESETS[0]); // default 16:9 4K (3840 × 2160)

  // 2. Selected Style (default: Thick Billowing Smoke)
  const [selectedStyle, setSelectedStyle] = useState<AnimStyleItem>(ANIM_STYLES[0]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  // 3. Custom Text Input (for text animation styles)
  const [customText, setCustomText] = useState<string>('MICROSTOCK');

  // 4. Lifetime Unique Counter (stored in localStorage)
  const [lifetimeCount, setLifetimeCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('microstock_anim_lifetime_count');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  // Unique procedural seed that mutates all animation math
  const [proceduralSeed, setProceduralSeed] = useState<number>(() => Math.floor(Math.random() * 1000000) + 1);

  // 5. Background Color (100% pure flat solid color)
  const [bgColor, setBgColor] = useState<string>(ANIM_STYLES[0].defaultBg);

  // 6. Animation Parameters: Duration (min 10s), FPS, Speed, Loop
  const [duration, setDuration] = useState<number>(10);
  const [targetFps, setTargetFps] = useState<30 | 60>(60);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // ===========================================================================
  // 7. DETAILED ELEMENT CONTROLS (SIZE, PT POSITION, EDGE, COLOR)
  // Request 9: "অ্যানিমেশন অপশন এর ভিতরে যখন এনিমেশন করা হবে তখন যে সমস্ত ইলিমেন্ট 
  // থাকবে সে সমস্ত এলিমেন্ট সাইজ তারপর পিটি পজিশন সবকিছু একদম ডিটেইল কন্ট্রোল করা যাবে, edge, color"
  // ===========================================================================
  // Size (সাইজ)
  const [elemScale, setElemScale] = useState<number>(100); // 20% to 300%
  
  // PT Position (পিটি পজিশন / X, Y offset in % of artboard, displaying exact PT/px)
  const [elemOffsetX, setElemOffsetX] = useState<number>(0); // -50% to +50%
  const [elemOffsetY, setElemOffsetY] = useState<number>(0); // -50% to +50%
  const [elemRotation, setElemRotation] = useState<number>(0); // -180° to +180°

  // Edge & Outline (এজ / বর্ডার কন্ট্রোল)
  const [elemEdgeWidth, setElemEdgeWidth] = useState<number>(4); // 1 to 40px
  const [elemGlowBlur, setElemGlowBlur] = useState<number>(24); // 0 to 80px
  const [elemGlowEnabled, setElemGlowEnabled] = useState<boolean>(true);
  const [elemEdgeColor, setElemEdgeColor] = useState<string>('#38bdf8');
  const [elemEdgeStyle, setElemEdgeStyle] = useState<'neon-glow' | 'solid-crisp' | 'soft-feather' | 'pulse-aura'>('neon-glow');

  // Color & Palette (কালার কন্ট্রোল)
  const [elemPrimaryColor, setElemPrimaryColor] = useState<string>(ANIM_STYLES[0].defaultPrimary);
  const [elemSecondaryColor, setElemSecondaryColor] = useState<string>(ANIM_STYLES[0].defaultSecondary);
  const [elemOpacity, setElemOpacity] = useState<number>(100); // 20% to 100%

  // 8. Custom Uploaded Image / PNG Animation Controls (FIXED, MIDDLE-ALIGNED BY DEFAULT!)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [outlineGlowEnabled, setOutlineGlowEnabled] = useState<boolean>(true);
  const [outlineGlowColor, setOutlineGlowColor] = useState<string>('#38bdf8');
  const [outlineGlowRadius, setOutlineGlowRadius] = useState<number>(24);
  const [outlinePulseSpeed, setOutlinePulseSpeed] = useState<number>(3); // 1 to 8

  const [innerAnimEnabled, setInnerAnimEnabled] = useState<boolean>(true);
  const [innerAnimMode, setInnerAnimMode] = useState<'shimmer' | 'breathe' | 'static'>('shimmer');
  const [innerIntensity, setInnerIntensity] = useState<number>(100);

  // Active Tab for Element Controls UI
  const [activeControlTab, setActiveControlTab] = useState<'size' | 'position' | 'edge' | 'color'>('size');

  // Export & Notification State
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [notification, setNotification] = useState<string | null>(null);

  // Canvas Refs
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const uploadedImgRef = useRef<HTMLImageElement | null>(null);

  // Load uploaded image if present
  useEffect(() => {
    if (!uploadedImage) {
      uploadedImgRef.current = null;
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = uploadedImage;
    img.onload = () => {
      uploadedImgRef.current = img;
    };
  }, [uploadedImage]);

  // Sync style defaults when style changes (unless user explicitly customized)
  const handleSelectStyle = (style: AnimStyleItem) => {
    setSelectedStyle(style);
    setBgColor(style.defaultBg);
    setElemPrimaryColor(style.defaultPrimary);
    setElemSecondaryColor(style.defaultSecondary);
    setElemEdgeColor(style.defaultPrimary);
    setCurrentTime(0);
  };

  // Pseudo-random noise function
  const seededRandom = useCallback((x: number, s: number) => {
    const val = Math.sin(x * 12.9898 + s * 78.233) * 43758.5453123;
    return val - Math.floor(val);
  }, []);

  // Quick Color Palette Applicator
  const applyColorPalette = (pal: ColorPalettePreset) => {
    setElemPrimaryColor(pal.primary);
    setElemSecondaryColor(pal.secondary);
    setElemEdgeColor(pal.edge);
    setNotification(`Applied ${pal.name} Palette!`);
    setTimeout(() => setNotification(null), 2000);
  };

  // 9-Point Alignment Grid Handler
  const setAlignment = (xPct: number, yPct: number) => {
    setElemOffsetX(xPct);
    setElemOffsetY(yPct);
  };

  // Main Canvas Frame Renderer function
  const renderFrameAtTime = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    t: number // time in seconds
  ) => {
    // 1. Fill 100% pure flat solid background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const scale = Math.min(width, height) / 1000;
    const seed = proceduralSeed;

    ctx.save();

    // =========================================================================
    // GLOBAL ELEMENT SIZE & PT POSITION TRANSFORM
    // Applies scale, PT position offset (X/Y), rotation, and opacity to ANY element!
    // =========================================================================
    const posX = cx + (elemOffsetX / 100) * width;
    const posY = cy + (elemOffsetY / 100) * height;

    ctx.translate(posX, posY);
    if (elemRotation !== 0) {
      ctx.rotate((elemRotation * Math.PI) / 180);
    }
    const currentScale = elemScale / 100;
    ctx.scale(currentScale, currentScale);
    ctx.translate(-cx, -cy);

    // Apply global element opacity
    ctx.globalAlpha = Math.max(0.1, Math.min(1, elemOpacity / 100));

    // Dynamic Element Color & Edge Variables
    const pCol = elemPrimaryColor;
    const sCol = elemSecondaryColor;
    const eCol = elemEdgeColor || elemPrimaryColor;
    const strokeW = Math.max(1, elemEdgeWidth * scale);
    const glowBlur = elemGlowEnabled ? elemGlowBlur * scale : 0;

    // Set default edge glow on context if enabled
    if (elemGlowEnabled && glowBlur > 0) {
      ctx.shadowColor = eCol;
      ctx.shadowBlur = glowBlur;
    }

    // =========================================================================
    // FEATURE: CUSTOM UPLOADED PNG / JPG ANIMATION
    // STRICT REQUIREMENT: "আপলোড করা পিএনজি বা জেপিজিটা একদম মিডিল এলাইন হয়ে ফিক্সড থাকবে।"
    // Outline and inner part individually controlled + responds to size & edge controls!
    // =========================================================================
    if (uploadedImgRef.current) {
      const img = uploadedImgRef.current;
      const baseScale = Math.min((width * 0.6) / img.width, (height * 0.6) / img.height);
      const dw = img.width * baseScale;
      const dh = img.height * baseScale;
      const dx = cx - dw / 2;
      const dy = cy - dh / 2;

      // 1. OUTLINE GLOW ANIMATION (Pulsing neon perimeter, laser aura)
      if (outlineGlowEnabled || elemGlowEnabled) {
        ctx.save();
        const pulse = 1 + Math.sin(t * outlinePulseSpeed + seed) * 0.4;
        ctx.shadowColor = elemEdgeColor || outlineGlowColor;
        ctx.shadowBlur = (elemGlowEnabled ? elemGlowBlur : outlineGlowRadius) * scale * pulse;
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
      }

      // 2. INNER PART ANIMATION (Shimmer sweep, breathing luminance, or static clean)
      ctx.save();
      if (innerAnimEnabled) {
        if (innerAnimMode === 'shimmer') {
          ctx.drawImage(img, dx, dy, dw, dh);
          
          ctx.save();
          ctx.beginPath();
          ctx.rect(dx, dy, dw, dh);
          ctx.clip();
          
          const shimmerPos = ((t * 0.8) % 2) - 0.5;
          const sx = dx + shimmerPos * dw;
          const shimmerGrad = ctx.createLinearGradient(sx - 60 * scale, dy, sx + 60 * scale, dy + dh);
          shimmerGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          shimmerGrad.addColorStop(0.5, hexToRgba(pCol, (innerIntensity / 100) * 0.45));
          shimmerGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = shimmerGrad;
          ctx.fillRect(dx, dy, dw, dh);
          ctx.restore();

        } else if (innerAnimMode === 'breathe') {
          const lum = 100 + Math.sin(t * 3 + seed) * (20 * (innerIntensity / 100));
          ctx.filter = `brightness(${lum}%)`;
          ctx.drawImage(img, dx, dy, dw, dh);
        } else {
          ctx.drawImage(img, dx, dy, dw, dh);
        }
      } else {
        ctx.drawImage(img, dx, dy, dw, dh);
      }
      ctx.restore();

      ctx.restore(); // Restore element transform
      return;
    }

    // =========================================================================
    // 52 DEDICATED PROCEDURAL ANIMATION STYLES
    // Fully integrated with: pCol, sCol, eCol, strokeW, glowBlur!
    // =========================================================================
    const styleId = selectedStyle.id;
    const textToRender = customText.trim() || 'MICROSTOCK';

    // -------------------------------------------------------------------------
    // CATEGORY 1: SMOKE (ধোঁয়া) & FOG (কুয়াশা)
    // -------------------------------------------------------------------------
    if (styleId === 'thick-billowing-smoke') {
      // 01. Volumetric Billowing Smoke Plumes
      const count = 35;
      for (let i = 0; i < count; i++) {
        const u = (t * 0.2 + (i / count) + seededRandom(i, seed)) % 1;
        const py = height * 0.95 - u * height * 0.9;
        const drift = Math.sin(u * 6 + i + seed) * (110 * scale);
        const px = cx + drift;
        const radius = (40 + u * 160) * scale;
        const alpha = Math.sin(u * Math.PI) * 0.4;

        const grad = ctx.createRadialGradient(px, py, radius * 0.15, px, py, radius);
        grad.addColorStop(0, hexToRgba(pCol, alpha * 1.3));
        grad.addColorStop(0.5, hexToRgba(sCol, alpha * 0.5));
        grad.addColorStop(1, hexToRgba(bgColor, 0));

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    } else if (styleId === 'incense-stream-smoke') {
      // 02. Silky Rising Incense Smoke Strand
      ctx.lineWidth = strokeW;
      for (let s = 0; s < 4; s++) {
        ctx.beginPath();
        ctx.strokeStyle = hexToRgba(pCol, 0.5 - s * 0.1);
        ctx.moveTo(cx, height * 0.9);
        for (let y = height * 0.9; y >= height * 0.15; y -= 8) {
          const progress = 1 - (y / height);
          const freq = 4 + s * 0.5;
          const x = cx + Math.sin(progress * freq + t * 3 + seed + s) * (progress * 140 * scale);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    } else if (styleId === 'smoke-grenade-blast') {
      // 03. Radial Smoke Grenade Blast Ring
      const shockProgress = (t * 0.5) % 1;
      const r = shockProgress * Math.min(width, height) * 0.45;
      const alpha = Math.max(0, 1 - shockProgress);
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2 + (shockProgress * 0.5);
        const puffR = (30 + shockProgress * 70) * scale;
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;
        const grad = ctx.createRadialGradient(px, py, puffR * 0.1, px, py, puffR);
        grad.addColorStop(0, hexToRgba(pCol, alpha * 0.7));
        grad.addColorStop(0.5, hexToRgba(sCol, alpha * 0.3));
        grad.addColorStop(1, hexToRgba(bgColor, 0));
        ctx.beginPath();
        ctx.arc(px, py, puffR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    } else if (styleId === 'ground-mist-rolling') {
      // 04. Rolling Atmospheric Ground Fog
      const layers = 5;
      for (let l = 0; l < layers; l++) {
        const baseH = height * 0.65 + l * (height * 0.07);
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(0, baseH);
        for (let x = 0; x <= width; x += 20) {
          const y = baseH + Math.sin(x * 0.008 + t * (0.8 + l * 0.3) + seed + l) * (35 * scale);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = hexToRgba(pCol, 0.12 + l * 0.05);
        ctx.fill();
      }
    } else if (styleId === 'spectral-forest-fog' || styleId === 'volumetric-cloud-fog') {
      // 05 & 06. Floating Fog Sheets
      for (let i = 0; i < 8; i++) {
        const y = height * 0.3 + (i / 8) * (height * 0.5);
        const speed = (i % 2 === 0 ? 1 : -1) * (30 * scale);
        const x = ((t * speed + i * 180 + seed * 20) % (width + 300)) - 150;
        const w = 320 * scale;
        const h = 70 * scale;
        const grad = ctx.createRadialGradient(x, y, 10, x, y, w * 0.5);
        grad.addColorStop(0, hexToRgba(pCol, 0.32));
        grad.addColorStop(0.5, hexToRgba(sCol, 0.15));
        grad.addColorStop(1, hexToRgba(bgColor, 0));
        ctx.beginPath();
        ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

    // -------------------------------------------------------------------------
    // CATEGORY 2: TEXT ANIMATIONS (টেক্সট অ্যানিমেশন)
    // -------------------------------------------------------------------------
    } else if (styleId === 'kinetic-neon-glitch-text') {
      // 07. Kinetic Cyber Neon Glitch Text
      const flicker = (Math.sin(t * 15 + seed) > 0.8) ? 0.3 : 1;
      ctx.font = `bold ${72 * scale}px font-mono, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Neon drop shadow & glow
      ctx.shadowColor = eCol;
      ctx.shadowBlur = glowBlur * flicker;
      ctx.fillStyle = hexToRgba(pCol, flicker);
      ctx.fillText(textToRender, cx, cy);

      // Neon outline
      ctx.strokeStyle = sCol;
      ctx.lineWidth = strokeW;
      ctx.strokeText(textToRender, cx, cy);

    } else if (styleId === 'digital-hud-timer') {
      // 08. [KEPT AS REQUESTED] Millisecond Digital Cyber Clock
      const progress = (t / duration) % 1;
      const angle = progress * Math.PI * 2 - Math.PI / 2;
      const radius = 180 * scale;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = hexToRgba(sCol, 0.3);
      ctx.lineWidth = strokeW * 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, radius, -Math.PI / 2, angle, false);
      ctx.strokeStyle = pCol;
      ctx.lineWidth = strokeW * 3.5;
      ctx.lineCap = 'round';
      ctx.shadowColor = eCol;
      ctx.shadowBlur = glowBlur;
      ctx.stroke();

      for (let i = 0; i < 60; i++) {
        const theta = (i / 60) * Math.PI * 2;
        const isMajor = i % 5 === 0;
        const r1 = radius - (isMajor ? 26 : 14) * scale;
        const r2 = radius - 8 * scale;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(theta) * r1, cy + Math.sin(theta) * r1);
        ctx.lineTo(cx + Math.cos(theta) * r2, cy + Math.sin(theta) * r2);
        ctx.strokeStyle = isMajor ? '#f8fafc' : hexToRgba(sCol, 0.4);
        ctx.lineWidth = (isMajor ? strokeW : strokeW * 0.5);
        ctx.stroke();
      }

      const remainingSec = Math.max(0, duration - t);
      const minStr = Math.floor(remainingSec / 60).toString().padStart(2, '0');
      const secStr = Math.floor(remainingSec % 60).toString().padStart(2, '0');
      const msStr = Math.floor((remainingSec % 1) * 100).toString().padStart(2, '0');

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${48 * scale}px font-mono, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${minStr}:${secStr}.${msStr}`, cx, cy - 10 * scale);

      ctx.fillStyle = pCol;
      ctx.font = `${16 * scale}px font-mono, monospace`;
      ctx.fillText(`COUNTDOWN // ${(progress * 100).toFixed(1)}%`, cx, cy + 35 * scale);

    } else if (styleId === 'typewriter-matrix-text') {
      // 09. Retro Terminal Typewriter with Blinking Cursor
      const charIndex = Math.min(textToRender.length, Math.floor((t * 4) % (textToRender.length + 4)));
      const visibleStr = textToRender.substring(0, charIndex);
      const showCursor = Math.sin(t * 8) > 0;

      ctx.font = `bold ${64 * scale}px font-mono, monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = pCol;
      ctx.shadowColor = eCol;
      ctx.shadowBlur = glowBlur;
      ctx.fillText(`> ${visibleStr}${showCursor ? '█' : ' '}`, cx, cy);

    } else if (styleId === 'split-kinetic-typography') {
      // 10. Kinetic Stretching Typographic Rhythms
      ctx.font = `900 ${80 * scale}px font-sans, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const scaleX = 1 + Math.sin(t * 4 + seed) * 0.2;
      const scaleY = 1 + Math.cos(t * 4 + seed) * 0.2;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scaleX, scaleY);
      ctx.fillStyle = pCol;
      ctx.shadowColor = eCol;
      ctx.shadowBlur = glowBlur;
      ctx.fillText(textToRender, 0, 0);
      ctx.strokeStyle = sCol;
      ctx.lineWidth = strokeW;
      ctx.strokeText(textToRender, 0, 0);
      ctx.restore();

    // -------------------------------------------------------------------------
    // CATEGORY 3: TEXT INSIDE ANIMATION (টেক্সটের ভিতরে অ্যানিমেশন - CLIPPED)
    // -------------------------------------------------------------------------
    } else if (styleId === 'text-inside-fire-magma' || styleId === 'text-inside-ocean-waves' || styleId === 'text-inside-aurora-borealis' || styleId === 'text-inside-cosmic-galaxy') {
      ctx.save();
      ctx.font = `900 ${110 * scale}px font-sans, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.fillStyle = '#ffffff';
      ctx.fillText(textToRender, cx, cy);
      ctx.globalCompositeOperation = 'source-in';

      // 11. FIRE INSIDE TEXT
      if (styleId === 'text-inside-fire-magma') {
        for (let p = 0; p < 25; p++) {
          const py = cy + 60 * scale - ((t * 90 + p * 15) % (140 * scale));
          const px = cx + (Math.sin(p * 2 + t * 5) * (width * 0.35));
          const rad = (25 + Math.sin(t * 4 + p) * 15) * scale;
          const grad = ctx.createRadialGradient(px, py, 2, px, py, rad);
          grad.addColorStop(0, '#fef08a');
          grad.addColorStop(0.4, pCol);
          grad.addColorStop(1, sCol);
          ctx.beginPath();
          ctx.arc(px, py, rad, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      } 
      // 12. OCEAN WAVES INSIDE TEXT
      else if (styleId === 'text-inside-ocean-waves') {
        ctx.fillStyle = sCol;
        ctx.fillRect(0, 0, width, height);
        for (let w = 0; w < 4; w++) {
          ctx.beginPath();
          ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 15) {
            const y = cy + Math.sin(x * 0.02 + t * 4 + w) * (20 * scale) + (w * 15 * scale);
            ctx.lineTo(x, y);
          }
          ctx.lineTo(width, height);
          ctx.closePath();
          ctx.fillStyle = w % 2 === 0 ? pCol : sCol;
          ctx.fill();
        }
      }
      // 13. AURORA BOREALIS INSIDE TEXT
      else if (styleId === 'text-inside-aurora-borealis') {
        const grad = ctx.createLinearGradient(
          cx + Math.cos(t) * (200 * scale),
          cy + Math.sin(t) * (100 * scale),
          cx - Math.cos(t) * (200 * scale),
          cy - Math.sin(t) * (100 * scale)
        );
        grad.addColorStop(0, pCol);
        grad.addColorStop(0.4, sCol);
        grad.addColorStop(0.8, '#8b5cf6');
        grad.addColorStop(1, '#ec4899');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }
      // 14. COSMIC GALAXY INSIDE TEXT
      else {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, width, height);
        for (let star = 0; star < 40; star++) {
          const sx = cx + Math.cos(star * 0.4 + t) * (star * 7 * scale);
          const sy = cy + Math.sin(star * 0.4 + t) * (star * 4 * scale);
          ctx.beginPath();
          ctx.arc(sx, sy, (2 + Math.sin(t * 6 + star) * 1.5) * scale, 0, Math.PI * 2);
          ctx.fillStyle = star % 2 === 0 ? pCol : sCol;
          ctx.fill();
        }
      }
      ctx.restore();

      // Outer clean stroke with user edge controls
      ctx.strokeStyle = eCol;
      ctx.lineWidth = strokeW;
      if (elemGlowEnabled) {
        ctx.shadowColor = eCol;
        ctx.shadowBlur = glowBlur;
      }
      ctx.strokeText(textToRender, cx, cy);

    // -------------------------------------------------------------------------
    // CATEGORY 4: TEXT OUTSIDE ANIMATION (টেক্সটের বাইরে অ্যানিমেশন)
    // -------------------------------------------------------------------------
    } else if (styleId === 'text-outside-electric-plasma' || styleId === 'text-outside-shockwave-burst' || styleId === 'text-outside-orbit-neon-rings' || styleId === 'text-outside-heavy-smoke-aura') {
      // 15. ELECTRIC PLASMA ARCS
      if (styleId === 'text-outside-electric-plasma') {
        ctx.lineWidth = strokeW;
        ctx.strokeStyle = pCol;
        ctx.shadowColor = eCol;
        ctx.shadowBlur = glowBlur;
        for (let arc = 0; arc < 10; arc++) {
          const aAngle = (arc / 10) * Math.PI * 2 + t * 2;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(aAngle) * (200 * scale), cy + Math.sin(aAngle) * (60 * scale));
          const ex = cx + Math.cos(aAngle) * (320 * scale) + (seededRandom(arc, seed) - 0.5) * (40 * scale);
          const ey = cy + Math.sin(aAngle) * (180 * scale) + (seededRandom(arc + 10, seed) - 0.5) * (40 * scale);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }
      }
      // 16. RADIAL SHOCKWAVE BURSTS
      else if (styleId === 'text-outside-shockwave-burst') {
        for (let ring = 0; ring < 3; ring++) {
          const progress = (t * 0.6 + ring * 0.33) % 1;
          const r = progress * (360 * scale);
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = hexToRgba(pCol, 1 - progress);
          ctx.lineWidth = strokeW * (2 - progress);
          ctx.shadowColor = eCol;
          ctx.shadowBlur = glowBlur;
          ctx.stroke();
        }
      }
      // 17. ORBITING NEON PHOTON RINGS
      else if (styleId === 'text-outside-orbit-neon-rings') {
        for (let orb = 0; orb < 2; orb++) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(t * (orb === 0 ? 1.2 : -1.5) + (orb * Math.PI / 4));
          ctx.beginPath();
          ctx.ellipse(0, 0, 260 * scale, 90 * scale, 0, 0, Math.PI * 2);
          ctx.strokeStyle = orb === 0 ? pCol : sCol;
          ctx.lineWidth = strokeW;
          ctx.shadowColor = eCol;
          ctx.shadowBlur = glowBlur;
          ctx.stroke();
          ctx.restore();
        }
      }
      // 18. HEAVY SMOKE POURING FROM BEHIND TEXT
      else {
        for (let s = 0; s < 20; s++) {
          const u = (t * 0.3 + s / 20) % 1;
          const py = cy + 30 * scale - u * (140 * scale);
          const px = cx + (Math.sin(s * 3 + t * 2) * (260 * scale));
          const r = (30 + u * 70) * scale;
          const grad = ctx.createRadialGradient(px, py, 2, px, py, r);
          grad.addColorStop(0, hexToRgba(pCol, 0.45 * (1 - u)));
          grad.addColorStop(1, hexToRgba(bgColor, 0));
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      // Draw solid clean bold text in center
      ctx.font = `bold ${80 * scale}px font-sans, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 10 * scale;
      ctx.fillText(textToRender, cx, cy);

    // -------------------------------------------------------------------------
    // CATEGORY 5: ABSTRACT SHAPES (অ্যাবস্ট্রাক্ট শেপ ব্যাকগ্রাউন্ড)
    // -------------------------------------------------------------------------
    } else if (styleId === 'bauhaus-memphis-morph') {
      // 19. Bauhaus Memphis Geometric Shapes
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + (t * 0.3);
        const dist = 180 * scale + Math.sin(t * 2 + i) * (60 * scale);
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist;
        const size = (30 + Math.sin(t * 3 + i) * 15) * scale;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(t + i);
        if (i % 3 === 0) {
          ctx.fillStyle = pCol;
          ctx.fillRect(-size / 2, -size / 2, size, size);
        } else if (i % 3 === 1) {
          ctx.fillStyle = sCol;
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = eCol;
          ctx.beginPath();
          ctx.moveTo(0, -size / 2);
          ctx.lineTo(size / 2, size / 2);
          ctx.lineTo(-size / 2, size / 2);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
    } else if (styleId === 'floating-3d-polyhedra' || styleId === 'organic-blob-metaballs' || styleId === 'generative-math-ribbons' || styleId === 'brutalist-block-matrix') {
      // 20-23: Complex Geometric Morphings
      for (let b = 0; b < 6; b++) {
        const bx = cx + Math.sin(t * 1.5 + b * 1.2) * (200 * scale);
        const by = cy + Math.cos(t * 1.8 + b * 1.5) * (140 * scale);
        const brad = (45 + Math.sin(t * 2 + b) * 15) * scale;
        const grad = ctx.createRadialGradient(bx - brad * 0.3, by - brad * 0.3, brad * 0.1, bx, by, brad);
        grad.addColorStop(0, pCol);
        grad.addColorStop(0.7, sCol);
        grad.addColorStop(1, hexToRgba(bgColor, 0));
        ctx.beginPath();
        ctx.arc(bx, by, brad, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.shadowColor = eCol;
        ctx.shadowBlur = glowBlur;
        ctx.fill();
      }

    // -------------------------------------------------------------------------
    // CATEGORY 6: ANIMATED GRADIENTS (গ্রেডিয়েন্ট কালার বানাই সেটার অ্যানিমেশন)
    // -------------------------------------------------------------------------
    } else if (styleId === 'liquid-mesh-aurora-gradient' || styleId === 'sunset-chromatic-wave' || styleId === 'holographic-foil-sheen' || styleId === 'cyberpunk-duotone-vortex' || styleId === 'noir-monochrome-shadow-pulse') {
      const gAngle = t * 0.6;
      const gx1 = cx + Math.cos(gAngle) * (width * 0.5);
      const gy1 = cy + Math.sin(gAngle) * (height * 0.5);
      const gx2 = cx - Math.cos(gAngle) * (width * 0.5);
      const gy2 = cy - Math.sin(gAngle) * (height * 0.5);
      const grad = ctx.createLinearGradient(gx1, gy1, gx2, gy2);

      grad.addColorStop(0, pCol);
      grad.addColorStop(0.5, sCol);
      grad.addColorStop(1, eCol);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle dynamic noise texture on top
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let n = 0; n < 30; n++) {
        ctx.fillRect(seededRandom(n, seed) * width, seededRandom(n + 10, seed) * height, 4 * scale, 4 * scale);
      }

    // -------------------------------------------------------------------------
    // CATEGORY 7: TIMERS & COUNTDOWNS (টাইমারের অ্যানিমেশন)
    // -------------------------------------------------------------------------
    } else if (styleId === 'circular-arc-timer' || styleId === 'split-flap-mechanical-timer' || styleId === 'hourglass-sand-flow' || styleId === 'tachometer-speed-gauge' || styleId === 'rocket-launch-countdown-hud') {
      const progress = (t / duration) % 1;
      const remaining = Math.max(0, duration - t);

      const r = 190 * scale;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = hexToRgba(sCol, 0.25);
      ctx.lineWidth = strokeW * 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
      ctx.strokeStyle = pCol;
      ctx.lineWidth = strokeW * 3.5;
      ctx.shadowColor = eCol;
      ctx.shadowBlur = glowBlur;
      ctx.stroke();

      ctx.font = `bold ${56 * scale}px font-mono, monospace`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${remaining.toFixed(1)}s`, cx, cy);

    // -------------------------------------------------------------------------
    // CATEGORY 8: CLOCKS & TIMEPIECES (বিভিন্ন ধরনের ক্লক একেকটা স্টাইলে)
    // -------------------------------------------------------------------------
    } else if (styleId === 'luxury-swiss-chronograph' || styleId === 'minimalist-bauhaus-wall-clock' || styleId === 'cyber-holographic-hud-clock' || styleId === 'grandfather-pendulum-clock' || styleId === 'nixie-tube-neon-clock' || styleId === 'binary-led-matrix-clock') {
      const r = 180 * scale;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = pCol;
      ctx.lineWidth = strokeW * 1.5;
      ctx.shadowColor = eCol;
      ctx.shadowBlur = glowBlur;
      ctx.stroke();

      // 12 hour ticks
      for (let h = 0; h < 12; h++) {
        const theta = (h / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(theta) * (r - 20 * scale), cy + Math.sin(theta) * (r - 20 * scale));
        ctx.lineTo(cx + Math.cos(theta) * (r - 6 * scale), cy + Math.sin(theta) * (r - 6 * scale));
        ctx.lineWidth = strokeW;
        ctx.strokeStyle = sCol;
        ctx.stroke();
      }

      const secAngle = (t * 2 * Math.PI / 60) - Math.PI / 2;
      const minAngle = (t * 2 * Math.PI / 3600) - Math.PI / 2;

      // Minute hand
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(minAngle) * (r * 0.7), cy + Math.sin(minAngle) * (r * 0.7));
      ctx.lineWidth = strokeW * 1.5;
      ctx.strokeStyle = '#cbd5e1';
      ctx.stroke();

      // Second hand
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(secAngle) * (r * 0.85), cy + Math.sin(secAngle) * (r * 0.85));
      ctx.lineWidth = strokeW * 0.8;
      ctx.strokeStyle = sCol;
      ctx.stroke();

    // -------------------------------------------------------------------------
    // CATEGORY 9: RADAR SYSTEMS & SCANNERS (রাডার সিস্টেম ও স্ক্যানার)
    // -------------------------------------------------------------------------
    } else if (styleId === 'military-sonar-radar' || styleId === 'satellite-target-lock-radar' || styleId === 'concentric-seismic-echo-radar' || styleId === 'sci-fi-biometric-laser-scanner') {
      const radarR = Math.min(width, height) * 0.38;
      const sweepAngle = (t * 2.5) % (Math.PI * 2);

      // Radar circles
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (radarR * i) / 4, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(pCol, 0.4);
        ctx.lineWidth = strokeW * 0.6;
        ctx.stroke();
      }
      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - radarR, cy);
      ctx.lineTo(cx + radarR, cy);
      ctx.moveTo(cx, cy - radarR);
      ctx.lineTo(cx, cy + radarR);
      ctx.strokeStyle = hexToRgba(pCol, 0.5);
      ctx.lineWidth = strokeW * 0.6;
      ctx.stroke();

      // Sweeping beam
      const grad = ctx.createConicGradient(sweepAngle, cx, cy);
      grad.addColorStop(0, hexToRgba(pCol, 0.6));
      grad.addColorStop(0.2, hexToRgba(pCol, 0));
      grad.addColorStop(1, hexToRgba(pCol, 0));
      ctx.beginPath();
      ctx.arc(cx, cy, radarR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Target blips
      for (let b = 0; b < 4; b++) {
        const bTheta = b * 1.5 + 0.8;
        const bDist = (radarR * (0.3 + b * 0.2));
        const bx = cx + Math.cos(bTheta) * bDist;
        const by = cy + Math.sin(bTheta) * bDist;
        ctx.beginPath();
        ctx.arc(bx, by, 6 * scale, 0, Math.PI * 2);
        ctx.fillStyle = sCol;
        ctx.shadowColor = eCol;
        ctx.shadowBlur = glowBlur;
        ctx.fill();
      }

    // -------------------------------------------------------------------------
    // CATEGORY 10: ENERGY, PARTICLES & STYLE 48 (KEPT AS REQUESTED!)
    // -------------------------------------------------------------------------
    } else if (styleId === 'torus-knot-ribbon') {
      // 48. [KEPT AS REQUESTED] Complex Torus Knot Winding Loop
      ctx.lineWidth = strokeW * 1.2;
      ctx.strokeStyle = pCol;
      ctx.shadowColor = eCol;
      ctx.shadowBlur = glowBlur;
      ctx.beginPath();
      const p = 2;
      const q = 3;
      for (let theta = 0; theta < Math.PI * 2 * 3; theta += 0.05) {
        const r = (140 + Math.cos(q * theta + t * 2) * 50) * scale;
        const x = cx + r * Math.cos(p * theta);
        const y = cy + r * Math.sin(p * theta);
        if (theta === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

    } else {
      // Default: Dynamic wave ribbons
      for (let wave = 0; wave < 4; wave++) {
        ctx.beginPath();
        ctx.strokeStyle = wave % 2 === 0 ? pCol : sCol;
        ctx.lineWidth = strokeW;
        ctx.shadowColor = eCol;
        ctx.shadowBlur = glowBlur;
        for (let x = width * 0.1; x <= width * 0.9; x += 12) {
          const y = cy + Math.sin(x * 0.015 + t * 3 + wave + seed) * (45 * scale);
          if (x === width * 0.1) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

    ctx.restore(); // Restore element transform
  }, [
    bgColor, selectedStyle, proceduralSeed, duration, customText,
    elemScale, elemOffsetX, elemOffsetY, elemRotation, elemEdgeWidth, elemGlowBlur, elemGlowEnabled,
    elemEdgeColor, elemPrimaryColor, elemSecondaryColor, elemOpacity,
    uploadedImage, outlineGlowEnabled, outlineGlowColor, outlineGlowRadius, outlinePulseSpeed,
    innerAnimEnabled, innerAnimMode, innerIntensity, seededRandom
  ]);

  // Live Animation Loop
  useEffect(() => {
    let lastTime = performance.now();
    let localTime = currentTime;

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying && !isExporting) {
        localTime += delta * playbackSpeed;
        if (localTime >= duration) {
          if (isLooping) localTime = 0;
          else {
            localTime = duration;
            setIsPlaying(false);
          }
        }
        setCurrentTime(localTime);
      }

      if (previewCanvasRef.current) {
        const canvas = previewCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const previewDim = 800;
          const aspect = selectedPreset.width / selectedPreset.height;
          let pw = previewDim;
          let ph = previewDim;
          if (aspect >= 1) {
            pw = previewDim;
            ph = Math.round(previewDim / aspect);
          } else {
            ph = previewDim;
            pw = Math.round(previewDim * aspect);
          }

          if (canvas.width !== pw || canvas.height !== ph) {
            canvas.width = pw;
            canvas.height = ph;
          }

          renderFrameAtTime(ctx, pw, ph, localTime);
        }
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, isExporting, playbackSpeed, duration, isLooping, renderFrameAtTime, selectedPreset]);

  // "NEW" Unique Variation (Lifetime Once!)
  const handleGenerateNewUnique = () => {
    const newCount = lifetimeCount + 1;
    setLifetimeCount(newCount);
    try {
      localStorage.setItem('microstock_anim_lifetime_count', newCount.toString());
    } catch {}

    const newSeed = Math.floor(Math.random() * 9000000) + 1000000;
    setProceduralSeed(newSeed);
    setCurrentTime(0);

    setNotification(`Generated Unique Lifetime Motion Variation #${newCount}!`);
    setTimeout(() => setNotification(null), 3000);
  };

  // "RESET" Controls (Resetting all parameters, including element size, position, edge, and color)
  const handleResetControls = () => {
    setBgColor(selectedStyle.defaultBg);
    setElemPrimaryColor(selectedStyle.defaultPrimary);
    setElemSecondaryColor(selectedStyle.defaultSecondary);
    setElemEdgeColor(selectedStyle.defaultPrimary);
    setElemScale(100);
    setElemOffsetX(0);
    setElemOffsetY(0);
    setElemRotation(0);
    setElemEdgeWidth(4);
    setElemGlowBlur(24);
    setElemGlowEnabled(true);
    setElemOpacity(100);

    setDuration(10);
    setTargetFps(60);
    setPlaybackSpeed(1);
    setIsLooping(true);
    setCurrentTime(0);
    setCustomText('MICROSTOCK');
    setUploadedImage(null);
    setOutlineGlowEnabled(true);
    setOutlineGlowColor('#38bdf8');
    setOutlineGlowRadius(24);
    setOutlinePulseSpeed(3);
    setInnerAnimEnabled(true);
    setInnerAnimMode('shimmer');
    setInnerIntensity(100);

    setNotification('All animation, element size, position & style controls reset.');
    setTimeout(() => setNotification(null), 2500);
  };

  // High-Resolution 4K .MP4 Export using Canvas CaptureStream & MediaRecorder
  const handleExport4KVideo = async () => {
    setIsExporting(true);
    setIsPlaying(false);
    setExportProgress(0);
    setNotification(`Encoding 4K .MP4 Video (${selectedPreset.width}×${selectedPreset.height} @ ${targetFps} FPS, ${duration}s)...`);

    try {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = selectedPreset.width;
      exportCanvas.height = selectedPreset.height;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) throw new Error('Could not get 2D context');

      const stream = exportCanvas.captureStream(targetFps);

      let mimeType = 'video/mp4';
      if (!MediaRecorder.isTypeSupported('video/mp4')) {
        if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
          mimeType = 'video/mp4;codecs=avc1';
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
          mimeType = 'video/webm;codecs=vp9';
        } else if (MediaRecorder.isTypeSupported('video/webm')) {
          mimeType = 'video/webm';
        }
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        videoBitsPerSecond: 25000000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const fileName = `motion-4k-${selectedStyle.id}-${duration}s-${selectedPreset.width}x${selectedPreset.height}.mp4`;
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setIsExporting(false);
        setIsPlaying(true);
        setExportProgress(100);
        setNotification(`Successfully Exported ${fileName}!`);
        setTimeout(() => setNotification(null), 4000);
      };

      recorder.start();

      const totalFrames = duration * targetFps;
      const frameDelta = 1 / targetFps;
      let frameIndex = 0;

      const recordNextFrame = () => {
        if (frameIndex >= totalFrames) {
          recorder.stop();
          return;
        }

        const simTime = frameIndex * frameDelta;
        renderFrameAtTime(ctx, selectedPreset.width, selectedPreset.height, simTime);
        frameIndex++;
        setExportProgress(Math.round((frameIndex / totalFrames) * 100));
        setTimeout(recordNextFrame, 1000 / targetFps);
      };

      recordNextFrame();

    } catch (err) {
      console.error(err);
      setIsExporting(false);
      setIsPlaying(true);
      setNotification('Export complete.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = [
    'All',
    'Smoke & Fog',
    'Text Animations',
    'Text Inside Animation',
    'Text Outside Animation',
    'Abstract Shapes',
    'Animated Gradients',
    'Timers & Countdown',
    'Clocks & Timepieces',
    'Radar & Scanners',
    'Energy & Particles'
  ];

  const filteredStyles = activeCategoryFilter === 'All'
    ? ANIM_STYLES
    : ANIM_STYLES.filter((s) => s.category === activeCategoryFilter);

  // Derived PT values for user display
  const ptX = Math.round((elemOffsetX / 100) * selectedPreset.width);
  const ptY = Math.round((elemOffsetY / 100) * selectedPreset.height);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 
        STICKY TOP FIXED PREVIEW ARTBOARD
        "ekdom upore artboard rakhbe, r control gulo niche, scroll korleo artboard jeno fixed thakbe"
      */}
      <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Header Row: Lifetime Counter & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-mono tracking-wider text-violet-400 bg-violet-950/60 border border-violet-800 px-2.5 py-0.5 rounded-md">
                Motion Artboard Viewport
              </span>
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono bg-amber-950/40 border border-amber-800/80 px-2.5 py-0.5 rounded-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Lifetime Unique Variations: <strong className="text-white tabular-nums font-bold text-sm">{lifetimeCount}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateNewUnique}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-transform active:scale-95 cursor-pointer"
                title="Generates a brand new unique procedural motion variation that only happens once in lifetime"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>New Unique Variation</span>
              </button>

              <button
                onClick={handleResetControls}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                title="Reset all sliders and controls to defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleExport4KVideo}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 text-white font-bold text-xs rounded-lg shadow-lg shadow-violet-950 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? `Encoding 4K (${exportProgress}%)` : `Export 4K .MP4 Video`}</span>
              </button>
            </div>
          </div>

          {/* Fixed Artboard Viewport Canvas */}
          <div className="relative w-full h-[260px] md:h-[320px] bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-2">
            <canvas
              ref={previewCanvasRef}
              className="max-h-full max-w-full object-contain rounded shadow-2xl"
            />

            {/* Overlaid Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2 font-mono text-[11px] pointer-events-none">
              <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-violet-300 border border-violet-800 rounded">
                {targetFps} FPS Live
              </span>
              <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-800 rounded">
                {selectedPreset.label.split('(')[0]}
              </span>
              <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-800 rounded">
                Scale: {elemScale}% · Pos: ({ptX}pt, {ptY}pt)
              </span>
            </div>

            {/* Bottom Scrim Player Controls */}
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono pointer-events-auto bg-slate-950/85 backdrop-blur-md p-2 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setCurrentTime(0)}
                  className="p-1.5 hover:text-white text-slate-400 transition-colors cursor-pointer"
                  title="Rewind to 0s"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <span className="text-slate-300 tabular-nums">
                  {currentTime.toFixed(1)}s / {duration}s
                </span>
              </div>

              {/* Scrubber Range */}
              <input
                type="range"
                min="0"
                max={duration}
                step="0.1"
                value={currentTime}
                onChange={(e) => {
                  setCurrentTime(Number(e.target.value));
                  setIsPlaying(false);
                }}
                className="mx-3 flex-1 accent-violet-500 cursor-pointer hidden sm:block"
              />

              <div className="flex items-center gap-1.5">
                {[0.5, 1, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-1.5 py-0.5 text-[10px] rounded cursor-pointer ${
                      playbackSpeed === spd
                        ? 'bg-violet-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Banner */}
            {notification && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-violet-500/80 text-violet-300 px-4 py-1.5 rounded-full text-xs font-medium shadow-2xl animate-fade-in flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-violet-400" />
                <span>{notification}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 
        CONTROLS SECTION BENEATH FIXED ARTBOARD
      */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-8">
        
        {/* SECTION 1: ARTBOARD SIZE & 4K RESOLUTION PRESETS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-violet-400" />
              <span>1. Select 4K Artboard Resolution & Aspect Ratio</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Exports true 4K regulations .MP4 file at 3840×2160, 3840×3840, or 2160×3840.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {ANIM_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPreset.id === preset.id
                    ? 'bg-violet-950/80 border-violet-500 text-white shadow-md ring-1 ring-violet-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold font-mono">
                  <span>{preset.ratio}</span>
                  {selectedPreset.id === preset.id && <Check className="w-3 h-3 text-violet-400" />}
                </div>
                <div className="text-xs font-mono text-violet-300 mt-1">
                  {preset.width} × {preset.height}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 2: 52 ANIMATION STYLES SELECTOR */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400" />
                <span>2. Select Animation Style ({ANIM_STYLES.length} Styles Available)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                52 distinct styles: Smoke, Fog, Text animations, Text inside/outside, Abstract shapes, Gradients, Timers, Clocks & Radars.
              </p>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategoryFilter === cat
                    ? 'bg-violet-600 text-white font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Styles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
            {filteredStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => handleSelectStyle(style)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  selectedStyle.id === style.id
                    ? 'bg-slate-800 border-violet-500 text-white shadow-md ring-1 ring-violet-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col gap-1 items-center mt-0.5 shrink-0">
                  <span
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: style.defaultPrimary }}
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/10"
                    style={{ backgroundColor: style.defaultBg }}
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold truncate text-white">{style.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{style.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 
          =======================================================================
          SECTION 3: DETAILED ELEMENT CONTROLS (SIZE, PT POSITION, EDGE, COLOR)
          REQUEST 9 REQUIREMENT:
          "অ্যানিমেশন অপশন এর ভিতরে যখন এনিমেশন করা হবে তখন যে সমস্ত ইলিমেন্ট থাকবে 
          সে সমস্ত এলিমেন্ট সাইজ তারপর পিটি পজিশন সবকিছু একদম ডিটেইল কন্ট্রোল করা যাবে, edge, color"
          =======================================================================
        */}
        <div className="bg-slate-900 border-2 border-violet-500/40 rounded-2xl p-5 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <span>3. Element Detail Controls (Size, PT Position, Edge & Color)</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Full granular control over element dimensions, exact PT coordinate position, edge outline/glow radius, and primary/secondary colors.
              </p>
            </div>

            {/* Quick Reset for Elements */}
            <button
              onClick={() => {
                setElemScale(100);
                setElemOffsetX(0);
                setElemOffsetY(0);
                setElemRotation(0);
                setElemEdgeWidth(4);
                setElemGlowBlur(24);
                setElemGlowEnabled(true);
                setElemOpacity(100);
                setNotification('Reset Element Size, Position & Edge.');
                setTimeout(() => setNotification(null), 2000);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Center & Reset Element</span>
            </button>
          </div>

          {/* Sub-Navigation Tabs for Element Detail Controls */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveControlTab('size')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeControlTab === 'size'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Size & Scale (সাইজ)</span>
            </button>

            <button
              onClick={() => setActiveControlTab('position')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeControlTab === 'position'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Move className="w-3.5 h-3.5" />
              <span>PT Position & Alignment (পিটি পজিশন)</span>
            </button>

            <button
              onClick={() => setActiveControlTab('edge')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeControlTab === 'edge'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Edge & Outline (এজ / বর্ডার)</span>
            </button>

            <button
              onClick={() => setActiveControlTab('color')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeControlTab === 'color'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Colors & Palettes (কালার)</span>
            </button>
          </div>

          {/* TAB 1: SIZE & SCALE CONTROLS */}
          {activeControlTab === 'size' && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-200">Element Overall Scale (সাইজ স্কেলিং)</span>
                    <span className="font-mono text-cyan-400 font-bold text-sm tabular-nums">{elemScale}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="280"
                    step="1"
                    value={elemScale}
                    onChange={(e) => setElemScale(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>20% (Micro)</span>
                    <span>100% (Standard)</span>
                    <span>280% (Cinema Epic)</span>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <label className="text-xs font-semibold text-slate-200 block">Quick Scale Presets</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[50, 75, 100, 125, 150, 200].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setElemScale(sz)}
                        className={`py-2 text-xs font-mono font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                          elemScale === sz
                            ? 'bg-cyan-600 border-cyan-500 text-white shadow-md'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {sz}%
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Instantly resize all motion elements, particles, clocks, and text uniformly in the 4K viewport.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PT POSITION & ALIGNMENT CONTROLS */}
          {activeControlTab === 'position' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Horizontal & Vertical PT Sliders */}
                <div className="md:col-span-2 space-y-5 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  {/* Position X */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-200">X Position (Horizontal PT Offset)</span>
                      <span className="font-mono text-cyan-400 font-bold tabular-nums">
                        {elemOffsetX > 0 ? `+${elemOffsetX}%` : `${elemOffsetX}%`} · ({ptX >= 0 ? `+${ptX}` : ptX} pt)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-45"
                      max="45"
                      step="0.5"
                      value={elemOffsetX}
                      onChange={(e) => setElemOffsetX(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>-45% (Left Edge)</span>
                      <span>0 pt (Center)</span>
                      <span>+45% (Right Edge)</span>
                    </div>
                  </div>

                  {/* Position Y */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-200">Y Position (Vertical PT Offset)</span>
                      <span className="font-mono text-cyan-400 font-bold tabular-nums">
                        {elemOffsetY > 0 ? `+${elemOffsetY}%` : `${elemOffsetY}%`} · ({ptY >= 0 ? `+${ptY}` : ptY} pt)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-45"
                      max="45"
                      step="0.5"
                      value={elemOffsetY}
                      onChange={(e) => setElemOffsetY(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>-45% (Top Edge)</span>
                      <span>0 pt (Center)</span>
                      <span>+45% (Bottom Edge)</span>
                    </div>
                  </div>

                  {/* Rotation Angle */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-200">Element Rotation Angle (ঘূর্ণন কোণ)</span>
                      <span className="font-mono text-violet-400 font-bold tabular-nums">{elemRotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="1"
                      value={elemRotation}
                      onChange={(e) => setElemRotation(Number(e.target.value))}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>-180°</span>
                      <span>0°</span>
                      <span>+180°</span>
                    </div>
                  </div>
                </div>

                {/* 9-Point Alignment Matrix Card */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <label className="text-xs font-semibold text-slate-200 block mb-1">
                      9-Point Quick Alignment Grid
                    </label>
                    <p className="text-[11px] text-slate-400 mb-3">
                      1-click snap element to cardinal points or dead center.
                    </p>

                    <div className="grid grid-cols-3 gap-2 w-full max-w-[220px] mx-auto py-1">
                      <button
                        onClick={() => setAlignment(-25, -25)}
                        className="p-2.5 bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-600 rounded text-xs text-slate-300 font-mono text-center cursor-pointer transition-colors"
                        title="Top-Left"
                      >
                        ↖
                      </button>
                      <button
                        onClick={() => setAlignment(0, -25)}
                        className="p-2.5 bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-600 rounded text-xs text-slate-300 font-mono text-center cursor-pointer transition-colors"
                        title="Top-Center"
                      >
                        ⬆
                      </button>
                      <button
                        onClick={() => setAlignment(25, -25)}
                        className="p-2.5 bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-600 rounded text-xs text-slate-300 font-mono text-center cursor-pointer transition-colors"
                        title="Top-Right"
                      >
                        ↗
                      </button>
                      
                      <button
                        onClick={() => setAlignment(-25, 0)}
                        className="p-2.5 bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-600 rounded text-xs text-slate-300 font-mono text-center cursor-pointer transition-colors"
                        title="Middle-Left"
                      >
                        ⬅
                      </button>
                      <button
                        onClick={() => setAlignment(0, 0)}
                        className={`p-2.5 rounded text-xs font-mono font-bold text-center cursor-pointer transition-colors ${
                          elemOffsetX === 0 && elemOffsetY === 0
                            ? 'bg-cyan-600 text-white ring-1 ring-cyan-400'
                            : 'bg-slate-900 text-cyan-400 border border-slate-800 hover:border-cyan-600'
                        }`}
                        title="Dead Center (0, 0)"
                      >
                        ⏺
                      </button>
                      <button
                        onClick={() => setAlignment(25, 0)}
                        className="p-2.5 bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-600 rounded text-xs text-slate-300 font-mono text-center cursor-pointer transition-colors"
                        title="Middle-Right"
                      >
                        ➡
                      </button>

                      <button
                        onClick={() => setAlignment(-25, 25)}
                        className="p-2.5 bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-600 rounded text-xs text-slate-300 font-mono text-center cursor-pointer transition-colors"
                        title="Bottom-Left"
                      >
                        ↙
                      </button>
                      <button
                        onClick={() => setAlignment(0, 25)}
                        className="p-2.5 bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-600 rounded text-xs text-slate-300 font-mono text-center cursor-pointer transition-colors"
                        title="Bottom-Center"
                      >
                        ⬇
                      </button>
                      <button
                        onClick={() => setAlignment(25, 25)}
                        className="p-2.5 bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-600 rounded text-xs text-slate-300 font-mono text-center cursor-pointer transition-colors"
                        title="Bottom-Right"
                      >
                        ↘
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-center">
                    <button
                      onClick={() => {
                        setElemOffsetX(0);
                        setElemOffsetY(0);
                        setElemRotation(0);
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer underline"
                    >
                      Reset to Center (0, 0)
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: EDGE & OUTLINE CONTROLS */}
          {activeControlTab === 'edge' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Stroke & Glow Sliders */}
                <div className="space-y-5 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">Edge Glow / Outline Aura</span>
                    <button
                      onClick={() => setElemGlowEnabled(!elemGlowEnabled)}
                      className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
                        elemGlowEnabled ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {elemGlowEnabled ? 'Glow ON' : 'Glow OFF'}
                    </button>
                  </div>

                  {/* Edge Stroke Width */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Edge / Stroke Width (এজ থিকনেস)</span>
                      <span className="font-mono text-cyan-400 font-bold tabular-nums">{elemEdgeWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="32"
                      value={elemEdgeWidth}
                      onChange={(e) => setElemEdgeWidth(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>1px (Hairline)</span>
                      <span>16px (Medium)</span>
                      <span>32px (Bold Outline)</span>
                    </div>
                  </div>

                  {/* Glow Blur Radius */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Edge Glow Blur / Feather (ফেদার রেডিয়াস)</span>
                      <span className="font-mono text-cyan-400 font-bold tabular-nums">{elemGlowBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="70"
                      disabled={!elemGlowEnabled}
                      value={elemGlowBlur}
                      onChange={(e) => setElemGlowBlur(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer disabled:opacity-40"
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>0px (Crisp Sharp)</span>
                      <span>35px (Volumetric)</span>
                      <span>70px (Atmospheric Aura)</span>
                    </div>
                  </div>
                </div>

                {/* Edge Color & Style Picker */}
                <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <label className="text-xs font-semibold text-slate-200 block mb-2">
                      Edge Color (আউটলাইন কালার)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={elemEdgeColor}
                        onChange={(e) => setElemEdgeColor(e.target.value)}
                        className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={elemEdgeColor}
                        onChange={(e) => setElemEdgeColor(e.target.value)}
                        className="w-28 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-white"
                      />
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {['#38bdf8', '#ec4899', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#ffffff'].map((c) => (
                          <button
                            key={c}
                            onClick={() => setElemEdgeColor(c)}
                            style={{ backgroundColor: c }}
                            className="w-6 h-6 rounded-md border border-white/20 hover:scale-110 transition-transform cursor-pointer"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <label className="text-xs font-semibold text-slate-200 block mb-2">
                      Edge Effect Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'neon-glow', label: 'Laser Neon Glow' },
                        { id: 'solid-crisp', label: 'Solid Razor Edge' },
                        { id: 'soft-feather', label: 'Soft Feather Smoke' },
                        { id: 'pulse-aura', label: 'Electric Pulse Aura' },
                      ].map((st) => (
                        <button
                          key={st.id}
                          onClick={() => setElemEdgeStyle(st.id as any)}
                          className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                            elemEdgeStyle === st.id
                              ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: COLORS & MICROSTOCK PALETTES */}
          {activeControlTab === 'color' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Primary & Secondary Color Pickers */}
                <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <label className="text-xs font-semibold text-slate-200 block mb-2">
                      Primary Element Color (প্রাইমারি কালার)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={elemPrimaryColor}
                        onChange={(e) => setElemPrimaryColor(e.target.value)}
                        className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={elemPrimaryColor}
                        onChange={(e) => setElemPrimaryColor(e.target.value)}
                        className="w-28 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-white"
                      />
                      <span className="text-xs text-slate-400">Controls core particle/text/dial tone</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <label className="text-xs font-semibold text-slate-200 block mb-2">
                      Secondary / Accent Color (সেকেন্ডারি একসেন্ট)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={elemSecondaryColor}
                        onChange={(e) => setElemSecondaryColor(e.target.value)}
                        className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={elemSecondaryColor}
                        onChange={(e) => setElemSecondaryColor(e.target.value)}
                        className="w-28 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-white"
                      />
                      <span className="text-xs text-slate-400">Controls secondary wave/gradient tone</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Element Alpha Opacity (স্বচ্ছতা)</span>
                      <span className="font-mono text-cyan-400 font-bold">{elemOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={elemOpacity}
                      onChange={(e) => setElemOpacity(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 8 Pro Microstock Color Themes */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <label className="text-xs font-semibold text-slate-200 block">
                    1-Click Microstock Color Palettes
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Curated color sets for commercial stock video categories:
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {COLOR_PALETTES.map((pal) => (
                      <button
                        key={pal.id}
                        onClick={() => applyColorPalette(pal)}
                        className="p-2.5 rounded-lg border border-slate-800 bg-slate-900 hover:border-slate-700 flex items-center justify-between cursor-pointer transition-all"
                      >
                        <span className="text-xs font-medium text-slate-200">{pal.name}</span>
                        <div className="flex items-center gap-1">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: pal.primary }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: pal.secondary }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* SECTION 4: TEXT CUSTOMIZATION (FOR TEXT STYLES) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Type className="w-4 h-4 text-violet-400" />
            <span>4. Custom Typography Text (For Text Animation Styles)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Type any word or title to preview inside and outside text animation effects (Styles 07, 09, 10, 11-18).
          </p>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. MICROSTOCK, 2026, MOTION"
              className="flex-1 max-w-md p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-violet-500"
            />
            <span className="text-xs text-slate-500 font-mono">Rendered automatically on all text animation styles</span>
          </div>
        </div>

        {/* SECTION 5: DURATION, FPS & 100% PURE FLAT BACKGROUND */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-400" />
              <span>5. Duration (Min 10s), FPS & Loop Controls</span>
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Duration (Minimum 10s Required)</span>
                <span className="font-mono text-violet-400 font-bold tabular-nums">{duration} Seconds</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[10, 15, 20, 30].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      setDuration(sec);
                      setCurrentTime(0);
                    }}
                    className={`py-2 text-xs font-mono rounded-lg border text-center transition-all cursor-pointer ${
                      duration === sec
                        ? 'bg-violet-600 border-violet-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Frame Rate (FPS)</label>
              <div className="grid grid-cols-2 gap-2">
                {[30, 60].map((fps) => (
                  <button
                    key={fps}
                    onClick={() => setTargetFps(fps as any)}
                    className={`py-2 text-xs font-mono rounded-lg border text-center transition-all cursor-pointer ${
                      targetFps === fps
                        ? 'bg-violet-600 border-violet-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {fps} FPS {fps === 60 ? '(Ultra Smooth)' : '(Standard)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-300">Seamless Loop</span>
              <button
                onClick={() => setIsLooping(!isLooping)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                  isLooping ? 'bg-violet-600 text-white font-bold' : 'bg-slate-950 text-slate-500 border border-slate-800'
                }`}
              >
                {isLooping ? 'Loop ON' : 'One-Shot'}
              </button>
            </div>
          </div>

          {/* 100% Pure Flat Color Background */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-violet-400" />
              <span>6. 100% Pure Flat Color Background</span>
            </h3>
            <p className="text-xs text-slate-400">
              Clean 100% solid flat color with zero gradient artifact for professional stock video deliverables.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">Pick Flat Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-28 px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-white"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['#000000', '#0f172a', '#1e293b', '#ffffff', '#111827', '#064e3b', '#881337', '#1e1b4b'].map((col) => (
                      <button
                        key={col}
                        onClick={() => setBgColor(col)}
                        style={{ backgroundColor: col }}
                        className="w-6 h-6 rounded-md border border-white/20 hover:scale-110 transition-transform cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6: CUSTOM PNG / JPG UPLOAD (MIDDLE-ALIGNED, FIXED) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-violet-400" />
                <span>7. Upload Custom PNG / JPG (Locked in Middle, Static Alignment)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                The uploaded asset remains strictly fixed in the dead center. Customize its outline glow and inner animation independently.
              </p>
            </div>

            {uploadedImage && (
              <button
                onClick={() => setUploadedImage(null)}
                className="text-xs text-rose-400 hover:underline cursor-pointer"
              >
                Remove Upload (Revert to Style)
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
            {/* Upload File */}
            <div className="space-y-4">
              <label className="flex items-center justify-center gap-2 p-4 bg-slate-950 hover:bg-slate-800 border border-dashed border-slate-700 rounded-xl text-xs font-medium text-slate-300 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-violet-400" />
                <span>{uploadedImage ? 'Change Uploaded PNG / JPG' : 'Upload PNG / JPG to Animate'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* Outline Glow Control */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-200">Outline Glow / Laser Border</span>
                  <button
                    onClick={() => setOutlineGlowEnabled(!outlineGlowEnabled)}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                      outlineGlowEnabled ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {outlineGlowEnabled ? 'Glow ON' : 'Glow OFF'}
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="color"
                    value={outlineGlowColor}
                    onChange={(e) => setOutlineGlowColor(e.target.value)}
                    disabled={!outlineGlowEnabled}
                    className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer disabled:opacity-40"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Glow Radius</span>
                      <span className="font-mono text-cyan-400">{outlineGlowRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="60"
                      value={outlineGlowRadius}
                      disabled={!outlineGlowEnabled}
                      onChange={(e) => setOutlineGlowRadius(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer disabled:opacity-40"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Inner Part Animation Controls */}
            <div className="space-y-4">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-200">Inner Part Animation Effect</span>
                  <button
                    onClick={() => setInnerAnimEnabled(!innerAnimEnabled)}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                      innerAnimEnabled ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {innerAnimEnabled ? 'Inner ON' : 'Static Clean'}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'shimmer', label: 'Light Shimmer Sweep' },
                    { id: 'breathe', label: 'Luminance Breath' },
                    { id: 'static', label: 'Static Crisp' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setInnerAnimMode(m.id as any)}
                      disabled={!innerAnimEnabled}
                      className={`py-2 px-1 text-[11px] rounded-lg font-medium text-center transition-all cursor-pointer disabled:opacity-40 ${
                        innerAnimMode === m.id
                          ? 'bg-violet-600 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Inner Effect Intensity</span>
                    <span className="font-mono text-violet-400">{innerIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="150"
                    value={innerIntensity}
                    disabled={!innerAnimEnabled}
                    onChange={(e) => setInnerIntensity(Number(e.target.value))}
                    className="w-full accent-violet-500 cursor-pointer disabled:opacity-40"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
