import React from 'react';
import { ActiveView } from '../types/microstock';
import { ArrowLeft, Grid } from 'lucide-react';

interface TopNavbarProps {
  currentView: ActiveView;
  onSelectView: (view: ActiveView) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ currentView, onSelectView }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single line, display face) */}
        <button
          onClick={() => onSelectView('portal')}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-blue-400 transition-colors cursor-pointer font-['Plus_Jakarta_Sans']"
        >
          Website for Micro Stock
        </button>

        {/* Zone 2: Navigation Links (1–2 word concise labels, whitespace-nowrap) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onSelectView('general')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 border-b-2 ${
              currentView === 'general'
                ? 'text-white border-blue-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            1. General Work
          </button>

          <button
            onClick={() => onSelectView('png')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 border-b-2 ${
              currentView === 'png'
                ? 'text-white border-cyan-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            2. PNG Cutouts
          </button>

          <button
            onClick={() => onSelectView('animation')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 border-b-2 ${
              currentView === 'animation'
                ? 'text-white border-violet-500 font-semibold'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            3. Animation
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectView('portal')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Grid className="w-3.5 h-3.5 text-blue-400" />
            <span>Options Portal (1 · 2 · 3)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
