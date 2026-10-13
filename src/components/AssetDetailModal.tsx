import React, { useState } from 'react';
import { GeneralAsset } from '../types/microstock';
import { X, Download, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface AssetDetailModalProps {
  asset: GeneralAsset | null;
  onClose: () => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ asset, onClose }) => {
  const [downloadFormat, setDownloadFormat] = useState<string>('EPS');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!asset) return null;

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Media Column */}
        <div className="md:w-1/2 bg-slate-950 relative flex items-center justify-center p-6">
          <img
            src={asset.image}
            alt={asset.title}
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-[460px] object-contain rounded-lg shadow-lg"
          />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800">
            <span>{asset.resolution}</span>
            <span>{asset.fileSize}</span>
          </div>
        </div>

        {/* Info Column */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-2">
              <span className="uppercase">{asset.category}</span>
              <span aria-hidden="true">·</span>
              <span>By {asset.author}</span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">
              {asset.title}
            </h2>

            <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{asset.license} License (Worldwide, Multi-Seat Royalty-Free)</span>
            </div>

            {/* Formats Selector */}
            <div className="mt-6 space-y-2">
              <label className="text-xs font-medium text-slate-300 block">
                Deliverable Format
              </label>
              <div className="flex items-center gap-2">
                {asset.formats.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setDownloadFormat(fmt)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-lg border cursor-pointer transition-colors ${
                      downloadFormat === fmt
                        ? 'bg-blue-600 border-blue-500 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    .{fmt.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Extracted Color Palette */}
            {asset.colorPalette && (
              <div className="mt-5 space-y-2">
                <span className="text-xs font-medium text-slate-300 block">Color Palette (sRGB)</span>
                <div className="flex items-center gap-2">
                  {asset.colorPalette.map((col, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span
                        className="w-5 h-5 rounded border border-slate-700 shadow-sm"
                        style={{ backgroundColor: col }}
                      />
                      <span className="text-[10px] font-mono text-slate-400">{col}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            <div className="mt-5 space-y-2">
              <span className="text-xs font-medium text-slate-300 block">Microstock Keywords</span>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {asset.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded text-[11px] font-mono"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-blue-950"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Downloaded {downloadFormat} Package</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download {downloadFormat} (Royalty-Free)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
