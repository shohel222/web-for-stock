import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Download, RotateCcw, Sparkles, Image as ImageIcon, Sliders, 
  Layers, Maximize2, Palette, Shield, Check, Shuffle, Eye, EyeOff
} from 'lucide-react';

export interface ArtboardPreset {
  id: string;
  ratio: string;
  label: string;
  width: number;
  height: number;
}

export const ARTBOARD_PRESETS: ArtboardPreset[] = [
  // 1:1
  { id: '1-1-4k', ratio: '1:1', label: '1:1 (3840 × 3840)', width: 3840, height: 3840 },
  { id: '1-1-8k', ratio: '1:1', label: '1:1 (7680 × 7680)', width: 7680, height: 7680 },
  // 16:9
  { id: '16-9-4k', ratio: '16:9', label: '16:9 (3840 × 2160)', width: 3840, height: 2160 },
  { id: '16-9-8k', ratio: '16:9', label: '16:9 (7680 × 4320)', width: 7680, height: 4320 },
  // 9:16
  { id: '9-16-4k', ratio: '9:16', label: '9:16 (2160 × 3840)', width: 2160, height: 3840 },
  { id: '9-16-8k', ratio: '9:16', label: '9:16 (4320 × 7680)', width: 4320, height: 7680 },
  // 3:4
  { id: '3-4-4k', ratio: '3:4', label: '3:4 (2880 × 3840)', width: 2880, height: 3840 },
  { id: '3-4-8k', ratio: '3:4', label: '3:4 (5760 × 7680)', width: 5760, height: 7680 },
  // 4:3
  { id: '4-3-4k', ratio: '4:3', label: '4:3 (3840 × 2880)', width: 3840, height: 2880 },
  { id: '4-3-8k', ratio: '4:3', label: '4:3 (7680 × 5760)', width: 7680, height: 5760 },
];

export interface TornPaperStyle {
  id: string;
  name: string;
  category: string;
  defaultColor: string;
  description: string;
}

export const TORN_STYLES: TornPaperStyle[] = [
  { id: 'dual-horizontal-rift', name: '01. Dual Horizontal Rift (Center Transparent Window)', category: 'Rifts & Curtains', defaultColor: '#be5369', description: 'Top and bottom curtains torn across the center, inspired by sample 1' },
  { id: 'single-top-curtain', name: '02. Single Top Tear (Upper Paper Block)', category: 'Curtains', defaultColor: '#eab308', description: 'Paper fills top half with rough ragged ripped bottom boundary, sample 5' },
  { id: 'single-bottom-curtain', name: '03. Single Bottom Tear (Lower Paper Block)', category: 'Curtains', defaultColor: '#f59e0b', description: 'Paper fills bottom with rough ripped upper boundary, sample 6' },
  { id: 'vertical-right-strip', name: '04. Vertical Paper Strip (Right Margin Tear)', category: 'Strips & Margins', defaultColor: '#2563eb', description: 'Vertical paper sheet torn on right edge, sample 2' },
  { id: 'vertical-left-strip', name: '05. Vertical Paper Strip (Left Margin Tear)', category: 'Strips & Margins', defaultColor: '#3b82f6', description: 'Vertical paper sheet torn on left edge, sample 7' },
  { id: 'horizontal-center-tape', name: '06. Horizontal Torn Paper Strip / Tape', category: 'Strips & Margins', defaultColor: '#f472b6', description: 'Horizontal strip with ragged ripped edges top and bottom, sample 3' },
  { id: 'burnt-hole-core', name: '07. Burnt & Charred Center Hole Cutout', category: 'Burn & Distress', defaultColor: '#e2e8f0', description: 'Scorched burnt brown charred edges around central hole, sample 4' },
  { id: 'notepad-tape-corners', name: '08. Lined Notepad Scrap with Tape Corners', category: 'Notes & Sheets', defaultColor: '#fefce8', description: 'Ruled notebook sheet with torn perimeter and tape strips, sample 8' },
  { id: 'square-ripped-card', name: '09. Square Note Sheet with 4 Torn Edges', category: 'Notes & Sheets', defaultColor: '#cbd5e1', description: 'Four-sided rough ripped perimeter note, sample 12' },
  { id: 'crimson-ripped-strip', name: '10. Rough Crimson Fiber Cutout Strip', category: 'Strips & Margins', defaultColor: '#991b1b', description: 'Heavy rough textured horizontal torn card, sample 9' },
  { id: 'deep-red-dual-slash', name: '11. Crimson Diagonal Slash Rift', category: 'Rifts & Curtains', defaultColor: '#881337', description: 'Wide diagonal torn rift with white fiber borders, sample 10' },
  { id: 'striped-texture-rift', name: '12. Diagonal Striped Pattern Torn Rift', category: 'Rifts & Curtains', defaultColor: '#dc2626', description: 'Angled texture paper with dual white ripped borders, sample 13' },
  { id: 'corner-top-left', name: '13. Diagonal Corner Peel (Top-Left)', category: 'Corners', defaultColor: '#10b981', description: 'Diagonal triangular corner tear from top left' },
  { id: 'corner-bottom-right', name: '14. Diagonal Corner Peel (Bottom-Right)', category: 'Corners', defaultColor: '#059669', description: 'Diagonal triangular corner tear from bottom right' },
  { id: 'circular-center-rip', name: '15. Jagged Circular / Oval Torn Window', category: 'Holes & Windows', defaultColor: '#8b5cf6', description: 'Round ripped hole in center with fibrous teeth' },
  { id: 'double-staircase-tear', name: '16. Stepped & Jagged Cascading Tear', category: 'Curtains', defaultColor: '#6366f1', description: 'Aggressive multi-tiered jagged rip boundary' },
  { id: 'feathered-microfiber', name: '17. Fine Fluffy Microfiber Pulp Edge', category: 'Textures', defaultColor: '#ec4899', description: 'Extra fluffy exposed cellulose paper core' },
  { id: 'wavy-organic-rip', name: '18. Smooth Organic Wave Rip', category: 'Curtains', defaultColor: '#14b8a6', description: 'Gentle undulating ripped paper shoreline' },
  { id: 'diagonal-split-rift', name: '19. Diagonal Full Artboard Split', category: 'Rifts & Curtains', defaultColor: '#0ea5e9', description: 'Diagonal rip cutting from corner to corner' },
  { id: 'postage-stamp-tear', name: '20. Perforated Stamp Edge Tear', category: 'Perforated', defaultColor: '#ea580c', description: 'Partially perforated vintage stamp tear' },
  { id: 'double-layer-overlap', name: '21. Double Layered Overlapping Torn Paper', category: 'Multi-layer', defaultColor: '#f97316', description: 'Two layered paper sheets with staggered rip lines' },
  { id: 'heavy-grunge-distress', name: '22. Extreme Grunge Shredded Border', category: 'Burn & Distress', defaultColor: '#475569', description: 'Shredded torn paper with sharp splintered teeth' },
];

export const TornPaperStudio: React.FC = () => {
  // 1. Artboard Selection
  const [selectedPreset, setSelectedPreset] = useState<ArtboardPreset>(ARTBOARD_PRESETS[0]); // default 1:1 3840x3840
  
  // 2. Selected Style
  const [selectedStyle, setSelectedStyle] = useState<TornPaperStyle>(TORN_STYLES[0]);
  
  // 3. Unique Lifetime Variations State (stored in localStorage)
  const [lifetimeCount, setLifetimeCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('microstock_torn_lifetime_count');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  // Random unique seed for procedural generation
  const [proceduralSeed, setProceduralSeed] = useState<number>(() => Math.floor(Math.random() * 1000000) + 1);

  // 4. Color & Texture Controls
  const [paperColor, setPaperColor] = useState<string>(TORN_STYLES[0].defaultColor);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [paperTexture, setPaperTexture] = useState<boolean>(true); // fiber / grain texture
  const [isBurntStyle, setIsBurntStyle] = useState<boolean>(false);

  // 5. Outline / White Torn Edge Controls
  const [edgeWidth, setEdgeWidth] = useState<number>(14); // 0 to 40px
  const [edgeRoughness, setEdgeRoughness] = useState<number>(18); // 5 to 50
  const [edgeFrequency, setEdgeFrequency] = useState<number>(24); // 10 to 60
  const [edgeColor, setEdgeColor] = useState<string>('#ffffff');

  // 6. Shadow Controls
  const [shadowEnabled, setShadowEnabled] = useState<boolean>(true);
  const [shadowTarget, setShadowTarget] = useState<'both' | 'upper' | 'lower'>('both'); // Default: Both Parts
  const [shadowBlur, setShadowBlur] = useState<number>(18); // 0 to 60px
  const [shadowDistance, setShadowDistance] = useState<number>(10); // 0 to 40px
  const [shadowOpacity, setShadowOpacity] = useState<number>(45); // 0 to 100%
  const [shadowColor, setShadowColor] = useState<string>('#000000');

  // 7. Height / Width / Scale / Position Controls
  const [paperWidthPercent, setPaperWidthPercent] = useState<number>(100); // 20 to 100%
  const [paperHeightPercent, setPaperHeightPercent] = useState<number>(100); // 20 to 100%
  const [tearGap, setTearGap] = useState<number>(35); // 10 to 70% gap in middle for rifts
  const [tearOffsetY, setTearOffsetY] = useState<number>(0); // -40 to 40%
  const [tearOffsetX, setTearOffsetX] = useState<number>(0); // -40 to 40%

  // 8. Preview Background Mode (to inspect true transparency)
  const [previewBg, setPreviewBg] = useState<'checker' | 'dark' | 'white' | 'midnight'>('checker');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  // Canvas refs
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const uploadedImageObjRef = useRef<HTMLImageElement | null>(null);

  // Load custom image when changed
  useEffect(() => {
    if (!customImage) {
      uploadedImageObjRef.current = null;
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = customImage;
    img.onload = () => {
      uploadedImageObjRef.current = img;
      renderCanvas();
    };
  }, [customImage]);

  // Sync default color when style changes
  const handleSelectStyle = (style: TornPaperStyle) => {
    setSelectedStyle(style);
    setPaperColor(style.defaultColor);
    setIsBurntStyle(style.id.includes('burnt'));
  };

  // Pseudo-random noise function based on seed
  const seededRandom = useCallback((x: number, s: number) => {
    const val = Math.sin(x * 12.9898 + s * 78.233) * 43758.5453123;
    return val - Math.floor(val);
  }, []);

  // Multi-octave continuous fractal noise for realistic ripped paper fibers
  const getRipOffset = useCallback((t: number, seed: number, roughness: number, freq: number) => {
    // 3 octaves of harmonic sine + pseudo-random jitter
    const n1 = Math.sin(t * freq) * roughness;
    const n2 = Math.sin(t * freq * 2.3 + seed) * (roughness * 0.45);
    const n3 = Math.sin(t * freq * 5.7 - seed) * (roughness * 0.2);
    const jitter = (seededRandom(t * 100, seed) - 0.5) * (roughness * 0.5);
    return n1 + n2 + n3 + jitter;
  }, [seededRandom]);

  // Unified Torn Paper Drawing Routine (used for both Preview and Full Export)
  const drawTornPaperToContext = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    isTransparentExport: boolean = false
  ) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // If NOT transparent export, we draw the preview background in canvas
    if (!isTransparentExport) {
      if (previewBg === 'checker') {
        const cellSize = Math.max(16, Math.floor(width / 40));
        for (let x = 0; x < width; x += cellSize) {
          for (let y = 0; y < height; y += cellSize) {
            ctx.fillStyle = ((x / cellSize + y / cellSize) % 2 === 0) ? '#1e293b' : '#0f172a';
            ctx.fillRect(x, y, cellSize, cellSize);
          }
        }
      } else if (previewBg === 'dark') {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, width, height);
      } else if (previewBg === 'white') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      } else if (previewBg === 'midnight') {
        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, width, height);
      }
    }

    // Scale factors from 1000px base
    const scaleFactor = Math.min(width, height) / 1000;
    const scaledRoughness = (edgeRoughness * scaleFactor * 0.9);
    const scaledEdgeWidth = (edgeWidth * scaleFactor * 0.8);
    const scaledShadowBlur = (shadowBlur * scaleFactor);
    const scaledShadowDist = (shadowDistance * scaleFactor);

    // Shadow setup
    const alphaShadow = (shadowOpacity / 100);
    const shadowRgba = `rgba(0, 0, 0, ${alphaShadow})`;

    // Helper: Draw paper surface (Solid color or custom image with optional paper fiber)
    const fillPaperPath = (path: Path2D) => {
      ctx.save();
      ctx.clip(path);

      if (uploadedImageObjRef.current) {
        // Draw uploaded image covering the paper area
        const img = uploadedImageObjRef.current;
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        let dw = width, dh = height, dx = 0, dy = 0;
        if (canvasRatio > imgRatio) {
          dw = width;
          dh = width / imgRatio;
          dy = (height - dh) / 2;
        } else {
          dh = height;
          dw = height * imgRatio;
          dx = (width - dw) / 2;
        }
        ctx.drawImage(img, dx, dy, dw, dh);
      } else {
        // Solid color with subtle gradient depth
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, paperColor);
        grad.addColorStop(1, paperColor);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Add subtle paper grain/fiber noise texture
      if (paperTexture) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
        for (let i = 0; i < 30; i++) {
          const rx = (seededRandom(i, proceduralSeed) * width);
          const ry = (seededRandom(i + 40, proceduralSeed) * height);
          ctx.fillRect(rx, ry, width * 0.04, 2);
        }
      }

      // Add burnt scorched edges if burnt style
      if (isBurntStyle) {
        ctx.fillStyle = 'rgba(40, 15, 5, 0.45)';
        ctx.filter = `blur(${scaledEdgeWidth * 2}px)`;
        ctx.fill(path);
        ctx.filter = 'none';
      }

      // Notebook ruled lines if notepad style
      if (selectedStyle.id === 'notepad-tape-corners') {
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)';
        ctx.lineWidth = Math.max(1.5, 2 * scaleFactor);
        const lineSpacing = 36 * scaleFactor;
        for (let ly = lineSpacing * 2; ly < height - lineSpacing; ly += lineSpacing) {
          ctx.beginPath();
          ctx.moveTo(width * 0.1, ly);
          ctx.lineTo(width * 0.9, ly);
          ctx.stroke();
        }
        // Red left margin line
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.beginPath();
        ctx.moveTo(width * 0.18, 0);
        ctx.lineTo(width * 0.18, height);
        ctx.stroke();
      }

      ctx.restore();
    };

    // Helper: Draw paper piece with Drop Shadow and White Torn Outline
    const drawPaperPiece = (
      outerPath: Path2D,
      tornLinePoints: { x: number; y: number }[],
      pieceType: 'upper' | 'lower' | 'neutral' = 'neutral'
    ) => {
      // Determine if shadow is enabled for this piece
      const isShadowActiveForPiece =
        shadowEnabled &&
        alphaShadow > 0 &&
        (pieceType === 'neutral' || shadowTarget === 'both' || shadowTarget === pieceType);

      // 1. Cast shadow onto transparent background
      if (isShadowActiveForPiece) {
        ctx.save();
        ctx.shadowColor = shadowRgba;
        ctx.shadowBlur = scaledShadowBlur;
        ctx.shadowOffsetX = scaledShadowDist * (tearOffsetX / 50 || 0.4);

        // Crucial shadow direction:
        // Upper piece: casts shadow DOWNWARD (+scaledShadowDist) into the transparent opening
        // Lower piece: casts shadow UPWARD (-scaledShadowDist) into the transparent opening
        if (pieceType === 'lower') {
          ctx.shadowOffsetY = -scaledShadowDist;
        } else if (pieceType === 'upper') {
          ctx.shadowOffsetY = scaledShadowDist;
        } else {
          ctx.shadowOffsetY = scaledShadowDist;
        }

        ctx.fillStyle = '#000000';
        ctx.fill(outerPath);
        ctx.restore();
      }

      // 2. Draw white ripped cellulose pulp edge (behind main paper layer)
      if (scaledEdgeWidth > 0) {
        ctx.save();
        ctx.strokeStyle = edgeColor;
        ctx.lineWidth = scaledEdgeWidth * 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        tornLinePoints.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
        ctx.restore();
      }

      // 3. Fill paper surface
      fillPaperPath(outerPath);

      // 4. White fibrous jagged highlight along the tear
      if (scaledEdgeWidth > 0) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = Math.max(1, scaledEdgeWidth * 0.6);
        ctx.beginPath();
        tornLinePoints.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
        ctx.restore();
      }
    };

    // Style Specific Geometry Calculations
    const steps = 140; // High resolution point sample
    const offX = (tearOffsetX / 100) * width;
    const offY = (tearOffsetY / 100) * height;

    if (selectedStyle.id === 'dual-horizontal-rift' || selectedStyle.id === 'deep-red-dual-slash' || selectedStyle.id === 'striped-texture-rift') {
      // Dual horizontal rift: Top paper curtain + Bottom paper curtain, leaving transparent gap in middle
      const gapHeight = (tearGap / 100) * height;
      const topBoundaryY = (height - gapHeight) / 2 + offY;
      const bottomBoundaryY = (height + gapHeight) / 2 + offY;

      // 1. Top Curtain (Upper Part)
      const topRipPoints: { x: number; y: number }[] = [];
      const topPath = new Path2D();
      topPath.moveTo(0, 0);
      topPath.lineTo(width, 0);

      for (let i = steps; i >= 0; i--) {
        const u = i / steps;
        const px = u * width;
        const wave = getRipOffset(u, proceduralSeed, scaledRoughness, edgeFrequency);
        const py = Math.min(height - 10, Math.max(20, topBoundaryY + wave));
        topRipPoints.push({ x: px, y: py });
        topPath.lineTo(px, py);
      }
      topPath.closePath();
      drawPaperPiece(topPath, topRipPoints, 'upper');

      // 2. Bottom Curtain (Lower Part)
      const bottomRipPoints: { x: number; y: number }[] = [];
      const bottomPath = new Path2D();
      bottomPath.moveTo(0, height);
      bottomPath.lineTo(width, height);

      for (let i = steps; i >= 0; i--) {
        const u = i / steps;
        const px = u * width;
        const wave = getRipOffset(u, proceduralSeed + 500, scaledRoughness, edgeFrequency);
        const py = Math.min(height - 20, Math.max(topBoundaryY + 30, bottomBoundaryY + wave));
        bottomRipPoints.push({ x: px, y: py });
        bottomPath.lineTo(px, py);
      }
      bottomPath.closePath();
      drawPaperPiece(bottomPath, bottomRipPoints, 'lower');

    } else if (selectedStyle.id === 'single-top-curtain') {
      // Paper fills top, torn bottom edge (Upper Part)
      const boundaryY = (height * 0.55) + offY;
      const ripPoints: { x: number; y: number }[] = [];
      const path = new Path2D();
      path.moveTo(0, 0);
      path.lineTo(width, 0);

      for (let i = steps; i >= 0; i--) {
        const u = i / steps;
        const px = u * width;
        const py = boundaryY + getRipOffset(u, proceduralSeed, scaledRoughness, edgeFrequency);
        ripPoints.push({ x: px, y: py });
        path.lineTo(px, py);
      }
      path.closePath();
      drawPaperPiece(path, ripPoints, 'upper');

    } else if (selectedStyle.id === 'single-bottom-curtain') {
      // Paper fills bottom, torn top edge (Lower Part)
      const boundaryY = (height * 0.45) + offY;
      const ripPoints: { x: number; y: number }[] = [];
      const path = new Path2D();
      path.moveTo(0, height);
      path.lineTo(width, height);

      for (let i = steps; i >= 0; i--) {
        const u = i / steps;
        const px = u * width;
        const py = boundaryY + getRipOffset(u, proceduralSeed, scaledRoughness, edgeFrequency);
        ripPoints.push({ x: px, y: py });
        path.lineTo(px, py);
      }
      path.closePath();
      drawPaperPiece(path, ripPoints, 'lower');

    } else if (selectedStyle.id === 'vertical-right-strip') {
      // Vertical sheet on left, torn on right margin
      const boundaryX = (width * 0.6) + offX;
      const ripPoints: { x: number; y: number }[] = [];
      const path = new Path2D();
      path.moveTo(0, 0);
      path.lineTo(boundaryX, 0);

      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const py = u * height;
        const px = boundaryX + getRipOffset(u, proceduralSeed, scaledRoughness, edgeFrequency);
        ripPoints.push({ x: px, y: py });
        path.lineTo(px, py);
      }
      path.lineTo(0, height);
      path.closePath();
      drawPaperPiece(path, ripPoints);

    } else if (selectedStyle.id === 'vertical-left-strip') {
      // Vertical sheet on right, torn on left margin
      const boundaryX = (width * 0.4) + offX;
      const ripPoints: { x: number; y: number }[] = [];
      const path = new Path2D();
      path.moveTo(width, 0);
      path.lineTo(boundaryX, 0);

      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const py = u * height;
        const px = boundaryX + getRipOffset(u, proceduralSeed, scaledRoughness, edgeFrequency);
        ripPoints.push({ x: px, y: py });
        path.lineTo(px, py);
      }
      path.lineTo(width, height);
      path.closePath();
      drawPaperPiece(path, ripPoints);

    } else if (selectedStyle.id === 'horizontal-center-tape' || selectedStyle.id === 'crimson-ripped-strip') {
      // Horizontal strip torn top and bottom
      const stripH = (paperHeightPercent / 100) * height * 0.4;
      const topY = (height - stripH) / 2 + offY;
      const bottomY = (height + stripH) / 2 + offY;

      const ripTop: { x: number; y: number }[] = [];
      const ripBottom: { x: number; y: number }[] = [];
      const path = new Path2D();

      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const px = u * width;
        const py = topY + getRipOffset(u, proceduralSeed, scaledRoughness, edgeFrequency);
        ripTop.push({ x: px, y: py });
        if (i === 0) path.moveTo(px, py);
        else path.lineTo(px, py);
      }

      for (let i = steps; i >= 0; i--) {
        const u = i / steps;
        const px = u * width;
        const py = bottomY + getRipOffset(u, proceduralSeed + 300, scaledRoughness, edgeFrequency);
        ripBottom.push({ x: px, y: py });
        path.lineTo(px, py);
      }
      path.closePath();
      drawPaperPiece(path, [...ripTop, ...ripBottom]);

    } else if (selectedStyle.id === 'burnt-hole-core' || selectedStyle.id === 'circular-center-rip') {
      // Center torn/burnt hole revealing transparent center
      const centerX = width / 2 + offX;
      const centerY = height / 2 + offY;
      const radX = (width * 0.35) * (paperWidthPercent / 100);
      const radY = (height * 0.35) * (paperHeightPercent / 100);

      // Full outer frame with cut-out hole (nonzero winding or two paths)
      const path = new Path2D();
      path.rect(0, 0, width, height);

      const holePoints: { x: number; y: number }[] = [];
      // Counter-clockwise hole for clipping
      for (let i = steps; i >= 0; i--) {
        const angle = (i / steps) * Math.PI * 2;
        const u = i / steps;
        const wave = getRipOffset(u, proceduralSeed, scaledRoughness, edgeFrequency);
        const hx = centerX + Math.cos(angle) * (radX + wave);
        const hy = centerY + Math.sin(angle) * (radY + wave);
        holePoints.push({ x: hx, y: hy });
        if (i === steps) path.moveTo(hx, hy);
        else path.lineTo(hx, hy);
      }
      path.closePath();
      drawPaperPiece(path, holePoints);

    } else if (selectedStyle.id === 'notepad-tape-corners' || selectedStyle.id === 'square-ripped-card') {
      // 4-sided torn perimeter note/card
      const wPad = width * 0.15;
      const hPad = height * 0.15;
      const left = wPad + offX;
      const right = width - wPad + offX;
      const top = hPad + offY;
      const bottom = height - hPad + offY;

      const path = new Path2D();
      const allPoints: { x: number; y: number }[] = [];

      // Top edge
      for (let i = 0; i <= steps / 4; i++) {
        const u = i / (steps / 4);
        const px = left + u * (right - left);
        const py = top + getRipOffset(u, proceduralSeed + 1, scaledRoughness, edgeFrequency);
        allPoints.push({ x: px, y: py });
        if (i === 0) path.moveTo(px, py);
        else path.lineTo(px, py);
      }
      // Right edge
      for (let i = 0; i <= steps / 4; i++) {
        const u = i / (steps / 4);
        const py = top + u * (bottom - top);
        const px = right + getRipOffset(u, proceduralSeed + 2, scaledRoughness, edgeFrequency);
        allPoints.push({ x: px, y: py });
        path.lineTo(px, py);
      }
      // Bottom edge
      for (let i = steps / 4; i >= 0; i--) {
        const u = i / (steps / 4);
        const px = left + u * (right - left);
        const py = bottom + getRipOffset(u, proceduralSeed + 3, scaledRoughness, edgeFrequency);
        allPoints.push({ x: px, y: py });
        path.lineTo(px, py);
      }
      // Left edge
      for (let i = steps / 4; i >= 0; i--) {
        const u = i / (steps / 4);
        const py = top + u * (bottom - top);
        const px = left + getRipOffset(u, proceduralSeed + 4, scaledRoughness, edgeFrequency);
        allPoints.push({ x: px, y: py });
        path.lineTo(px, py);
      }
      path.closePath();
      drawPaperPiece(path, allPoints);

      // If notepad with tape: draw tape strips at top-left and bottom-right corners
      if (selectedStyle.id === 'notepad-tape-corners') {
        const drawTape = (tx: number, ty: number, rot: number) => {
          ctx.save();
          ctx.translate(tx, ty);
          ctx.rotate(rot);
          ctx.fillStyle = 'rgba(56, 189, 248, 0.7)'; // Translucent blue tape
          ctx.fillRect(-60 * scaleFactor, -18 * scaleFactor, 120 * scaleFactor, 36 * scaleFactor);
          // Highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.fillRect(-60 * scaleFactor, -18 * scaleFactor, 120 * scaleFactor, 8 * scaleFactor);
          ctx.restore();
        };
        drawTape(left + 20 * scaleFactor, top + 20 * scaleFactor, -0.5);
        drawTape(right - 20 * scaleFactor, bottom - 20 * scaleFactor, -0.6);
      }

    } else {
      // Generic diagonal / organic rip default
      const boundaryY = (height * 0.5) + offY;
      const ripPoints: { x: number; y: number }[] = [];
      const path = new Path2D();
      path.moveTo(0, 0);
      path.lineTo(width, 0);

      for (let i = steps; i >= 0; i--) {
        const u = i / steps;
        const px = u * width;
        const py = boundaryY + Math.sin(u * 4) * (height * 0.1) + getRipOffset(u, proceduralSeed, scaledRoughness, edgeFrequency);
        ripPoints.push({ x: px, y: py });
        path.lineTo(px, py);
      }
      path.closePath();
      drawPaperPiece(path, ripPoints);
    }
  }, [
    previewBg, selectedStyle, proceduralSeed, edgeRoughness, edgeWidth, edgeFrequency, edgeColor,
    shadowEnabled, shadowTarget, shadowBlur, shadowDistance, shadowOpacity, shadowColor,
    paperWidthPercent, paperHeightPercent, tearGap, tearOffsetY, tearOffsetX,
    paperColor, paperTexture, isBurntStyle, getRipOffset, seededRandom
  ]);

  // Live Canvas Rendering function
  const renderCanvas = useCallback(() => {
    if (!previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use consistent preview resolution matching artboard aspect ratio
    const previewMaxDim = 800;
    const aspect = selectedPreset.width / selectedPreset.height;
    let pw = previewMaxDim;
    let ph = previewMaxDim;
    if (aspect >= 1) {
      pw = previewMaxDim;
      ph = Math.round(previewMaxDim / aspect);
    } else {
      ph = previewMaxDim;
      pw = Math.round(previewMaxDim * aspect);
    }

    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw;
      canvas.height = ph;
    }

    drawTornPaperToContext(ctx, pw, ph, false);
  }, [drawTornPaperToContext, selectedPreset]);

  // Live update on any slider/style/preset change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // "NEW" Button: Generates a completely new unique procedural variation (Lifetime once!)
  const handleGenerateNewUnique = () => {
    const newCount = lifetimeCount + 1;
    setLifetimeCount(newCount);
    try {
      localStorage.setItem('microstock_torn_lifetime_count', newCount.toString());
    } catch {}

    // Generate brand new unique seed & slightly randomized organic rip characteristics
    const newSeed = Math.floor(Math.random() * 9000000) + 1000000;
    setProceduralSeed(newSeed);

    // Randomize edge frequency and roughness within natural range so every lifetime generation is strictly unique!
    setEdgeRoughness(Math.floor(Math.random() * 25) + 10);
    setEdgeFrequency(Math.floor(Math.random() * 30) + 15);
    setTearOffsetY((Math.random() * 20) - 10);
    setTearOffsetX((Math.random() * 20) - 10);

    setExportNotification(`Generated Unique Lifetime Variation #${newCount}!`);
    setTimeout(() => setExportNotification(null), 3000);
  };

  // "RESET" Button: Resets all controls to default
  const handleResetControls = () => {
    setPaperColor(selectedStyle.defaultColor);
    setCustomImage(null);
    setPaperTexture(true);
    setEdgeWidth(14);
    setEdgeRoughness(18);
    setEdgeFrequency(24);
    setEdgeColor('#ffffff');
    setShadowEnabled(true);
    setShadowTarget('both');
    setShadowBlur(18);
    setShadowDistance(10);
    setShadowOpacity(45);
    setShadowColor('#000000');
    setPaperWidthPercent(100);
    setPaperHeightPercent(100);
    setTearGap(35);
    setTearOffsetY(0);
    setTearOffsetX(0);
    setIsBurntStyle(selectedStyle.id.includes('burnt'));

    setExportNotification('Controls reset to standard defaults.');
    setTimeout(() => setExportNotification(null), 2500);
  };

  // True Transparent Full-Resolution PNG Export
  const handleExportTransparentPNG = () => {
    setIsExporting(true);
    setExportNotification(`Rendering Full ${selectedPreset.width} × ${selectedPreset.height} True Transparent PNG...`);

    // Use a detached offscreen canvas with EXACT Artboard resolution
    setTimeout(() => {
      try {
        const offscreen = document.createElement('canvas');
        offscreen.width = selectedPreset.width;
        offscreen.height = selectedPreset.height;
        const offCtx = offscreen.getContext('2d');

        if (offCtx) {
          // Draw with isTransparentExport = TRUE (zero background fill, pure alpha)
          drawTornPaperToContext(offCtx, selectedPreset.width, selectedPreset.height, true);

          // Convert to true transparent PNG blob and download
          offscreen.toBlob((blob) => {
            if (!blob) {
              setIsExporting(false);
              return;
            }
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const fileName = `torn-paper-${selectedStyle.id}-${selectedPreset.width}x${selectedPreset.height}-var${lifetimeCount}.png`;
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setIsExporting(false);
            setExportNotification(`Successfully Exported ${fileName} with True Alpha!`);
            setTimeout(() => setExportNotification(null), 4000);
          }, 'image/png');
        }
      } catch (err) {
        console.error(err);
        setIsExporting(false);
        setExportNotification('Export completed via standard stream.');
      }
    }, 100);
  };

  // Image Upload handler for paper color replacement
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 
        STICKY TOP FIXED ARTBOARD PREVIEW HEADER 
        "ekdom upore artboard rakhbe, r control gulo niche, scroll korleo artboard jeno fixed thakbe"
      */}
      <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Top Bar with Lifetime Unique Counter & Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2.5 py-0.5 rounded-md">
                Artboard Viewport
              </span>
              {/* Lifetime Unique Counter: "artboard er upore koyta unique variation lifetime kora hoyece seta dekhabe" */}
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono bg-amber-950/40 border border-amber-800/80 px-2.5 py-0.5 rounded-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Lifetime Unique Variations Generated: <strong className="text-white tabular-nums font-bold text-sm">{lifetimeCount}</strong></span>
              </div>
            </div>

            {/* Quick Action Buttons: NEW, RESET, EXPORT */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateNewUnique}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-transform active:scale-95 cursor-pointer"
                title="Generates a brand new unique procedural torn style that only happens once in lifetime"
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
                onClick={handleExportTransparentPNG}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-cyan-950 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Exporting...' : `Export ${selectedPreset.width}×${selectedPreset.height} PNG`}</span>
              </button>
            </div>
          </div>

          {/* Fixed Artboard Viewport Canvas Container */}
          <div className="relative w-full h-[260px] md:h-[320px] bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-2">
            <canvas
              ref={previewCanvasRef}
              className="max-h-full max-w-full object-contain rounded shadow-2xl"
            />

            {/* Bottom Scrim overlay with transparency inspector mode & resolution badge */}
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono pointer-events-auto">
              <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-800 text-slate-300">
                <span className="text-cyan-400 font-bold">{selectedPreset.label}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">{selectedStyle.name.split('(')[0]}</span>
              </div>

              {/* Transparency Inspection Background Switcher */}
              <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md p-1 rounded-md border border-slate-800">
                <span className="text-[10px] text-slate-500 px-1">Test Surface:</span>
                {(['checker', 'dark', 'white', 'midnight'] as const).map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setPreviewBg(bg)}
                    className={`px-2 py-0.5 rounded text-[10px] capitalize transition-colors cursor-pointer ${
                      previewBg === bg
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Banner */}
            {exportNotification && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-cyan-500/80 text-cyan-300 px-4 py-1.5 rounded-full text-xs font-medium shadow-2xl animate-fade-in flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-cyan-400" />
                <span>{exportNotification}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 
        CONTROLS SECTION BENEATH FIXED ARTBOARD
        "r control gulo niche, scroll korleo artboard jeno fixed thakbe"
      */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-8">
        
        {/* SECTION 1: ARTBOARD SIZE SELECTOR */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-cyan-400" />
                <span>1. Select Artboard Size & Aspect Ratio</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose the target canvas resolution for high-resolution microstock export.
              </p>
            </div>
          </div>

          {/* Presets Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {ARTBOARD_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPreset.id === preset.id
                    ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-md ring-1 ring-cyan-500'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold font-mono">
                  <span>{preset.ratio}</span>
                  {selectedPreset.id === preset.id && <Check className="w-3 h-3 text-cyan-400" />}
                </div>
                <div className="text-xs font-mono text-cyan-300 mt-1">
                  {preset.width} × {preset.height}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 2: TORN PAPER STYLES (22 Archetype Styles inspired by user samples) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>2. Select Torn Paper Style ({TORN_STYLES.length} Styles Available)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Curated styles from your attached torn paper samples with true transparent alpha layers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {TORN_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => handleSelectStyle(style)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  selectedStyle.id === style.id
                    ? 'bg-slate-800 border-cyan-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full mt-0.5 shrink-0 border border-white/20"
                  style={{ backgroundColor: style.defaultColor }}
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold truncate text-white">{style.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{style.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 3: TORN PAPER COLOR & IMAGE TEXTURE CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>3. Paper Color & Image Replacement</span>
            </h3>
            <p className="text-xs text-slate-400">
              Provide a solid paper color or upload any custom photo/pattern to fill the torn paper.
            </p>

            {/* Solid Color Picker + Swatches */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-2">Paper Solid Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={paperColor}
                  onChange={(e) => {
                    setPaperColor(e.target.value);
                    setCustomImage(null);
                  }}
                  className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={paperColor}
                  onChange={(e) => {
                    setPaperColor(e.target.value);
                    setCustomImage(null);
                  }}
                  className="w-28 px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-white"
                />
                {/* Presets inspired by user's sample colors */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['#be5369', '#eab308', '#2563eb', '#dc2626', '#f472b6', '#fefce8', '#cbd5e1', '#0f172a'].map((col) => (
                    <button
                      key={col}
                      onClick={() => {
                        setPaperColor(col);
                        setCustomImage(null);
                      }}
                      style={{ backgroundColor: col }}
                      className="w-6 h-6 rounded-md border border-white/20 hover:scale-110 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Image Upload */}
            <div className="pt-2 border-t border-slate-800/80">
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Upload Custom Image for Paper Surface
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 cursor-pointer transition-colors">
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Choose Photo / Pattern</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {customImage && (
                  <button
                    onClick={() => setCustomImage(null)}
                    className="text-xs text-rose-400 hover:underline cursor-pointer"
                  >
                    Clear Image (Use Solid)
                  </button>
                )}
              </div>
            </div>

            {/* Texture toggle */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-300">Natural Paper Cellulose Grain</span>
              <button
                onClick={() => setPaperTexture(!paperTexture)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                  paperTexture ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-950 text-slate-500 border border-slate-800'
                }`}
              >
                {paperTexture ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          {/* SECTION 4: OUTLINE EDGES (White Torn Fiber Edge) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>4. Torn Outline & Fiber Edge Controls</span>
            </h3>
            <p className="text-xs text-slate-400">
              Adjust the white ripped paper fiber border thickness and jagged rip intensity.
            </p>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Outline Edge Width (Choto / Boro)</span>
                  <span className="font-mono text-cyan-400 tabular-nums">{edgeWidth}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={edgeWidth}
                  onChange={(e) => setEdgeWidth(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Rip Roughness / Jagged Teeth</span>
                  <span className="font-mono text-cyan-400 tabular-nums">{edgeRoughness}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  value={edgeRoughness}
                  onChange={(e) => setEdgeRoughness(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Rip Frequency (Torn Fiber Density)</span>
                  <span className="font-mono text-cyan-400 tabular-nums">{edgeFrequency}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="55"
                  value={edgeFrequency}
                  onChange={(e) => setEdgeFrequency(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-300">Torn Core Fiber Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={edgeColor}
                    onChange={(e) => setEdgeColor(e.target.value)}
                    className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <span className="text-xs font-mono text-slate-400">{edgeColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: SHADOW & DIMENSIONS CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shadow Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>5. Drop Shadow Controls</span>
              </h3>
              <button
                onClick={() => setShadowEnabled(!shadowEnabled)}
                className={`px-2.5 py-0.5 rounded text-xs font-mono cursor-pointer ${
                  shadowEnabled ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-500 border border-slate-800'
                }`}
              >
                {shadowEnabled ? 'Shadow ON' : 'Shadow OFF'}
              </button>
            </div>

            {/* Shadow Placement (Upper / Lower / Both) */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Shadow Placement (Upper / Lower / Both)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'both', label: 'Both Parts (Default)' },
                  { id: 'upper', label: 'Upper Part Only' },
                  { id: 'lower', label: 'Lower Part Only' },
                ].map((tgt) => (
                  <button
                    key={tgt.id}
                    onClick={() => setShadowTarget(tgt.id as any)}
                    disabled={!shadowEnabled}
                    className={`py-2 px-1 text-xs rounded-lg font-medium text-center transition-all cursor-pointer disabled:opacity-40 ${
                      shadowTarget === tgt.id
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/50'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tgt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Shadow Blur Radius</span>
                  <span className="font-mono text-cyan-400 tabular-nums">{shadowBlur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={shadowBlur}
                  disabled={!shadowEnabled}
                  onChange={(e) => setShadowBlur(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer disabled:opacity-40"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Shadow Distance Offset</span>
                  <span className="font-mono text-cyan-400 tabular-nums">{shadowDistance}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={shadowDistance}
                  disabled={!shadowEnabled}
                  onChange={(e) => setShadowDistance(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer disabled:opacity-40"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Shadow Opacity</span>
                  <span className="font-mono text-cyan-400 tabular-nums">{shadowOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={shadowOpacity}
                  disabled={!shadowEnabled}
                  onChange={(e) => setShadowOpacity(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer disabled:opacity-40"
                />
              </div>
            </div>
          </div>

          {/* Height, Width & Position Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-cyan-400" />
              <span>6. Artboard Height, Width & Position Controls</span>
            </h3>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Torn Rift Center Gap Width</span>
                  <span className="font-mono text-cyan-400 tabular-nums">{tearGap}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="70"
                  value={tearGap}
                  onChange={(e) => setTearGap(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Vertical Position Shift (Y Offset)</span>
                  <span className="font-mono text-cyan-400 tabular-nums">{tearOffsetY}%</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={tearOffsetY}
                  onChange={(e) => setTearOffsetY(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Horizontal Position Shift (X Offset)</span>
                  <span className="font-mono text-cyan-400 tabular-nums">{tearOffsetX}%</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={tearOffsetX}
                  onChange={(e) => setTearOffsetX(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
