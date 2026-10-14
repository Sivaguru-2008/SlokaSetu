import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  RotateCcw,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  SlidersHorizontal
} from 'lucide-react';
import { apiClient } from '../api/client';
import { Sloka, Deity, Category } from '../types';
import { SlokaCard } from '../components/SlokaCard';

export const SlokaLibraryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Query state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedDeity, setSelectedDeity] = useState(searchParams.get('deity') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedScript, setSelectedScript] = useState(searchParams.get('script') || 'all');
  const [hasPdfOnly, setHasPdfOnly] = useState(searchParams.get('hasPdf') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'alpha');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Data state
  const [slokas, setSlokas] = useState<Sloka[]>([]);
  const [deities, setDeities] = useState<Deity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 1, currentPage: 1, limit: 12 });
  const [loading, setLoading] = useState(true);

  // Load filter metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await apiClient.get('/metadata');
        if (res.data.success) {
          setDeities(res.data.data.deities || []);
          setCategories(res.data.data.categories?.filter((c: Category) => c.type !== 'OCCASION') || []);
        }
      } catch (err) {
        console.error('Failed to load filter metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch slokas when filters change
  useEffect(() => {
    const fetchSlokas = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', '12');

        if (searchTerm.trim()) params.set('search', searchTerm.trim());
        if (selectedDeity !== 'all') params.set('deity', selectedDeity);
        if (selectedCategory !== 'all') params.set('category', selectedCategory);
        if (selectedScript !== 'all') params.set('script', selectedScript);
        if (hasPdfOnly) params.set('hasPdf', 'true');
        if (sortBy === 'recent') params.set('sort', 'recent');
        if (sortBy === 'category') params.set('sort', 'category');

        const res = await apiClient.get(`/slokas?${params.toString()}`);
        if (res.data.success) {
          setSlokas(res.data.data);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Failed to fetch slokas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlokas();
  }, [searchTerm, selectedDeity, selectedCategory, selectedScript, hasPdfOnly, sortBy, page]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDeity('all');
    setSelectedCategory('all');
    setSelectedScript('all');
    setHasPdfOnly(false);
    setSortBy('alpha');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="border-b border-gold-200/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-maroon-800 mb-1 font-heading">
            Scriptural Repository
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-stone-900">
            Sloka Knowledge Library
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-serif mt-1 max-w-2xl">
            Explore 27 canonical Sanskrit devotional compositions with verified Roman, Telugu, and Tamil script editions from archival sources.
          </p>
        </div>

        <div className="text-xs font-semibold text-stone-500 bg-stone-100 px-3.5 py-1.5 rounded-full border border-stone-200 shadow-2xs self-start md:self-auto">
          Showing <strong>{pagination.totalCount}</strong> published texts
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs space-y-4">
        
        {/* Top Row: Search Input & Sort */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-maroon-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              placeholder="Search by canonical title, alias, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-maroon-700 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-stone-500 font-medium whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-maroon-700"
            >
              <option value="alpha">Alphabetical (A–Z)</option>
              <option value="category">By Category</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>
        </div>

        {/* Bottom Row: Facet Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-stone-100 text-xs">
          
          {/* Deity Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-stone-400 block mb-1">Deity</label>
            <select
              value={selectedDeity}
              onChange={(e) => { setSelectedDeity(e.target.value); setPage(1); }}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none"
            >
              <option value="all">All Deities</option>
              {deities.map(d => (
                <option key={d.id} value={d.slug}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-stone-400 block mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Script Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase text-stone-400 block mb-1">Script Edition</label>
            <select
              value={selectedScript}
              onChange={(e) => { setSelectedScript(e.target.value); setPage(1); }}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none"
            >
              <option value="all">All Scripts</option>
              <option value="Latn">Latin (IAST)</option>
              <option value="Telu">Telugu</option>
              <option value="Taml">Tamil</option>
            </select>
          </div>

          {/* Checkbox and Reset */}
          <div className="flex items-center justify-between pt-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasPdfOnly}
                onChange={(e) => { setHasPdfOnly(e.target.checked); setPage(1); }}
                className="rounded border-stone-300 text-maroon-700 focus:ring-0"
              />
              <span className="text-xs font-medium text-stone-700">PDF Ready</span>
            </label>

            <button
              onClick={handleResetFilters}
              className="p-1.5 text-xs text-stone-400 hover:text-maroon-800 flex items-center space-x-1"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Sloka Cards */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-maroon-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-stone-500 font-serif">Querying PostgreSQL sloka catalog...</p>
        </div>
      ) : slokas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-heading text-lg font-bold text-stone-800">No Devotional Texts Found</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            No sloka matches your selected filter criteria. Try adjusting the search term or resetting the filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-maroon-800 text-gold-200 text-xs font-semibold rounded-lg shadow-2xs hover:bg-maroon-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slokas.map((sloka) => (
            <SlokaCard key={sloka.id} sloka={sloka} />
          ))}
        </div>
      )}

      {/* Server-Side Pagination Bar */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs text-stone-500">
            Page <strong>{pagination.currentPage}</strong> of <strong>{pagination.totalPages}</strong>
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: pagination.totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold ${
                  page === idx + 1
                    ? 'bg-maroon-800 text-white shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-50 border border-stone-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
              disabled={page >= pagination.totalPages}
              className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
