import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Download,
  ShieldCheck,
  FileText,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Info,
  Layers,
  ChevronRight,
  Star,
  Printer
} from 'lucide-react';
import { apiClient } from '../api/client';
import { Sloka, PdfResource } from '../types';
import { TextReader } from '../components/TextReader';
import { DownloadModal } from '../components/DownloadModal';
import { useNityaParayanam } from '../context/NityaParayanamContext';
import { PrintPrayerSheetModal } from '../components/PrintPrayerSheetModal';

export const SlokaDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [sloka, setSloka] = useState<Sloka | null>(null);
  const [related, setRelated] = useState<{ relatedSlokas: Sloka[]; relatedOccasions: any[] }>({
    relatedSlokas: [],
    relatedOccasions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDownload, setSelectedDownload] = useState<PdfResource | null>(null);
  const [printingModalOpen, setPrintingModalOpen] = useState(false);
  const { isBookmarked, toggleBookmark } = useNityaParayanam();

  useEffect(() => {
    const fetchSlokaData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.get(`/slokas/${slug}`);
        if (res.data.success) {
          setSloka(res.data.data);

          // Fetch related content
          const relRes = await apiClient.get(`/slokas/${res.data.data.id}/related`);
          if (relRes.data.success) {
            setRelated(relRes.data.data);
          }
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Sloka record not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchSlokaData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-maroon-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-stone-500 font-serif">Retrieving verified Sanskrit sloka edition from PostgreSQL...</p>
      </div>
    );
  }

  if (error || !sloka) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-maroon-700 mx-auto" />
        <h2 className="text-xl font-bold text-stone-900 font-heading">Devotional Text Record Not Found</h2>
        <p className="text-sm text-stone-600">{error || 'Requested sloka could not be located.'}</p>
        <Link to="/slokas" className="inline-block px-4 py-2 bg-maroon-800 text-gold-200 rounded-lg text-xs font-semibold">
          Return to Sloka Library
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* SECTION A: BASIC INFORMATION BANNER */}
      <div className="bg-gradient-to-br from-ivory-100 via-white to-ivory-50 rounded-2xl border-2 border-gold-300/80 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-maroon-800 bg-maroon-100/70 px-3 py-1 rounded-full border border-maroon-200 font-heading">
            {sloka.category?.name || 'Stotram'}
          </span>

          {sloka.deity && (
            <span className="text-xs text-stone-700 bg-white px-2.5 py-1 rounded-full border border-stone-200 font-medium">
              Primary Deity: <strong>{sloka.deity.name}</strong>
            </span>
          )}

          <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Canonical Text</span>
          </span>

          <div className="ml-auto flex items-center space-x-2">
            {/* Bookmark button */}
            <button
              onClick={() => toggleBookmark(sloka.slug)}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 border transition-colors ${
                isBookmarked(sloka.slug)
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-gold-50'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isBookmarked(sloka.slug) ? 'fill-current text-amber-500' : 'text-stone-400'}`} />
              <span>{isBookmarked(sloka.slug) ? 'In My Prayers' : 'Bookmark to Nitya Prayers'}</span>
            </button>

            {/* Print Leaflet button */}
            <button
              onClick={() => setPrintingModalOpen(true)}
              className="px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 border border-stone-200 bg-white hover:bg-gold-50 text-maroon-800 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Leaflet</span>
            </button>
          </div>
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-stone-900 mb-3 tracking-tight">
          {sloka.canonicalTitle}
        </h1>

        {/* Alternative Titles & Transliteration Variants */}
        {sloka.aliases && sloka.aliases.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500 mb-6">
            <span className="font-medium text-stone-400">Known as:</span>
            {sloka.aliases.map((a) => (
              <span key={a.id} className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-serif italic border border-stone-200">
                {a.aliasTitle}
              </span>
            ))}
          </div>
        )}

        {/* Primary Description */}
        <p className="text-sm sm:text-base text-stone-700 font-serif leading-relaxed max-w-4xl">
          {sloka.backgroundContext}
        </p>

        {/* Available Editions Pill Strip */}
        <div className="mt-6 pt-5 border-t border-stone-200/70 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-stone-800">Available Scripts:</span>
            {sloka.versions?.map((v) => (
              <span key={v.id} className="bg-white border border-stone-200 px-2 py-0.5 rounded font-mono text-[11px]">
                {v.script.name}
              </span>
            ))}
          </div>

          <span className="text-stone-400 text-[11px]">
            Source: {sloka.primarySource?.fileName || 'Archival PDF Collection'}
          </span>
        </div>
      </div>

      {/* SECTION B & C: BACKGROUND & SIGNIFICANCE (CLEARLY DISTINGUISHING EVIDENCE FROM TRADITION) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Historical & Textual Evidence */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
            <Info className="w-4 h-4 text-maroon-700" />
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-maroon-900">
              Textual & Historical Context
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif">
            {sloka.historicalNotes || 'Documented in classical Puranic compilations and preserved through unbroken guru-shishya lineages across Vedic centers.'}
          </p>
          <div className="pt-2 text-[11px] text-stone-400 italic">
            * Recorded per documented textual manuscripts and commentaries.
          </div>
        </div>

        {/* Traditional & Devotional Significance */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
            <Sparkles className="w-4 h-4 text-gold-600" />
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-maroon-900">
              Traditional & Devotional Significance
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif">
            {sloka.significanceNotes || sloka.traditionalNotes || 'Recited during daily spiritual practice, temple pujas, and homams to cultivate contemplative focus and devotion.'}
          </p>
          <div className="pt-2 text-[11px] text-stone-400 italic">
            * Explanatory notes reflect traditional religious heritage without unsupported medical or scientific claims.
          </div>
        </div>
      </section>

      {/* SECTION D: MULTILINGUAL TEXT READER */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gold-200/80">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-maroon-800 mb-0.5 font-heading">
              Original Text & Transliteration
            </div>
            <h2 className="font-heading text-2xl font-bold text-stone-900">
              Interactive Text Reader
            </h2>
          </div>
        </div>

        {sloka.versions && sloka.versions.length > 0 ? (
          <TextReader versions={sloka.versions} />
        ) : (
          <div className="p-8 text-center bg-white rounded-xl border border-dashed border-stone-300 text-stone-500">
            No published text versions found for this record.
          </div>
        )}
      </section>

      {/* SECTION E: DOWNLOADS SECTION */}
      {sloka.pdfResources && sloka.pdfResources.length > 0 && (
        <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-maroon-700" />
              <h3 className="font-heading text-lg font-bold text-stone-900">
                Available PDF Editions ({sloka.pdfResources.length})
              </h3>
            </div>
            <span className="text-xs text-stone-500 font-serif">
              Archival copies for personal parayanam study
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sloka.pdfResources.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-xl border border-stone-200 hover:border-gold-300 hover:shadow-2xs transition-all bg-stone-50/50 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-stone-900 font-serif line-clamp-1 mb-1">
                    {res.title}
                  </h4>
                  <span className="text-[11px] font-mono text-stone-500 block">
                    {res.fileName}
                  </span>
                  <span className="text-[11px] text-stone-400 block mt-0.5">
                    {res.pageReference || 'Full document'}
                  </span>
                </div>

                <div className="pt-3 mt-3 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    PDF Document
                  </span>
                  <button
                    onClick={() => setSelectedDownload(res)}
                    className="text-xs font-semibold text-maroon-800 hover:text-maroon-900 flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION F: RELATED CONTENT (OCCASIONS & OTHER SLOKAS) */}
      <section className="space-y-6 pt-4 border-t border-stone-200">
        
        {/* Associated Occasions */}
        {related.relatedOccasions && related.relatedOccasions.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-heading text-lg font-bold text-stone-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-maroon-700" />
              <span>Related Occasions & Festivals</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {related.relatedOccasions.map((occ) => (
                <Link
                  key={occ.id}
                  to={`/occasions/${occ.slug}`}
                  className="p-4 rounded-xl bg-white border border-stone-200 hover:border-gold-300 hover:shadow-xs transition-all block group"
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-maroon-800 mb-1">
                    {occ.relationshipType?.replace(/_/g, ' ') || 'Associated Occasion'}
                  </div>
                  <h4 className="font-heading text-sm font-bold text-stone-900 group-hover:text-maroon-800 mb-1">
                    {occ.name}
                  </h4>
                  <p className="text-xs text-stone-500 line-clamp-2">
                    {occ.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Slokas */}
        {related.relatedSlokas && related.relatedSlokas.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-heading text-lg font-bold text-stone-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-maroon-700" />
              <span>Other Stotras for {sloka.deity?.name || 'Devotion'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {related.relatedSlokas.map((relSloka) => (
                <Link
                  key={relSloka.id}
                  to={`/slokas/${relSloka.slug}`}
                  className="p-4 rounded-xl bg-white border border-stone-200 hover:border-gold-300 hover:shadow-xs transition-all block group"
                >
                  <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                    {relSloka.category?.name}
                  </span>
                  <h4 className="font-heading text-sm font-bold text-stone-900 group-hover:text-maroon-800 mb-1">
                    {relSloka.canonicalTitle}
                  </h4>
                  <p className="text-xs text-stone-500 line-clamp-2">
                    {relSloka.backgroundContext}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Download Modal Trigger */}
      <DownloadModal
        resource={selectedDownload}
        onClose={() => setSelectedDownload(null)}
      />

      {/* Print Prayer Leaflet Modal */}
      {printingModalOpen && sloka && (
        <PrintPrayerSheetModal
          sloka={sloka}
          onClose={() => setPrintingModalOpen(false)}
        />
      )}
    </div>
  );
};
