import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Info,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  GraduationCap,
  Sparkles,
  Download,
  X,
  Languages,
  Layers,
  FileText,
  Star,
  Printer,
  Compass,
  Sun,
  Moon
} from 'lucide-react';
import { apiClient } from '../api/client';
import { Occasion, Sloka, PdfResource } from '../types';
import { TextReader } from '../components/TextReader';
import { DownloadModal } from '../components/DownloadModal';
import { calculatePanchang } from '../utils/panchang';
import { useNityaParayanam } from '../context/NityaParayanamContext';
import { PrintPrayerSheetModal } from '../components/PrintPrayerSheetModal';

// Daily Day-of-Week Hindu Traditions & Suggested Slokas
const dailyTraditions: {
  [day: number]: {
    dayName: string;
    sanskritName: string;
    deity: string;
    color: string;
    whatHappens: string;
    whatToDo: string[];
    recommendedSlokas: { title: string; slug: string; desc: string }[];
  }
} = {
  0: { // Sunday
    dayName: 'Sunday',
    sanskritName: 'Ravivara',
    deity: 'Lord Surya (Sun God) & Lord Maha Vishnu',
    color: 'Red & Golden Yellow',
    whatHappens: 'Dedicated to the cosmic source of light, energy, health, and vitality. Traditionally celebrated with Surya Namaskar, solar prayers, and giving alms.',
    whatToDo: [
      'Wake up before sunrise and perform morning contemplation',
      'Offer fresh water (Arghyam) to the rising sun with Gayatri Mantra',
      'Recite Sri Aditya Hridaya Stotram for health, protection, and vital energy',
      'Consume light, sattvic food seasoned with natural whole grains'
    ],
    recommendedSlokas: [
      { title: 'Sri Aditya Hridaya Stotram', slug: 'aditya-hridaya-stotram', desc: 'Sage Agastya’s hymn of victory to the Sun God' },
      { title: 'Sri Vishnu Sahasranama Stotram', slug: 'vishnu-sahasranamam', desc: 'Thousand sacred names of the Supreme Lord' }
    ]
  },
  1: { // Monday
    dayName: 'Monday',
    sanskritName: 'Somavara',
    deity: 'Lord Shiva & Chandra (Moon)',
    color: 'White & Silver',
    whatHappens: 'Sacred to Lord Shiva, the auspicious Mahadeva, and the mind-governing deity Chandra. Ideal for fasting (Somavara Vratam) and meditation for mental tranquility.',
    whatToDo: [
      'Offer clean water, milk, or holy ashes (vibhuti) to Shiva Lingam',
      'Chant Lingashtakam and Sri Shiva Panchakshari Stotram (Om Namah Shivaya)',
      'Offer three-leafed Bilva patras while reciting Sri Bilvashtakam',
      'Practice silence (Mouna) and deep breath awareness in the evening'
    ],
    recommendedSlokas: [
      { title: 'Lingashtakam', slug: 'lingashtakam', desc: 'Eight verses praising the eternal Shiva Lingam' },
      { title: 'Sri Shiva Panchakshari Stotram', slug: 'shiva-panchakshari-stotram', desc: 'Meditation on the syllables Na-Ma-Si-Va-Ya' },
      { title: 'Sri Bilvashtakam', slug: 'bilvashtakam', desc: 'Offering the sacred Bilva leaf to Shiva' }
    ]
  },
  2: { // Tuesday
    dayName: 'Tuesday',
    sanskritName: 'Mangalavara',
    deity: 'Lord Ganesha & Lord Hanuman',
    color: 'Red & Ochre',
    whatHappens: 'Governed by Angaraka (Mars), Lord Ganesha, and Lord Hanuman. Celebrated for courage, eliminating physical and mental obstacles, and triumph over fear.',
    whatToDo: [
      'Light a red-wick oil or ghee lamp before Lord Ganesha',
      'Chant Sri Sankata Nashana Ganesha Stotram for liberation from affliction',
      'Sing Sri Maha Ganesha Pancharatnam for academic success and sharp intellect',
      'Recite Sri Hanuman Chalisa for strength and inner fearlessness'
    ],
    recommendedSlokas: [
      { title: 'Sri Mahaganapathi Dhyanam', slug: 'mahaganapathi-dhyanam', desc: 'Invocation to the remover of obstacles' },
      { title: 'Sri Sankata Nashana Ganesha Stotram', slug: 'sankata-nashana-ganesha-stotram', desc: 'Twelve holy names of Ganesha' },
      { title: 'Sri Maha Ganesha Pancharatnam', slug: 'maha-ganesha-pancharatnam', desc: 'Adi Shankaracharya’s five gems' },
      { title: 'Sri Hanuman Chalisa', slug: 'hanuman-chalisa', desc: 'Goswami Tulsidas’s hymn to Lord Hanuman' }
    ]
  },
  3: { // Wednesday
    dayName: 'Wednesday',
    sanskritName: 'Budhavara',
    deity: 'Lord Maha Vishnu & Goddess Saraswati',
    color: 'Green & Bright Yellow',
    whatHappens: 'Associated with intellect (Buddhi), speech, mathematics, literary arts, and commerce. Dedicated to Lord Vishnu who preserves cosmic balance.',
    whatToDo: [
      'Engage in dedicated scriptural study, learning, or academic reading',
      'Recite Sri Vishnu Sahasranamam for mental focus and spiritual peace',
      'Chant Sri Saraswati Stotram for eloquence, memory, and artistic skills',
      'Practice acts of charity towards students and educational causes'
    ],
    recommendedSlokas: [
      { title: 'Sri Vishnu Sahasranama Stotram', slug: 'vishnu-sahasranamam', desc: 'Thousand sacred names of the Supreme Lord' },
      { title: 'Sri Achyutashtakam', slug: 'achyutashtakam', desc: 'Melodic adoration of Achyuta and Krishna' },
      { title: 'Sri Saraswati Stotram', slug: 'saraswati-stotram', desc: 'Hymn to the Goddess of wisdom and learning' }
    ]
  },
  4: { // Thursday
    dayName: 'Thursday',
    sanskritName: 'Guruvara (Brihaspativara)',
    deity: 'The Spiritual Guru & Lord Dakshinamurthy',
    color: 'Yellow & Saffron',
    whatHappens: 'The day of the Guru, wisdom, and spiritual preceptors. Dedicated to seeking knowledge of the Self, receiving teachings, and honoring monastic lineages.',
    whatToDo: [
      'Meditate on the holy feet and teachings of your Guru / Chancellor',
      'Chant Sri Guru Stotram (Gurur Brahma) with sincere devotion',
      'Recite Vedic Shanti Mantras for universal peace and mutual harmony',
      'Study scriptural philosophy and offer yellow flowers to the altar'
    ],
    recommendedSlokas: [
      { title: 'Sri Guru Stotram (Guru Vandanam)', slug: 'guru-stotram', desc: 'Salutations to the Supreme Preceptor' },
      { title: 'Vedic Shanti Mantras', slug: 'shanti-mantram', desc: 'Upanishadic prayers for cosmic peace' }
    ]
  },
  5: { // Friday
    dayName: 'Friday',
    sanskritName: 'Shukravara',
    deity: 'Goddess Mahalakshmi & The Divine Mother',
    color: 'Pink, Crimson & White',
    whatHappens: 'Dedicated to the Divine Mother in all her auspicious forms — Lakshmi, Saraswati, and Durga. Observed for family harmony, virtue, beauty, and noble prosperity.',
    whatToDo: [
      'Cleanse home entrance, draw rice-flour kolam/rangoli, and light brass lamps',
      'Recite Sri Mahalakshmi Ashtakam in the morning and twilight (Sandhya)',
      'Chant Sri Saraswati Stotram for wisdom and refined speech',
      'Offer fragrant flowers and sweet kheer as holy offering (naivedyam)'
    ],
    recommendedSlokas: [
      { title: 'Sri Mahalakshmi Ashtakam', slug: 'mahalakshmi-ashtakam', desc: 'Eight-stanza hymn from the Padma Purana' },
      { title: 'Sri Saraswati Stotram', slug: 'saraswati-stotram', desc: 'Praise to the goddess of learning' }
    ]
  },
  6: { // Saturday
    dayName: 'Saturday',
    sanskritName: 'Shanivara',
    deity: 'Lord Maha Vishnu & Lord Hanuman',
    color: 'Dark Blue & Ochre',
    whatHappens: 'Dedicated to Lord Vishnu and Lord Hanuman for refuge from worldly suffering, fear, and karmic debts.',
    whatToDo: [
      'Chant Sri Vishnu Sahasranamam with devotion',
      'Recite Sri Hanuman Chalisa for courage and spiritual armor',
      'Light a pure sesame oil lamp for spiritual peace and discipline',
      'Feed birds, cows, or needy individuals as selfless service (Seva)'
    ],
    recommendedSlokas: [
      { title: 'Sri Vishnu Sahasranama Stotram', slug: 'vishnu-sahasranamam', desc: 'Thousand names of Lord Vishnu' },
      { title: 'Sri Hanuman Chalisa', slug: 'hanuman-chalisa', desc: 'Hymn of devotion to Lord Hanuman' },
      { title: 'Sri Achyutashtakam', slug: 'achyutashtakam', desc: 'Eight verses praising Achyuta' }
    ]
  }
};

export const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 6, 1)); // Default July 2026
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 6, 22)); // Default July 22, 2026
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  // Preferred script for inline previews across the calendar
  const [activeScript, setActiveScript] = useState<string>('Deva');

  // Reader Modal State
  const [readingSloka, setReadingSloka] = useState<Sloka | null>(null);
  const [loadingSloka, setLoadingSloka] = useState<boolean>(false);

  // PDF Download Modal State
  const [downloadResource, setDownloadResource] = useState<PdfResource | null>(null);

  // Print Prayer Sheet Modal State
  const [printingSloka, setPrintingSloka] = useState<Sloka | null>(null);
  const [showPanchangExpanded, setShowPanchangExpanded] = useState<boolean>(false);

  // Nitya Parayanam Bookmarking Hook
  const { isBookmarked, toggleBookmark } = useNityaParayanam();

  useEffect(() => {
    fetchOccasions();
  }, [categoryFilter]);

  const fetchOccasions = async () => {
    try {
      setLoading(true);
      let url = '/occasions';
      if (categoryFilter === 'amrita') {
        url += '?institution=amrita';
      } else if (categoryFilter === 'hindu') {
        url += '?institution=general';
      }
      const res = await apiClient.get(url);
      if (res.data.success) {
        setOccasions(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch occasions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Open Sloka in Multilingual Reader
  const handleOpenSloka = (sloka: Sloka) => {
    setReadingSloka(sloka);
  };

  const handleOpenSlokaBySlug = async (slug: string) => {
    try {
      setLoadingSloka(true);
      const res = await apiClient.get(`/slokas/${slug}`);
      if (res.data.success) {
        setReadingSloka(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch sloka details:', err);
    } finally {
      setLoadingSloka(false);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const setYearJump = (y: number) => setCurrentDate(new Date(y, month, 1));

  // Build calendar month grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to match occasions for a given day
  const getOccasionsForDay = (day: number) => {
    const checkDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return occasions.filter(occ => {
      if (!occ.dates) return false;
      return occ.dates.some(d => {
        const dStr = new Date(d.gregorianDate).toISOString().split('T')[0];
        return dStr === checkDateStr;
      });
    });
  };

  const selectedDayOccasions = selectedDate ? getOccasionsForDay(selectedDate.getDate()) : [];
  const selectedDayOfWeek = selectedDate ? selectedDate.getDay() : 0;
  const dayGuide = dailyTraditions[selectedDayOfWeek];

  // Helper to retrieve text for a specific script from a sloka
  const getScriptPreview = (sloka: Sloka, scriptCode: string) => {
    if (!sloka.versions || sloka.versions.length === 0) return null;
    
    // If user wants English meaning
    if (scriptCode === 'Translation') {
      const trans = sloka.versions.find(v => v.versionType === 'TRANSLATION');
      if (trans && trans.textContent) {
        return trans.textContent.split('\n\n')[0];
      }
    }

    const match = sloka.versions.find(v => v.script?.code === scriptCode);
    if (match && match.textContent) {
      const lines = match.textContent.split('\n').filter(l => l.trim().length > 0);
      return lines.slice(0, 2).join('\n');
    }
    // Fallback to first available version
    const fallback = sloka.versions[0];
    const lines = fallback.textContent.split('\n').filter(l => l.trim().length > 0);
    return lines.slice(0, 2).join('\n');
  };

  const scriptOptions = [
    { code: 'Deva', label: 'देवनागरी', sub: 'Sanskrit' },
    { code: 'Latn', label: 'English (IAST)', sub: 'Romanized' },
    { code: 'Telu', label: 'తెలుగు', sub: 'Telugu' },
    { code: 'Taml', label: 'தமிழ்', sub: 'Tamil' },
    { code: 'Knda', label: 'ಕನ್ನಡ', sub: 'Kannada' },
    { code: 'Mlym', label: 'മലയാളം', sub: 'Malayalam' },
    { code: 'Translation', label: 'Meaning', sub: 'English' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-gold-600 uppercase tracking-widest font-heading">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Comprehensive Hindu Calendar & Devotional Platform</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            Hindu Festival & Daily Devotional Calendar
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-serif mt-1 max-w-2xl">
            Click on <strong>any date</strong> to discover the festival, traditional tithi, customs, ritual procedures, and read associated slokas in <strong>Devanagari, Telugu, Tamil, Kannada, Malayalam, and English</strong>.
          </p>
        </div>

        {/* Quick Year Jumps & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Year Buttons */}
          <div className="bg-stone-100 p-1 rounded-lg border border-stone-200 flex items-center text-xs">
            {[2025, 2026, 2027].map(y => (
              <button
                key={y}
                onClick={() => setYearJump(y)}
                className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                  year === y ? 'bg-maroon-800 text-gold-200' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          <div className="bg-white p-1 rounded-lg border border-stone-200 flex items-center shadow-2xs text-xs">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                categoryFilter === 'all' ? 'bg-maroon-800 text-gold-200 font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setCategoryFilter('hindu')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                categoryFilter === 'hindu' ? 'bg-maroon-800 text-gold-200 font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Hindu Festivals
            </button>
            <button
              onClick={() => setCategoryFilter('amrita')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                categoryFilter === 'amrita' ? 'bg-maroon-800 text-gold-200 font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Amrita Occasions
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar Grid (Left) & Today's Ritual Guidance (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Cols: Monthly Calendar View */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
          
          {/* Calendar Header / Navigation */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-ivory-100 to-ivory-50 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-maroon-900">
                {monthNames[month]} <span className="text-gold-600 font-normal">{year}</span>
              </h2>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg text-stone-600 hover:text-maroon-800 hover:bg-white border border-stone-200 shadow-2xs"
                title="Previous Month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg text-stone-600 hover:text-maroon-800 hover:bg-white border border-stone-200 shadow-2xs"
                title="Next Month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-50/70 text-center text-xs font-semibold uppercase tracking-wider text-stone-500 py-2.5">
            <span className="text-red-700">Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-stone-100 bg-white">
            
            {/* Empty slots before month start */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-20 sm:h-24 bg-stone-50/30 p-1 text-stone-300 text-xs">
                {/* Blank */}
              </div>
            ))}

            {/* Month Day Cells */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dayOccasions = getOccasionsForDay(day);
              const isSelected = selectedDate &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => setSelectedDate(new Date(year, month, day))}
                  className={`h-20 sm:h-24 p-1 sm:p-1.5 cursor-pointer transition-all flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-gold-100/90 ring-2 ring-inset ring-maroon-800'
                      : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                      isSelected
                        ? 'bg-maroon-800 text-white'
                        : dayOccasions.length > 0
                        ? 'text-maroon-900 font-extrabold'
                        : 'text-stone-700'
                    }`}>
                      {day}
                    </span>

                    {dayOccasions.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                    )}
                  </div>

                  {/* Occasion Mini Badges */}
                  <div className="space-y-0.5 overflow-hidden">
                    {dayOccasions.slice(0, 1).map((occ) => {
                      const isAmrita = !!occ.institutionId || occ.category?.slug.includes('amrita');
                      return (
                        <div
                          key={occ.id}
                          className={`text-[9px] font-semibold px-1 py-0.5 rounded truncate border ${
                            isAmrita
                              ? 'bg-maroon-100 text-maroon-900 border-maroon-300 font-bold'
                              : 'bg-gold-100 text-gold-900 border-gold-300'
                          }`}
                          title={occ.name}
                        >
                          {occ.name}
                        </div>
                      );
                    })}
                    {dayOccasions.length > 1 && (
                      <span className="text-[8px] text-maroon-700 font-bold block">
                        +{dayOccasions.length - 1} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-stone-50 border-t border-stone-200 text-[11px] text-stone-500 flex items-center space-x-2">
            <Info className="w-4 h-4 text-stone-400 shrink-0" />
            <span>
              Click on any day cell to load the complete ritual schedule, festive procedures, and prescribed prayer stotras in all scripts.
            </span>
          </div>
        </div>

        {/* Right 5 Cols: "What Happens Today & Multilingual Slokas" Dynamic Panel */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header of Selected Date */}
          <div className="bg-gradient-to-r from-maroon-800 to-maroon-900 rounded-2xl p-5 text-white shadow-md">
            <div className="flex items-center space-x-2 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-1 font-heading">
              <CalendarIcon className="w-4 h-4" />
              <span>Selected Observance Date</span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </h3>
            <p className="text-xs text-gold-200 mt-1 font-serif">
              {dayGuide.sanskritName} • Dedicated to {dayGuide.deity}
            </p>
          </div>

          {/* Vedic Panchang Astronomical Card */}
          {(() => {
            const panchang = calculatePanchang(selectedDate);
            return (
              <div className="bg-gradient-to-br from-ivory-100 to-ivory-50 rounded-2xl border border-gold-300/80 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gold-200">
                  <div className="flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-maroon-700" />
                    <span className="text-xs font-bold font-heading text-maroon-900 uppercase tracking-wider">
                      Vedic Panchang & Muhurta
                    </span>
                  </div>
                  <button
                    onClick={() => setShowPanchangExpanded(!showPanchangExpanded)}
                    className="text-[11px] font-semibold text-maroon-800 hover:underline"
                  >
                    {showPanchangExpanded ? 'Show Less' : 'Full Timings'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-lg border border-stone-200/80">
                    <span className="text-[10px] text-stone-500 block uppercase tracking-wider font-semibold">Tithi</span>
                    <span className="font-bold text-stone-900">{panchang.tithiName}</span>
                    <span className="text-[10px] text-maroon-700 block font-serif">({panchang.paksha} Paksha)</span>
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-stone-200/80">
                    <span className="text-[10px] text-stone-500 block uppercase tracking-wider font-semibold">Nakshatra</span>
                    <span className="font-bold text-stone-900">{panchang.nakshatraName}</span>
                    <span className="text-[10px] text-stone-500 block font-serif line-clamp-1">{panchang.nakshatraDeity}</span>
                  </div>
                </div>

                {showPanchangExpanded && (
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-white p-2 rounded-lg border border-stone-200/80">
                      <span className="text-[10px] text-stone-500 block uppercase tracking-wider font-semibold">Brahma Muhurta</span>
                      <span className="font-bold text-emerald-800">{panchang.brahmaMuhurta}</span>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-stone-200/80">
                      <span className="text-[10px] text-stone-500 block uppercase tracking-wider font-semibold">Abhijit Muhurta</span>
                      <span className="font-bold text-stone-900">{panchang.abhijitMuhurta}</span>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-stone-200/80">
                      <span className="text-[10px] text-stone-500 block uppercase tracking-wider font-semibold">Sunrise / Sunset</span>
                      <span className="font-medium text-stone-800">{panchang.sunrise} • {panchang.sunset}</span>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-stone-200/80">
                      <span className="text-[10px] text-red-600 block uppercase tracking-wider font-semibold">Rahu Kalam</span>
                      <span className="font-medium text-stone-800">{panchang.rahuKalam}</span>
                    </div>
                  </div>
                )}

                <div className="text-[11px] text-stone-600 font-serif italic pt-1 border-t border-gold-200/50">
                  {panchang.auspiciousSummary}
                </div>
              </div>
            );
          })()}

          {/* Quick Script Selector Bar */}
          <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-maroon-900 uppercase tracking-wider font-heading">
                <Languages className="w-4 h-4 text-gold-600" />
                <span>Script / Language Display:</span>
              </div>
              <span className="text-[11px] text-stone-500 font-serif italic">
                Active in previews & reader
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {scriptOptions.map(opt => (
                <button
                  key={opt.code}
                  onClick={() => setActiveScript(opt.code)}
                  className={`px-2.5 py-1 rounded text-xs transition-all font-medium flex items-center space-x-1 ${
                    activeScript === opt.code
                      ? 'bg-maroon-800 text-gold-200 font-bold shadow-xs'
                      : 'bg-stone-50 text-stone-700 hover:bg-gold-50 border border-stone-200'
                  }`}
                >
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 1. If an Annual Festival falls on this date */}
          {selectedDayOccasions.length > 0 ? (
            <div className="space-y-6">
              {selectedDayOccasions.map((occ) => {
                const isAmrita = !!occ.institutionId || occ.category?.slug.includes('amrita');
                return (
                  <div
                    key={occ.id}
                    className="bg-white rounded-2xl border-2 border-gold-300 p-6 shadow-sm space-y-5"
                  >
                    {/* Festival Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isAmrita ? 'bg-maroon-100 text-maroon-900 border-maroon-300' : 'bg-gold-100 text-gold-900 border-gold-300'
                        }`}>
                          {occ.category?.name}
                        </span>
                        <h4 className="font-heading text-xl font-bold text-stone-900 mt-1">
                          {occ.name}
                        </h4>
                      </div>
                      {isAmrita && (
                        <span className="flex items-center space-x-1 text-xs text-maroon-800 bg-maroon-50 px-2 py-1 rounded-lg border border-maroon-200 font-semibold">
                          <GraduationCap className="w-4 h-4" />
                          <span>Amrita Campus</span>
                        </span>
                      )}
                    </div>

                    {/* What Happens Today */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-maroon-800 flex items-center space-x-1.5 font-heading">
                        <Clock className="w-4 h-4 text-maroon-700" />
                        <span>What Happens Today (Customs & Observances)</span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-700 font-serif leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
                        {occ.whatHappensToday || occ.description}
                      </p>
                    </div>

                    {/* What You Need to Do (Step-by-step Preparation Guide) */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-maroon-800 flex items-center space-x-1.5 font-heading">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>What You Should Do (Ritual Guide)</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-stone-700">
                        {occ.preparationGuide?.split('\n').filter(s => s.trim().length > 0).map((step, idx) => (
                          <div key={idx} className="flex items-start space-x-2 bg-ivory-50 p-2.5 rounded-lg border border-gold-200/60">
                            <span className="w-4 h-4 rounded-full bg-maroon-800 text-gold-200 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step.replace(/^\d+\.\s*/, '')}</span>
                          </div>
                        )) || (
                          <p className="text-xs text-stone-500 font-serif">Participate in collective prayers and maintain meditative focus.</p>
                        )}
                      </div>
                    </div>

                    {/* Prescribed Parayanam Slokas with Multilingual Reader Action */}
                    <div className="space-y-3 pt-2 border-t border-stone-200">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold uppercase tracking-wider text-maroon-800 flex items-center space-x-1.5 font-heading">
                          <BookOpen className="w-4 h-4 text-maroon-700" />
                          <span>Prescribed Parayanam Slokas ({occ.occasionSlokas?.length || 0})</span>
                        </div>
                        <span className="text-[10px] text-stone-500 italic">
                          Click to read in any language
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {occ.occasionSlokas?.map((os) => {
                          const previewText = getScriptPreview(os.sloka, activeScript);
                          const hasPdf = os.sloka.pdfResources && os.sloka.pdfResources.length > 0;

                          return (
                            <div
                              key={os.sloka.id}
                              className="p-3.5 rounded-xl bg-stone-50 hover:bg-gold-50/70 border border-stone-200/90 transition-all space-y-2 group"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-xs font-bold text-stone-900 group-hover:text-maroon-800">
                                    {os.sloka.canonicalTitle}
                                  </div>
                                  <div className="text-[10px] text-stone-500">
                                    {os.relationshipType.replace(/_/g, ' ')} • {os.sloka.category?.name}
                                  </div>
                                </div>

                                <div className="flex items-center space-x-1.5">
                                  {/* Bookmark to Nitya Parayanam */}
                                  <button
                                    onClick={() => toggleBookmark(os.sloka.slug)}
                                    className={`p-1 rounded transition-colors ${
                                      isBookmarked(os.sloka.slug)
                                        ? 'text-amber-500 hover:text-amber-600'
                                        : 'text-stone-400 hover:text-amber-500'
                                    }`}
                                    title={isBookmarked(os.sloka.slug) ? 'Remove from Nitya Prayers' : 'Bookmark to My Nitya Prayers'}
                                  >
                                    <Star className={`w-3.5 h-3.5 ${isBookmarked(os.sloka.slug) ? 'fill-current' : ''}`} />
                                  </button>

                                  {/* Print Prayer Leaflet */}
                                  <button
                                    onClick={() => setPrintingSloka(os.sloka)}
                                    className="p-1 rounded text-stone-500 hover:text-maroon-800 hover:bg-white transition-colors"
                                    title="Print Sacred Prayer Leaflet"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                  </button>

                                  {hasPdf && (
                                    <button
                                      onClick={() => setDownloadResource(os.sloka.pdfResources![0])}
                                      className="p-1 rounded text-stone-500 hover:text-maroon-800 hover:bg-white border border-transparent hover:border-stone-200"
                                      title="Download PDF"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleOpenSloka(os.sloka)}
                                    className="px-2.5 py-1 bg-maroon-800 hover:bg-maroon-900 text-gold-200 rounded text-[11px] font-semibold flex items-center space-x-1 shadow-2xs"
                                  >
                                    <span>Read in All Scripts</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Script Text Excerpt */}
                              {previewText && (
                                <div className="p-2.5 bg-white rounded-lg border border-gold-200/70 text-xs text-stone-800 font-serif italic whitespace-pre-line leading-relaxed">
                                  {previewText}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-1 text-right">
                        <Link
                          to={`/occasions/${occ.slug}`}
                          className="text-xs font-bold text-maroon-800 hover:text-maroon-900 underline"
                        >
                          View Occasion Page & All Historical Records →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* 2. When No Annual Festival: Daily Hindu Day-of-the-Week Spiritual Guide */
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-5">
              <div className="pb-3 border-b border-stone-200">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                  Daily Vedic Tradition
                </span>
                <h4 className="font-heading text-lg font-bold text-stone-900 mt-1">
                  {dayGuide.dayName} Spiritual Guidance ({dayGuide.sanskritName})
                </h4>
                <p className="text-xs text-maroon-800 font-semibold mt-0.5">
                  Governing Divinity: {dayGuide.deity} • Color: {dayGuide.color}
                </p>
              </div>

              {/* What Happens / Significance */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block font-heading">
                  Day's Significance
                </span>
                <p className="text-xs sm:text-sm text-stone-600 font-serif leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-200/70">
                  {dayGuide.whatHappens}
                </p>
              </div>

              {/* Recommended Daily Observance */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block font-heading">
                  Recommended Daily Observance
                </span>
                <div className="space-y-1.5 text-xs text-stone-700">
                  {dayGuide.whatToDo.map((todo, idx) => (
                    <div key={idx} className="flex items-start space-x-2 bg-ivory-50 p-2.5 rounded-lg border border-stone-200/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{todo}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Daily Slokas with Multilingual Reader */}
              <div className="space-y-2.5 pt-2 border-t border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-maroon-800 block font-heading">
                  Recommended Daily Slokas (Available in All Languages)
                </span>
                <div className="space-y-2">
                  {dayGuide.recommendedSlokas.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-stone-50 hover:bg-gold-50/70 border border-stone-200/90 transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-stone-900">
                          {s.title}
                        </div>
                        <div className="text-[11px] text-stone-500 font-serif">
                          {s.desc}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0 ml-3">
                        {/* Bookmark to Nitya Parayanam */}
                        <button
                          onClick={() => toggleBookmark(s.slug)}
                          className={`p-1.5 rounded transition-colors ${
                            isBookmarked(s.slug)
                              ? 'text-amber-500 hover:text-amber-600'
                              : 'text-stone-400 hover:text-amber-500'
                          }`}
                          title={isBookmarked(s.slug) ? 'Remove from Nitya Prayers' : 'Bookmark to My Nitya Prayers'}
                        >
                          <Star className={`w-3.5 h-3.5 ${isBookmarked(s.slug) ? 'fill-current' : ''}`} />
                        </button>

                        <button
                          onClick={() => handleOpenSlokaBySlug(s.slug)}
                          className="px-2.5 py-1 rounded bg-maroon-800 hover:bg-maroon-900 text-gold-200 text-xs font-semibold flex items-center space-x-1 shadow-2xs"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>Read</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MULTILINGUAL SLOKA READER MODAL */}
      {readingSloka && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setReadingSloka(null)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border-2 border-gold-300 overflow-hidden z-10 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-maroon-800 to-maroon-900 p-5 text-white flex items-center justify-between shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2 text-[10px] text-gold-300 font-bold uppercase tracking-widest font-heading">
                  <span>{readingSloka.category?.name || 'Stotram'}</span>
                  {readingSloka.deity && <span>• {readingSloka.deity.name}</span>}
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                  {readingSloka.canonicalTitle}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                {/* Print Leaflet Button */}
                <button
                  onClick={() => setPrintingSloka(readingSloka)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center space-x-1"
                  title="Print Sacred Leaflet"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print Leaflet</span>
                </button>

                {/* Bookmark Toggle Button */}
                <button
                  onClick={() => toggleBookmark(readingSloka.slug)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isBookmarked(readingSloka.slug)
                      ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                  }`}
                  title={isBookmarked(readingSloka.slug) ? 'Remove from Nitya Prayers' : 'Bookmark to Nitya Prayers'}
                >
                  <Star className={`w-3.5 h-3.5 ${isBookmarked(readingSloka.slug) ? 'fill-current' : ''}`} />
                </button>

                {readingSloka.pdfResources && readingSloka.pdfResources.length > 0 && (
                  <button
                    onClick={() => setDownloadResource(readingSloka.pdfResources![0])}
                    className="px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-stone-950 font-semibold text-xs flex items-center space-x-1 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Download PDF</span>
                  </button>
                )}
                <button
                  onClick={() => setReadingSloka(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: TextReader Component */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              <TextReader versions={readingSloka.versions || []} />
              
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                <span>
                  Source: {readingSloka.primarySource?.fileName || 'Archival Devotional Collection'}
                </span>
                <Link
                  to={`/slokas/${readingSloka.slug}`}
                  className="font-semibold text-maroon-800 hover:text-maroon-900 underline"
                  onClick={() => setReadingSloka(null)}
                >
                  Open Full Academic Commentary & Historical Notes →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Download Modal */}
      {downloadResource && (
        <DownloadModal
          resource={downloadResource}
          onClose={() => setDownloadResource(null)}
        />
      )}

      {/* Print Prayer Leaflet Modal */}
      {printingSloka && (
        <PrintPrayerSheetModal
          sloka={printingSloka}
          onClose={() => setPrintingSloka(null)}
          occasionTitle={selectedDayOccasions.length > 0 ? selectedDayOccasions[0].name : `${dayGuide.dayName} Sadhana`}
          panchangDateStr={selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        />
      )}
    </div>
  );
};
