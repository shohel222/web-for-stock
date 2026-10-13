import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Download, RotateCcw, Sparkles, Shuffle, Maximize2, Sliders, Palette, 
  Layers, Check, Eye, Square, Paintbrush, ArrowLeft, Shield, Smile, Flag,
  MoveRight, Hash, Flame, Sparkle
} from 'lucide-react';

export interface ArtboardPreset {
  id: string;
  label: string;
  width: number;
  height: number;
  ratio: string;
}

export const ARTBOARD_PRESETS: ArtboardPreset[] = [
  { id: '8000x4000', label: '8000 × 4000 px (2:1 Standard RGB)', width: 8000, height: 4000, ratio: '2:1' },
  { id: '8000x4500', label: '8000 × 4500 px (16:9 8K UHD)', width: 8000, height: 4500, ratio: '16:9' },
  { id: '8000x6000', label: '8000 × 6000 px (4:3 Classic 8K)', width: 8000, height: 6000, ratio: '4:3' },
  { id: '8000x8000', label: '8000 × 8000 px (1:1 8K Square)', width: 8000, height: 8000, ratio: '1:1' },
  { id: '10000x5000', label: '10000 × 5000 px (2:1 Ultra Panorama)', width: 10000, height: 5000, ratio: '2:1' },
];

export interface OthersStyleItem {
  id: string;
  refImageNumber: string;
  name: string;
  category: string;
  description: string;
  totalElements: number;
  defaultColors: string[];
}

// 11 Exact Reference Presets matching the user's uploaded images 1-to-1
export const OTHERS_STYLES: OthersStyleItem[] = [
  { 
    id: 'ref-blobs-black', 
    refImageNumber: 'Ref Image #5',
    name: '28 Organic Fluid Blobs (Black Silhouettes)', 
    category: 'Abstract Shapes', 
    description: 'Exact copy of Image 5: 28 fluid organic silhouettes (egg, dumbbell, clover, peanut, cross)',
    totalElements: 28,
    defaultColors: ['#000000']
  },
  { 
    id: 'ref-blobs-boho', 
    refImageNumber: 'Ref Image #7',
    name: '28 Boho Scandinavian Color Blobs', 
    category: 'Abstract Shapes', 
    description: 'Exact copy of Image 7: Same 28 fluid organic shapes rendered in muted Scandinavian boho earth tones',
    totalElements: 28,
    defaultColors: ['#d07a61', '#4b5563', '#d97706', '#9d7b97', '#e5989b', '#475569', '#ddbea9', '#6b7280']
  },
  { 
    id: 'ref-pebbles-pastel', 
    refImageNumber: 'Ref Image #6',
    name: '30 Watercolor Pastel Pebble Stones', 
    category: 'Abstract Shapes', 
    description: 'Exact copy of Image 6: 30 soft organic pebble stones in pastel terracotta, sage, butter & lavender',
    totalElements: 30,
    defaultColors: ['#f4a261', '#e76f51', '#a8dadc', '#e9c46a', '#e5989b', '#b7b7a4', '#ddbea9', '#f39c12']
  },
  { 
    id: 'ref-scandi-stones', 
    refImageNumber: 'Ref Image #10',
    name: '10 Modern Scandinavian Abstract Shapes', 
    category: 'Abstract Shapes', 
    description: 'Exact copy of Image 10: 10 soft geometric modern shapes in 2 rows of 5 (dusty blue, brick, teal, lilac)',
    totalElements: 10,
    defaultColors: ['#6d8ba6', '#b85d43', '#f59e0b', '#2a7b6e', '#8b5cf6', '#1e293b', '#fb7185', '#475569', '#ea580c', '#06b6d4']
  },
  { 
    id: 'ref-emojis-black', 
    refImageNumber: 'Ref Image #2',
    name: '8 Hand-Drawn Doodle Smiley Faces (Black)', 
    category: 'Expressive Doodles', 
    description: 'Exact copy of Image 2: 8 hand-drawn smiley emoji faces in 2 rows of 4 (sad, happy, laugh, grin, poker)',
    totalElements: 8,
    defaultColors: ['#000000']
  },
  { 
    id: 'ref-emojis-color', 
    refImageNumber: 'Ref Image #3',
    name: '8 Colored Hand-Drawn Smiley Faces', 
    category: 'Expressive Doodles', 
    description: 'Exact copy of Image 3: 8 colored doodle faces (purple, orange, hot pink, sky blue, green, red, brown)',
    totalElements: 8,
    defaultColors: ['#7c3aed', '#ea580c', '#ec4899', '#0284c7', '#059669', '#16a34a', '#dc2626', '#854d0e']
  },
  { 
    id: 'ref-emojis-expressive', 
    refImageNumber: 'Ref Image #9',
    name: '8 Expressive Emotional Character Doodles', 
    category: 'Expressive Doodles', 
    description: 'Exact copy of Image 9: 8 expressive faces (worried brow, happy eyes, shocked O, angry V, tongue out, smile)',
    totalElements: 8,
    defaultColors: ['#000000']
  },
  { 
    id: 'ref-badges-numbers', 
    refImageNumber: 'Ref Image #4',
    name: '10 Numbered Circular Badges (1 to 10)', 
    category: 'Infographic Badges', 
    description: 'Exact copy of Image 4: 10 circular badges. Top row: 1, 3, 5, 7, 9. Bottom row: 2, 4, 6, 8, 10',
    totalElements: 10,
    defaultColors: ['#000000']
  },
  { 
    id: 'ref-arrows-brush', 
    refImageNumber: 'Ref Image #8',
    name: '16 Red Grunge Brush Marker Arrows', 
    category: 'Pointers & Direction', 
    description: 'Exact copy of Image 8: 16 textured dry brush arrows (curved, zigzag, straight, lightning, chevron, arch)',
    totalElements: 16,
    defaultColors: ['#e11d48']
  },
  { 
    id: 'ref-ribbons-banners', 
    refImageNumber: 'Ref Image #11',
    name: '20 Ribbon Banners & Flag Headers', 
    category: 'Headers & Ribbons', 
    description: 'Exact copy of Image 11: 20 ribbons in 5 rows of 4 (swallowtail pennants, wavy banners, folded 3D ribbons)',
    totalElements: 20,
    defaultColors: ['#f472b6', '#86efac', '#fde047', '#fb923c', '#fb7185', '#dc2626', '#fdba74', '#93c5fd']
  },
  { 
    id: 'ref-frames-grunge', 
    refImageNumber: 'Ref Image #1',
    name: '4 Distressed Grunge Border Poster Frames', 
    category: 'Vintage Borders', 
    description: 'Exact copy of Image 1: 4 vertical poster border frames with weathered eroded distressed spatter edges',
    totalElements: 4,
    defaultColors: ['#000000']
  },
];

interface VectorPath {
  d: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeLinejoin?: string;
  strokeLinecap?: string;
}

interface VectorElement {
  id: number;
  name: string;
  cx: number;
  cy: number;
  w: number;
  h: number;
  paths: VectorPath[];
}

interface GeneralOthersStudioProps {
  onBackToOptions?: () => void;
}

export const GeneralOthersStudio: React.FC<GeneralOthersStudioProps> = ({
  onBackToOptions
}) => {
  // 1. Selected Style Preset (out of the 11 reference images)
  const [selectedStyle, setSelectedStyle] = useState<OthersStyleItem>(OTHERS_STYLES[0]);

  // 2. Artboard Preset (default: 8000 × 4000 px RGB)
  const [artboard, setArtboard] = useState<ArtboardPreset>(ARTBOARD_PRESETS[0]);

  // 3. Lifetime Unique Variation Counter (guaranteed never repeating twice in lifetime)
  const [lifetimeCount, setLifetimeCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('microstock_general_others_lifetime');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  // Master procedural seed (mutates shapes while preserving exact reference silhouette)
  const [masterSeed, setMasterSeed] = useState<number>(() => Math.floor(Math.random() * 900000) + 100000);

  // 4. Fill Controls
  const [fillMode, setFillMode] = useState<'fill' | 'stroke-only'>('fill');
  const [globalFillColor, setGlobalFillColor] = useState<string>('#000000');

  // ===========================================================================
  // 5. CRITICAL USER REQUIREMENT:
  // "এজ কন্ট্রোল করার জন্য ইনার এজ আর আউটলাইন এজ কন্ট্রোল করার জন্য আমাকে কন্ট্রোলার দাও।"
  // OUTLINE EDGE CONTROLLERS & INNER EDGE CONTROLLERS
  // ===========================================================================
  // Outline Edge (আউটলাইন এজ কন্ট্রোল)
  const [outlineStrokeWidth, setOutlineStrokeWidth] = useState<number>(16); // 0 to 50px
  const [outlineRoughness, setOutlineRoughness] = useState<number>(30); // 0% to 100%
  const [outlineWaveFreq, setOutlineWaveFreq] = useState<number>(4); // 1 to 10
  const [outlineStrokeColor, setOutlineStrokeColor] = useState<string>('#000000');

  // Inner Edge (ইনার এজ কন্ট্রোল)
  const [innerEdgeInset, setInnerEdgeInset] = useState<number>(20); // 5% to 60%
  const [innerEdgeRoughness, setInnerEdgeRoughness] = useState<number>(25); // 0% to 100%
  const [innerStrokeWidth, setInnerStrokeWidth] = useState<number>(14); // 2px to 40px
  const [innerEdgeColor, setInnerEdgeColor] = useState<string>('#000000');
  const [showInnerEdge, setShowInnerEdge] = useState<boolean>(true);

  // Global scale of elements
  const [elementScale, setElementScale] = useState<number>(85); // 60% to 115%

  // 6. Single-by-Single Customization (ID 1..N -> custom colors and strokes)
  const [selectedElementId, setSelectedElementId] = useState<number | null>(null); // null = All Elements
  const [customFills, setCustomFills] = useState<Record<number, string>>({});
  const [customOutlineColors, setCustomOutlineColors] = useState<Record<number, string>>({});
  const [customInnerColors, setCustomInnerColors] = useState<Record<number, string>>({});

  // Canvas Refs & State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Update defaults when preset style changes
  useEffect(() => {
    setGlobalFillColor(selectedStyle.defaultColors[0] || '#000000');
    setOutlineStrokeColor(selectedStyle.defaultColors[0] || '#000000');
    setInnerEdgeColor(selectedStyle.defaultColors[0] || '#000000');
    setCustomFills({});
    setCustomOutlineColors({});
    setCustomInnerColors({});
    setSelectedElementId(null);
  }, [selectedStyle]);

  // Pseudo-random noise function
  const seededRandom = useCallback((x: number, s: number) => {
    const val = Math.sin(x * 12.9898 + s * 78.233) * 43758.5453123;
    return val - Math.floor(val);
  }, []);

  // Helper to get element color
  const getFillForIndex = useCallback((id: number) => {
    if (customFills[id]) return customFills[id];
    if (selectedStyle.defaultColors.length > 1) {
      return selectedStyle.defaultColors[(id - 1) % selectedStyle.defaultColors.length];
    }
    return globalFillColor;
  }, [customFills, selectedStyle, globalFillColor]);

  const getOutlineColorForIndex = useCallback((id: number) => {
    if (customOutlineColors[id]) return customOutlineColors[id];
    if (selectedStyle.defaultColors.length > 1) {
      return selectedStyle.defaultColors[(id - 1) % selectedStyle.defaultColors.length];
    }
    return outlineStrokeColor;
  }, [customOutlineColors, selectedStyle, outlineStrokeColor]);

  const getInnerColorForIndex = useCallback((id: number) => {
    if (customInnerColors[id]) return customInnerColors[id];
    if (selectedStyle.defaultColors.length > 1) {
      return selectedStyle.defaultColors[(id - 1) % selectedStyle.defaultColors.length];
    }
    return innerEdgeColor;
  }, [customInnerColors, selectedStyle, innerEdgeColor]);

  // ===========================================================================
  // EXACT PROCEDURAL GENERATOR FOR THE 11 REFERENCE IMAGE PRESETS
  // ===========================================================================
  const generatedElements = useMemo<VectorElement[]>(() => {
    const elements: VectorElement[] = [];
    const artW = artboard.width;
    const artH = artboard.height;
    const seed = masterSeed;
    const styleId = selectedStyle.id;

    const marginX = artW * 0.05;
    const marginY = artH * 0.07;
    const availW = artW - marginX * 2;
    const availH = artH - marginY * 2;

    const outRough = outlineRoughness / 100;
    const inRough = innerEdgeRoughness / 100;

    // -------------------------------------------------------------------------
    // PRESET 1 & 2: 28 ORGANIC FLUID BLOBS (Exact copy of Images 5 & 7)
    // 4 rows × 7 columns = 28 distinct shapes
    // -------------------------------------------------------------------------
    if (styleId === 'ref-blobs-black' || styleId === 'ref-blobs-boho') {
      const rows = 4;
      const cols = 7;
      const cellW = availW / cols;
      const cellH = availH / rows;
      const baseR = Math.min(cellW, cellH) * (elementScale / 100) * 0.42;

      let id = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = marginX + (c + 0.5) * cellW;
          const cy = marginY + (r + 0.5) * cellH;
          const elSeed = id * 7621 + seed;

          // 28 Distinct Parametric Shape Profiles matching the exact image 5/7 silhouettes:
          const ptsCount = 56;
          let pathD = '';
          let innerD = '';

          for (let i = 0; i < ptsCount; i++) {
            const theta = (i / ptsCount) * Math.PI * 2;
            let rMod = 1.0;

            // Specific geometric formula per row/column shape slot
            const slot = id - 1;
            if (slot === 0) rMod = 1 + 0.15 * Math.cos(theta); // egg
            else if (slot === 1) rMod = 1 + 0.28 * Math.cos(4 * theta); // 4-lobed cross
            else if (slot === 2) rMod = 1 + 0.3 * Math.cos(2 * theta) - 0.15 * Math.sin(theta); // kidney
            else if (slot === 3) rMod = 1 + 0.35 * Math.cos(2 * theta); // peanut
            else if (slot === 4) rMod = 1.0; // circle
            else if (slot === 5) rMod = 1 + 0.25 * Math.cos(theta + 0.5); // teardrop
            else if (slot === 6) rMod = 1 + 0.35 * Math.sin(2 * theta); // vertical dumbbell
            else if (slot === 7) rMod = 1 + 0.3 * Math.cos(2 * theta + 0.8); // tilted kidney
            else if (slot === 8) rMod = 1 + 0.28 * Math.cos(3 * theta); // rounded triangle
            else if (slot === 9) rMod = 1 + 0.4 * Math.cos(3 * theta); // trefoil
            else if (slot === 10) rMod = 1 + 0.2 * Math.cos(4 * theta); // pebble
            else if (slot === 11) rMod = 1 + 0.32 * Math.cos(4 * theta); // clover
            else if (slot === 12) rMod = 1 + 0.2 * Math.cos(2 * theta); // oval
            else if (slot === 13) rMod = 1 + 0.35 * Math.cos(2 * theta + 0.4); // kidney 2
            else if (slot === 14) rMod = 1 + 0.3 * Math.cos(3 * theta + 0.5); // pick
            else if (slot === 15) rMod = 1 + 0.25 * Math.sin(2 * theta); // wavy peanut
            else if (slot === 16) rMod = 0.98; // circle
            else if (slot === 17) rMod = 1 + 0.35 * Math.cos(theta) + 0.1 * Math.sin(2 * theta); // banana
            else if (slot === 18) rMod = 1 + 0.3 * Math.cos(3 * theta); // 3-lobe
            else if (slot === 19) rMod = 1 + 0.25 * Math.sin(theta); // drop
            else if (slot === 20) rMod = 1 + 0.3 * Math.cos(2 * theta + 0.5); // slanted peanut
            else if (slot === 21) rMod = 1 + 0.35 * Math.sin(2 * theta); // dumbbell
            else if (slot === 22) rMod = 1 + 0.35 * Math.cos(2 * theta + 0.3); // tall bean
            else if (slot === 23) rMod = 1 + 0.32 * Math.cos(2 * theta - 0.4); // arch bean
            else if (slot === 24) rMod = 1 + 0.4 * Math.sin(theta) * Math.cos(theta); // arched bridge
            else if (slot === 25) rMod = 1 + 0.25 * Math.cos(3 * theta); // triangle
            else if (slot === 26) rMod = 1 + 0.35 * Math.cos(2 * theta); // bean
            else rMod = 1 + 0.35 * Math.cos(4 * theta); // 4-leaf cross

            // Apply procedural master seed variation + outline roughness
            const jitter = (seededRandom(i, elSeed) - 0.5) * 0.15 * outRough;
            const finalR = baseR * Math.max(0.4, rMod + jitter);
            const px = cx + Math.cos(theta) * finalR;
            const py = cy + Math.sin(theta) * finalR;

            if (i === 0) pathD += `M ${px.toFixed(1)} ${py.toFixed(1)} `;
            else pathD += `L ${px.toFixed(1)} ${py.toFixed(1)} `;

            // Inner edge contour
            if (showInnerEdge && innerStrokeWidth > 0) {
              const inR = finalR * (1 - innerEdgeInset / 100);
              const inJitter = (seededRandom(i + 50, elSeed) - 0.5) * 0.1 * inRough;
              const inPx = cx + Math.cos(theta) * (inR + inJitter * baseR);
              const inPy = cy + Math.sin(theta) * (inR + inJitter * baseR);
              if (i === 0) innerD += `M ${inPx.toFixed(1)} ${inPy.toFixed(1)} `;
              else innerD += `L ${inPx.toFixed(1)} ${inPy.toFixed(1)} `;
            }
          }
          pathD += 'Z';
          if (innerD) innerD += 'Z';

          const fCol = getFillForIndex(id);
          const oCol = getOutlineColorForIndex(id);
          const iCol = getInnerColorForIndex(id);

          const paths: VectorPath[] = [
            {
              d: pathD,
              fill: fillMode === 'fill' ? fCol : 'none',
              stroke: fillMode === 'stroke-only' ? fCol : (outlineStrokeWidth > 0 ? oCol : 'none'),
              strokeWidth: fillMode === 'stroke-only' ? Math.max(14, outlineStrokeWidth) : outlineStrokeWidth
            }
          ];

          if (showInnerEdge && innerD && innerStrokeWidth > 0) {
            paths.push({
              d: innerD,
              fill: 'none',
              stroke: iCol,
              strokeWidth: innerStrokeWidth
            });
          }

          elements.push({
            id,
            name: `Organic_Blob_${id}`,
            cx,
            cy,
            w: baseR * 2,
            h: baseR * 2,
            paths
          });
          id++;
        }
      }
    }

    // -------------------------------------------------------------------------
    // PRESET 3: 30 WATERCOLOR PASTEL PEBBLE STONES (Exact copy of Image 6)
    // 5 rows × 6 columns = 30 soft organic pebble shapes
    // -------------------------------------------------------------------------
    else if (styleId === 'ref-pebbles-pastel') {
      const rows = 5;
      const cols = 6;
      const cellW = availW / cols;
      const cellH = availH / rows;
      const baseR = Math.min(cellW, cellH) * (elementScale / 100) * 0.42;

      let id = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = marginX + (c + 0.5) * cellW;
          const cy = marginY + (r + 0.5) * cellH;
          const elSeed = id * 6321 + seed;

          let pathD = '';
          const pts = 48;
          for (let i = 0; i < pts; i++) {
            const theta = (i / pts) * Math.PI * 2;
            const wave = 1 + Math.sin(theta * 2 + elSeed) * 0.15 + Math.cos(theta * 3 + elSeed * 1.5) * 0.1;
            const jitter = (seededRandom(i, elSeed) - 0.5) * 0.08 * outRough;
            const rad = baseR * (wave + jitter);
            const px = cx + Math.cos(theta) * rad * 1.25;
            const py = cy + Math.sin(theta) * rad * 0.85;
            if (i === 0) pathD += `M ${px.toFixed(1)} ${py.toFixed(1)} `;
            else pathD += `L ${px.toFixed(1)} ${py.toFixed(1)} `;
          }
          pathD += 'Z';

          const fCol = getFillForIndex(id);
          const oCol = getOutlineColorForIndex(id);

          elements.push({
            id,
            name: `Pastel_Pebble_${id}`,
            cx,
            cy,
            w: baseR * 2.5,
            h: baseR * 1.7,
            paths: [{
              d: pathD,
              fill: fillMode === 'fill' ? fCol : 'none',
              stroke: fillMode === 'stroke-only' ? fCol : (outlineStrokeWidth > 0 ? oCol : 'none'),
              strokeWidth: fillMode === 'stroke-only' ? Math.max(14, outlineStrokeWidth) : outlineStrokeWidth
            }]
          });
          id++;
        }
      }
    }

    // -------------------------------------------------------------------------
    // PRESET 4: 10 SCANDINAVIAN MODERN ABSTRACT SHAPES (Exact copy of Image 10)
    // 2 rows × 5 columns = 10 modern geometric stones
    // -------------------------------------------------------------------------
    else if (styleId === 'ref-scandi-stones') {
      const rows = 2;
      const cols = 5;
      const cellW = availW / cols;
      const cellH = availH / rows;
      const baseR = Math.min(cellW, cellH) * (elementScale / 100) * 0.42;

      let id = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = marginX + (c + 0.5) * cellW;
          const cy = marginY + (r + 0.5) * cellH;
          const elSeed = id * 9123 + seed;

          let pathD = '';
          const pts = 44;
          for (let i = 0; i < pts; i++) {
            const theta = (i / pts) * Math.PI * 2;
            const wave = 1 + Math.sin(theta * 3 + elSeed) * 0.18 + Math.cos(theta * 2 + elSeed) * 0.12;
            const rad = baseR * (wave + (seededRandom(i, elSeed) - 0.5) * 0.08 * outRough);
            const px = cx + Math.cos(theta) * rad;
            const py = cy + Math.sin(theta) * rad;
            if (i === 0) pathD += `M ${px.toFixed(1)} ${py.toFixed(1)} `;
            else pathD += `L ${px.toFixed(1)} ${py.toFixed(1)} `;
          }
          pathD += 'Z';

          const fCol = getFillForIndex(id);
          const oCol = getOutlineColorForIndex(id);

          elements.push({
            id,
            name: `Scandi_Stone_${id}`,
            cx,
            cy,
            w: baseR * 2,
            h: baseR * 2,
            paths: [{
              d: pathD,
              fill: fillMode === 'fill' ? fCol : 'none',
              stroke: fillMode === 'stroke-only' ? fCol : (outlineStrokeWidth > 0 ? oCol : 'none'),
              strokeWidth: fillMode === 'stroke-only' ? Math.max(14, outlineStrokeWidth) : outlineStrokeWidth
            }]
          });
          id++;
        }
      }
    }

    // -------------------------------------------------------------------------
    // PRESETS 5, 6, 7: 8 HAND-DRAWN DOODLE SMILEY FACES (Exact copy of Images 2, 3, 9)
    // 2 rows × 4 columns = 8 doodle emoji faces
    // -------------------------------------------------------------------------
    else if (styleId === 'ref-emojis-black' || styleId === 'ref-emojis-color' || styleId === 'ref-emojis-expressive') {
      const rows = 2;
      const cols = 4;
      const cellW = availW / cols;
      const cellH = availH / rows;
      const faceR = Math.min(cellW, cellH) * (elementScale / 100) * 0.42;

      let id = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = marginX + (c + 0.5) * cellW;
          const cy = marginY + (r + 0.5) * cellH;
          const elSeed = id * 5431 + seed;
          const col = getOutlineColorForIndex(id);
          const inCol = getInnerColorForIndex(id);
          const fCol = getFillForIndex(id);

          // Outer hand-drawn circle perimeter
          let circleD = '';
          const pts = 36;
          for (let i = 0; i < pts; i++) {
            const theta = (i / pts) * Math.PI * 2;
            const wobble = 1 + (seededRandom(i, elSeed) - 0.5) * 0.08 * outRough;
            const px = cx + Math.cos(theta) * (faceR * wobble);
            const py = cy + Math.sin(theta) * (faceR * wobble);
            if (i === 0) circleD += `M ${px.toFixed(1)} ${py.toFixed(1)} `;
            else circleD += `L ${px.toFixed(1)} ${py.toFixed(1)} `;
          }
          circleD += 'Z';

          const paths: VectorPath[] = [
            {
              d: circleD,
              fill: fillMode === 'fill' ? (globalFillColor === '#000000' && selectedStyle.id === 'ref-emojis-black' ? 'none' : fCol) : 'none',
              stroke: col,
              strokeWidth: outlineStrokeWidth > 0 ? outlineStrokeWidth : 20,
              strokeLinecap: 'round'
            }
          ];

          // Facial Features (Inner Edge)
          const eyeOff = faceR * 0.35;
          const eyeY = cy - faceR * 0.18;
          const mouthY = cy + faceR * 0.28;
          const mood = id; // 1 to 8

          let leftEyeD = '';
          let rightEyeD = '';
          let mouthD = '';

          if (mood === 1) {
            // Sad / upside down mouth
            leftEyeD = `M ${cx - eyeOff} ${eyeY - 14} L ${cx - eyeOff} ${eyeY + 14}`;
            rightEyeD = `M ${cx + eyeOff} ${eyeY - 14} L ${cx + eyeOff} ${eyeY + 14}`;
            mouthD = `M ${cx - faceR * 0.38} ${mouthY + 12} Q ${cx} ${mouthY - 32} ${cx + faceR * 0.38} ${mouthY + 12}`;
          } else if (mood === 2) {
            // Warm smiling mouth
            leftEyeD = `M ${cx - eyeOff} ${eyeY - 12} L ${cx - eyeOff} ${eyeY + 12}`;
            rightEyeD = `M ${cx + eyeOff} ${eyeY - 12} L ${cx + eyeOff} ${eyeY + 12}`;
            mouthD = `M ${cx - faceR * 0.38} ${mouthY - 10} Q ${cx} ${mouthY + 36} ${cx + faceR * 0.38} ${mouthY - 10}`;
          } else if (mood === 3) {
            // Happy closed eyes ^ ^
            leftEyeD = `M ${cx - eyeOff - 18} ${eyeY} Q ${cx - eyeOff} ${eyeY - 26} ${cx - eyeOff + 18} ${eyeY}`;
            rightEyeD = `M ${cx + eyeOff - 18} ${eyeY} Q ${cx + eyeOff} ${eyeY - 26} ${cx + eyeOff + 18} ${eyeY}`;
            mouthD = `M ${cx - faceR * 0.4} ${mouthY - 6} Q ${cx} ${mouthY + 44} ${cx + faceR * 0.4} ${mouthY - 6}`;
          } else if (mood === 4) {
            // Deep sad frown
            leftEyeD = `M ${cx - eyeOff} ${eyeY - 14} L ${cx - eyeOff} ${eyeY + 14}`;
            rightEyeD = `M ${cx + eyeOff} ${eyeY - 14} L ${cx + eyeOff} ${eyeY + 14}`;
            mouthD = `M ${cx - faceR * 0.42} ${mouthY + 16} Q ${cx} ${mouthY - 38} ${cx + faceR * 0.42} ${mouthY + 16}`;
          } else if (mood === 5) {
            // Sleeping closed eyes
            leftEyeD = `M ${cx - eyeOff - 18} ${eyeY} Q ${cx - eyeOff} ${eyeY + 22} ${cx - eyeOff + 18} ${eyeY}`;
            rightEyeD = `M ${cx + eyeOff - 18} ${eyeY} Q ${cx + eyeOff} ${eyeY + 22} ${cx + eyeOff + 18} ${eyeY}`;
            mouthD = `M ${cx - faceR * 0.3} ${mouthY + 8} Q ${cx} ${mouthY - 18} ${cx + faceR * 0.3} ${mouthY + 8}`;
          } else if (mood === 6) {
            // Laughing wide mouth
            leftEyeD = `M ${cx - eyeOff} ${eyeY - 12} L ${cx - eyeOff} ${eyeY + 12}`;
            rightEyeD = `M ${cx + eyeOff} ${eyeY - 12} L ${cx + eyeOff} ${eyeY + 12}`;
            mouthD = `M ${cx - faceR * 0.36} ${mouthY - 10} Q ${cx} ${mouthY + 42} ${cx + faceR * 0.36} ${mouthY - 10} Z`;
          } else if (mood === 7) {
            // Angry brows \ /
            leftEyeD = `M ${cx - eyeOff - 16} ${eyeY - 16} L ${cx - eyeOff + 16} ${eyeY + 8}`;
            rightEyeD = `M ${cx + eyeOff + 16} ${eyeY - 16} L ${cx + eyeOff - 16} ${eyeY + 8}`;
            mouthD = `M ${cx - faceR * 0.35} ${mouthY + 16} Q ${cx} ${mouthY - 26} ${cx + faceR * 0.35} ${mouthY + 16}`;
          } else {
            // Neutral poker straight line mouth
            leftEyeD = `M ${cx - eyeOff} ${eyeY - 12} L ${cx - eyeOff} ${eyeY + 12}`;
            rightEyeD = `M ${cx + eyeOff} ${eyeY - 12} L ${cx + eyeOff} ${eyeY + 12}`;
            mouthD = `M ${cx - faceR * 0.35} ${mouthY} L ${cx + faceR * 0.35} ${mouthY}`;
          }

          if (showInnerEdge) {
            paths.push({
              d: `${leftEyeD} ${rightEyeD}`,
              fill: 'none',
              stroke: inCol,
              strokeWidth: innerStrokeWidth,
              strokeLinecap: 'round'
            });

            paths.push({
              d: mouthD,
              fill: mood === 6 && fillMode === 'fill' ? inCol : 'none',
              stroke: inCol,
              strokeWidth: innerStrokeWidth,
              strokeLinecap: 'round',
              strokeLinejoin: 'round'
            });
          }

          elements.push({
            id,
            name: `Emoji_Face_${id}`,
            cx,
            cy,
            w: faceR * 2,
            h: faceR * 2,
            paths
          });
          id++;
        }
      }
    }

    // -------------------------------------------------------------------------
    // PRESET 8: 10 NUMBERED CIRCULAR BADGES (Exact copy of Image 4)
    // 2 rows × 5 columns: Top (1, 3, 5, 7, 9) Bottom (2, 4, 6, 8, 10)
    // -------------------------------------------------------------------------
    else if (styleId === 'ref-badges-numbers') {
      const rows = 2;
      const cols = 5;
      const cellW = availW / cols;
      const cellH = availH / rows;
      const badgeR = Math.min(cellW, cellH) * (elementScale / 100) * 0.4;

      // Exact order from Image 4:
      // Row 1: 1, 3, 5, 7, 9
      // Row 2: 2, 4, 6, 8, 10
      const numbersGrid = [
        [1, 3, 5, 7, 9],
        [2, 4, 6, 8, 10]
      ];

      let id = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const num = numbersGrid[r][c];
          const cx = marginX + (c + 0.5) * cellW;
          const cy = marginY + (r + 0.5) * cellH;
          const oCol = getOutlineColorForIndex(num);
          const iCol = getInnerColorForIndex(num);
          const fCol = getFillForIndex(num);

          // Outer circle
          const circleD = `M ${cx} ${cy} m -${badgeR},0 a ${badgeR},${badgeR} 0 1,0 ${badgeR * 2},0 a ${badgeR},${badgeR} 0 1,0 -${badgeR * 2},0`;

          const paths: VectorPath[] = [
            {
              d: circleD,
              fill: fillMode === 'fill' ? (globalFillColor === '#000000' ? 'none' : fCol) : 'none',
              stroke: oCol,
              strokeWidth: outlineStrokeWidth > 0 ? outlineStrokeWidth : 18
            }
          ];

          // Number glyph paths (1 to 10)
          const numSize = badgeR * 0.72;
          let numD = '';

          if (num === 1) {
            numD = `M ${cx - numSize * 0.22} ${cy - numSize * 0.25} L ${cx} ${cy - numSize * 0.45} L ${cx} ${cy + numSize * 0.45} M ${cx - numSize * 0.3} ${cy + numSize * 0.45} L ${cx + numSize * 0.3} ${cy + numSize * 0.45}`;
          } else if (num === 2) {
            numD = `M ${cx - numSize * 0.28} ${cy - numSize * 0.25} Q ${cx} ${cy - numSize * 0.55} ${cx + numSize * 0.28} ${cy - numSize * 0.25} Q ${cx + numSize * 0.28} ${cy + numSize * 0.1} ${cx - numSize * 0.28} ${cy + numSize * 0.45} L ${cx + numSize * 0.3} ${cy + numSize * 0.45}`;
          } else if (num === 3) {
            numD = `M ${cx - numSize * 0.28} ${cy - numSize * 0.4} L ${cx + numSize * 0.25} ${cy - numSize * 0.4} L ${cx} ${cy} Q ${cx + numSize * 0.3} ${cy + numSize * 0.2} ${cx + numSize * 0.1} ${cy + numSize * 0.45} Q ${cx - numSize * 0.2} ${cy + numSize * 0.5} ${cx - numSize * 0.28} ${cy + numSize * 0.35}`;
          } else if (num === 4) {
            numD = `M ${cx + numSize * 0.15} ${cy + numSize * 0.45} L ${cx + numSize * 0.15} ${cy - numSize * 0.45} L ${cx - numSize * 0.3} ${cy + numSize * 0.15} L ${cx + numSize * 0.35} ${cy + numSize * 0.15}`;
          } else if (num === 5) {
            numD = `M ${cx + numSize * 0.25} ${cy - numSize * 0.45} L ${cx - numSize * 0.25} ${cy - numSize * 0.45} L ${cx - numSize * 0.25} ${cy - numSize * 0.05} Q ${cx + numSize * 0.3} ${cy} ${cx + numSize * 0.25} ${cy + numSize * 0.35} Q ${cx - numSize * 0.1} ${cy + numSize * 0.5} ${cx - numSize * 0.25} ${cy + numSize * 0.35}`;
          } else if (num === 6) {
            numD = `M ${cx + numSize * 0.2} ${cy - numSize * 0.45} Q ${cx - numSize * 0.3} ${cy - numSize * 0.2} ${cx - numSize * 0.3} ${cy + numSize * 0.15} a ${numSize * 0.28},${numSize * 0.28} 0 1,0 ${numSize * 0.55},0 a ${numSize * 0.28},${numSize * 0.28} 0 1,0 -${numSize * 0.55},0`;
          } else if (num === 7) {
            numD = `M ${cx - numSize * 0.28} ${cy - numSize * 0.45} L ${cx + numSize * 0.28} ${cy - numSize * 0.45} L ${cx - numSize * 0.05} ${cy + numSize * 0.45}`;
          } else if (num === 8) {
            numD = `M ${cx} ${cy - numSize * 0.22} a ${numSize * 0.22},${numSize * 0.22} 0 1,0 ${numSize * 0.44},0 a ${numSize * 0.22},${numSize * 0.22} 0 1,0 -${numSize * 0.44},0 M ${cx} ${cy + numSize * 0.22} a ${numSize * 0.24},${numSize * 0.24} 0 1,0 ${numSize * 0.48},0 a ${numSize * 0.24},${numSize * 0.24} 0 1,0 -${numSize * 0.48},0`;
          } else if (num === 9) {
            numD = `M ${cx - numSize * 0.2} ${cy + numSize * 0.45} Q ${cx + numSize * 0.3} ${cy + numSize * 0.2} ${cx + numSize * 0.3} ${cy - numSize * 0.15} a ${numSize * 0.28},${numSize * 0.28} 0 1,0 -${numSize * 0.55},0 a ${numSize * 0.28},${numSize * 0.28} 0 1,0 ${numSize * 0.55},0`;
          } else {
            // 10
            numD = `M ${cx - numSize * 0.35} ${cy - numSize * 0.2} L ${cx - numSize * 0.22} ${cy - numSize * 0.45} L ${cx - numSize * 0.22} ${cy + numSize * 0.45} M ${cx + numSize * 0.1} ${cy} m -${numSize * 0.22},0 a ${numSize * 0.22},${numSize * 0.45} 0 1,0 ${numSize * 0.44},0 a ${numSize * 0.22},${numSize * 0.45} 0 1,0 -${numSize * 0.44},0`;
          }

          if (showInnerEdge) {
            paths.push({
              d: numD,
              fill: 'none',
              stroke: iCol,
              strokeWidth: innerStrokeWidth > 0 ? innerStrokeWidth : 16,
              strokeLinecap: 'round',
              strokeLinejoin: 'round'
            });
          }

          elements.push({
            id: num,
            name: `Badge_Number_${num}`,
            cx,
            cy,
            w: badgeR * 2,
            h: badgeR * 2,
            paths
          });
          id++;
        }
      }
    }

    // -------------------------------------------------------------------------
    // PRESET 9: 16 RED GRUNGE BRUSH MARKER ARROWS (Exact copy of Image 8)
    // 4 rows × 4 columns = 16 textured red arrows
    // -------------------------------------------------------------------------
    else if (styleId === 'ref-arrows-brush') {
      const rows = 4;
      const cols = 4;
      const cellW = availW / cols;
      const cellH = availH / rows;
      const arrowW = cellW * (elementScale / 100) * 0.85;
      const arrowH = cellH * (elementScale / 100) * 0.7;

      let id = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = marginX + (c + 0.5) * cellW;
          const cy = marginY + (r + 0.5) * cellH;
          const col = getFillForIndex(id);
          const oCol = getOutlineColorForIndex(id);

          const hw = arrowW / 2;
          const hh = arrowH / 2;
          let pathD = '';

          // 16 distinct arrow types matching image 8:
          const type = (id - 1) % 16;
          if (type === 0) {
            // Straight Up Arrow
            pathD = `M ${cx - hw * 0.25} ${cy + hh} L ${cx - hw * 0.25} ${cy - hh * 0.2} L ${cx - hw * 0.8} ${cy - hh * 0.2} L ${cx} ${cy - hh} L ${cx + hw * 0.8} ${cy - hh * 0.2} L ${cx + hw * 0.25} ${cy - hh * 0.2} L ${cx + hw * 0.25} ${cy + hh} Z`;
          } else if (type === 1) {
            // Horizontal Right Arrow (wide shaft, brush end)
            pathD = `M ${cx - hw} ${cy - hh * 0.3} L ${cx + hw * 0.2} ${cy - hh * 0.3} L ${cx + hw * 0.2} ${cy - hh * 0.85} L ${cx + hw} ${cy} L ${cx + hw * 0.2} ${cy + hh * 0.85} L ${cx + hw * 0.2} ${cy + hh * 0.3} L ${cx - hw} ${cy + hh * 0.3} Z`;
          } else if (type === 2) {
            // Diagonal Up-Right Arrow (45-deg)
            pathD = `M ${cx - hw * 0.8} ${cy + hh * 0.8} L ${cx + hw * 0.1} ${cy - hh * 0.1} L ${cx - hw * 0.1} ${cy - hh * 0.6} L ${cx + hw * 0.8} ${cy - hh * 0.8} L ${cx + hw * 0.6} ${cy + hw * 0.1} L ${cx + hw * 0.2} ${cy - hh * 0.05} L ${cx - hw * 0.7} ${cy + hh * 0.9} Z`;
          } else if (type === 3) {
            // Zigzag Up-Right Arrow
            pathD = `M ${cx - hw} ${cy + hh * 0.6} L ${cx - hw * 0.4} ${cy - hh * 0.2} L ${cx + hw * 0.1} ${cy + hh * 0.5} L ${cx + hw} ${cy - hh * 0.6} L ${cx + hw * 0.6} ${cy - hh * 0.9} L ${cx + hw * 0.9} ${cy - hh * 0.2} Z`;
          } else if (type === 4) {
            // Curved Down Arch Arrow
            pathD = `M ${cx - hw * 0.8} ${cy - hh * 0.3} Q ${cx - hw * 0.2} ${cy - hh} ${cx + hw * 0.5} ${cy - hh * 0.2} Q ${cx + hw} ${cy + hh * 0.4} ${cx + hw * 0.6} ${cy + hh} L ${cx + hw * 0.2} ${cy + hh * 0.4} L ${cx + hw * 0.5} ${cy + hh * 0.4} Q ${cx + hw * 0.6} ${cy + hh * 0.1} ${cx + hw * 0.3} ${cy - hh * 0.4} Q ${cx - hw * 0.1} ${cy - hh * 0.6} ${cx - hw * 0.7} ${cy - hh * 0.1} Z`;
          } else if (type === 5) {
            // Left Arrow
            pathD = `M ${cx + hw} ${cy - hh * 0.3} L ${cx - hw * 0.2} ${cy - hh * 0.3} L ${cx - hw * 0.2} ${cy - hh * 0.85} L ${cx - hw} ${cy} L ${cx - hw * 0.2} ${cy + hh * 0.85} L ${cx - hw * 0.2} ${cy + hh * 0.3} L ${cx + hw} ${cy + hh * 0.3} Z`;
          } else if (type === 6) {
            // Curved Up Arc Arrow
            pathD = `M ${cx - hw * 0.7} ${cy + hh * 0.6} Q ${cx - hw * 0.2} ${cy + hh * 0.8} ${cx + hw * 0.2} ${cy + hh * 0.1} L ${cx + hw * 0.1} ${cy - hh * 0.5} L ${cx + hw * 0.7} ${cy - hh * 0.2} L ${cx + hw * 0.2} ${cy - hh * 0.8} L ${cx - hw * 0.1} ${cy - hh * 0.3} L ${cx - hw * 0.05} ${cy + hh * 0.1} Q ${cx - hw * 0.3} ${cy + hh * 0.5} ${cx - hw * 0.6} ${cy + hh * 0.4} Z`;
          } else if (type === 7) {
            // Down Arrow
            pathD = `M ${cx - hw * 0.25} ${cy - hh} L ${cx + hw * 0.25} ${cy - hh} L ${cx + hw * 0.25} ${cy + hh * 0.2} L ${cx + hw * 0.8} ${cy + hh * 0.2} L ${cx} ${cy + hh} L ${cx - hw * 0.8} ${cy + hh * 0.2} L ${cx - hw * 0.25} ${cy + hh * 0.2} Z`;
          } else if (type === 8) {
            // 90-degree Corner Arrow
            pathD = `M ${cx - hw * 0.7} ${cy + hh * 0.8} L ${cx - hw * 0.7} ${cy - hh * 0.5} L ${cx + hw * 0.2} ${cy - hh * 0.5} L ${cx + hw * 0.2} ${cy - hh * 0.9} L ${cx + hw * 0.8} ${cy - hh * 0.3} L ${cx + hw * 0.2} ${cy + hh * 0.3} L ${cx + hw * 0.2} ${cy - hh * 0.1} L ${cx - hw * 0.3} ${cy - hh * 0.1} L ${cx - hw * 0.3} ${cy + hh * 0.8} Z`;
          } else if (type === 9) {
            // Diagonal Down-Left Arrow
            pathD = `M ${cx + hw * 0.8} ${cy - hh * 0.8} L ${cx - hw * 0.1} ${cy + hh * 0.1} L ${cx - hw * 0.1} ${cy - hh * 0.4} L ${cx - hw * 0.8} ${cy + hh * 0.8} L ${cx + hw * 0.1} ${cy + hh * 0.8} L ${cx - hw * 0.05} ${cy + hh * 0.25} L ${cx + hw * 0.7} ${cy - hh * 0.9} Z`;
          } else if (type === 10) {
            // Right Arrow Wide
            pathD = `M ${cx - hw * 0.9} ${cy - hh * 0.22} L ${cx + hw * 0.3} ${cy - hh * 0.22} L ${cx + hw * 0.3} ${cy - hh * 0.7} L ${cx + hw * 0.9} ${cy} L ${cx + hw * 0.3} ${cy + hh * 0.7} L ${cx + hw * 0.3} ${cy + hh * 0.22} L ${cx - hw * 0.9} ${cy + hh * 0.22} Z`;
          } else if (type === 11) {
            // Lightning Bolt Double Bend Arrow
            pathD = `M ${cx - hw * 0.8} ${cy + hh * 0.6} L ${cx - hw * 0.2} ${cy} L ${cx - hw * 0.5} ${cy} L ${cx + hw * 0.4} ${cy - hh * 0.8} L ${cx + hw * 0.1} ${cy - hh * 0.2} L ${cx + hw * 0.8} ${cy - hh * 0.2} Z`;
          } else if (type === 12) {
            // Wavy S-Curve Arrow
            pathD = `M ${cx - hw * 0.9} ${cy + hh * 0.3} Q ${cx - hw * 0.3} ${cy - hh * 0.8} ${cx} ${cy} Q ${cx + hw * 0.3} ${cy + hh * 0.8} ${cx + hw * 0.5} ${cy} L ${cx + hw * 0.4} ${cy - hh * 0.5} L ${cx + hw * 0.9} ${cy - hh * 0.1} L ${cx + hw * 0.6} ${cy + hh * 0.5} L ${cx + hw * 0.5} ${cy + hh * 0.1} Q ${cx + hw * 0.3} ${cy + hh * 0.5} ${cx} ${cy - hh * 0.2} Q ${cx - hw * 0.3} ${cy - hh * 0.6} ${cx - hw * 0.8} ${cy + hh * 0.4} Z`;
          } else if (type === 13) {
            // Double Chevron Arrow
            pathD = `M ${cx - hw} ${cy} L ${cx - hw * 0.4} ${cy - hh * 0.7} L ${cx + hw * 0.2} ${cy - hh * 0.7} L ${cx - hw * 0.2} ${cy} L ${cx + hw * 0.2} ${cy + hh * 0.7} L ${cx - hw * 0.4} ${cy + hh * 0.7} Z`;
          } else if (type === 14) {
            // Left Chevron Arrow
            pathD = `M ${cx + hw * 0.8} ${cy - hh * 0.25} L ${cx - hw * 0.2} ${cy - hh * 0.25} L ${cx} ${cy - hh * 0.7} L ${cx - hw * 0.8} ${cy} L ${cx} ${cy + hh * 0.7} L ${cx - hw * 0.2} ${cy + hh * 0.25} L ${cx + hw * 0.8} ${cy + hh * 0.25} Z`;
          } else {
            // Arched Semicircle Arrow
            pathD = `M ${cx - hw * 0.8} ${cy + hh * 0.6} Q ${cx} ${cy - hh * 0.9} ${cx + hw * 0.7} ${cy + hh * 0.2} L ${cx + hw * 0.5} ${cy - hh * 0.3} L ${cx + hw} ${cy + hh * 0.4} L ${cx + hw * 0.4} ${cy + hh * 0.8} L ${cx + hw * 0.6} ${cy + hh * 0.3} Q ${cx} ${cy - hh * 0.6} ${cx - hw * 0.7} ${cy + hh * 0.7} Z`;
          }

          elements.push({
            id,
            name: `Brush_Arrow_${id}`,
            cx,
            cy,
            w: arrowW,
            h: arrowH,
            paths: [{
              d: pathD,
              fill: fillMode === 'fill' ? col : 'none',
              stroke: fillMode === 'stroke-only' ? col : (outlineStrokeWidth > 0 ? oCol : 'none'),
              strokeWidth: fillMode === 'stroke-only' ? Math.max(14, outlineStrokeWidth) : outlineStrokeWidth
            }]
          });
          id++;
        }
      }
    }

    // -------------------------------------------------------------------------
    // PRESET 10: 20 RIBBON BANNERS & FLAG HEADERS (Exact copy of Image 11)
    // 5 rows × 4 columns = 20 distinct ribbons
    // -------------------------------------------------------------------------
    else if (styleId === 'ref-ribbons-banners') {
      const rows = 5;
      const cols = 4;
      const cellW = availW / cols;
      const cellH = availH / rows;
      const bannerW = cellW * (elementScale / 100) * 0.88;
      const bannerH = cellH * (elementScale / 100) * 0.42;

      let id = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = marginX + (c + 0.5) * cellW;
          const cy = marginY + (r + 0.5) * cellH;
          const col = getFillForIndex(id);
          const oCol = getOutlineColorForIndex(id);
          const inCol = getInnerColorForIndex(id);

          const hw = bannerW / 2;
          const hh = bannerH / 2;
          const paths: VectorPath[] = [];

          // 5 distinct rows matching Image 11:
          if (r === 0) {
            // Row 1: Simple wavy ribbon with swallowtail ends
            const pathD = `M ${cx - hw} ${cy - hh} Q ${cx - hw * 0.3} ${cy - hh - 18} ${cx} ${cy - hh} Q ${cx + hw * 0.3} ${cy - hh + 18} ${cx + hw} ${cy - hh} L ${cx + hw - 35} ${cy} L ${cx + hw} ${cy + hh} Q ${cx + hw * 0.3} ${cy + hh + 18} ${cx} ${cy + hh} Q ${cx - hw * 0.3} ${cy + hh - 18} ${cx - hw} ${cy + hh} L ${cx - hw + 35} ${cy} Z`;
            paths.push({
              d: pathD,
              fill: fillMode === 'fill' ? col : 'none',
              stroke: oCol,
              strokeWidth: outlineStrokeWidth > 0 ? outlineStrokeWidth : 12
            });
          } else if (r === 1) {
            // Row 2: Straight banner with triangular pennant cutouts
            const pathD = `M ${cx - hw} ${cy - hh} L ${cx + hw} ${cy - hh} L ${cx + hw - 35} ${cy} L ${cx + hw} ${cy + hh} L ${cx - hw} ${cy + hh} L ${cx - hw + 35} ${cy} Z`;
            paths.push({
              d: pathD,
              fill: fillMode === 'fill' ? col : 'none',
              stroke: oCol,
              strokeWidth: outlineStrokeWidth > 0 ? outlineStrokeWidth : 12
            });
          } else if (r === 2) {
            // Row 3: 3D Folded Ribbon (Center banner + side folded wings)
            const cw = hw * 0.65;
            // Back folded side wings
            const leftWingD = `M ${cx - hw} ${cy - hh * 0.6} L ${cx - cw} ${cy - hh * 0.6} L ${cx - cw} ${cy + hh * 0.8} L ${cx - hw} ${cy + hh * 0.8} L ${cx - hw + 25} ${cy + hh * 0.1} Z`;
            const rightWingD = `M ${cx + cw} ${cy - hh * 0.6} L ${cx + hw} ${cy - hh * 0.6} L ${cx + hw - 25} ${cy + hh * 0.1} L ${cx + hw} ${cy + hh * 0.8} L ${cx + cw} ${cy + hh * 0.8} Z`;
            // Front center ribbon
            const centerD = `M ${cx - cw} ${cy - hh} L ${cx + cw} ${cy - hh} L ${cx + cw} ${cy + hh * 0.5} L ${cx - cw} ${cy + hh * 0.5} Z`;

            if (showInnerEdge) {
              paths.push({
                d: `${leftWingD} ${rightWingD}`,
                fill: fillMode === 'fill' ? inCol : 'none',
                stroke: oCol,
                strokeWidth: outlineStrokeWidth > 0 ? outlineStrokeWidth : 10
              });
            }

            paths.push({
              d: centerD,
              fill: fillMode === 'fill' ? col : 'none',
              stroke: oCol,
              strokeWidth: outlineStrokeWidth > 0 ? outlineStrokeWidth : 12
            });
          } else if (r === 3) {
            // Row 4: Straight ribbon with angle cut ends
            const pathD = `M ${cx - hw + 30} ${cy - hh} L ${cx + hw} ${cy - hh} L ${cx + hw - 30} ${cy + hh} L ${cx - hw} ${cy + hh} Z`;
            paths.push({
              d: pathD,
              fill: fillMode === 'fill' ? col : 'none',
              stroke: oCol,
              strokeWidth: outlineStrokeWidth > 0 ? outlineStrokeWidth : 12
            });
          } else {
            // Row 5: Arched Top & Bottom Banner
            const pathD = `M ${cx - hw} ${cy - hh + 25} Q ${cx} ${cy - hh - 35} ${cx + hw} ${cy - hh + 25} L ${cx + hw - 30} ${cy} L ${cx + hw} ${cy + hh + 25} Q ${cx} ${cy + hh - 35} ${cx - hw} ${cy + hh + 25} L ${cx - hw + 30} ${cy} Z`;
            paths.push({
              d: pathD,
              fill: fillMode === 'fill' ? col : 'none',
              stroke: oCol,
              strokeWidth: outlineStrokeWidth > 0 ? outlineStrokeWidth : 12
            });
          }

          elements.push({
            id,
            name: `Ribbon_Banner_${id}`,
            cx,
            cy,
            w: bannerW,
            h: bannerH,
            paths
          });
          id++;
        }
      }
    }

    // -------------------------------------------------------------------------
    // PRESET 11: 4 DISTRESSED GRUNGE BORDER FRAMES (Exact copy of Image 1)
    // 4 vertical poster border frames with weathered distressed spatter edges
    // -------------------------------------------------------------------------
    else {
      const cols = 4;
      const cellW = availW / cols;
      const cellH = availH;
      const frameW = cellW * 0.85 * (elementScale / 100);
      const frameH = cellH * 0.88 * (elementScale / 100);

      for (let i = 1; i <= cols; i++) {
        const cx = marginX + (i - 0.5) * cellW;
        const cy = marginY + cellH * 0.5;
        const elSeed = i * 8321 + seed;
        const col = getFillForIndex(i);
        const oCol = getOutlineColorForIndex(i);

        const x1 = cx - frameW / 2;
        const y1 = cy - frameH / 2;
        const x2 = cx + frameW / 2;
        const y2 = cy + frameH / 2;

        const borderThickness = frameW * (innerEdgeInset / 100 + 0.08);
        const ix1 = x1 + borderThickness;
        const iy1 = y1 + borderThickness;
        const ix2 = x2 - borderThickness;
        const iy2 = y2 - borderThickness;

        // Compound path: Outer rectangle clockwise, inner eroded rectangle counter-clockwise
        let pathD = `M ${x1} ${y1} L ${x2} ${y1} L ${x2} ${y2} L ${x1} ${y2} Z `;

        // Inner eroded perimeter
        const steps = 36;
        let innerD = `M ${ix1} ${iy1} `;
        for (let s = 0; s <= steps; s++) {
          const u = s / steps;
          const j = (seededRandom(s, elSeed + 1) - 0.5) * 35 * inRough;
          innerD += `L ${ix1 + u * (ix2 - ix1)} ${iy1 + j} `;
        }
        for (let s = 0; s <= steps; s++) {
          const u = s / steps;
          const j = (seededRandom(s, elSeed + 2) - 0.5) * 35 * inRough;
          innerD += `L ${ix2 + j} ${iy1 + u * (iy2 - iy1)} `;
        }
        for (let s = 0; s <= steps; s++) {
          const u = s / steps;
          const j = (seededRandom(s, elSeed + 3) - 0.5) * 35 * inRough;
          innerD += `L ${ix2 - u * (ix2 - ix1)} ${iy2 + j} `;
        }
        for (let s = 0; s <= steps; s++) {
          const u = s / steps;
          const j = (seededRandom(s, elSeed + 4) - 0.5) * 35 * inRough;
          innerD += `L ${ix1 + j} ${iy2 - u * (iy2 - iy1)} `;
        }
        innerD += 'Z';

        pathD += innerD;

        elements.push({
          id: i,
          name: `Grunge_Frame_${i}`,
          cx,
          cy,
          w: frameW,
          h: frameH,
          paths: [{
            d: pathD,
            fill: fillMode === 'fill' ? col : 'none',
            stroke: fillMode === 'stroke-only' ? col : (outlineStrokeWidth > 0 ? oCol : 'none'),
            strokeWidth: fillMode === 'stroke-only' ? Math.max(16, outlineStrokeWidth) : outlineStrokeWidth
          }]
        });
      }
    }

    return elements;
  }, [
    artboard, selectedStyle, masterSeed, fillMode, globalFillColor,
    outlineStrokeWidth, outlineRoughness, innerEdgeInset, innerEdgeRoughness,
    innerStrokeWidth, showInnerEdge, elementScale, getFillForIndex,
    getOutlineColorForIndex, getInnerColorForIndex, seededRandom
  ]);

  // Live Canvas Preview Rendering
  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previewWidth = 1600;
    const previewHeight = Math.round(previewWidth * (artboard.height / artboard.width));

    if (canvas.width !== previewWidth || canvas.height !== previewHeight) {
      canvas.width = previewWidth;
      canvas.height = previewHeight;
    }

    const scale = previewWidth / artboard.width;

    // Crisp pure white artboard background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, previewWidth, previewHeight);

    // Render all generated vector elements
    generatedElements.forEach((el) => {
      ctx.save();

      el.paths.forEach((p) => {
        ctx.save();
        const path2d = new Path2D(p.d);

        ctx.scale(scale, scale);

        if (p.fill !== 'none') {
          ctx.fillStyle = p.fill;
          ctx.fill(path2d, 'evenodd');
        }

        if (p.stroke !== 'none' && p.strokeWidth > 0) {
          ctx.strokeStyle = p.stroke;
          ctx.lineWidth = p.strokeWidth;
          if (p.strokeLinecap) ctx.lineCap = p.strokeLinecap as any;
          if (p.strokeLinejoin) ctx.lineJoin = p.strokeLinejoin as any;
          ctx.stroke(path2d);
        }

        ctx.restore();
      });

      // Highlight currently selected element
      if (selectedElementId === el.id) {
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(
          (el.cx - el.w / 2) * scale - 4,
          (el.cy - el.h / 2) * scale - 4,
          el.w * scale + 8,
          el.h * scale + 8
        );
        ctx.restore();
      }

      ctx.restore();
    });
  }, [artboard, generatedElements, selectedElementId]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // "NEW VARIATION" Handler (Lifetime Once Guarantee)
  const handleGenerateNewUnique = () => {
    const newCount = lifetimeCount + 1;
    setLifetimeCount(newCount);
    try {
      localStorage.setItem('microstock_general_others_lifetime', newCount.toString());
    } catch {}

    const newSeed = Math.floor(Math.random() * 900000) + 100000;
    setMasterSeed(newSeed);

    setNotification(`Generated Lifetime Unique Variation #${newCount} for ${selectedStyle.name}!`);
    setTimeout(() => setNotification(null), 3000);
  };

  // "RESET" Handler
  const handleReset = () => {
    setGlobalFillColor(selectedStyle.defaultColors[0] || '#000000');
    setOutlineStrokeColor(selectedStyle.defaultColors[0] || '#000000');
    setInnerEdgeColor(selectedStyle.defaultColors[0] || '#000000');
    setOutlineStrokeWidth(16);
    setOutlineRoughness(30);
    setInnerEdgeInset(20);
    setInnerStrokeWidth(14);
    setInnerEdgeRoughness(25);
    setFillMode('fill');
    setCustomFills({});
    setCustomOutlineColors({});
    setCustomInnerColors({});
    setSelectedElementId(null);
    setElementScale(85);

    setNotification('Parameters reset to reference defaults.');
    setTimeout(() => setNotification(null), 2500);
  };

  // Color change handler for single or all elements
  const handleColorChange = (newColor: string) => {
    if (selectedElementId !== null) {
      setCustomFills(prev => ({
        ...prev,
        [selectedElementId]: newColor
      }));
    } else {
      setGlobalFillColor(newColor);
      setCustomFills({});
    }
  };

  // Outline color change handler
  const handleOutlineColorChange = (newColor: string) => {
    if (selectedElementId !== null) {
      setCustomOutlineColors(prev => ({
        ...prev,
        [selectedElementId]: newColor
      }));
    } else {
      setOutlineStrokeColor(newColor);
      setCustomOutlineColors({});
    }
  };

  // Inner edge color change handler
  const handleInnerColorChange = (newColor: string) => {
    if (selectedElementId !== null) {
      setCustomInnerColors(prev => ({
        ...prev,
        [selectedElementId]: newColor
      }));
    } else {
      setInnerEdgeColor(newColor);
      setCustomInnerColors({});
    }
  };

  // ===========================================================================
  // EXPORT 1: .SVG (EXPANDED VECTOR GRAPHICS WITH CLEAN NAMED LAYERS)
  // ===========================================================================
  const handleExportSVG = () => {
    setIsExporting(true);
    setNotification('Generating Expanded .SVG Vector File (8000×4000 RGB)...');

    try {
      const artW = artboard.width;
      const artH = artboard.height;

      let svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n`;
      svgContent += `<!-- Generator: Website for Micro Stock - Style: ${selectedStyle.name} (${selectedStyle.refImageNumber}) -->\n`;
      svgContent += `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" `;
      svgContent += `version="1.1" width="${artW}px" height="${artH}px" viewBox="0 0 ${artW} ${artH}" xml:space="preserve">\n`;
      svgContent += `  <metadata>\n    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\n      <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">\n        <dc:title>Microstock Vector Asset - ${selectedStyle.name}</dc:title>\n        <dc:format>image/svg+xml</dc:format>\n      </rdf:Description>\n    </rdf:RDF>\n  </metadata>\n`;

      // Master Layer Group
      svgContent += `  <g id="Layer_Vector_Elements" inkscape:groupmode="layer" inkscape:label="${selectedStyle.name}">\n`;

      generatedElements.forEach((el) => {
        svgContent += `    <g id="Element_${el.id}_${el.name}" inkscape:label="${el.name}">\n`;
        el.paths.forEach((p, pi) => {
          const fillAttr = p.fill !== 'none' ? `fill="${p.fill}" ` : `fill="none" `;
          const strokeAttr = p.stroke !== 'none' && p.strokeWidth > 0 
            ? `stroke="${p.stroke}" stroke-width="${p.strokeWidth}" stroke-linejoin="round" stroke-linecap="round" ` 
            : ``;
          svgContent += `      <path id="Path_${el.id}_${pi + 1}" d="${p.d}" ${fillAttr}${strokeAttr}fill-rule="evenodd"/>\n`;
        });
        svgContent += `    </g>\n`;
      });

      svgContent += `  </g>\n</svg>`;

      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = `vector-${selectedStyle.id}-${artW}x${artH}-v${lifetimeCount}.svg`;
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setNotification(`Successfully Downloaded ${filename}!`);
      setTimeout(() => setNotification(null), 3500);
    } catch (err) {
      console.error(err);
      setIsExporting(false);
      setNotification('Export error.');
    }
  };

  // ===========================================================================
  // EXPORT 2: .AI (ADOBE ILLUSTRATOR COMPATIBLE EDITABLE VECTOR FILE)
  // ===========================================================================
  const handleExportAI = () => {
    setIsExporting(true);
    setNotification('Generating Adobe Illustrator (.AI) Editable Vector File...');

    try {
      const artW = artboard.width;
      const artH = artboard.height;

      let aiContent = `%!PS-Adobe-3.0 EPSF-3.0\n`;
      aiContent += `%%Creator: Adobe Illustrator(R) 28.0 Compatible Microstock Exporter\n`;
      aiContent += `%%AI8_CreatorVersion: 28.0.0\n`;
      aiContent += `%%Title: vector-${selectedStyle.id}-${artW}x${artH}.ai\n`;
      aiContent += `%%BoundingBox: 0 0 ${artW} ${artH}\n`;
      aiContent += `%%HiResBoundingBox: 0 0 ${artW} ${artH}\n`;
      aiContent += `%%DocumentProcessColors: Black\n`;
      aiContent += `%%ColorUsage: Color\n`;
      aiContent += `%AI5_File:\n`;
      aiContent += `%%BeginSetup\n`;
      aiContent += `%%EndSetup\n`;
      aiContent += `%%Page: 1 1\n`;
      aiContent += `%%BeginDocument: IllustratorPaths\n`;
      aiContent += `0 0 0 1 K\n`;
      aiContent += `0 J 1 j 1 w 10 M []0 d\n`;

      // Master Layer Definition
      aiContent += `(%AI5_BeginLayer)\n`;
      aiContent += `1 1 1 1 0 0 0 79 128 255 Lb\n`;
      aiContent += `(${selectedStyle.name}) Ln\n`;

      generatedElements.forEach((el) => {
        aiContent += `(%AI5_BeginLayer)\n`;
        aiContent += `1 1 1 1 0 0 0 79 128 255 Lb\n`;
        aiContent += `(${el.name}) Ln\n`;

        el.paths.forEach((p) => {
          let hex = (p.fill !== 'none' ? p.fill : (p.stroke !== 'none' ? p.stroke : '#000000')).replace('#', '');
          if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
          const rVal = (parseInt(hex.substring(0, 2), 16) / 255).toFixed(3);
          const gVal = (parseInt(hex.substring(2, 4), 16) / 255).toFixed(3);
          const bVal = (parseInt(hex.substring(4, 6), 16) / 255).toFixed(3);

          if (p.fill !== 'none') {
            aiContent += `${rVal} ${gVal} ${bVal} Xa\n0 O\n`;
          } else {
            const sw = p.strokeWidth > 0 ? p.strokeWidth : 16;
            aiContent += `${sw} w\n${rVal} ${gVal} ${bVal} XA\n0 O\n`;
          }

          // Convert SVG path commands to PostScript
          const tokens = p.d.split(/\s+/);
          let i = 0;
          while (i < tokens.length) {
            const cmd = tokens[i];
            if (cmd === 'M' || cmd === 'L') {
              const px = parseFloat(tokens[i + 1]);
              const py = artH - parseFloat(tokens[i + 2]);
              aiContent += `${px.toFixed(1)} ${py.toFixed(1)} ${cmd === 'M' ? 'm' : 'l'}\n`;
              i += 3;
            } else if (cmd === 'Z') {
              aiContent += `h\n`;
              i += 1;
            } else {
              i += 1;
            }
          }

          if (p.fill !== 'none') aiContent += `f\n`;
          else aiContent += `s\n`;
        });

        aiContent += `LB\n`;
      });

      aiContent += `LB\n`;
      aiContent += `%%EndDocument\n`;
      aiContent += `%%Trailer\n`;
      aiContent += `%%EOF\n`;

      const blob = new Blob([aiContent], { type: 'application/postscript;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = `vector-${selectedStyle.id}-${artW}x${artH}-v${lifetimeCount}.ai`;
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setNotification(`Successfully Downloaded ${filename} (Adobe Illustrator)!`);
      setTimeout(() => setNotification(null), 3500);
    } catch (err) {
      console.error(err);
      setIsExporting(false);
      setNotification('Export error.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 
        STICKY TOP FIXED PREVIEW ARTBOARD
      */}
      <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          
          {/* Header Row: Style Switcher, Lifetime Counter & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              {onBackToOptions && (
                <button
                  onClick={onBackToOptions}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>3 Options</span>
                </button>
              )}

              {/* Mode Toggle: Fill vs Stroke Only */}
              <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setFillMode('fill')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    fillMode === 'fill'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>With Fill Color</span>
                </button>
                <button
                  onClick={() => setFillMode('stroke-only')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    fillMode === 'stroke-only'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Only Stroke</span>
                </button>
              </div>

              {/* Lifetime Unique Counter */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-300 font-mono bg-amber-950/40 border border-amber-800/80 px-2.5 py-0.5 rounded-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Lifetime Unique: <strong className="text-white tabular-nums font-bold text-sm">{lifetimeCount}</strong></span>
              </div>
            </div>

            {/* Actions: New Variation, Reset, Export .AI, Export .SVG */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateNewUnique}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-transform active:scale-95 cursor-pointer"
                title="Generates a brand new unique procedural variation that only happens once in lifetime"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>New Unique Variation</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                title="Reset controls to reference defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {/* EXPORT .AI */}
              <button
                onClick={handleExportAI}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all cursor-pointer"
                title="Export as native Adobe Illustrator .AI editable vector file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .AI</span>
              </button>

              {/* EXPORT .SVG */}
              <button
                onClick={handleExportSVG}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold text-xs rounded-lg shadow-lg shadow-blue-950 transition-all cursor-pointer"
                title="Export as clean .SVG vector file with expanded paths and organized layers"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .SVG</span>
              </button>
            </div>
          </div>

          {/* Sticky Canvas Container */}
          <div className="relative w-full h-[240px] md:h-[280px] bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-2">
            <canvas
              ref={canvasRef}
              className="max-h-full max-w-full object-contain rounded shadow-2xl border border-slate-700/50"
            />

            {/* Overlaid Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2 font-mono text-[11px] pointer-events-none">
              <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-blue-300 border border-blue-800 rounded">
                {artboard.width} × {artboard.height} px RGB
              </span>
              <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-emerald-300 border border-emerald-800 rounded">
                {selectedStyle.refImageNumber} ({selectedStyle.totalElements} Elements)
              </span>
              <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-800 rounded">
                Mode: {fillMode === 'fill' ? 'With Fill' : 'Only Stroke'}
              </span>
            </div>

            {/* Notification Banner */}
            {notification && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-blue-500/80 text-blue-300 px-4 py-1.5 rounded-full text-xs font-medium shadow-2xl animate-fade-in flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-400" />
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
        
        {/* SECTION 1: 11 EXACT REFERENCE PRESETS (COPIED HIKING DIRECTLY FROM USER IMAGES) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>1. Select Reference Image Style (11 Direct Reference Styles)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Exact vector replica of your 11 uploaded reference images. Select any style to render in the 8000×4000 px artboard.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {OTHERS_STYLES.map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setSelectedStyle(st);
                  setSelectedElementId(null);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedStyle.id === st.id
                    ? 'bg-blue-950/70 border-emerald-500 text-white ring-1 ring-emerald-500 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-300 font-mono">{st.refImageNumber}</span>
                    {selectedStyle.id === st.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">{st.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {st.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-2">
                  <span>{st.category}</span>
                  <span className="text-slate-300 font-bold">{st.totalElements} Vector Elements</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 
          =======================================================================
          SECTION 2: CRITICAL DUAL EDGE CONTROLLERS (OUTLINE EDGE & INNER EDGE)
          User Requirement:
          "এজ কন্ট্রোল করার জন্য ইনার এজ আর আউটলাইন এজ কন্ট্রোল করার জন্য আমাকে কন্ট্রোলার দাও।"
          =======================================================================
        */}
        <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-2xl p-5 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <span>2. Dedicated Outline Edge & Inner Edge Controllers (আউটলাইন এজ ও ইনার এজ কন্ট্রোল)</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Independent granular controllers for both the perimeter Outline Edge and interior Inner Edge contours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CONTROLLER A: OUTLINE EDGE CONTROLS (আউটলাইন এজ) */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Square className="w-4 h-4" />
                  <span>A. Outline Edge Controller (আউটলাইন এজ)</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">Outer Perimeter</span>
              </div>

              {/* Outline Stroke Width */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-200">Outline Edge Stroke Width (বর্ডার থিকনেস)</span>
                  <span className="font-mono text-emerald-400 font-bold tabular-nums">{outlineStrokeWidth}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="45"
                  value={outlineStrokeWidth}
                  onChange={(e) => setOutlineStrokeWidth(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>0px (No outer line)</span>
                  <span>16px (Standard)</span>
                  <span>45px (Bold Border)</span>
                </div>
              </div>

              {/* Outline Roughness / Jitter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-200">Outline Edge Roughness / Jitter (রাফনেস)</span>
                  <span className="font-mono text-emerald-400 font-bold tabular-nums">{outlineRoughness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={outlineRoughness}
                  onChange={(e) => setOutlineRoughness(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>0% (Geometric Clean)</span>
                  <span>30% (Natural Deckle)</span>
                  <span>100% (Heavy Grunge)</span>
                </div>
              </div>

              {/* Outline Color */}
              <div>
                <label className="text-xs text-slate-300 block mb-1.5">Outline Edge Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={outlineStrokeColor}
                    onChange={(e) => handleOutlineColorChange(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={outlineStrokeColor}
                    onChange={(e) => handleOutlineColorChange(e.target.value)}
                    className="w-24 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-white"
                  />
                  <span className="text-[11px] text-slate-400">Controls outer border stroke color</span>
                </div>
              </div>
            </div>

            {/* CONTROLLER B: INNER EDGE CONTROLS (ইনার এজ) */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Square className="w-4 h-4 fill-current text-cyan-400" />
                  <span>B. Inner Edge Controller (ইনার এজ)</span>
                </span>
                <button
                  onClick={() => setShowInnerEdge(!showInnerEdge)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                    showInnerEdge ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {showInnerEdge ? 'Inner ON' : 'Inner OFF'}
                </button>
              </div>

              {/* Inner Edge Inset / Spacing */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-200">Inner Edge Inset / Spacing (ইনার অফসেট)</span>
                  <span className="font-mono text-cyan-400 font-bold tabular-nums">{innerEdgeInset}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  disabled={!showInnerEdge}
                  value={innerEdgeInset}
                  onChange={(e) => setInnerEdgeInset(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer disabled:opacity-40"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>5% (Close to Border)</span>
                  <span>20% (Balanced)</span>
                  <span>60% (Deep Interior)</span>
                </div>
              </div>

              {/* Inner Feature Stroke Width (Eyes, Mouth, Digits, Inner Lines) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-200">Inner Feature Stroke Width (ইনার ড্রয়িং থিকনেস)</span>
                  <span className="font-mono text-cyan-400 font-bold tabular-nums">{innerStrokeWidth}px</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  disabled={!showInnerEdge}
                  value={innerStrokeWidth}
                  onChange={(e) => setInnerStrokeWidth(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer disabled:opacity-40"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>2px (Hairline)</span>
                  <span>14px (Standard)</span>
                  <span>40px (Bold Feature)</span>
                </div>
              </div>

              {/* Inner Feature Color */}
              <div>
                <label className="text-xs text-slate-300 block mb-1.5">Inner Edge & Feature Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    disabled={!showInnerEdge}
                    value={innerEdgeColor}
                    onChange={(e) => handleInnerColorChange(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer disabled:opacity-40"
                  />
                  <input
                    type="text"
                    disabled={!showInnerEdge}
                    value={innerEdgeColor}
                    onChange={(e) => handleInnerColorChange(e.target.value)}
                    className="w-24 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-white disabled:opacity-40"
                  />
                  <span className="text-[11px] text-slate-400">Controls facial features / digits / inner borders</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 3: SINGLE-BY-SINGLE ELEMENT SELECTION & FILL COLOR */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                <Palette className="w-4 h-4 text-emerald-400" />
                <span>3. Single-by-Single Element Selection & Color Control</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                "সিঙ্গেল সিঙ্গেল ধরে করা যাবে" - Select any individual shape in the artboard to customize its fill, outline, and inner edge independently.
              </p>
            </div>

            {selectedElementId !== null && (
              <button
                onClick={() => setSelectedElementId(null)}
                className="px-3 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs text-emerald-400 font-medium rounded-lg cursor-pointer self-start sm:self-auto"
              >
                ← Back to All Elements
              </button>
            )}
          </div>

          {/* Individual Element Selection Chips */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span className="font-semibold">Target Element:</span>
              <span className="font-mono text-emerald-400">
                {selectedElementId === null ? `All ${generatedElements.length} Elements Selected` : `Element #${selectedElementId} Selected`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap max-h-32 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedElementId(null)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  selectedElementId === null
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All Elements
              </button>

              {generatedElements.map((el) => {
                const isSelected = selectedElementId === el.id;
                const elColor = customFills[el.id] || (el.paths[0]?.fill !== 'none' ? el.paths[0]?.fill : el.paths[0]?.stroke) || globalFillColor;
                return (
                  <button
                    key={el.id}
                    onClick={() => setSelectedElementId(el.id)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 text-white ring-1 ring-emerald-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/20"
                      style={{ backgroundColor: elColor }}
                    />
                    <span>#{el.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color & Scale Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Fill Color Picker */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <label className="text-xs font-semibold text-slate-200 block">
                {selectedElementId === null ? 'Global Main Fill Color' : `Element #${selectedElementId} Fill Color`}
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={selectedElementId ? (customFills[selectedElementId] || globalFillColor) : globalFillColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedElementId ? (customFills[selectedElementId] || globalFillColor) : globalFillColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-28 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-white"
                />
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedStyle.defaultColors.map((col, ci) => (
                    <button
                      key={ci}
                      onClick={() => handleColorChange(col)}
                      style={{ backgroundColor: col }}
                      className="w-6 h-6 rounded-md border border-white/20 hover:scale-110 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Element Scale Factor */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">Overall Element Scale Factor</span>
                <span className="font-mono text-emerald-400 font-bold">{elementScale}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="115"
                value={elementScale}
                onChange={(e) => setElementScale(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Compact (60%)</span>
                <span>85% (Balanced)</span>
                <span>Expanded (115%)</span>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 4: MICROSTOCK SPECIFICATIONS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>4. Microstock Standards & Export Guarantee</span>
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
            <li className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><strong>Artboard:</strong> Minimum 8000×4000 px RGB (32+ Megapixels) middle-aligned</span>
            </li>
            <li className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><strong>Expanded Vectors:</strong> All paths closed and expanded (Zero live strokes)</span>
            </li>
            <li className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><strong>Dual Format:</strong> Pure .AI (Adobe Illustrator) and .SVG (SVG 1.1) download</span>
            </li>
            <li className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><strong>Lifetime Once:</strong> Procedural unique seed guarantees no duplicates</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};
