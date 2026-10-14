import React from 'react';
import { Database, ShieldCheck, FileText, Sparkles, BookOpen, GraduationCap, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto border-b border-gold-200/80 pb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-100 text-maroon-800 text-xs font-semibold">
          <GraduationCap className="w-4 h-4 text-maroon-700" />
          <span>Advanced Database Management Systems • Academic Project</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
          About SlokaSetu
        </h1>
        <p className="text-base text-stone-600 font-serif leading-relaxed">
          A normalized digital platform connecting Hindu festivals, Amrita institutional devotional occasions, canonical slokas, their meanings, and multilingual prayer resources.
        </p>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-maroon-50 text-maroon-800 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-base font-bold text-stone-900">
            Relational Integrity
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed font-serif">
            Normalized PostgreSQL 3NF schema separating canonical slokas from textual editions, recurring festivals from year-specific dates, and enforced via explicit foreign keys and check constraints.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-gold-50 text-gold-800 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-base font-bold text-stone-900">
            Multilingual Text Engine
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed font-serif">
            Precise separation of Language from Script. A Sanskrit text rendered in Telugu or Tamil script remains categorized as Sanskrit, preserving authentic Unicode rendering without automated translation artifacts.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-base font-bold text-stone-900">
            Content Governance
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed font-serif">
            Every text version is traceable to its archival source document and page number. Historical scholarship is clearly separated from traditional accounts, with human review required prior to publication.
          </p>
        </div>
      </div>

      {/* Source Provenance */}
      <section className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm space-y-6">
        <div className="pb-4 border-b border-stone-200">
          <h2 className="font-heading text-2xl font-bold text-stone-900">
            Verified Source Materials
          </h2>
          <p className="text-xs text-stone-500 font-serif">
            Directly ingested from authentic institutional and liturgical documents.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
            <span className="font-mono text-maroon-800 font-bold block">1. SRI MAHAGANAPATHI HOMAM JULY.pdf</span>
            <p className="text-stone-600 font-serif">
              Official circular of Sri Mahaganapathi Homam on 22 July 2026, Department of Amrita Darshanam, Amrita School of Engineering, Chennai. Lists the complete 15-stotra Parayanam sequence.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
            <span className="font-mono text-maroon-800 font-bold block">2. ENGLISH.pdf</span>
            <p className="text-stone-600 font-serif">
              46-page devotional collection containing classical Sanskrit stotras rendered in Latin IAST transliteration, including Sri Amma Dhyanam, Lalita Sahasranama, and Ganesha Pancharatnam.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
            <span className="font-mono text-maroon-800 font-bold block">3. TELUGU.pdf</span>
            <p className="text-stone-600 font-serif">
              57-page devotional collection containing complete stotras in Telugu script, matched canonically to the Sanskrit originals.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
            <span className="font-mono text-maroon-800 font-bold block">4. TAMIL.pdf</span>
            <p className="text-stone-600 font-serif">
              46-page devotional collection containing complete stotras in Tamil script, with grantha letter notation for authentic Sanskrit phonetics.
            </p>
          </div>
        </div>
      </section>

      {/* Ten Engineering Rules Compliance */}
      <section className="bg-ivory-100/70 rounded-2xl border border-gold-300 p-8 shadow-sm space-y-4">
        <h3 className="font-heading text-lg font-bold text-stone-900">
          Devotional & Data Ethics Compliance
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Real database content from PostgreSQL, no hardcoded stotras</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Astronomical ephemeris and verified institutional dates</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Preserved original document references and page citations</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Path-traversal protected secure PDF resource management</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>No pseudo-scientific medical claims or fabricated miracles</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Server-side JWT authentication on administrative mutations</span>
          </div>
        </div>
      </section>

    </div>
  );
};
