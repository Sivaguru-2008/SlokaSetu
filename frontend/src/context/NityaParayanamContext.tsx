import React, { createContext, useContext, useState, useEffect } from 'react';

interface NityaParayanamContextType {
  bookmarks: string[];
  toggleBookmark: (slug: string) => void;
  isBookmarked: (slug: string) => boolean;
  completedToday: string[];
  markCompletedToday: (slug: string) => void;
  streakCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const NityaParayanamContext = createContext<NityaParayanamContextType | undefined>(undefined);

const BOOKMARKS_STORAGE_KEY = 'slokasetu_nitya_bookmarks';
const COMPLETED_STORAGE_KEY = 'slokasetu_completed_today';
const STREAK_STORAGE_KEY = 'slokasetu_chanting_streak';
const LAST_DATE_STORAGE_KEY = 'slokasetu_last_chanting_date';

export const NityaParayanamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Defaults to starter daily prayers if empty
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['mahaganapathi-dhyanam', 'maha-ganesha-pancharatnam', 'shiva-panchakshari-stotram'];
    } catch {
      return ['mahaganapathi-dhyanam', 'maha-ganesha-pancharatnam'];
    }
  });

  const [completedToday, setCompletedToday] = useState<string[]>(() => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const lastDate = localStorage.getItem(LAST_DATE_STORAGE_KEY);
      if (lastDate !== todayStr) {
        return [];
      }
      const saved = localStorage.getItem(COMPLETED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [streakCount, setStreakCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STREAK_STORAGE_KEY);
      return saved ? parseInt(saved, 10) : 3; // Initial encouragement streak
    } catch {
      return 1;
    }
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('Failed to save bookmarks:', e);
    }
  }, [bookmarks]);

  // Sync completion to localStorage
  useEffect(() => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      localStorage.setItem(LAST_DATE_STORAGE_KEY, todayStr);
      localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(completedToday));
    } catch (e) {
      console.warn('Failed to save completion:', e);
    }
  }, [completedToday]);

  const toggleBookmark = (slug: string) => {
    setBookmarks(prev => {
      if (prev.includes(slug)) {
        return prev.filter(s => s !== slug);
      } else {
        return [...prev, slug];
      }
    });
  };

  const isBookmarked = (slug: string) => bookmarks.includes(slug);

  const markCompletedToday = (slug: string) => {
    setCompletedToday(prev => {
      if (prev.includes(slug)) {
        return prev.filter(s => s !== slug);
      } else {
        const next = [...prev, slug];
        // If first completion today, increment streak
        if (prev.length === 0) {
          const nextStreak = streakCount + 1;
          setStreakCount(nextStreak);
          localStorage.setItem(STREAK_STORAGE_KEY, String(nextStreak));
        }
        return next;
      }
    });
  };

  return (
    <NityaParayanamContext.Provider
      value={{
        bookmarks,
        toggleBookmark,
        isBookmarked,
        completedToday,
        markCompletedToday,
        streakCount,
        isOpen,
        setIsOpen
      }}
    >
      {children}
    </NityaParayanamContext.Provider>
  );
};

export const useNityaParayanam = (): NityaParayanamContextType => {
  const context = useContext(NityaParayanamContext);
  if (!context) {
    throw new Error('useNityaParayanam must be used within a NityaParayanamProvider');
  }
  return context;
};
