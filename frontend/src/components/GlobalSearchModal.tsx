import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { apiClient } from '../api/client';
import { Sloka, Occasion } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [slokas, setSlokas] = useState<Sloka[]>([]);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSlokas([]);
      setOccasions([]);
    }
  }, [isOpen]);

  // Live search debounce
  useEffect(() => {
    if (!query.trim()) {
      setSlokas([]);
      setOccasions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/search?q=${encodeURIComponent(query)}`);
        if (res.data.success) {
          setSlokas(res.data.results.slokas || []);
          setOccasions(res.data.results.occasions || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut for ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectSloka = (slug: string) => {
    onClose();
    navigate(`/slokas/${slug}`);
  };

  const handleSelectOccasion = (slug: string) => {
    onClose();
    navigate(`/occasions/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-start justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gold-300/80 overflow-hidden transform transition-all z-10">
        
        {/* Search Input Bar */}
        <div className="relative border-b border-stone-200 flex items-center px-4 py-3 bg-stone-50/50">
          <Search className="w-5 h-5 text-maroon-700 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by stotra name, deity, festival, or keyword..."
            className="w-full bg-transparent border-none text-base text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-0"
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-gold-600 animate-spin shrink-0" />
          ) : query ? (
            <button onClick={() => setQuery('')} className="p-1 text-stone-400 hover:text-stone-600">
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="text-center py-8 text-stone-400 text-sm">
              <p>Type to search canonical slokas, Amrita institutional occasions, and festivals.</p>
              <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                {['Ganesha', 'Maha Shivaratri', 'Amma Dhyanam', 'Sudarshana', 'Homam', 'Govinda'].map(k => (
                  <button
                    key={k}
                    onClick={() => setQuery(k)}
                    className="text-xs px-2.5 py-1 bg-stone-100 hover:bg-gold-50 hover:text-maroon-800 text-stone-600 rounded-full border border-stone-200 transition-colors"
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && !loading && slokas.length === 0 && occasions.length === 0 && (
            <div className="text-center py-8 text-stone-500 text-sm">
              No matching devotional records found for "<span className="font-semibold">{query}</span>".
            </div>
          )}

          {/* Occasions Matches */}
          {occasions.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-maroon-800 mb-2 flex items-center space-x-1 font-heading">
                <Calendar className="w-3.5 h-3.5 text-maroon-700" />
                <span>Occasions & Festivals ({occasions.length})</span>
              </div>
              <div className="space-y-1.5">
                {occasions.map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => handleSelectOccasion(occ.slug)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-gold-50/70 border border-transparent hover:border-gold-200 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-stone-800 group-hover:text-maroon-800">
                        {occ.name}
                      </div>
                      <div className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                        {occ.category?.name} {occ.institution ? `• ${occ.institution.campus}` : ''}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-maroon-700 shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Slokas Matches */}
          {slokas.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-maroon-800 mb-2 flex items-center space-x-1 font-heading">
                <BookOpen className="w-3.5 h-3.5 text-maroon-700" />
                <span>Devotional Texts ({slokas.length})</span>
              </div>
              <div className="space-y-1.5">
                {slokas.map((sloka) => (
                  <button
                    key={sloka.id}
                    onClick={() => handleSelectSloka(sloka.slug)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-gold-50/70 border border-transparent hover:border-gold-200 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-stone-800 group-hover:text-maroon-800">
                        {sloka.canonicalTitle}
                      </div>
                      <div className="text-xs text-stone-500 flex items-center space-x-2 mt-0.5">
                        <span className="bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded text-[10px]">
                          {sloka.category?.name}
                        </span>
                        {sloka.deity && (
                          <span className="text-[11px] text-maroon-700">
                            Deity: {sloka.deity.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-maroon-700 shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-stone-100 px-4 py-2 border-t border-stone-200 text-[11px] text-stone-500 flex justify-between items-center">
          <span>Search PostgreSQL database</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
