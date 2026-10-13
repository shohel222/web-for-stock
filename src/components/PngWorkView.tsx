import React, { useState, useRef, useEffect } from 'react';
import { PngAsset } from '../types/microstock';
import { PNG_ASSETS } from '../data/mockAssets';
import { Download, Sliders, Check, Eye, Sparkles, RefreshCw } from 'lucide-react';

interface PngWorkViewProps {
  onSelectAsset?: (asset: PngAsset) => void;
}

export const PngWorkView: React.FC<PngWorkViewProps> = () => {
  const [bgMode, setBgMode] = useState<'checker-light' | 'checker-dark' | 'slate' | 'white' | 'midnight'>('checker-dark');
  const [selectedAsset, setSelectedAsset] = useState<PngAsset>(PNG_ASSETS[0]);
  const [activeTab, setActiveTab] = useState<'gallery' | 'studio'>('gallery');

  // Studio Adjustments
  const [glowColor, setGlowColor] = useState<string>('#38bdf8');
  const [glowIntensity, setGlowIntensity] = useState<number>(12);
  const [shadowDistance, setShadowDistance] = useState<number>(8);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render processed PNG on Canvas
  useEffect(() => {
    if (activeTab !== 'studio' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedAsset.image;
    img.onload = () => {
      canvas.width = 600;
      canvas.height = 450;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

      // Draw shadow/glow
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = glowIntensity;
      ctx.shadowOffsetX = shadowDistance / 2;
      ctx.shadowOffsetY = shadowDistance;

      // Draw centered image
      const scale = Math.min((canvas.width - 80) / img.width, (canvas.height - 80) / img.height) * zoomLevel;
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (canvas.width - w) / 2;
      const y = (canvas.height - h) / 2;

      ctx.drawImage(img, x, y, w, h);
      ctx.restore();
    };
  }, [activeTab, selectedAsset, glowColor, glowIntensity, shadowDistance, brightness, contrast, zoomLevel]);

  const handleExportProcessed = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${selectedAsset.id}-custom-studio.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const getBackgroundStyle = () => {
    switch (bgMode) {
      case 'checker-light':
        return 'bg-[linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(-45deg,#e2e8f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e2e8f0_75%),linear-gradient(-45deg,transparent_75%,#e2e8f0_75%)] bg-[size:20px_20px] bg-[#f8fafc] text-slate-900';
      case 'checker-dark':
        return 'bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] bg-[size:20px_20px] bg-[#0f172a] text-slate-100';
      case 'white':
        return 'bg-white text-slate-900';
      case 'midnight':
        return 'bg-[#030712] text-slate-100';
      case 'slate':
      default:
        return 'bg-slate-900 text-slate-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Hero Banner */}
      <div className="border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
            <span>Department 02</span>
            <span aria-hidden="true">·</span>
            <span>Microstock Transparent PNG</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
            2. PNG Cutouts & Studio
          </h1>
          <p className="text-sm md:text-base text-slate-400 mt-2 max-w-2xl">
            Isolated 3D renders, crystal emblems, natural flora, and edge-tested transparent stock assets with zero-artifact alpha channels.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cutout Library
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Interactive PNG Studio
          </button>
        </div>
      </div>

      {/* Global Transparency Background Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-medium text-slate-300">
            Transparency Test Surface:
          </span>
          <span className="text-xs text-slate-500 hidden md:inline">
            Verify clean edges and zero white halos against any backdrop
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'checker-dark', label: 'Dark Grid' },
            { id: 'checker-light', label: 'Light Grid' },
            { id: 'midnight', label: 'Jet Black' },
            { id: 'slate', label: 'Deep Slate' },
            { id: 'white', label: 'Pure White' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setBgMode(mode.id as any)}
              className={`px-2.5 py-1 text-xs rounded-md font-mono transition-colors cursor-pointer whitespace-nowrap ${
                bgMode === mode.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Cutout Library */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PNG_ASSETS.map((asset) => (
            <div
              key={asset.id}
              className="group bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Surface Frame with Selected Background Texture */}
                <div className={`relative aspect-[4/3] p-4 flex items-center justify-center transition-colors duration-200 ${getBackgroundStyle()}`}>
                  <img
                    src={asset.image}
                    alt={asset.title}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-cyan-950/80 border border-cyan-800 text-cyan-200 rounded">
                      PNG-24
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono text-slate-300 bg-slate-900/80 border border-slate-700 rounded">
                      Alpha Channel
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 text-[10px] font-mono px-2 py-0.5 bg-slate-900/80 backdrop-blur-md rounded border border-slate-800 text-slate-300">
                    {asset.resolution}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    {asset.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                    <span>{asset.author}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{asset.downloads} downloads</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{asset.dpi} DPI Print</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-4">
                    {asset.keywords.slice(0, 4).map((kw) => (
                      <span key={kw} className="text-[11px] text-slate-400 font-mono">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 py-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setSelectedAsset(asset);
                    setActiveTab('studio');
                  }}
                  className="text-cyan-400 font-medium hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Customize in Studio</span>
                </button>

                <a
                  href={asset.image}
                  download={`${asset.id}.png`}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-md flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export PNG</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Interactive PNG Studio */}
      {activeTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Sidebar */}
          <div className="lg:col-span-1 space-y-5 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div>
              <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                Alpha Studio Controls
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Refine glows, shadows, and color grading before downloading.
              </p>
            </div>

            {/* Asset Select */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">Select Asset</label>
              <select
                value={selectedAsset.id}
                onChange={(e) => {
                  const match = PNG_ASSETS.find((a) => a.id === e.target.value);
                  if (match) setSelectedAsset(match);
                }}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
              >
                {PNG_ASSETS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Glow Color Swatches */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Volumetric Glow Color
              </label>
              <div className="flex items-center gap-2">
                {[
                  { color: '#38bdf8', label: 'Sky' },
                  { color: '#a855f7', label: 'Violet' },
                  { color: '#fbbf24', label: 'Amber' },
                  { color: '#34d399', label: 'Mint' },
                  { color: '#ffffff', label: 'White' },
                ].map((item) => (
                  <button
                    key={item.color}
                    onClick={() => setGlowColor(item.color)}
                    style={{ backgroundColor: item.color }}
                    className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-transform ${
                      glowColor === item.color ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                    }`}
                    title={item.label}
                  />
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Glow Dispersion</span>
                  <span className="font-mono tabular-nums text-cyan-400">{glowIntensity}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={glowIntensity}
                  onChange={(e) => setGlowIntensity(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Drop Shadow Depth</span>
                  <span className="font-mono tabular-nums text-cyan-400">{shadowDistance}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={shadowDistance}
                  onChange={(e) => setShadowDistance(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Brightness</span>
                  <span className="font-mono tabular-nums text-cyan-400">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="140"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Contrast</span>
                  <span className="font-mono tabular-nums text-cyan-400">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="140"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Scale Zoom</span>
                  <span className="font-mono tabular-nums text-cyan-400">{zoomLevel.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setGlowIntensity(12);
                setShadowDistance(8);
                setBrightness(100);
                setContrast(100);
                setZoomLevel(1);
                setGlowColor('#38bdf8');
              }}
              className="w-full py-2 bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 hover:text-white rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Parameters
            </button>
          </div>

          {/* Canvas Render Area */}
          <div className="lg:col-span-2 flex flex-col justify-between space-y-4">
            <div className={`rounded-2xl p-6 border border-slate-800 flex items-center justify-center min-h-[460px] ${getBackgroundStyle()}`}>
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[450px] rounded-lg"
              />
            </div>

            {/* Export Bar */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                <span className="text-white font-semibold block">{selectedAsset.title}</span>
                <span className="font-mono">300 DPI · Transparent PNG with preserved alpha layer</span>
              </div>

              <button
                onClick={handleExportProcessed}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-950 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Custom Processed PNG</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
