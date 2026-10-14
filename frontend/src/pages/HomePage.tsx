import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Calendar, BookOpen, Download, ArrowRight, Sparkles, ShieldCheck, ChevronRight, GraduationCap } from 'lucide-react';
import { apiClient } from '../api/client';
import { Occasion, Sloka, PdfResource } from '../types';
import { OccasionCard } from '../components/OccasionCard';
import { SlokaCard } from '../components/SlokaCard';
import { DownloadModal } from '../components/DownloadModal';

export const HomePage: React.FC = () => {
  const [upcomingOccasions, setUpcomingOccasions] = useState<Occasion[]>([]);
  const [dailySloka, setDailySloka] = useState<Sloka | null>(null);
  const [featuredResources, setFeaturedResources] = useState<PdfResource[]>([]);
  const [stats, setStats] = useState({ totalSlokas: 27, totalOccasions: 7, totalVersions: 81, totalResources: 88 });
  const [searchInput, setSearchInput] = useState('');
  const [selectedDownload, setSelectedDownload] = useState<PdfResource | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [occasionsRes, dailyRes, statsRes, slokasRes] = await Promise.all([
          apiClient.get('/occasions'),
          apiClient.get('/slokas/daily'),
          apiClient.get('/stats'),
          apiClient.get('/slokas?limit=6')
        ]);

        if (occasionsRes.data.success) {
          setUpcomingOccasions(occasionsRes.data.data.slice(0, 3));
        }
        if (dailyRes.data.success) {
          setDailySloka(dailyRes.data.data);
        }
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
        if (slokasRes.data.success && slokasRes.data.data.length > 0) {
          // Flatten some PDF resources for featured display
          const resList: PdfResource[] = [];
          slokasRes.data.data.forEach((s: Sloka) => {
            if (s.pdfResources) resList.push(...s.pdfResources);
          });
          setFeaturedResources(resList.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/slokas?search=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16 bg-pattern">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ivory-100 via-white to-ivory-50 border-b border-gold-200/80 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-100/80 border border-gold-300 text-maroon-800 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Academic Devotional Knowledge Platform • SlokaSetu</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-tight">
            Discover the Meaning Behind <span className="text-maroon-800">Every Prayer</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto font-serif leading-relaxed">
            Explore Hindu festivals, Amrita institutional occasions, devotional texts, their meanings, and multilingual prayer resources in one place.
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto mt-6">
            <div className="relative flex items-center shadow-lg rounded-2xl bg-white border-2 border-gold-400/80 p-1.5 focus-within:border-maroon-700 transition-all">
              <Search className="w-5 h-5 text-maroon-700 ml-3.5 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search slokas, deities, Amrita Homam, or festivals..."
                className="w-full px-4 py-3 text-stone-800 text-sm sm:text-base bg-transparent border-none focus:outline-none focus:ring-0"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-maroon-800 hover:bg-maroon-700 text-gold-200 font-semibold rounded-xl text-sm transition-colors flex items-center space-x-1.5 shrink-0 shadow-xs"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Metric Badges */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-stone-200/80">
              <span className="text-xs text-stone-500 block font-medium">Canonical Slokas</span>
              <span className="text-2xl font-bold text-maroon-800 font-heading">{stats.totalSlokas}</span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-stone-200/80">
              <span className="text-xs text-stone-500 block font-medium">Multilingual Editions</span>
              <span className="text-2xl font-bold text-maroon-800 font-heading">{stats.totalVersions}</span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-stone-200/80">
              <span className="text-xs text-stone-500 block font-medium">Festivals & Occasions</span>
              <span className="text-2xl font-bold text-maroon-800 font-heading">{stats.totalOccasions}</span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-stone-200/80">
              <span className="text-xs text-stone-500 block font-medium">PDF Resources</span>
              <span className="text-2xl font-bold text-maroon-800 font-heading">{stats.totalResources}</span>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING OCCASIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-gold-200/60">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-maroon-800 mb-1 font-heading">
              Chronological Observances
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900">
              Upcoming Occasions & Festivals
            </h2>
          </div>
          <Link
            to="/calendar"
            className="text-xs font-semibold text-maroon-800 hover:text-maroon-900 flex items-center space-x-1"
          >
            <span>Open Interactive Calendar</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingOccasions.map((occ) => (
            <OccasionCard key={occ.id} occasion={occ} />
          ))}
        </div>
      </section>

      {/* TODAY'S SLOKA SECTION */}
      {dailySloka && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-ivory-100 via-white to-gold-50/50 rounded-2xl border-2 border-gold-300 p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-48 h-48 bg-gold-200/30 rounded-full blur-2xl pointer-events-none" />
            
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-maroon-800 bg-maroon-100/70 px-3 py-1 rounded-full border border-maroon-200 font-heading">
                  Today's Featured Sloka
                </span>
                {dailySloka.deity && (
                  <span className="text-xs text-stone-600 bg-white px-2.5 py-1 rounded-full border border-stone-200">
                    Deity: <strong>{dailySloka.deity.name}</strong>
                  </span>
                )}
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900">
                {dailySloka.canonicalTitle}
              </h3>

              {/* Excerpt text in Romanized Sanskrit */}
              {dailySloka.versions && dailySloka.versions.length > 0 && (
                <div className="p-5 rounded-xl bg-white border border-gold-200/70 font-serif text-sm sm:text-base leading-relaxed text-stone-800 italic shadow-2xs">
                  {dailySloka.versions[0].textContent.split('\n\n')[0] || dailySloka.versions[0].textContent.slice(0, 300)}
                </div>
              )}

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {dailySloka.backgroundContext || dailySloka.significanceNotes}
              </p>

              <div className="pt-2 flex items-center space-x-4">
                <Link
                  to={`/slokas/${dailySloka.slug}`}
                  className="px-5 py-2.5 bg-maroon-800 hover:bg-maroon-700 text-gold-200 text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 shadow-xs"
                >
                  <span>Read Full Text & Translations</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/slokas"
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Browse all 27 slokas →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* EXPLORE THE LIBRARY BY DEITY & CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-4 border-b border-gold-200/60">
          <div className="text-xs font-bold uppercase tracking-wider text-maroon-800 mb-1 font-heading">
            Knowledge Taxonomy
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900">
            Explore the Devotional Library
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { name: 'Lord Ganesha', slug: 'ganesha', icon: '🐘', count: '4 texts' },
            { name: 'Lord Shiva', slug: 'shiva', icon: '🔱', count: '8 texts' },
            { name: 'Lord Vishnu', slug: 'vishnu', icon: '🪷', count: '6 texts' },
            { name: 'Goddess Lakshmi', slug: 'lakshmi', icon: '🪙', count: '2 texts' },
            { name: 'Sri Amma', slug: 'amma', icon: '🌸', count: '2 texts' },
            { name: 'Guru Parampara', slug: 'guru', icon: '📖', count: '5 texts' }
          ].map((d) => (
            <Link
              key={d.slug}
              to={`/slokas?deity=${d.slug}`}
              className="p-4 rounded-xl bg-white border border-stone-200 hover:border-gold-400 hover:shadow-sm transition-all text-center group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{d.icon}</div>
              <h4 className="text-xs font-bold text-stone-800 group-hover:text-maroon-800 font-heading">
                {d.name}
              </h4>
              <span className="text-[11px] text-stone-400 block mt-0.5">{d.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED DOWNLOADABLE RESOURCES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-gold-200/60">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-maroon-800 mb-1 font-heading">
              Authentic Archival Material
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900">
              Downloadable Prayer Documents
            </h2>
          </div>
          <Link
            to="/downloads"
            className="text-xs font-semibold text-maroon-800 hover:text-maroon-900 flex items-center space-x-1"
          >
            <span>View All PDF Editions</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Sri Mahaganapathi Homam Parayanam',
              source: 'SRI MAHAGANAPATHI HOMAM JULY.pdf',
              desc: 'Official 2026 Chennai Campus parayanam list & sequence.',
              badge: 'Official Programme'
            },
            {
              title: 'Devotional Stotra Sangraha (English)',
              source: 'ENGLISH.pdf',
              desc: '46 pages of Romanized Sanskrit transliterations and stotras.',
              badge: 'IAST Edition'
            },
            {
              title: 'Devotional Stotra Sangraha (Telugu)',
              source: 'TELUGU.pdf',
              desc: '57 pages of complete stotras rendered in classical Telugu script.',
              badge: 'Telugu Script'
            },
            {
              title: 'Devotional Stotra Sangraha (Tamil)',
              source: 'TAMIL.pdf',
              desc: '46 pages of complete stotras rendered in classical Tamil script.',
              badge: 'Tamil Script'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-white border border-stone-200 shadow-2xs hover:shadow-md hover:border-gold-300 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-maroon-800 bg-maroon-50 px-2 py-0.5 rounded border border-maroon-200 mb-2 inline-block">
                  {item.badge}
                </span>
                <h4 className="font-heading text-sm font-bold text-stone-900 mb-1 font-serif">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-500 mb-3 line-clamp-2">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-stone-400">PDF Document</span>
                <Link
                  to="/downloads"
                  className="text-xs font-semibold text-maroon-700 hover:text-maroon-900 flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Download Modal Trigger */}
      <DownloadModal
        resource={selectedDownload}
        onClose={() => setSelectedDownload(null)}
      />
    </div>
  );
};
