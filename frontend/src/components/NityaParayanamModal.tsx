import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Flame, CheckCircle, Circle, BookOpen, Trash2, ArrowRight, Sparkles, PlusCircle } from 'lucide-react';
import { useNityaParayanam } from '../context/NityaParayanamContext';
import { apiClient } from '../api/client';
import { Sloka } from '../types';

export const NityaParayanamModal: React.FC = () => {
  const {
    isOpen,
    setIsOpen,
    bookmarks,
    toggleBookmark,
    completedToday,
    markCompletedToday,
    streakCount
  } = useNityaParayanam();

  const [slokas, setSlokas] = useState<Sloka[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && bookmarks.length > 0) {
      loadBookmarkedSlokas();
    }
  }, [isOpen, bookmarks]);

  const loadBookmarkedSlokas = async () => {
    try {
      setLoading(true);
      // Fetch each bookmarked sloka details
      const promises = bookmarks.map(slug =>
        apiClient.get(`/slokas/${slug}`).then(r => r.data.data).catch(() => null)
      );
      const results = await Promise.all(promises);
      setSlokas(results.filter(Boolean) as Sloka[]);
    } catch (err) {
      console.warn('Failed to load bookmarked slokas:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const total = bookmarks.length;
  const completedCount = bookmarks.filter(b => completedToday.includes(b)).length;
  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border-2 border-gold-300 overflow-hidden z-10 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-maroon-800 to-maroon-900 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-gold-500 text-stone-950 rounded-lg shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-white flex items-center space-x-2">
                <span>My Nitya Parayanam</span>
                <span className="text-xs bg-gold-400 text-stone-950 px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 fill-current text-red-600" />
                  <span>{streakCount} Day Streak</span>
                </span>
              </h3>
              <p className="text-xs text-gold-200 font-serif">
                Personal daily devotional routine & chanting practice
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-ivory-100 p-4 border-b border-stone-200">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1.5">
            <span>Today's Recitation Progress</span>
            <span className="text-maroon-800 font-bold">{completedCount} of {total} Completed ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-500 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Sloka List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {loading ? (
            <div className="py-10 text-center text-stone-500 text-sm">
              Loading your sacred prayer list...
            </div>
          ) : slokas.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-sm text-stone-600 font-serif">
                You haven't added any daily slokas to your Nitya Parayanam yet.
              </p>
              <Link
                to="/slokas"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center space-x-1 px-4 py-2 bg-maroon-800 text-gold-200 rounded-lg text-xs font-semibold shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Browse Sloka Library to Bookmark</span>
              </Link>
            </div>
          ) : (
            slokas.map((s) => {
              const isCompleted = completedToday.includes(s.slug);

              return (
                <div
                  key={s.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    isCompleted
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-stone-50 hover:bg-gold-50/50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => markCompletedToday(s.slug)}
                      className="text-stone-400 hover:text-emerald-600 transition-colors shrink-0"
                      title={isCompleted ? 'Mark uncompleted' : 'Mark completed today'}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div>
                      <h4 className={`text-xs font-bold font-serif ${isCompleted ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                        {s.canonicalTitle}
                      </h4>
                      <div className="text-[10px] text-stone-500 flex items-center space-x-2">
                        <span>{s.category?.name}</span>
                        {s.deity && <span>• {s.deity.name}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0 ml-3">
                    <Link
                      to={`/slokas/${s.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="px-2.5 py-1 bg-maroon-800 hover:bg-maroon-900 text-gold-200 rounded text-xs font-semibold flex items-center space-x-1 shadow-2xs"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Chant</span>
                    </Link>

                    <button
                      onClick={() => toggleBookmark(s.slug)}
                      className="p-1 rounded text-stone-400 hover:text-red-700 hover:bg-white transition-colors"
                      title="Remove from daily routine"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600 shrink-0">
          <Link
            to="/slokas"
            onClick={() => setIsOpen(false)}
            className="text-maroon-800 font-bold hover:underline flex items-center space-x-1"
          >
            <span>Explore More Stotras</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <span className="font-serif italic text-stone-400">
            Recite with devotion & mental tranquility
          </span>
        </div>

      </div>
    </div>
  );
};
