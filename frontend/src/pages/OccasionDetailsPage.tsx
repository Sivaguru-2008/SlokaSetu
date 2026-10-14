import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  BookOpen,
  Download,
  GraduationCap,
  ShieldCheck,
  CheckSquare,
  Square,
  ArrowRight,
  FileText,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { apiClient } from '../api/client';
import { Occasion, PdfResource } from '../types';
import { DownloadModal } from '../components/DownloadModal';

export const OccasionDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDownload, setSelectedDownload] = useState<PdfResource | null>(null);
  
  // Interactive checklist in localStorage
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchOccasion = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.get(`/occasions/${slug}`);
        if (res.data.success) {
          setOccasion(res.data.data);
          // Load checklist state
          const saved = localStorage.getItem(`checklist_${res.data.data.id}`);
          if (saved) {
            setChecklist(JSON.parse(saved));
          }
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Occasion not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchOccasion();
  }, [slug]);

  const toggleChecklistItem = (itemKey: string) => {
    if (!occasion) return;
    const updated = { ...checklist, [itemKey]: !checklist[itemKey] };
    setChecklist(updated);
    localStorage.setItem(`checklist_${occasion.id}`, JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-maroon-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-stone-500 font-serif">Retrieving verified occasion details from PostgreSQL...</p>
      </div>
    );
  }

  if (error || !occasion) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-maroon-700 mx-auto" />
        <h2 className="text-xl font-bold text-stone-900 font-heading">Occasion Record Unavailable</h2>
        <p className="text-sm text-stone-600">{error || 'Requested occasion could not be located.'}</p>
        <Link to="/calendar" className="inline-block px-4 py-2 bg-maroon-800 text-gold-200 rounded-lg text-xs font-semibold">
          Return to Calendar
        </Link>
      </div>
    );
  }

  const primaryDate = occasion.dates && occasion.dates.length > 0 ? occasion.dates[0] : null;
  const isAmrita = !!occasion.institutionId || occasion.category?.slug.includes('amrita');

  // Parse preparation guide lines
  const preparationItems = occasion.preparationGuide
    ? occasion.preparationGuide.split(';\n').map(l => l.replace(/^\d+\.\s*/, '').trim())
    : [
        'Review the occasion history and significance',
        'Read the associated parayanam stotras',
        'Download available PDF editions for offline prayer',
        'Participate with mental purity and reverence'
      ];

  const completedCount = preparationItems.filter((_, idx) => checklist[`item_${idx}`]).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Banner / Header */}
      <div className="bg-gradient-to-br from-ivory-100 via-white to-ivory-50 rounded-2xl border-2 border-gold-300/80 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
            isAmrita
              ? 'bg-maroon-100 text-maroon-900 border-maroon-300'
              : 'bg-gold-100 text-gold-900 border-gold-300'
          }`}>
            {occasion.category?.name}
          </span>

          {isAmrita && (
            <span className="flex items-center space-x-1.5 text-xs text-maroon-800 bg-white px-2.5 py-1 rounded-full border border-maroon-200 font-semibold shadow-2xs">
              <GraduationCap className="w-4 h-4 text-maroon-700" />
              <span>Amrita Institutional Occasion</span>
            </span>
          )}

          {occasion.deity && (
            <span className="text-xs text-stone-600 bg-white px-2.5 py-1 rounded-full border border-stone-200">
              Deity: <strong>{occasion.deity.name}</strong>
            </span>
          )}
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-stone-900 mb-4 tracking-tight">
          {occasion.name}
        </h1>

        {/* Date and Location Ribbon */}
        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-700 pb-6 border-b border-stone-200">
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-2xs">
            <Calendar className="w-4 h-4 text-maroon-700" />
            <span className="font-semibold text-stone-900">
              {primaryDate ? new Date(primaryDate.gregorianDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }) : 'Observance Date Pending'}
            </span>
            {primaryDate?.region && (
              <span className="text-stone-500">({primaryDate.region})</span>
            )}
          </div>

          {occasion.institution && (
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-2xs">
              <MapPin className="w-4 h-4 text-maroon-700" />
              <span>{occasion.institution.name} • {occasion.institution.department}</span>
            </div>
          )}
        </div>

        {/* Description & Significance */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-stone-700 leading-relaxed font-serif">
          <div>
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-maroon-800 mb-2">
              Background & Context
            </h3>
            <p>{occasion.description}</p>
          </div>

          <div>
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-maroon-800 mb-2">
              Spiritual Significance
            </h3>
            <p>{occasion.significance || 'Celebrated in accordance with sacred Puranic traditions.'}</p>
          </div>
        </div>

        {/* What Happens Today Section */}
        {occasion.whatHappensToday && (
          <div className="mt-6 pt-5 border-t border-stone-200/60">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-maroon-800 mb-2 flex items-center space-x-1.5">
              <span>What Happens Today (Rituals & Traditional Customs)</span>
            </h3>
            <p className="text-sm text-stone-800 bg-gold-50/60 p-4 rounded-xl border border-gold-200/80 leading-relaxed font-serif">
              {occasion.whatHappensToday}
            </p>
          </div>
        )}

        {/* Source Citation */}
        <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-500">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>Primary Document Source:</strong> {occasion.primarySource?.fileName || 'Official Circular Archive'}
            </span>
          </span>
          <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium">
            Verified Record
          </span>
        </div>
      </div>

      {/* ASSOCIATED SLOKAS / PARAYANAM SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b border-gold-200/80 gap-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-maroon-800 mb-1 font-heading">
              Devotional Sequence
            </div>
            <h2 className="font-heading text-2xl font-bold text-stone-900">
              Parayanam & Associated Texts ({occasion.occasionSlokas?.length || 0})
            </h2>
          </div>
          <p className="text-xs text-stone-500 font-serif">
            Distinguishing official liturgical programme texts from curated recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {occasion.occasionSlokas?.map((os) => {
            const sloka = os.sloka;
            const isOfficial = os.relationshipType === 'OFFICIAL_PROGRAMME';

            return (
              <div
                key={sloka.id}
                className="p-5 rounded-xl bg-white border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-gold-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      isOfficial
                        ? 'bg-maroon-50 text-maroon-800 border-maroon-200'
                        : 'bg-stone-100 text-stone-700 border-stone-200'
                    }`}>
                      {isOfficial ? `Order #${os.displayOrder} • Official Programme` : 'Curated Recommendation'}
                    </span>

                    {sloka.deity && (
                      <span className="text-[11px] text-stone-500">
                        {sloka.deity.name}
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading text-base font-bold text-stone-900 mb-1">
                    <Link to={`/slokas/${sloka.slug}`} className="hover:text-maroon-800 transition-colors">
                      {sloka.canonicalTitle}
                    </Link>
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                    {os.notes || sloka.backgroundContext}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-[11px] text-stone-500">
                    <span className="bg-stone-100 px-1.5 py-0.5 rounded text-[10px]">
                      {sloka.versions?.length || 3} scripts
                    </span>
                    {sloka.pdfResources && sloka.pdfResources.length > 0 && (
                      <span className="text-emerald-700 font-medium">PDF Available</span>
                    )}
                  </div>

                  <Link
                    to={`/slokas/${sloka.slug}`}
                    className="text-xs font-bold text-maroon-800 hover:text-maroon-900 flex items-center space-x-1"
                  >
                    <span>Read Text</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PREPARATION CHECKLIST SECTION */}
      <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 mb-6 gap-2">
          <div>
            <h3 className="font-heading text-lg font-bold text-stone-900 flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-maroon-700" />
              <span>Devotional Preparation Checklist</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Track personal study and recitation progress for this observance.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gold-100 text-gold-900 border border-gold-300">
            {completedCount} of {preparationItems.length} Completed
          </span>
        </div>

        <div className="space-y-3">
          {preparationItems.map((item, idx) => {
            const key = `item_${idx}`;
            const isDone = !!checklist[key];

            return (
              <div
                key={key}
                onClick={() => toggleChecklistItem(key)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-center space-x-3 ${
                  isDone
                    ? 'bg-emerald-50/60 border-emerald-200 text-stone-900'
                    : 'bg-stone-50/70 border-stone-200/80 hover:bg-stone-100 text-stone-700'
                }`}
              >
                {isDone ? (
                  <CheckSquare className="w-5 h-5 text-emerald-700 shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-stone-400 shrink-0" />
                )}
                <span className={`text-xs sm:text-sm font-medium ${isDone ? 'line-through text-stone-500' : ''}`}>
                  {item}
                </span>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-3 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-500 leading-relaxed">
          <strong>Note on Devotional Guidelines:</strong> The preparation checklist provides personal devotional guidance and does not impose mandatory ritual obligations. Devotees may chant and contemplate according to their inclination and spiritual tradition.
        </div>
      </section>

      {/* PDF RESOURCES & DOWNLOADS SECTION */}
      {occasion.pdfResources && occasion.pdfResources.length > 0 && (
        <section className="space-y-4">
          <div className="pb-2 border-b border-stone-200">
            <h3 className="font-heading text-lg font-bold text-stone-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-maroon-700" />
              <span>Downloadable Event Resources ({occasion.pdfResources.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {occasion.pdfResources.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-2xs flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-stone-900 font-serif">
                    {res.title}
                  </h4>
                  <span className="text-[11px] font-mono text-stone-400 block mt-0.5">
                    {res.fileName} • {res.pageReference || 'Complete'}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDownload(res)}
                  className="px-3 py-1.5 rounded-lg bg-maroon-50 text-maroon-800 hover:bg-maroon-100 border border-maroon-200 text-xs font-semibold flex items-center space-x-1 shrink-0 ml-3"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Download Modal Trigger */}
      <DownloadModal
        resource={selectedDownload}
        onClose={() => setSelectedDownload(null)}
      />
    </div>
  );
};
