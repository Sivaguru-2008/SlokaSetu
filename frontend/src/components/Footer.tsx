import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Download, Heart, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t-4 border-gold-500 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand & Academic Statement */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-serif">🕉️</span>
              <span className="font-heading text-xl font-bold tracking-wider text-gold-400">
                SlokaSetu
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-serif">
              A multilingual devotional knowledge platform bridging Hindu festival dates, Amrita institutional occasions, and canonical stotras across Sanskrit, Telugu, Tamil, and English.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-gold-400 bg-stone-800/80 p-2.5 rounded border border-stone-700">
              <GraduationCap className="w-4 h-4 shrink-0 text-gold-400" />
              <span>Advanced Database Management Systems Project</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-3 font-heading">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/calendar" className="hover:text-gold-300 transition-colors flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  <span>Hindu & Amrita Calendar</span>
                </Link>
              </li>
              <li>
                <Link to="/slokas" className="hover:text-gold-300 transition-colors flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-stone-500" />
                  <span>Searchable Sloka Library</span>
                </Link>
              </li>
              <li>
                <Link to="/downloads" className="hover:text-gold-300 transition-colors flex items-center space-x-1.5">
                  <Download className="w-3.5 h-3.5 text-stone-500" />
                  <span>PDF Prayer Resources</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-300 transition-colors">
                  <span>Architecture & Data Sources</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Provenance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-3 font-heading">
              Source Material
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-2">
              Ingested and verified from authentic archival documents:
            </p>
            <ul className="space-y-1.5 text-[11px] text-stone-400 font-mono">
              <li>• SRI MAHAGANAPATHI HOMAM JULY.pdf</li>
              <li>• ENGLISH.pdf (Roman Transliteration)</li>
              <li>• TELUGU.pdf (Telugu Script Edition)</li>
              <li>• TAMIL.pdf (Tamil Script Edition)</li>
            </ul>
          </div>

          {/* Col 4: Governance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-3 font-heading">
              Devotional Integrity
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              SlokaSetu enforces rigorous content governance: distinct separation of historical scholarship from traditional accounts, no automated translations, and verified human review.
            </p>
            <Link
              to="/admin"
              className="inline-block text-xs font-medium text-maroon-300 bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded border border-stone-700 transition-colors"
            >
              Administrative Portal →
            </Link>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 space-y-2 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} SlokaSetu. Department of Amrita Darshanam, Amrita Vishwa Vidyapeetham.
          </div>
          <div className="flex items-center space-x-1">
            <span>Preserving sacred Sanskrit heritage with relational precision</span>
            <span className="text-gold-500 font-serif">॥ ॐ तत् सत् ॥</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
