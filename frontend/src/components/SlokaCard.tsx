import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, ArrowRight } from 'lucide-react';
import { Sloka } from '../types';

interface SlokaCardProps {
  sloka: Sloka;
}

export const SlokaCard: React.FC<SlokaCardProps> = ({ sloka }) => {
  const hasPdfs = (sloka.pdfResources && sloka.pdfResources.length > 0);
  
  // Script badges
  const scripts = new Set<string>();
  if (sloka.versions) {
    sloka.versions.forEach(v => {
      if (v.script?.name) scripts.add(v.script.name.split(' ')[0]);
    });
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-gold-300 transition-all flex flex-col justify-between group overflow-hidden">
      <div className="p-5">
        
        {/* Category & Deity Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-maroon-800 bg-maroon-50 px-2.5 py-0.5 rounded-full border border-maroon-200/60">
            {sloka.category?.name || 'Stotram'}
          </span>
          {sloka.deity && (
            <span className="text-[11px] text-stone-600 font-medium bg-stone-100 px-2 py-0.5 rounded">
              {sloka.deity.name}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-heading text-lg font-bold text-stone-900 group-hover:text-maroon-800 transition-colors mb-2 line-clamp-1">
          <Link to={`/slokas/${sloka.slug}`}>
            {sloka.canonicalTitle}
          </Link>
        </h3>

        {/* Excerpt / Background */}
        <p className="text-xs text-stone-600 leading-relaxed line-clamp-2 mb-4">
          {sloka.backgroundContext || sloka.significanceNotes || 'Canonical Sanskrit devotional composition.'}
        </p>

        {/* Script & PDF indicator */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-stone-100">
          <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider mr-1">
            Scripts:
          </span>
          {scripts.size > 0 ? (
            Array.from(scripts).map((s) => (
              <span key={s} className="text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded border border-stone-200 font-medium">
                {s}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-stone-400 italic">Devanagari, Latin</span>
          )}

          {hasPdfs && (
            <span className="ml-auto inline-flex items-center space-x-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <FileText className="w-3 h-3 text-emerald-600" />
              <span>PDF Ready</span>
            </span>
          )}
        </div>
      </div>

      {/* Footer Action */}
      <div className="bg-stone-50/70 px-5 py-3 border-t border-stone-100 flex items-center justify-between">
        <span className="text-xs text-stone-500 font-medium">
          {sloka.versions?.length || 3} multilingual versions
        </span>
        <Link
          to={`/slokas/${sloka.slug}`}
          className="text-xs font-semibold text-maroon-700 hover:text-maroon-900 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Read & Study</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
