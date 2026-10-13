import React, { useState } from 'react';
import { GeneralAsset, GeneralCategory } from '../types/microstock';
import { GENERAL_ASSETS } from '../data/mockAssets';
import { Search, Download, Copy, Check, SlidersHorizontal, Calculator, FileCheck, Layers } from 'lucide-react';

interface GeneralWorkViewProps {
  onSelectAsset: (asset: GeneralAsset) => void;
}

export const GeneralWorkView: React.FC<GeneralWorkViewProps> = ({ onSelectAsset }) => {
  const [selectedCategory, setSelectedCategory] = useState<GeneralCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'catalog' | 'metadata' | 'spec_checker' | 'earnings'>('catalog');

  // Metadata Tool State
  const [metaTheme, setMetaTheme] = useState('Abstract geometric business report cover and modern vector icons');
  const [copiedKey, setCopiedKey] = useState(false);

  // Spec Checker State
  const [mockResolution, setMockResolution] = useState('6000 x 4000');
  const [mockFileSize, setMockFileSize] = useState(18);
  const [mockColorProfile, setMockColorProfile] = useState<'sRGB' | 'CMYK' | 'AdobeRGB'>('sRGB');
  const [mockEpsVersion, setMockEpsVersion] = useState<'EPS 10' | 'EPS CS6' | 'AI CC'>('EPS 10');

  // Earnings Calculator State
  const [monthlyDownloads, setMonthlyDownloads] = useState(350);
  const [royaltyRate, setRoyaltyRate] = useState(33); // %
  const [averagePrice, setAveragePrice] = useState(2.80); // $

  const filteredAssets = GENERAL_ASSETS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const generatedKeywords = [
    'vector', 'geometric', 'branding', 'stationery', 'corporate', 'minimalist', 'annual report',
    'presentation', 'business template', 'infographic', 'editorial', 'modern layout', 'clean design',
    'abstract shapes', 'print ready', 'cmyk', 'marketing flyer', 'brochure mockup', 'typography',
    'poster series', 'identity package', 'digital asset', 'creative direction', 'microstock',
    'high resolution', 'commercial license', 'commercial use', 'scalable art', 'eps 10', 'adobe illustrator',
    'graphic designer resource', 'creative agency', 'grid system', 'swiss style', 'bauhaus design',
    'isometric server', 'futuristic data', 'technology visual', 'flat illustration', 'ui background',
    'desktop wallpaper', 'portfolio showcase', 'multipurpose template', 'stationery set', 'envelope mock'
  ];

  const handleCopyKeywords = () => {
    navigator.clipboard.writeText(generatedKeywords.join(', '));
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const calculatedEarnings = (monthlyDownloads * averagePrice * (royaltyRate / 100)).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Hero Banner */}
      <div className="border-b border-slate-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-2">
            <span>Department 01</span>
            <span aria-hidden="true">·</span>
            <span>Microstock General Work</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
            1. General Work Studio
          </h1>
          <p className="text-sm md:text-base text-slate-400 mt-2 max-w-2xl">
            Commercial vector illustrations, scalable templates, high-res stock photography, and automated microstock contributor submission tools.
          </p>
        </div>

        {/* Tab Controls for Studio Modes */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Asset Catalog
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'metadata'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Metadata & Keywords
          </button>
          <button
            onClick={() => setActiveTab('spec_checker')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'spec_checker'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Stock Spec Checker
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === 'earnings'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Royalty Calculator
          </button>
        </div>
      </div>

      {/* VIEW 1: Asset Catalog */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {(['all', 'vector', 'photo', 'template', 'illustration'] as GeneralCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-white text-slate-900 font-semibold shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat === 'all' ? 'All Assets' : cat}
                </button>
              ))}
            </div>

            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search vectors, templates, photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Asset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => onSelectAsset(asset)}
                className="group bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                    <img
                      src={asset.image}
                      alt={asset.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {asset.formats.map((fmt) => (
                        <span key={fmt} className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-slate-950/80 backdrop-blur-md text-slate-200 rounded border border-slate-700">
                          {fmt}
                        </span>
                      ))}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-xs font-mono text-slate-300 truncate">
                      {asset.resolution}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {asset.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                      <span>{asset.author}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{asset.downloads} downloads</span>
                      <span aria-hidden="true">·</span>
                      <span>{asset.license}</span>
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

                <div className="px-5 py-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono">{asset.fileSize}</span>
                  <span className="text-blue-400 font-medium group-hover:underline flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    Download / Inspect
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: Contributor Metadata & 50-Keyword Generator */}
      {activeTab === 'metadata' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
              Microstock Contributor Tagging
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standardized formatting for Adobe Stock, Shutterstock, Freepik, and Getty. Automatic generation of 50 comma-separated keywords and commercial title parameters.
            </p>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-medium text-slate-300 block">
                Artwork Title or Subject Brief
              </label>
              <textarea
                rows={3}
                value={metaTheme}
                onChange={(e) => setMetaTheme(e.target.value)}
                className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
              />

              <div className="space-y-2 pt-2">
                <span className="text-xs font-medium text-slate-400 block">Microstock Target Platforms</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
                    Adobe Stock <span className="text-[10px] text-blue-400 block font-mono">50 Keywords max</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
                    Shutterstock <span className="text-[10px] text-blue-400 block font-mono">50 Keywords max</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
                    Freepik <span className="text-[10px] text-blue-400 block font-mono">Tags + EPS-10</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
                    iStock / Getty <span className="text-[10px] text-blue-400 block font-mono">Taxonomy Sync</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Generated Microstock Keywords ({generatedKeywords.length}/50)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ordered by microstock search ranking volume
                </p>
              </div>
              <button
                onClick={handleCopyKeywords}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'Copied to Clipboard' : 'Copy All 50 Keywords'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto p-3 bg-slate-950/70 border border-slate-800 rounded-xl font-mono text-xs">
              {generatedKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded hover:border-slate-700"
                >
                  <span className="text-slate-500 mr-1 tabular-nums">{i + 1}.</span>
                  {kw}
                </span>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-medium text-slate-300 block">CSV & Contributor Export Format</span>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-400 overflow-x-auto">
{`Filename: artwork_vector_template_01.eps
Title: ${metaTheme}
Description: High quality commercial graphic vector template with geometric layouts and print ready resolution.
Keywords: ${generatedKeywords.slice(0, 15).join(', ')}...`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Stock Spec Checker */}
      {activeTab === 'spec_checker' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
              Pre-Submission Compliance Spec
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify vector and raster specs against standard commercial microstock rejection thresholds (e.g., minimum 4 MP, EPS 10 compatibility, RGB color model).
            </p>

            <div className="space-y-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Pixel Resolution</label>
                <select
                  value={mockResolution}
                  onChange={(e) => setMockResolution(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                >
                  <option value="6000 x 4000">6000 × 4000 (24.0 MP) - Excellent</option>
                  <option value="4000 x 3000">4000 × 3000 (12.0 MP) - Good</option>
                  <option value="2000 x 1500">2000 × 1500 (3.0 MP) - Below Threshold</option>
                  <option value="8192 x 5464">8192 × 5464 (44.8 MP) - Premium Ultra</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Color Profile</label>
                <select
                  value={mockColorProfile}
                  onChange={(e) => setMockColorProfile(e.target.value as any)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                >
                  <option value="sRGB">sRGB IEC61966-2.1 (Standard)</option>
                  <option value="AdobeRGB">Adobe RGB (1998)</option>
                  <option value="CMYK">CMYK (Print Template only)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Vector EPS Spec</label>
                <select
                  value={mockEpsVersion}
                  onChange={(e) => setMockEpsVersion(e.target.value as any)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-xs text-white"
                >
                  <option value="EPS 10">Illustrator EPS 10 (Universal Acceptance)</option>
                  <option value="EPS CS6">EPS CS6 (May fail on Freepik)</option>
                  <option value="AI CC">Adobe Illustrator CC native</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-white">Compliance Evaluation Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">Minimum Resolution</span>
                  <span className={`text-xs font-mono font-bold ${mockResolution.includes('3.0 MP') ? 'text-red-400' : 'text-emerald-400'}`}>
                    {mockResolution.includes('3.0 MP') ? 'FAILED (< 4 MP)' : 'PASSED'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Microstock agencies mandate min 4.0 megapixels to allow large printing downloads.
                </p>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">EPS Version Standard</span>
                  <span className={`text-xs font-mono font-bold ${mockEpsVersion === 'EPS 10' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {mockEpsVersion === 'EPS 10' ? 'PASSED (EPS 10)' : 'WARNING (May Reject)'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  EPS 10 has no transparency rasterization bugs across legacy vector engines.
                </p>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">Color Profile Standard</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">PASSED ({mockColorProfile})</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  sRGB profile embedded prevents color shifts on web preview generators.
                </p>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">File Size Limit</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">PASSED ({mockFileSize} MB / 50 MB max)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Comfortably within standard 50 MB FTP upload ceiling.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: Royalty Calculator */}
      {activeTab === 'earnings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
              Contributor Royalty Estimator
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Model your recurring monthly revenue across general vector, photo, and template portfolios based on standard agency tiers.
            </p>

            <div className="space-y-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Monthly Downloads</span>
                  <span className="font-mono tabular-nums text-blue-400">{monthlyDownloads}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="3000"
                  step="50"
                  value={monthlyDownloads}
                  onChange={(e) => setMonthlyDownloads(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Royalty Share Tier</span>
                  <span className="font-mono tabular-nums text-blue-400">{royaltyRate}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="50"
                  step="1"
                  value={royaltyRate}
                  onChange={(e) => setRoyaltyRate(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <span className="text-[10px] text-slate-500 block mt-1">Tier 1: 15% · Tier 4: 33% · Exclusive: 40-50%</span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Average Revenue Per Download</span>
                  <span className="font-mono tabular-nums text-blue-400">${averagePrice.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.50"
                  max="15.00"
                  step="0.25"
                  value={averagePrice}
                  onChange={(e) => setAveragePrice(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                Projected Monthly Portfolio Payout
              </span>
              <div className="text-4xl md:text-5xl font-bold font-mono tabular-nums text-white mt-2">
                ${calculatedEarnings} <span className="text-sm font-normal text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Annualized trajectory: <strong className="text-slate-200 font-mono">${(Number(calculatedEarnings) * 12).toFixed(2)}</strong> per year across portfolio assets.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg">
                <span className="text-slate-500 block">Total Downloads</span>
                <span className="text-sm font-mono font-semibold text-slate-200 tabular-nums">{monthlyDownloads}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg">
                <span className="text-slate-500 block">Contributor Share</span>
                <span className="text-sm font-mono font-semibold text-slate-200 tabular-nums">{royaltyRate}%</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg">
                <span className="text-slate-500 block">Avg Net per DL</span>
                <span className="text-sm font-mono font-semibold text-slate-200 tabular-nums">${(averagePrice * (royaltyRate / 100)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
