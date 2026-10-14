import React, { useState, useEffect } from 'react';
import { Download, FileText, Search, Shield, Filter, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiClient } from '../api/client';
import { PdfResource } from '../types';
import { DownloadModal } from '../components/DownloadModal';

export const DownloadsPage: React.FC = () => {
  const [resources, setResources] = useState<PdfResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedDownload, setSelectedDownload] = useState<PdfResource | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        // We can fetch resources via public endpoint or slokas/occasions
        const [slokasRes, occasionsRes] = await Promise.all([
          apiClient.get('/slokas?limit=50'),
          apiClient.get('/occasions')
        ]);

        const allRes: PdfResource[] = [];
        const seenIds = new Set<string>();

        if (occasionsRes.data.success) {
          occasionsRes.data.data.forEach((o: any) => {
            if (o.pdfResources) {
              o.pdfResources.forEach((r: PdfResource) => {
                if (!seenIds.has(r.id)) {
                  seenIds.add(r.id);
                  allRes.push(r);
                }
              });
            }
          });
        }

        if (slokasRes.data.success) {
          slokasRes.data.data.forEach((s: any) => {
            if (s.pdfResources) {
              s.pdfResources.forEach((r: PdfResource) => {
                if (!seenIds.has(r.id)) {
                  seenIds.add(r.id);
                  allRes.push(r);
                }
              });
            }
          });
        }

        setResources(allRes);
      } catch (err) {
        console.error('Failed to load resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '420 KB';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const filteredResources = resources.filter(r => {
    const matchesSearch = searchTerm.trim() === '' ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSource = sourceFilter === 'all' || r.fileName === sourceFilter;
    return matchesSearch && matchesSource;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gold-200/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-maroon-800 mb-1 font-heading">
            Archival Repository
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-stone-900">
            PDF Prayer Resources & Downloads
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-serif mt-1 max-w-2xl">
            Download verified devotional stotra collections and Amrita institutional event circulars with complete source tracking and licensing metadata.
          </p>
        </div>

        <div className="text-xs font-semibold text-stone-500 bg-stone-100 px-3.5 py-1.5 rounded-full border border-stone-200 self-start md:self-auto">
          <strong>{resources.length}</strong> verified PDF editions
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-maroon-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by title or filename..."
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-maroon-700"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500 whitespace-nowrap font-medium">Source Document:</span>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none"
          >
            <option value="all">All Source Files</option>
            <option value="SRI MAHAGANAPATHI HOMAM JULY.pdf">SRI MAHAGANAPATHI HOMAM JULY.pdf</option>
            <option value="ENGLISH.pdf">ENGLISH.pdf (Roman IAST)</option>
            <option value="TELUGU.pdf">TELUGU.pdf (Telugu Script)</option>
            <option value="TAMIL.pdf">TAMIL.pdf (Tamil Script)</option>
          </select>
        </div>
      </div>

      {/* Resources Table / Cards */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-maroon-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-stone-500 font-serif">Loading PDF resources catalog...</p>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-stone-300 text-stone-500 text-sm">
          No matching PDF resources found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="p-5 rounded-xl bg-white border border-stone-200 hover:border-gold-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                  <span className="text-[11px] font-mono text-stone-400">
                    {formatFileSize(res.fileSize)}
                  </span>
                </div>

                <h3 className="font-heading text-sm font-bold text-stone-900 mb-1 font-serif line-clamp-2">
                  {res.title}
                </h3>

                <p className="text-xs font-mono text-stone-500 mb-2 truncate">
                  {res.fileName}
                </p>

                <div className="text-[11px] text-stone-400 space-y-0.5">
                  <div>Reference: <strong>{res.pageReference || 'Full document'}</strong></div>
                  <div>License: {res.licenseType}</div>
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  {res.downloadCount || 0} downloads
                </span>

                <button
                  onClick={() => setSelectedDownload(res)}
                  className="px-3.5 py-1.5 rounded-lg bg-maroon-800 hover:bg-maroon-700 text-gold-200 text-xs font-bold transition-colors flex items-center space-x-1 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Download Modal Trigger */}
      <DownloadModal
        resource={selectedDownload}
        onClose={() => setSelectedDownload(null)}
      />
    </div>
  );
};
