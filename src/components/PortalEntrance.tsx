import React from 'react';

export type OptionType = 'general' | 'png' | 'animation';

interface PortalEntranceProps {
  onSelectOption: (option: OptionType) => void;
}

export const PortalEntrance: React.FC<PortalEntranceProps> = ({ onSelectOption }) => {
  const options = [
    { id: 'general' as OptionType, num: '1', title: 'General Work' },
    { id: 'png' as OptionType, num: '2', title: 'PNG' },
    { id: 'animation' as OptionType, num: '3', title: 'Animation' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-6 select-none">
      <div className="w-full max-w-xl text-center space-y-10">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
          Website for Micro Stock
        </h1>

        {/* The 3 Options */}
        <div className="space-y-4">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelectOption(opt.id)}
              className="w-full group p-5 bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl flex items-center justify-between text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-slate-800 text-slate-200 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center font-mono font-bold text-base transition-colors">
                  {opt.num}
                </span>
                <span className="text-lg md:text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {opt.title}
                </span>
              </div>
              <span className="text-slate-500 group-hover:text-slate-300 text-sm font-medium transition-colors">
                →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
