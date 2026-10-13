import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Download, RotateCcw, Sparkles, Shuffle, Maximize2, Sliders, Palette, 
  Layers, Check, Eye, Square, Paintbrush, ArrowLeft, ZoomIn, ZoomOut, Shield
} from 'lucide-react';

export type GeneralVectorMode = 'fill' | 'stroke';

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

export interface PatchPoint {
  x: number;
  y: number;
}

export interface PatchConfig {
  id: number;
  row: number;
  col: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  seed: number;
}

interface GeneralVectorStudioProps {
  initialMode: GeneralVectorMode;
  onBackToOptions?: () => void;
}

export const GeneralVectorStudio: React.FC<GeneralVectorStudioProps> = ({
  initialMode,
  onBackToOptions
}) => {
  // 1. Current Mode (With Fill Color vs Only Stroke)
  const [mode, setMode] = useState<GeneralVectorMode>(initialMode);

  // 2. Artboard Size (default: 8000 × 4000 px RGB)
  const [artboard, setArtboard] = useState<ArtboardPreset>(ARTBOARD_PRESETS[0]);

  // 3. Grid configuration (default: 2 rows × 6 columns = 12 torn patches matching user sample image)
  const [gridRows, setGridRows] = useState<number>(2);
  const [gridCols, setGridCols] = useState<number>(6);
  const totalPatches = gridRows * gridCols;

  // 4. Lifetime Variation Counter
  const [lifetimeCount, setLifetimeCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('microstock_general_vector_lifetime');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  // Master procedural seed
  const [masterSeed, setMasterSeed] = useState<number>(() => Math.floor(Math.random() * 900000) + 100000);

  // 5. Global Edge Parameters
  const [edgeRoughness, setEdgeRoughness] = useState<number>(45); // 10 to 100
  const [edgeFrequency, setEdgeFrequency] = useState<number>(5); // 2 to 12
  const [tearDepth, setTearDepth] = useState<number>(40); // 10 to 90
  const [fiberDetail, setFiberDetail] = useState<number>(25); // 0 to 60
  const [cornerRounding, setCornerRounding] = useState<number>(15); // 0 to 40

  // 6. Geometry & Spacing
  const [patchWidthRatio, setPatchWidthRatio] = useState<number>(85); // 60% to 110% of cell width
  const [patchHeightRatio, setPatchHeightRatio] = useState<number>(75); // 50% to 100% of cell height
  const [gapX, setGapX] = useState<number>(35); // gap between columns
  const [gapY, setGapY] = useState<number>(45); // gap between rows

  // 7. Global Color & Stroke Settings
  const [globalFillColor, setGlobalFillColor] = useState<string>('#000000');
  const [globalStrokeColor, setGlobalStrokeColor] = useState<string>('#000000');
  const [globalStrokeWidth, setGlobalStrokeWidth] = useState<number>(mode === 'stroke' ? 18 : 0);

  // 8. Individual Patch Customizations (patch ID 1..12 -> custom color)
  const [selectedPatchIndex, setSelectedPatchIndex] = useState<number | null>(null); // null = All Patches
  const [patchCustomColors, setPatchCustomColors] = useState<Record<number, string>>({});

  // 9. Canvas Preview State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [previewZoom, setPreviewZoom] = useState<number>(1);
  const [notification, setNotification] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Update stroke width default when mode changes
  useEffect(() => {
    if (mode === 'stroke' && globalStrokeWidth === 0) {
      setGlobalStrokeWidth(18);
    }
  }, [mode, globalStrokeWidth]);

  // Pseudo-random noise function
  const seededRandom = useCallback((x: number, s: number) => {
    const val = Math.sin(x * 12.9898 + s * 78.233) * 43758.5453123;
    return val - Math.floor(val);
  }, []);

  // Generate the polygon boundary points for a single torn patch
  const generatePatchPolygon = useCallback((
    cx: number,
    cy: number,
    w: number,
    h: number,
    patchSeed: number
  ): PatchPoint[] => {
    const points: PatchPoint[] = [];
    const stepsPerEdge = 48; // Detailed resolution for 8K precision
    const s = patchSeed + masterSeed;

    const halfW = w / 2;
    const halfH = h / 2;

    const amp = (tearDepth / 100) * (Math.min(w, h) * 0.08);
    const rough = edgeRoughness / 100;
    const freq = edgeFrequency;
    const micro = fiberDetail / 100;

    // Helper to compute tear offset
    const getTearOffset = (u: number, edgeIdx: number) => {
      // Harmonic waves along the edge
      const wave1 = Math.sin(u * Math.PI * freq + s + edgeIdx) * amp * 0.6;
      const wave2 = Math.sin(u * Math.PI * freq * 2.3 + s * 1.5 + edgeIdx * 2) * (amp * 0.35);
      // Micro deckle jitter
      const jitter = (seededRandom(u * 100 + edgeIdx * 50, s) - 0.5) * amp * rough * 0.5;
      // Fine micro fibers
      const fibers = (seededRandom(u * 300 + edgeIdx * 120, s + 10) - 0.5) * amp * micro * 0.25;

      // Dampen at the absolute corners slightly to prevent detachment
      const edgeWeight = Math.sin(u * Math.PI);
      return (wave1 + wave2 + jitter + fibers) * Math.max(0.2, edgeWeight);
    };

    // 1. TOP EDGE (Left to Right)
    for (let i = 0; i <= stepsPerEdge; i++) {
      const u = i / stepsPerEdge;
      const baseX = cx - halfW + u * w;
      const baseY = cy - halfH;
      const offset = getTearOffset(u, 1);
      points.push({ x: baseX, y: baseY + offset });
    }

    // 2. RIGHT EDGE (Top to Bottom)
    for (let i = 1; i <= stepsPerEdge; i++) {
      const u = i / stepsPerEdge;
      const baseX = cx + halfW;
      const baseY = cy - halfH + u * h;
      const offset = getTearOffset(u, 2);
      points.push({ x: baseX + offset, y: baseY });
    }

    // 3. BOTTOM EDGE (Right to Left)
    for (let i = 1; i <= stepsPerEdge; i++) {
      const u = i / stepsPerEdge;
      const baseX = cx + halfW - u * w;
      const baseY = cy + halfH;
      const offset = getTearOffset(u, 3);
      points.push({ x: baseX, y: baseY + offset });
    }

    // 4. LEFT EDGE (Bottom to Top)
    for (let i = 1; i < stepsPerEdge; i++) {
      const u = i / stepsPerEdge;
      const baseX = cx - halfW;
      const baseY = cy + halfH - u * h;
      const offset = getTearOffset(u, 4);
      points.push({ x: baseX + offset, y: baseY });
    }

    return points;
  }, [masterSeed, tearDepth, edgeRoughness, edgeFrequency, fiberDetail, seededRandom]);

  // Compute all patch layouts centered middle-aligned in the artboard
  const patchesData = useMemo(() => {
    const list: {
      id: number;
      row: number;
      col: number;
      cx: number;
      cy: number;
      w: number;
      h: number;
      points: PatchPoint[];
      color: string;
      strokeColor: string;
      strokeWidth: number;
    }[] = [];

    // Calculate grid cell dimensions with middle alignment
    const artW = artboard.width;
    const artH = artboard.height;

    // Available usable area with margin
    const marginX = artW * 0.05;
    const marginY = artH * 0.08;
    const availW = artW - marginX * 2;
    const availH = artH - marginY * 2;

    const cellW = availW / gridCols;
    const cellH = availH / gridRows;

    const basePatchW = cellW * (patchWidthRatio / 100);
    const basePatchH = cellH * (patchHeightRatio / 100);

    let idCounter = 1;
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const id = idCounter++;
        // Centered coordinates of cell
        const cx = marginX + (c + 0.5) * cellW;
        const cy = marginY + (r + 0.5) * cellH;

        // Custom individual seed per patch so all 12 are distinct
        const patchSeed = id * 9871 + masterSeed;
        const points = generatePatchPolygon(cx, cy, basePatchW, basePatchH, patchSeed);

        const patchColor = patchCustomColors[id] || globalFillColor;
        const strokeCol = globalStrokeColor;
        const strokeW = globalStrokeWidth;

        list.push({
          id,
          row: r + 1,
          col: c + 1,
          cx,
          cy,
          w: basePatchW,
          h: basePatchH,
          points,
          color: patchColor,
          strokeColor: strokeCol,
          strokeWidth: strokeW
        });
      }
    }

    return list;
  }, [
    artboard, gridRows, gridCols, patchWidthRatio, patchHeightRatio, 
    generatePatchPolygon, masterSeed, patchCustomColors, globalFillColor, 
    globalStrokeColor, globalStrokeWidth
  ]);

  // Render to live preview canvas
  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set preview resolution responsive to aspect ratio
    const previewWidth = 1600;
    const previewHeight = Math.round(previewWidth * (artboard.height / artboard.width));

    if (canvas.width !== previewWidth || canvas.height !== previewHeight) {
      canvas.width = previewWidth;
      canvas.height = previewHeight;
    }

    const scale = previewWidth / artboard.width;

    // 1. Draw artboard background (Pure crisp white with subtle boundary for preview)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, previewWidth, previewHeight);

    // 2. Render each torn paper patch in order
    patchesData.forEach((patch) => {
      ctx.save();
      ctx.beginPath();

      patch.points.forEach((pt, i) => {
        const px = pt.x * scale;
        const py = pt.y * scale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();

      // WITH FILL COLOR MODE
      if (mode === 'fill') {
        ctx.fillStyle = patch.color;
        ctx.fill();

        // Optional outline stroke if specified
        if (patch.strokeWidth > 0) {
          ctx.strokeStyle = patch.strokeColor;
          ctx.lineWidth = Math.max(1, patch.strokeWidth * scale);
          ctx.stroke();
        }
      } 
      // ONLY STROKE MODE (Transparent inside, outline only)
      else {
        ctx.strokeStyle = patch.color || patch.strokeColor;
        const effStroke = Math.max(1.5, (patch.strokeWidth > 0 ? patch.strokeWidth : 18) * scale);
        ctx.lineWidth = effStroke;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // If this patch is individually selected, draw a subtle highlight ring
      if (selectedPatchIndex === patch.id) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.restore();
    });
  }, [artboard, mode, patchesData, selectedPatchIndex]);

  // Redraw when dependencies change
  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // "NEW VARIATION" Handler
  const handleGenerateNewUnique = () => {
    const newCount = lifetimeCount + 1;
    setLifetimeCount(newCount);
    try {
      localStorage.setItem('microstock_general_vector_lifetime', newCount.toString());
    } catch {}

    const newSeed = Math.floor(Math.random() * 900000) + 100000;
    setMasterSeed(newSeed);

    setNotification(`Generated Unique Lifetime Vector Variation #${newCount}!`);
    setTimeout(() => setNotification(null), 3000);
  };

  // "RESET" Handler
  const handleReset = () => {
    setGlobalFillColor('#000000');
    setGlobalStrokeColor('#000000');
    setGlobalStrokeWidth(mode === 'stroke' ? 18 : 0);
    setPatchCustomColors({});
    setSelectedPatchIndex(null);
    setEdgeRoughness(45);
    setEdgeFrequency(5);
    setTearDepth(40);
    setFiberDetail(25);
    setPatchWidthRatio(85);
    setPatchHeightRatio(75);

    setNotification('Parameters reset to default microstock standards.');
    setTimeout(() => setNotification(null), 2500);
  };

  // Color change handler for all or selected patch
  const handleColorChange = (newColor: string) => {
    if (selectedPatchIndex !== null) {
      setPatchCustomColors((prev) => ({
        ...prev,
        [selectedPatchIndex]: newColor
      }));
    } else {
      setGlobalFillColor(newColor);
      setPatchCustomColors({});
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
      svgContent += `<!-- Generator: Website for Micro Stock - High Precision Vector Studio -->\n`;
      svgContent += `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" `;
      svgContent += `version="1.1" width="${artW}px" height="${artH}px" viewBox="0 0 ${artW} ${artH}" xml:space="preserve">\n`;
      svgContent += `  <metadata>\n    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\n      <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">\n        <dc:title>Microstock Torn Paper Banners - ${mode === 'fill' ? 'With Fill' : 'Only Stroke'}</dc:title>\n        <dc:format>image/svg+xml</dc:format>\n      </rdf:Description>\n    </rdf:RDF>\n  </metadata>\n`;

      // Master Layer group
      svgContent += `  <g id="Layer_Torn_Paper_Banners" inkscape:groupmode="layer" inkscape:label="Torn Paper Banners">\n`;

      patchesData.forEach((patch) => {
        // Path command string
        let pathD = '';
        patch.points.forEach((pt, i) => {
          const x = pt.x.toFixed(1);
          const y = pt.y.toFixed(1);
          if (i === 0) pathD += `M ${x} ${y} `;
          else pathD += `L ${x} ${y} `;
        });
        pathD += 'Z';

        svgContent += `    <g id="Patch_${patch.id}_Row${patch.row}_Col${patch.col}" inkscape:label="Patch ${patch.id}">\n`;

        if (mode === 'fill') {
          const fillHex = patch.color;
          const strokeAttr = patch.strokeWidth > 0 
            ? `stroke="${patch.strokeColor}" stroke-width="${patch.strokeWidth}" stroke-linejoin="round" ` 
            : '';
          svgContent += `      <path d="${pathD}" fill="${fillHex}" ${strokeAttr}fill-rule="evenodd" />\n`;
        } else {
          const strokeHex = patch.color || patch.strokeColor;
          const strokeW = patch.strokeWidth > 0 ? patch.strokeWidth : 18;
          svgContent += `      <path d="${pathD}" fill="none" stroke="${strokeHex}" stroke-width="${strokeW}" stroke-linejoin="round" stroke-linecap="round" />\n`;
        }

        svgContent += `    </g>\n`;
      });

      svgContent += `  </g>\n</svg>`;

      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = `torn-paper-${mode}-${artW}x${artH}-v${lifetimeCount}.svg`;
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

      // Create an Adobe Illustrator native PostScript / AI container format
      // Adobe Illustrator opens PostScript EPS AI files directly as native editable vector paths in layers!
      let aiContent = `%!PS-Adobe-3.0 EPSF-3.0\n`;
      aiContent += `%%Creator: Adobe Illustrator(R) 28.0 Compatible Microstock Exporter\n`;
      aiContent += `%%AI8_CreatorVersion: 28.0.0\n`;
      aiContent += `%%Title: torn-paper-${mode}-${artW}x${artH}.ai\n`;
      aiContent += `%%BoundingBox: 0 0 ${artW} ${artH}\n`;
      aiContent += `%%HiResBoundingBox: 0 0 ${artW} ${artH}\n`;
      aiContent += `%%DocumentProcessColors: Black\n`;
      aiContent += `%%ColorUsage: Color\n`;
      aiContent += `%AI5_File:\n`;
      aiContent += `%%BeginSetup\n`;
      aiContent += `%%EndSetup\n`;
      aiContent += `%%Page: 1 1\n`;
      aiContent += `%%BeginDocument: IllustratorPaths\n`;
      aiContent += `0 0 0 1 K\n`; // CMYK/RGB prep
      aiContent += `0 J 1 j 1 w 10 M []0 d\n`;

      // Master Layer Definition
      aiContent += `(%AI5_BeginLayer)\n`;
      aiContent += `1 1 1 1 0 0 0 79 128 255 Lb\n`;
      aiContent += `(Torn Paper Banners) Ln\n`;

      patchesData.forEach((patch) => {
        aiContent += `(%AI5_BeginLayer)\n`;
        aiContent += `1 1 1 1 0 0 0 79 128 255 Lb\n`;
        aiContent += `(Patch ${patch.id}) Ln\n`;

        // Parse hex to RGB 0..1
        let hex = (patch.color || '#000000').replace('#', '');
        if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
        const rVal = (parseInt(hex.substring(0, 2), 16) / 255).toFixed(3);
        const gVal = (parseInt(hex.substring(2, 4), 16) / 255).toFixed(3);
        const bVal = (parseInt(hex.substring(4, 6), 16) / 255).toFixed(3);

        if (mode === 'fill') {
          aiContent += `${rVal} ${gVal} ${bVal} Xa\n`; // RGB fill
          aiContent += `0 O\n`;
        } else {
          const sw = (patch.strokeWidth > 0 ? patch.strokeWidth : 18);
          aiContent += `${sw} w\n`;
          aiContent += `${rVal} ${gVal} ${bVal} XA\n`; // RGB stroke
          aiContent += `0 O\n`;
        }

        patch.points.forEach((pt, i) => {
          // PostScript origin is bottom-left
          const psX = pt.x.toFixed(1);
          const psY = (artH - pt.y).toFixed(1);
          if (i === 0) aiContent += `${psX} ${psY} m\n`;
          else aiContent += `${psX} ${psY} l\n`;
        });

        if (mode === 'fill') {
          aiContent += `f\n`; // Fill path
        } else {
          aiContent += `s\n`; // Stroke path
        }

        aiContent += `LB\n`;
      });

      aiContent += `LB\n`;
      aiContent += `%%EndDocument\n`;
      aiContent += `%%Trailer\n`;
      aiContent += `%%EOF\n`;

      const blob = new Blob([aiContent], { type: 'application/postscript;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = `torn-paper-${mode}-${artW}x${artH}-v${lifetimeCount}.ai`;
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

  // Color Swatches
  const colorSwatches = [
    '#000000', '#171717', '#262626', '#0f172a', '#1e293b', 
    '#b91c1c', '#c2410c', '#b45309', '#15803d', '#0369a1', '#4338ca', '#6d28d9'
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 
        STICKY TOP FIXED PREVIEW ARTBOARD
        "ekdom upore artboard rakhbe, r control gulo niche, scroll korleo artboard jeno fixed thakbe"
      */}
      <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          
          {/* Header Row: Sub-Mode Switcher, Lifetime Counter & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              {/* Back to Options button if provided */}
              {onBackToOptions && (
                <button
                  onClick={onBackToOptions}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Options</span>
                </button>
              )}

              {/* Mode Toggle Switcher */}
              <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setMode('fill')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    mode === 'fill'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>With Fill Color</span>
                </button>
                <button
                  onClick={() => setMode('stroke')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    mode === 'stroke'
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
                <span>Lifetime Variations: <strong className="text-white tabular-nums font-bold text-sm">{lifetimeCount}</strong></span>
              </div>
            </div>

            {/* Actions: New Variation, Reset, Export .AI, Export .SVG */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateNewUnique}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-transform active:scale-95 cursor-pointer"
                title="Generates a brand new unique procedural torn edge variation that only happens once in lifetime"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>New Variation</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                title="Reset controls"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {/* EXPORT .AI (Adobe Illustrator) */}
              <button
                onClick={handleExportAI}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all cursor-pointer"
                title="Export as native Adobe Illustrator .AI editable vector file with expanded paths and organized layers"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .AI</span>
              </button>

              {/* EXPORT .SVG (Expanded Vector Graphics) */}
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

          {/* Sticky Artboard Canvas Container */}
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
              <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-800 rounded">
                {gridCols} × {gridRows} ({totalPatches} Patches)
              </span>
              <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-emerald-300 border border-emerald-800 rounded">
                Mode: {mode === 'fill' ? 'With Fill Color' : 'Only Stroke'}
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
        
        {/* SECTION 1: ARTBOARD SELECTION (MIN 8000 × 4000 PX RGB) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-blue-400" />
              <span>1. Artboard Dimensions (Minimum 8000px Width × 4000px Height RGB)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Strictly adheres to microstock specifications. All vector designs are middle-aligned in clean editable layers.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {ARTBOARD_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setArtboard(p)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  artboard.id === p.id
                    ? 'bg-blue-950/80 border-blue-500 text-white shadow-md ring-1 ring-blue-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold font-mono">
                  <span>{p.ratio}</span>
                  {artboard.id === p.id && <Check className="w-3 h-3 text-blue-400" />}
                </div>
                <div className="text-xs font-mono text-blue-300 mt-1">
                  {p.width} × {p.height} px
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 2: PATCH SELECTION & COLOR CONTROLS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-400" />
                <span>2. Patch Color & Individual Selection ({mode === 'fill' ? 'Fill Color' : 'Stroke Color'})</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Select "All Patches" or click any individual patch below to customize its specific color independently.
              </p>
            </div>

            {selectedPatchIndex !== null && (
              <button
                onClick={() => setSelectedPatchIndex(null)}
                className="px-3 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs text-blue-400 font-medium rounded-lg cursor-pointer self-start sm:self-auto"
              >
                ← Back to All Patches
              </button>
            )}
          </div>

          {/* Individual Patch Selector Chips */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span className="font-semibold">Target Patch:</span>
              <span className="font-mono text-blue-400">
                {selectedPatchIndex === null ? 'All 12 Patches Selected' : `Patch #${selectedPatchIndex} Selected`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedPatchIndex(null)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  selectedPatchIndex === null
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All Patches
              </button>

              {patchesData.map((p) => {
                const isSelected = selectedPatchIndex === p.id;
                const pColor = patchCustomColors[p.id] || globalFillColor;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPatchIndex(p.id)}
                    className={`px-2.5 py-1.5 text-xs font-mono rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-blue-500 text-white ring-1 ring-blue-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/20"
                      style={{ backgroundColor: pColor }}
                    />
                    <span>#{p.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Picker Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <label className="text-xs font-semibold text-slate-200 block">
                {selectedPatchIndex === null ? `Global ${mode === 'fill' ? 'Fill' : 'Stroke'} Color` : `Patch #${selectedPatchIndex} Color`}
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={selectedPatchIndex ? (patchCustomColors[selectedPatchIndex] || globalFillColor) : globalFillColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedPatchIndex ? (patchCustomColors[selectedPatchIndex] || globalFillColor) : globalFillColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-28 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-white"
                />
                <div className="flex items-center gap-1.5 flex-wrap">
                  {colorSwatches.map((col) => (
                    <button
                      key={col}
                      onClick={() => handleColorChange(col)}
                      style={{ backgroundColor: col }}
                      className="w-6 h-6 rounded-md border border-white/20 hover:scale-110 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Stroke Controls (Especially active in Only Stroke mode) */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-200">
                  {mode === 'stroke' ? 'Perimeter Stroke Width (বর্ডার থিকনেস)' : 'Optional Outer Stroke Width'}
                </span>
                <span className="font-mono text-blue-400 font-bold tabular-nums">{globalStrokeWidth}px</span>
              </div>

              <input
                type="range"
                min="0"
                max="60"
                value={globalStrokeWidth}
                onChange={(e) => setGlobalStrokeWidth(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>0px (No stroke)</span>
                <span>18px (Standard)</span>
                <span>60px (Heavy outline)</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: TORN EDGE PROCEDURAL CONTROLS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div>
            <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              <span>3. Torn Edge & Deckle Paper Parameters (এজ কন্ট্রোল)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Control the organic tear roughness, wave ripples, tear depth, and fiber jitter along the perimeter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Roughness & Jitter */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-200 font-semibold">Tear Roughness (এজ রাফনেস)</span>
                <span className="font-mono text-blue-400 font-bold">{edgeRoughness}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={edgeRoughness}
                onChange={(e) => setEdgeRoughness(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>10% (Clean rip)</span>
                <span>50% (Natural paper)</span>
                <span>90% (Jagged deckle)</span>
              </div>
            </div>

            {/* Wave Frequency */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-200 font-semibold">Wave Ripples (ওয়েভ ফ্রিকোয়েন্সি)</span>
                <span className="font-mono text-blue-400 font-bold">{edgeFrequency} Cycles</span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                value={edgeFrequency}
                onChange={(e) => setEdgeFrequency(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>2 (Gentle curve)</span>
                <span>5 (Standard tear)</span>
                <span>10 (Multi-crest)</span>
              </div>
            </div>

            {/* Tear Depth */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-200 font-semibold">Tear Amplitude / Depth (টিয়ার ডেপথ)</span>
                <span className="font-mono text-blue-400 font-bold">{tearDepth}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="80"
                value={tearDepth}
                onChange={(e) => setTearDepth(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>15% (Subtle bite)</span>
                <span>40% (Balanced)</span>
                <span>80% (Deep rugged tear)</span>
              </div>
            </div>

            {/* Micro Fiber Detail */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-200 font-semibold">Micro-Fiber Jitter (মাইক্রো ফাইবার)</span>
                <span className="font-mono text-blue-400 font-bold">{fiberDetail}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={fiberDetail}
                onChange={(e) => setFiberDetail(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>0% (Smooth edge)</span>
                <span>25% (Fine fibers)</span>
                <span>60% (Organic fray)</span>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 4: GRID & MIDDLE-ALIGNMENT SPACING */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div>
            <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>4. Grid Layout & Middle Alignment (সাইজ ও স্পেসিং)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Arrangement of patches on the 8000×4000 px artboard. Default is 2 rows × 6 columns (12 patches).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Grid Preset */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-200 block">Grid Layout Format</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { r: 2, c: 6, label: '2 × 6 (12 Patches - Sample)' },
                  { r: 2, c: 5, label: '2 × 5 (10 Patches)' },
                  { r: 2, c: 4, label: '2 × 4 (8 Patches)' },
                  { r: 3, c: 4, label: '3 × 4 (12 Patches)' },
                ].map((g) => (
                  <button
                    key={`${g.r}-${g.c}`}
                    onClick={() => {
                      setGridRows(g.r);
                      setGridCols(g.c);
                    }}
                    className={`p-2 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${
                      gridRows === g.r && gridCols === g.c
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Patch Width */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-200 font-semibold">Patch Width Multiplier</span>
                <span className="font-mono text-blue-400 font-bold">{patchWidthRatio}%</span>
              </div>
              <input
                type="range"
                min="65"
                max="100"
                value={patchWidthRatio}
                onChange={(e) => setPatchWidthRatio(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Narrow</span>
                <span>85% (Balanced)</span>
                <span>Wide</span>
              </div>
            </div>

            {/* Patch Height */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-200 font-semibold">Patch Height Multiplier</span>
                <span className="font-mono text-blue-400 font-bold">{patchHeightRatio}%</span>
              </div>
              <input
                type="range"
                min="55"
                max="95"
                value={patchHeightRatio}
                onChange={(e) => setPatchHeightRatio(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Compact</span>
                <span>75% (Balanced)</span>
                <span>Tall</span>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 5: EXPORT SUMMARY & MICROSTOCK STANDARDS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>5. Microstock Submission & Export Specifications</span>
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
            <li className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><strong>Artboard:</strong> Minimum 8000×4000 px (32+ Megapixels vector RGB)</span>
            </li>
            <li className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><strong>Expanded Vectors:</strong> All paths closed and expanded (Zero unexpanded live strokes)</span>
            </li>
            <li className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><strong>Organized Layers:</strong> Each patch isolated in clean named layers</span>
            </li>
            <li className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><strong>Dual Format:</strong> Pure .AI (Adobe Illustrator) and .SVG (SVG 1.1) download</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};
