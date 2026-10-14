import React, { useState } from 'react';
import { SlokaVersion } from '../types';
import { Copy, Check, Type, BookOpen, Layers, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ChantingAudioPlayer } from './ChantingAudioPlayer';

interface TextReaderProps {
  versions: SlokaVersion[];
}

export const TextReader: React.FC<TextReaderProps> = ({ versions }) => {
  if (!versions || versions.length === 0) {
    return (
      <div className="p-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-300 text-stone-500 text-sm">
        No verified text editions are currently published for this record.
      </div>
    );
  }

  // Selected version state (default to first available, e.g. Sanskrit + Latin or Telugu)
  const [selectedVersionId, setSelectedVersionId] = useState<string>(versions[0].id);
  const [viewMode, setViewMode] = useState<'continuous' | 'verse'>('continuous');
  const [fontSize, setFontSize] = useState<number>(18);
  const [copied, setCopied] = useState<boolean>(false);

  const currentVersion = versions.find(v => v.id === selectedVersionId) || versions[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentVersion.textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine script CSS class
  const getScriptClass = (scriptCode: string) => {
    if (scriptCode === 'Telu') return 'script-telugu leading-relaxed';
    if (scriptCode === 'Taml') return 'script-tamil leading-relaxed';
    if (scriptCode === 'Deva') return 'script-devanagari leading-relaxed';
    if (scriptCode === 'Knda') return 'script-kannada leading-relaxed';
    if (scriptCode === 'Mlym') return 'script-malayalam leading-relaxed';
    return 'font-serif leading-relaxed';
  };

  return (
    <div className="bg-white rounded-xl border border-gold-200/90 shadow-sm overflow-hidden">
      
      {/* Top Toolbar: Language/Script Selector & Controls */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-ivory-100 to-ivory-50 border-b border-gold-200/80 flex flex-wrap items-center justify-between gap-4">
        
        {/* Version / Script Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-maroon-800 mr-1 font-heading">
            Script / Edition:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {versions.map((ver) => {
              const isSelected = ver.id === currentVersion.id;
              return (
                <button
                  key={ver.id}
                  onClick={() => setSelectedVersionId(ver.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-maroon-800 text-gold-200 shadow-xs font-semibold ring-1 ring-gold-400'
                      : 'bg-white text-stone-700 hover:bg-gold-50 border border-stone-200'
                  }`}
                >
                  <span>{ver.script.name}</span>
                  <span className={`text-[10px] px-1 py-0.2 rounded ${
                    isSelected ? 'bg-maroon-900 text-gold-300' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {ver.language.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* View Controls: Mode Toggle & Font Size */}
        <div className="flex items-center space-x-3">
          
          {/* Continuous vs Verse-by-verse */}
          <div className="bg-white p-1 rounded-lg border border-stone-200 flex items-center shadow-2xs">
            <button
              onClick={() => setViewMode('continuous')}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1 transition-colors ${
                viewMode === 'continuous'
                  ? 'bg-maroon-700 text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Continuous Reading"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Continuous</span>
            </button>
            <button
              onClick={() => setViewMode('verse')}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1 transition-colors ${
                viewMode === 'verse'
                  ? 'bg-maroon-700 text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Verse-by-Verse View"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Verse by Verse</span>
            </button>
          </div>

          {/* Font Resizing */}
          <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-stone-200 shadow-2xs text-xs text-stone-600">
            <button
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              className="px-2 py-0.5 rounded hover:bg-stone-100 font-bold"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="text-[11px] text-stone-400 px-1 font-mono">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(28, fontSize + 2))}
              className="px-2 py-0.5 rounded hover:bg-stone-100 font-bold"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-600 hover:text-maroon-700 hover:border-gold-300 transition-colors shadow-2xs"
            title="Copy Text to Clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Chanting Audio Player Bar */}
      <div className="p-3 bg-stone-100/80 border-b border-stone-200">
        <ChantingAudioPlayer
          verses={
            currentVersion.verseData && currentVersion.verseData.length > 0
              ? currentVersion.verseData
              : currentVersion.textContent
                  .split('\n\n')
                  .filter((t) => t.trim().length > 0)
                  .map((t, idx) => ({ verseNumber: idx + 1, text: t }))
          }
          scriptCode={currentVersion.script?.code || 'Deva'}
        />
      </div>

      {/* Content Area */}
      <div className="p-6 sm:p-10 bg-[#FFFEFA]">
        
        {viewMode === 'continuous' ? (
          /* Continuous Text View */
          <div
            className={`whitespace-pre-wrap text-stone-900 transition-all ${getScriptClass(currentVersion.script.code)}`}
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.85 }}
          >
            {currentVersion.textContent}
          </div>
        ) : (
          /* Verse by Verse View */
          <div className="space-y-6">
            {currentVersion.verseData && currentVersion.verseData.length > 0 ? (
              currentVersion.verseData.map((verse) => (
                <div
                  key={verse.verseNumber}
                  className="p-5 rounded-lg border border-stone-200/80 bg-white hover:border-gold-300 hover:shadow-xs transition-all"
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
                    <span className="text-xs font-bold text-maroon-800 bg-maroon-50 px-2 py-0.5 rounded font-heading">
                      Verse {verse.verseNumber}
                    </span>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {currentVersion.script.name}
                    </span>
                  </div>

                  {/* Original Verse Text */}
                  <div
                    className={`whitespace-pre-wrap text-stone-900 mb-2 ${getScriptClass(currentVersion.script.code)}`}
                    style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
                  >
                    {verse.text}
                  </div>

                  {/* Transliteration or Meaning if attached */}
                  {verse.transliteration && (
                    <div className="mt-3 pt-2 border-t border-stone-100 text-sm text-stone-600 font-serif italic">
                      {verse.transliteration}
                    </div>
                  )}

                  {verse.meaning && (
                    <div className="mt-2 text-xs text-stone-600 bg-stone-50 p-3 rounded">
                      <strong className="text-maroon-800 block mb-0.5">Meaning:</strong>
                      {verse.meaning}
                    </div>
                  )}
                </div>
              ))
            ) : (
              /* Fallback segmented lines */
              currentVersion.textContent.split('\n\n').map((stanza, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-stone-200 bg-white"
                >
                  <span className="text-xs font-bold text-maroon-800 bg-maroon-50 px-2 py-0.5 rounded font-heading mb-2 inline-block">
                    Section {idx + 1}
                  </span>
                  <div
                    className={`whitespace-pre-wrap text-stone-900 ${getScriptClass(currentVersion.script.code)}`}
                    style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
                  >
                    {stanza}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Provenance & Citation Bar */}
      <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Source Document:</strong> {currentVersion.source?.fileName || 'Verified Canonical Archive'}
            {currentVersion.pageStart && ` (Pages ${currentVersion.pageStart}–${currentVersion.pageEnd})`}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-[11px]">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Human Reviewed & Verified</span>
          </span>
          <span className="text-stone-400">
            Confidence: {(currentVersion.confidenceScore * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
};
