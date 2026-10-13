import React, { useState, useEffect, useRef } from 'react';
import { AnimationAsset } from '../types/microstock';
import { ANIMATION_ASSETS } from '../data/mockAssets';
import { Play, Pause, RotateCcw, FastForward, Download, CheckCircle, Info, Sparkles } from 'lucide-react';

export const AnimationWorkView: React.FC = () => {
  const [selectedAnim, setSelectedAnim] = useState<AnimationAsset>(ANIMATION_ASSETS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [bgMode, setBgMode] = useState<'dark' | 'transparent' | 'light'>('dark');
  const [exportFormat, setExportFormat] = useState<'LOTTIE' | 'MP4' | 'WEBM' | 'GIF'>('LOTTIE');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);
  const startTimeRef = useRef<number>(performance.now());

  // Real-time 60FPS motion canvas renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localTime = currentTime;
    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        localTime += delta * playbackSpeed;
        if (localTime >= selectedAnim.duration) {
          localTime = 0; // seamless loop
        }
        setCurrentTime(localTime);
      }

      const t = localTime;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      if (selectedAnim.animationType === 'infinity') {
        // Render glowing kinetic infinity curve with particle trails
        ctx.save();
        ctx.lineWidth = 4;

        // Draw multiple glowing harmonic loops
        for (let pass = 0; pass < 3; pass++) {
          ctx.beginPath();
          ctx.strokeStyle = pass === 0 ? 'rgba(56, 189, 248, 0.4)' : pass === 1 ? 'rgba(168, 85, 247, 0.8)' : '#38bdf8';
          ctx.lineWidth = pass === 2 ? 3 : 8 - pass * 2;

          for (let theta = 0; theta < Math.PI * 2; theta += 0.04) {
            const scale = 140;
            const denom = 1 + Math.sin(theta) * Math.sin(theta);
            const x = cx + (scale * Math.cos(theta)) / denom;
            const y = cy + (scale * Math.sin(theta) * Math.cos(theta)) / denom;

            if (theta === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Animated circulating photon packet along the curve
        const progressTheta = (t / selectedAnim.duration) * Math.PI * 2;
        const pScale = 140;
        const pDenom = 1 + Math.sin(progressTheta) * Math.sin(progressTheta);
        const px = cx + (pScale * Math.cos(progressTheta)) / pDenom;
        const py = cy + (pScale * Math.sin(progressTheta) * Math.cos(progressTheta)) / pDenom;

        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 20;
        ctx.fill();

        // Particles trailing
        for (let i = 1; i <= 6; i++) {
          const trailTheta = progressTheta - (i * 0.12);
          const tDenom = 1 + Math.sin(trailTheta) * Math.sin(trailTheta);
          const tx = cx + (pScale * Math.cos(trailTheta)) / tDenom;
          const ty = cy + (pScale * Math.sin(trailTheta) * Math.cos(trailTheta)) / tDenom;
          ctx.beginPath();
          ctx.arc(tx, ty, 5 - i * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(168, 85, 247, ${1 - i * 0.15})`;
          ctx.fill();
        }

        ctx.restore();
      } else if (selectedAnim.animationType === 'wave') {
        // Harmonic undulating ribbons
        ctx.save();
        for (let wave = 0; wave < 4; wave++) {
          ctx.beginPath();
          ctx.strokeStyle = wave % 2 === 0 ? 'rgba(56, 189, 248, 0.7)' : 'rgba(236, 72, 153, 0.7)';
          ctx.lineWidth = 3;
          for (let x = 40; x < w - 40; x += 6) {
            const y = cy + Math.sin((x * 0.02) + (t * 4) + wave) * (35 + wave * 10);
            if (x === 40) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.restore();
      } else if (selectedAnim.animationType === 'orbit') {
        // Cyber pulse orbital rings
        ctx.save();
        ctx.lineWidth = 2;
        for (let r = 1; r <= 3; r++) {
          ctx.beginPath();
          ctx.arc(cx, cy, r * 45 + Math.sin(t * 3 + r) * 6, 0, Math.PI * 2);
          ctx.strokeStyle = r === 2 ? '#a855f7' : '#38bdf8';
          ctx.stroke();

          // Satellite nodes
          const angle = (t * (2 / r)) + r;
          const sx = cx + Math.cos(angle) * (r * 45);
          const sy = cy + Math.sin(angle) * (r * 45);
          ctx.beginPath();
          ctx.arc(sx, sy, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }
        ctx.restore();
      } else if (selectedAnim.animationType === 'pulse') {
        // Micro-interaction checkmark and pulse
        ctx.save();
        const pulseR = 40 + ((t % 1.5) / 1.5) * 45;
        const alpha = 1 - (t % 1.5) / 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, 38, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx - 14, cy);
        ctx.lineTo(cx - 4, cy + 10);
        ctx.lineTo(cx + 14, cy - 8);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.restore();
      } else {
        // Sparkle starlight loop
        ctx.save();
        for (let i = 0; i < 16; i++) {
          const angle = (i * Math.PI * 2) / 16;
          const dist = 60 + Math.sin(t * 5 + i) * 35;
          const sx = cx + Math.cos(angle) * dist;
          const sy = cy + Math.sin(angle) * dist;
          ctx.beginPath();
          ctx.arc(sx, sy, 3 + Math.sin(t * 4 + i) * 2, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#fbbf24';
          ctx.fill();
        }
        ctx.restore();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isPlaying, playbackSpeed, selectedAnim]);

  const handleDownloadSimulation = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Hero Banner */}
      <div className="border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-violet-400 mb-2">
            <span>Department 03</span>
            <span aria-hidden="true">·</span>
            <span>Microstock Motion & Animation</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
            3. Animation & Motion Graphics
          </h1>
          <p className="text-sm md:text-base text-slate-400 mt-2 max-w-2xl">
            Seamless 60 FPS motion loops, UI micro-interactions, Lottie JSON vectors, and transparent alpha-channel video stock assets.
          </p>
        </div>

        {/* Format Badges */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl">
          <span className="text-violet-400 font-semibold">60 FPS Native</span>
          <span aria-hidden="true">·</span>
          <span>4K Loop Ready</span>
          <span aria-hidden="true">·</span>
          <span>Zero Loop Jitter</span>
        </div>
      </div>

      {/* Main Studio Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Interactive Motion Player */}
        <div className="lg:col-span-2 space-y-4">
          {/* Player Viewport */}
          <div
            className={`relative rounded-2xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-6 min-h-[420px] transition-colors ${
              bgMode === 'dark'
                ? 'bg-slate-950'
                : bgMode === 'transparent'
                ? 'bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] bg-[size:20px_20px] bg-[#0f172a]'
                : 'bg-white'
            }`}
          >
            <canvas
              ref={canvasRef}
              width={640}
              height={380}
              className="max-w-full max-h-[360px]"
            />

            {/* Overlaid Microstock Spec Watermark Info */}
            <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[11px]">
              <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-violet-300 border border-violet-800 rounded">
                60 FPS Live
              </span>
              <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-800 rounded">
                {selectedAnim.dimensions}
              </span>
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-1.5">
              {(['dark', 'transparent', 'light'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setBgMode(mode)}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-colors ${
                    bgMode === mode
                      ? 'bg-violet-600 text-white font-bold'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Player Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            {/* Scrubber Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>{currentTime.toFixed(2)}s</span>
                <span className="text-violet-400">
                  {selectedAnim.isSeamlessLoop ? 'Loop: Seamless 360°' : 'One-Shot Trigger'}
                </span>
                <span>{selectedAnim.duration.toFixed(2)}s</span>
              </div>
              <input
                type="range"
                min="0"
                max={selectedAnim.duration}
                step="0.05"
                value={currentTime}
                onChange={(e) => {
                  setCurrentTime(Number(e.target.value));
                  setIsPlaying(false);
                }}
                className="w-full accent-violet-500 cursor-pointer"
              />
            </div>

            {/* Button Controls Row */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:text-white text-slate-400 rounded-lg transition-colors cursor-pointer"
                  title="Reset to 0s"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1 pl-2">
                  {[0.5, 1, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
                        playbackSpeed === spd
                          ? 'bg-slate-800 text-violet-400 font-bold border border-violet-800'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Seamless Loop Quality Badge */}
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Zero Loop Jump</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Asset Selector & Microstock Export Package */}
        <div className="space-y-6">
          {/* Motion Catalog Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white">Select Motion Asset</h3>
            <div className="space-y-2">
              {ANIMATION_ASSETS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedAnim(item);
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedAnim.id === item.id
                      ? 'bg-slate-800 border-violet-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-semibold">{item.title}</h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {item.fps} FPS · {item.duration}s · {item.fileSize}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-slate-900 rounded border border-slate-700 text-violet-400">
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Microstock Export Package Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Microstock Export Formats</h3>
            <p className="text-xs text-slate-400">
              Download industry-standard stock deliverables including Lottie vector json and alpha-channel video.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {(['LOTTIE', 'MP4', 'WEBM', 'GIF'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  className={`p-2 rounded-lg border text-center cursor-pointer transition-colors ${
                    exportFormat === fmt
                      ? 'bg-violet-950 border-violet-600 text-violet-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {fmt} Asset
                </button>
              ))}
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1 font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Selected:</span>
                <span className="text-slate-200 font-bold">{exportFormat} Bundle</span>
              </div>
              <div className="flex justify-between">
                <span>Target Store:</span>
                <span className="text-slate-200">Envato · MotionElements · LottieFiles</span>
              </div>
              <div className="flex justify-between">
                <span>FPS Standard:</span>
                <span className="text-emerald-400">60 FPS Progressive</span>
              </div>
            </div>

            <button
              onClick={handleDownloadSimulation}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-violet-950"
            >
              <Download className="w-4 h-4" />
              <span>{downloadSuccess ? 'Deliverable Package Ready!' : `Download ${exportFormat} Microstock File`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
