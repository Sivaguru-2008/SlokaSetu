import React, { useState } from 'react';
import { PdfResource } from '../types';
import { Download, FileText, X, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DownloadModalProps {
  resource: PdfResource | null;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ resource, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!resource) return null;

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '420 KB (approx)';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      // Trigger download via direct window or link
      const downloadUrl = `/api/resources/${resource.id}/download`;
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', resource.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 4000);
    } catch (err: any) {
      setError(err?.message || 'Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gold-300 overflow-hidden z-10">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-maroon-800 to-maroon-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <FileText className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-white">
                Devotional Resource Download
              </h3>
              <p className="text-xs text-gold-200">
                Verified Archival Document
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resource Details */}
        <div className="p-6 space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Document Title
            </span>
            <h4 className="text-base font-semibold text-stone-900 font-serif">
              {resource.title}
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-3.5 rounded-lg border border-stone-200/80">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Filename</span>
              <span className="font-mono text-stone-800 break-all">{resource.fileName}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">File Size</span>
              <span className="font-medium text-stone-800">{formatFileSize(resource.fileSize)}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Page Reference</span>
              <span className="font-medium text-stone-800">{resource.pageReference || 'Full Text'}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">Format</span>
              <span className="font-medium text-stone-800">Adobe PDF Document</span>
            </div>
          </div>

          <div className="text-xs text-stone-500 bg-gold-50/60 p-3 rounded border border-gold-200/80 flex items-start space-x-2">
            <Shield className="w-4 h-4 text-maroon-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-maroon-900 block mb-0.5">Academic & Devotional Use Policy</strong>
              <span>
                {resource.licenseType}. This material is preserved for educational and institutional religious study.
              </span>
            </div>
          </div>

          {error && (
            <div className="text-xs text-red-700 bg-red-50 p-3 rounded border border-red-200 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {downloadSuccess && (
            <div className="text-xs text-emerald-800 bg-emerald-50 p-3 rounded border border-emerald-200 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Download initiated successfully! Check your browser downloads.</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-maroon-800 hover:bg-maroon-700 active:bg-maroon-900 transition-colors flex items-center space-x-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Downloading...' : 'Download PDF Resource'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
