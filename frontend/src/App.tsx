import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';

// Pages
import { HomePage } from './pages/HomePage';
import { CalendarPage } from './pages/CalendarPage';
import { OccasionDetailsPage } from './pages/OccasionDetailsPage';
import { SlokaLibraryPage } from './pages/SlokaLibraryPage';
import { SlokaDetailsPage } from './pages/SlokaDetailsPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutPage } from './pages/AboutPage';
import { NityaParayanamProvider } from './context/NityaParayanamContext';
import { NityaParayanamModal } from './components/NityaParayanamModal';

export function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isPujaMode, setIsPujaMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('slokasetu_puja_mode') === 'true';
    } catch {
      return false;
    }
  });

  const togglePujaMode = () => {
    setIsPujaMode(prev => {
      const next = !prev;
      localStorage.setItem('slokasetu_puja_mode', String(next));
      return next;
    });
  };

  // Global keyboard shortcut: Ctrl+K or Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <NityaParayanamProvider>
      <Router>
        <div className={`flex flex-col min-h-screen bg-ivory-50 text-stone-800 selection:bg-gold-500 selection:text-white transition-colors duration-300 ${isPujaMode ? 'puja-mode' : ''}`}>
          
          {/* Navigation Bar */}
          <Navbar
            onOpenSearch={() => setSearchOpen(true)}
            isPujaMode={isPujaMode}
            onTogglePujaMode={togglePujaMode}
          />

          {/* Global Live Search Dialog */}
          <GlobalSearchModal
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
          />

          {/* Nitya Parayanam Routine Modal */}
          <NityaParayanamModal />

          {/* Main Content Area */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/occasions/:slug" element={<OccasionDetailsPage />} />
              <Route path="/slokas" element={<SlokaLibraryPage />} />
              <Route path="/slokas/:slug" element={<SlokaDetailsPage />} />
              <Route path="/downloads" element={<DownloadsPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </NityaParayanamProvider>
  );
}

export default App;
