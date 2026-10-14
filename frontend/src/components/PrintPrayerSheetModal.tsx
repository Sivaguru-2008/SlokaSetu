import React, { useState } from 'react';
import { X, Printer, Download, Sparkles, Check, BookOpen } from 'lucide-react';
import { Sloka, SlokaVersion } from '../types';

interface PrintPrayerSheetModalProps {
  sloka: Sloka | null;
  onClose: () => void;
  occasionTitle?: string;
  panchangDateStr?: string;
}

export const PrintPrayerSheetModal: React.FC<PrintPrayerSheetModalProps> = ({
  sloka,
  onClose,
  occasionTitle,
  panchangDateStr
}) => {
  const [selectedScriptCode, setSelectedScriptCode] = useState<string>('Deva');
  const [includeMeaning, setIncludeMeaning] = useState<boolean>(true);

  if (!sloka) return null;

  const versions = sloka.versions || [];
  const activeVersion = versions.find(v => v.script?.code === selectedScriptCode) || versions[0];
  const translationVersion = versions.find(v => v.versionType === 'TRANSLATION');

  const scriptsAvailable = [
    { code: 'Deva', label: 'देवनागरी (Devanagari)' },
    { code: 'Latn', label: 'English (IAST)' },
    { code: 'Telu', label: 'తెలుగు (Telugu)' },
    { code: 'Taml', label: 'தமிழ் (Tamil)' },
    { code: 'Knda', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'Mlym', label: 'മലയാളം (Malayalam)' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity no-print"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border-2 border-gold-300 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        {/* Controls Header (Hidden during print) */}
        <div className="bg-gradient-to-r from-maroon-800 to-maroon-900 p-5 text-white flex items-center justify-between shrink-0 no-print">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-gold-500 text-stone-950 rounded-lg shadow-xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-white">
                Print Sacred Parayanam Leaflet
              </h3>
              <p className="text-xs text-gold-200 font-serif">
                Formatted for household puja, temple parayanam, and classroom distribution
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-stone-950 font-bold text-xs flex items-center space-x-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Leaflet</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Options Toolbar (Hidden during print) */}
        <div className="p-4 bg-ivory-100 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs no-print">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-stone-700 font-heading">Script:</span>
            <div className="flex flex-wrap gap-1">
              {scriptsAvailable.map(s => (
                <button
                  key={s.code}
                  onClick={() => setSelectedScriptCode(s.code)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors font-medium ${
                    selectedScriptCode === s.code
                      ? 'bg-maroon-800 text-gold-200 font-bold'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-gold-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center space-x-1.5 cursor-pointer font-medium text-stone-700">
            <input
              type="checkbox"
              checked={includeMeaning}
              onChange={(e) => setIncludeMeaning(e.target.checked)}
              className="rounded text-maroon-800 focus:ring-maroon-700"
            />
            <span>Include English Meanings</span>
          </label>
        </div>

        {/* Printable Leaflet Preview Body */}
        <div className="p-8 sm:p-12 overflow-y-auto bg-white flex-1 font-serif printable-leaflet">
          
          {/* Sacred Traditional Top Heading */}
          <div className="text-center pb-6 border-b-2 border-maroon-800 space-y-1">
            <div className="text-xl font-bold text-maroon-900 tracking-widest font-heading">
              ॥ श्री गणेशाय नमः ॥ श्री गुरुभ्यो नमः ॥
            </div>
            {occasionTitle && (
              <div className="text-xs font-semibold text-stone-600 uppercase tracking-widest">
                Sacred Observance: {occasionTitle}
              </div>
            )}
            {panchangDateStr && (
              <div className="text-[11px] text-stone-500 italic">
                {panchangDateStr}
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-heading mt-2">
              {sloka.canonicalTitle}
            </h1>
            <div className="text-xs text-stone-600 font-sans uppercase tracking-wider">
              {sloka.category?.name} {sloka.deity && `• Dedicated to ${sloka.deity.name}`}
            </div>
          </div>

          {/* Verses Content in Selected Script */}
          <div className="py-6 space-y-6">
            {activeVersion ? (
              activeVersion.verseData && activeVersion.verseData.length > 0 ? (
                activeVersion.verseData.map((v, idx) => (
                  <div key={idx} className="space-y-2 pb-4 border-b border-stone-100 last:border-0">
                    <div className="text-base sm:text-lg font-medium text-stone-950 leading-relaxed whitespace-pre-line text-center">
                      {v.text}
                    </div>
                    {includeMeaning && v.meaning && (
                      <p className="text-xs sm:text-sm text-stone-600 italic text-center max-w-2xl mx-auto font-sans leading-relaxed">
                        {v.meaning}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-base sm:text-lg font-medium text-stone-950 leading-relaxed whitespace-pre-line text-center">
                  {activeVersion.textContent}
                </div>
              )
            ) : (
              <div className="text-center py-6 text-stone-500">
                Selected script is not yet available for this text.
              </div>
            )}
          </div>

          {/* Leaflet Footer */}
          <div className="pt-6 border-t-2 border-maroon-800 text-center text-[10px] text-stone-500 font-sans space-y-0.5">
            <div>श्लोकसेतुः • SlokaSetu Multilingual Devotional Knowledge Platform</div>
            <div className="italic">Preserving authentic Sanskrit stotras with script integrity • Amrita Vishwa Vidyapeetham</div>
          </div>

        </div>

      </div>
    </div>
  );
};
