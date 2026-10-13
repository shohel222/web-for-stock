import React, { useState } from 'react';
import { PortalEntrance, OptionType } from './components/PortalEntrance';
import { TornPaperStudio } from './components/TornPaperStudio';
import { AnimationStudio } from './components/AnimationStudio';
import { GeneralVectorStudio, GeneralVectorMode } from './components/GeneralVectorStudio';
import { GeneralOthersStudio } from './components/GeneralOthersStudio';
import { Square, ArrowLeft, Sparkles, Layers } from 'lucide-react';

export type GeneralOptionMode = 'fill' | 'stroke' | 'others';

export default function App() {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [generalSubOption, setGeneralSubOption] = useState<GeneralOptionMode | null>(null);

  // If no option selected: show ONLY the 3 options page
  if (!selectedOption) {
    return <PortalEntrance onSelectOption={(opt) => {
      setSelectedOption(opt);
      setGeneralSubOption(null);
    }} />;
  }

  const optionTitles: Record<OptionType, { num: string; title: string }> = {
    general: { num: '1', title: 'General Work' },
    png: { num: '2', title: 'PNG' },
    animation: { num: '3', title: 'Animation' },
  };

  const current = optionTitles[selectedOption];

  // =========================================================================
  // OPTION 1: GENERAL WORK (3 OPTIONS: 1. Fill, 2. Stroke, 3. Others)
  // "জেনারেল ওয়ার্ক অপশনের ভিতরে তিনটা অপশন আছে। তিন নম্বর অপশন করো আদার্স দিয়ে।"
  // =========================================================================
  if (selectedOption === 'general') {
    // 1.3 Sub-Option 3: Others ( আদার্স )
    if (generalSubOption === 'others') {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
          {/* Top Header */}
          <header className="border-b border-slate-800/80 px-6 py-3 flex items-center justify-between bg-slate-950/95 sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedOption(null);
                  setGeneralSubOption(null);
                }}
                className="font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                Website for Micro Stock
              </button>
              <span className="text-slate-600">/</span>
              <button
                onClick={() => setGeneralSubOption(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                1. General Work
              </button>
              <span className="text-slate-600">/</span>
              <span className="text-emerald-400 font-medium">
                3. Others (Blobs, Emojis, Grunge, Badges, Arrows, Ribbons)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setGeneralSubOption(null)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>General Options (1 · 2 · 3)</span>
              </button>

              <button
                onClick={() => {
                  setSelectedOption(null);
                  setGeneralSubOption(null);
                }}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium rounded-lg text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                ← Back to 3 Options
              </button>
            </div>
          </header>

          {/* General Others Studio Body */}
          <main className="flex-1">
            <GeneralOthersStudio 
              onBackToOptions={() => setGeneralSubOption(null)}
            />
          </main>
        </div>
      );
    }

    // 1.1 & 1.2 Sub-Options: With Fill Color OR Only Stroke
    if (generalSubOption === 'fill' || generalSubOption === 'stroke') {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
          {/* Top Header */}
          <header className="border-b border-slate-800/80 px-6 py-3 flex items-center justify-between bg-slate-950/95 sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedOption(null);
                  setGeneralSubOption(null);
                }}
                className="font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                Website for Micro Stock
              </button>
              <span className="text-slate-600">/</span>
              <button
                onClick={() => setGeneralSubOption(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                1. General Work
              </button>
              <span className="text-slate-600">/</span>
              <span className="text-blue-400 font-medium">
                {generalSubOption === 'fill' ? '1. With Fill Color' : '2. Only Stroke'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setGeneralSubOption(null)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>General Options (1 · 2 · 3)</span>
              </button>

              <button
                onClick={() => {
                  setSelectedOption(null);
                  setGeneralSubOption(null);
                }}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium rounded-lg text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                ← Back to 3 Options
              </button>
            </div>
          </header>

          {/* General Vector Studio Body */}
          <main className="flex-1">
            <GeneralVectorStudio 
              initialMode={generalSubOption} 
              onBackToOptions={() => setGeneralSubOption(null)}
            />
          </main>
        </div>
      );
    }

    // 1.0 Landing Page: Strictly 3 clean options inside General Work
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Top Header */}
        <header className="border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedOption(null)}
              className="font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              Website for Micro Stock
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-blue-400 font-medium">
              1. General Work
            </span>
          </div>

          <button
            onClick={() => setSelectedOption(null)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-sm font-medium rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            ← Back to 3 Options
          </button>
        </header>

        {/* 3 Options Selection Workspace */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
          <div className="max-w-4xl w-full text-center space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                General Work
              </h1>
              <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
                Select your vector production workflow. Fully expanded vector graphics exported at minimum 8000×4000 px RGB in .AI and .SVG.
              </p>
            </div>

            {/* 3 Clean Options Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
              {/* Option 1: With Fill Color */}
              <button
                onClick={() => setGeneralSubOption('fill')}
                className="group relative p-6 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-blue-500 rounded-2xl text-left transition-all duration-200 hover:shadow-2xl hover:shadow-blue-950/50 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-800/80 text-blue-400 flex items-center justify-center font-mono font-bold text-sm">
                      1
                    </span>
                    <Square className="w-5 h-5 text-blue-400 fill-blue-500/20 group-hover:scale-110 transition-transform" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                      With Fill Color
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Procedural torn paper rectangular banners with solid fill. Individual patch color control, edge roughness, 8000×4000 px RGB artboard, and .AI / .SVG export.
                    </p>
                  </div>
                </div>

                <div className="pt-6 flex items-center gap-1.5 text-xs text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Open Studio</span>
                  <span>→</span>
                </div>
              </button>

              {/* Option 2: Only Stroke */}
              <button
                onClick={() => setGeneralSubOption('stroke')}
                className="group relative p-6 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-blue-500 rounded-2xl text-left transition-all duration-200 hover:shadow-2xl hover:shadow-blue-950/50 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-800/80 text-blue-400 flex items-center justify-center font-mono font-bold text-sm">
                      2
                    </span>
                    <Square className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                      Only Stroke
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Outline borders only with transparent interior. Perimeter stroke width, deckle edge controls, 8000×4000 px RGB artboard, and .AI / .SVG export.
                    </p>
                  </div>
                </div>

                <div className="pt-6 flex items-center gap-1.5 text-xs text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Open Studio</span>
                  <span>→</span>
                </div>
              </button>

              {/* Option 3: Others ( আদার্স ) */}
              <button
                onClick={() => setGeneralSubOption('others')}
                className="group relative p-6 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500 rounded-2xl text-left transition-all duration-200 hover:shadow-2xl hover:shadow-emerald-950/50 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm">
                      3
                    </span>
                    <Layers className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Others (আদার্স)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Organic abstract blobs, hand-drawn emojis, grunge frames, numbered badges, brush arrows & ribbon banners. Inside/outside edge controls, per-element color, and .AI / .SVG export.
                    </p>
                  </div>
                </div>

                <div className="pt-6 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Open Studio</span>
                  <span>→</span>
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // OPTION 2: PNG (Torn Paper Studio)
  // =========================================================================
  if (selectedOption === 'png') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Top Header */}
        <header className="border-b border-slate-800/80 px-6 py-3 flex items-center justify-between bg-slate-950/95 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedOption(null)}
              className="font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              Website for Micro Stock
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400 font-medium">
              2. PNG (Torn Paper Studio)
            </span>
          </div>

          <button
            onClick={() => setSelectedOption(null)}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium rounded-lg text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            ← Back to 3 Options
          </button>
        </header>

        {/* Torn Paper Studio Body */}
        <main className="flex-1">
          <TornPaperStudio />
        </main>
      </div>
    );
  }

  // =========================================================================
  // OPTION 3: ANIMATION (Motion Studio)
  // =========================================================================
  if (selectedOption === 'animation') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Top Header */}
        <header className="border-b border-slate-800/80 px-6 py-3 flex items-center justify-between bg-slate-950/95 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedOption(null)}
              className="font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              Website for Micro Stock
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-violet-400 font-medium">
              3. Animation (Motion Studio)
            </span>
          </div>

          <button
            onClick={() => setSelectedOption(null)}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium rounded-lg text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            ← Back to 3 Options
          </button>
        </header>

        {/* Animation Studio Body */}
        <main className="flex-1">
          <AnimationStudio />
        </main>
      </div>
    );
  }

  return null;
}
