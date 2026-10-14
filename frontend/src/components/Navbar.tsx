import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Calendar, BookOpen, Download, Shield, Menu, X, Sparkles, Flame, Moon, Sun } from 'lucide-react';
import { useNityaParayanam } from '../context/NityaParayanamContext';

interface NavbarProps {
  onOpenSearch: () => void;
  isPujaMode?: boolean;
  onTogglePujaMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, isPujaMode, onTogglePujaMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { bookmarks, setIsOpen: setNityaOpen } = useNityaParayanam();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Festival Calendar', path: '/calendar', icon: Calendar },
    { name: 'Sloka Library', path: '/slokas', icon: BookOpen },
    { name: 'Downloads', path: '/downloads', icon: Download },
    { name: 'About', path: '/about' },
    { name: 'Admin', path: '/admin', icon: Shield }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gold-200/60 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Platform Identity */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-maroon-700 to-maroon-900 border border-gold-500/40 flex items-center justify-center text-gold-400 shadow-md group-hover:scale-105 transition-transform">
              <span className="text-2xl font-serif">🕉️</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-heading text-2xl font-bold tracking-wide text-maroon-800 group-hover:text-maroon-700 transition-colors">
                  SlokaSetu
                </span>
                <span className="text-xs bg-gold-100 text-gold-800 font-semibold px-1.5 py-0.5 rounded border border-gold-300">
                  ADM
                </span>
              </div>
              <span className="text-[11px] text-stone-500 block -mt-0.5 font-serif italic">
                श्लोकसेतुः • Devotional Knowledge Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    active
                      ? 'bg-maroon-50 text-maroon-800 font-semibold border-b-2 border-maroon-700'
                      : 'text-stone-700 hover:text-maroon-700 hover:bg-stone-50'
                  }`}
                >
                  {link.icon && <link.icon className={`w-4 h-4 ${active ? 'text-maroon-700' : 'text-stone-400'}`} />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Search Trigger Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-full border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 hover:border-gold-300 transition-all text-sm group shadow-2xs"
              title="Search Slokas & Festivals (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-stone-400 group-hover:text-maroon-700 transition-colors" />
              <span className="hidden sm:inline text-xs text-stone-500">Quick search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-stone-200 rounded text-stone-400 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Nitya Parayanam Daily Prayers Button */}
            <button
              onClick={() => setNityaOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-gold-300 bg-gold-50/80 hover:bg-gold-100 text-maroon-900 transition-all text-xs font-semibold shadow-2xs group"
              title="My Nitya Parayanam (Daily Chanting List)"
            >
              <Flame className="w-3.5 h-3.5 text-red-600 fill-current" />
              <span className="hidden sm:inline">Nitya Prayers</span>
              <span className="w-4 h-4 rounded-full bg-maroon-800 text-gold-200 text-[10px] flex items-center justify-center font-bold">
                {bookmarks.length}
              </span>
            </button>

            {/* Puja Mode (Low-light Temple Theme) Toggle */}
            {onTogglePujaMode && (
              <button
                onClick={onTogglePujaMode}
                className={`p-2 rounded-full border transition-all shadow-2xs ${
                  isPujaMode
                    ? 'bg-amber-400 text-stone-950 border-amber-300'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
                }`}
                title={isPujaMode ? 'Switch to Normal Light Mode' : 'Switch to Puja (Temple / Night) Mode'}
              >
                {isPujaMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium flex items-center space-x-3 ${
                isActive(link.path)
                  ? 'bg-maroon-50 text-maroon-800 font-bold border-l-4 border-maroon-700'
                  : 'text-stone-700 hover:bg-stone-50 hover:text-maroon-700'
              }`}
            >
              {link.icon && <link.icon className="w-5 h-5 text-maroon-700" />}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
