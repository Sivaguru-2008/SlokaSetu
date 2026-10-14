import React, { useState, useEffect } from 'react';
import {
  Shield,
  Layers,
  Calendar,
  BookOpen,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Lock,
  LogOut,
  Upload,
  UserCheck,
  RefreshCw,
  Database,
  Terminal,
  Play
} from 'lucide-react';
import { apiClient } from '../api/client';
import { User } from '../types';

export const AdminDashboardPage: React.FC = () => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [emailInput, setEmailInput] = useState('admin@slokasetu.org');
  const [passwordInput, setPasswordInput] = useState('SlokaSetu@2026');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'stats' | 'occasions' | 'slokas' | 'reviews' | 'adm'>('stats');

  // Dashboard Stats
  const [adminStats, setAdminStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // ADM Console State
  const [admPresets, setAdmPresets] = useState<any[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>('SELECT * FROM slokasetu.v_occasion_parayanam_overview LIMIT 20;');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [queryLoading, setQueryLoading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  // Form states
  const [newOccasion, setNewOccasion] = useState({
    name: '',
    slug: '',
    categoryId: '',
    description: '',
    significance: '',
    preparationGuide: '',
    gregorianDate: '2026-08-15',
    region: 'All India'
  });

  const [newSloka, setNewSloka] = useState({
    canonicalTitle: '',
    slug: '',
    categoryId: '',
    deityId: '',
    backgroundContext: '',
    historicalNotes: '',
    traditionalNotes: '',
    significanceNotes: ''
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [deities, setDeities] = useState<any[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Check login on mount
  useEffect(() => {
    const token = localStorage.getItem('slokasetu_token');
    if (token) {
      apiClient.get('/admin/me')
        .then(res => {
          if (res.data.success) {
            setCurrentUser(res.data.user);
          }
        })
        .catch(() => {
          localStorage.removeItem('slokasetu_token');
          setCurrentUser(null);
        });
    }
  }, []);

  // Fetch admin stats and metadata when logged in
  useEffect(() => {
    if (currentUser) {
      fetchAdminData();
    }
  }, [currentUser, activeTab]);

  const fetchAdminData = async () => {
    setStatsLoading(true);
    try {
      const [statsRes, metaRes, reviewsRes] = await Promise.all([
        apiClient.get('/admin/stats'),
        apiClient.get('/metadata'),
        apiClient.get('/admin/reviews')
      ]);

      if (statsRes.data.success) setAdminStats(statsRes.data.data);
      if (metaRes.data.success) {
        setCategories(metaRes.data.data.categories || []);
        setDeities(metaRes.data.data.deities || []);
        if (metaRes.data.data.categories?.length > 0) {
          setNewOccasion(prev => ({ ...prev, categoryId: metaRes.data.data.categories[0].id }));
          setNewSloka(prev => ({ ...prev, categoryId: metaRes.data.data.categories[0].id }));
        }
      }
      if (reviewsRes.data.success) setPendingReviews(reviewsRes.data.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchAdmPresets = async () => {
    try {
      const res = await apiClient.get('/admin/adm/presets');
      if (res.data.success && res.data.data.length > 0) {
        setAdmPresets(res.data.data);
        setCurrentQuery(res.data.data[0].sql);
      }
    } catch (err) {
      console.warn('Failed to load ADM presets:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'adm' && admPresets.length === 0) {
      fetchAdmPresets();
    }
  }, [activeTab]);

  const handleRunQuery = async (sqlToRun?: string) => {
    setQueryLoading(true);
    setQueryError(null);
    try {
      const q = sqlToRun || currentQuery;
      const res = await apiClient.post('/admin/adm/query', { query: q });
      if (res.data.success) {
        setQueryResult(res.data);
      } else {
        setQueryError(res.data.message || 'Execution failed.');
      }
    } catch (err: any) {
      setQueryError(err?.response?.data?.message || err?.message || 'Query execution error');
    } finally {
      setQueryLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await apiClient.post('/admin/login', {
        email: emailInput,
        password: passwordInput
      });

      if (res.data.success) {
        localStorage.setItem('slokasetu_token', res.data.token);
        setCurrentUser(res.data.user);
      }
    } catch (err: any) {
      setAuthError(err?.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('slokasetu_token');
    setCurrentUser(null);
  };

  const handleCreateOccasion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/admin/occasions', newOccasion);
      if (res.data.success) {
        setFormSuccess(`Occasion '${newOccasion.name}' created successfully!`);
        setNewOccasion({
          name: '',
          slug: '',
          categoryId: categories[0]?.id || '',
          description: '',
          significance: '',
          preparationGuide: '',
          gregorianDate: '2026-08-15',
          region: 'All India'
        });
        fetchAdminData();
        setTimeout(() => setFormSuccess(null), 4000);
      }
    } catch (err: any) {
      setAuthError(err?.response?.data?.message || 'Failed to create occasion.');
    }
  };

  const handleCreateSloka = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/admin/slokas', newSloka);
      if (res.data.success) {
        setFormSuccess(`Sloka '${newSloka.canonicalTitle}' created successfully!`);
        setNewSloka({
          canonicalTitle: '',
          slug: '',
          categoryId: categories[0]?.id || '',
          deityId: '',
          backgroundContext: '',
          historicalNotes: '',
          traditionalNotes: '',
          significanceNotes: ''
        });
        fetchAdminData();
        setTimeout(() => setFormSuccess(null), 4000);
      }
    } catch (err: any) {
      setAuthError(err?.response?.data?.message || 'Failed to create sloka.');
    }
  };

  const handleApproveReview = async (reviewId: string, entityType: string, entityId: string) => {
    try {
      await apiClient.post('/admin/reviews', {
        entityType,
        entityId,
        reviewStatus: 'PUBLISHED',
        reviewNotes: 'Approved and published by administrator.'
      });
      fetchAdminData();
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  // If not logged in, show elegant login card
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl border-2 border-gold-300 p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-maroon-800 text-gold-300 rounded-xl mx-auto flex items-center justify-center text-2xl shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-stone-900">
              Admin Governance Portal
            </h2>
            <p className="text-xs text-stone-500 font-serif">
              Authorized access for verifying liturgical and institutional records.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Administrative Email</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-maroon-700 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-maroon-700 font-mono"
              />
            </div>

            <div className="p-2.5 bg-gold-50/70 rounded border border-gold-200 text-[11px] text-stone-600">
              <strong>Demo Credentials:</strong><br />
              Email: <code className="text-maroon-800 font-bold">admin@slokasetu.org</code><br />
              Password: <code className="text-maroon-800 font-bold">SlokaSetu@2026</code>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-maroon-800 hover:bg-maroon-700 active:bg-maroon-900 text-gold-200 font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-xs"
            >
              <UserCheck className="w-4 h-4" />
              <span>{authLoading ? 'Verifying...' : 'Access Dashboard'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="border-b border-gold-200/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-maroon-800 bg-maroon-100 px-2 py-0.5 rounded font-heading">
              Role: {currentUser.role}
            </span>
            <span className="text-xs text-stone-400 font-mono">{currentUser.email}</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-stone-900">
            Administrative Management & Governance
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAdminData}
            className="p-2 rounded-lg border border-stone-200 bg-white text-stone-600 hover:text-maroon-800 shadow-2xs"
            title="Refresh database metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-red-50 hover:text-red-700 text-stone-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-stone-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {formSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2 text-xs font-semibold">
        {[
          { key: 'stats', label: 'Dashboard Overview', icon: Layers },
          { key: 'occasions', label: 'Occasion Management', icon: Calendar },
          { key: 'slokas', label: 'Sloka Management', icon: BookOpen },
          { key: 'reviews', label: 'Review & Verification', icon: CheckCircle2 },
          { key: 'adm', label: 'ADM Relational SQL Console', icon: Database }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-colors ${
              activeTab === tab.key
                ? 'bg-maroon-800 text-gold-200 font-bold shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: DASHBOARD STATS */}
      {activeTab === 'stats' && adminStats && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-xs text-stone-500 block">Published Slokas</span>
              <span className="text-3xl font-bold text-maroon-800 font-heading">{adminStats.publishedSlokas}</span>
            </div>
            <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-xs text-stone-500 block">Active Occasions</span>
              <span className="text-3xl font-bold text-maroon-800 font-heading">{adminStats.totalOccasions}</span>
            </div>
            <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-xs text-stone-500 block">Multilingual Versions</span>
              <span className="text-3xl font-bold text-maroon-800 font-heading">{adminStats.totalVersions}</span>
            </div>
            <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-xs text-stone-500 block">PDF Resources</span>
              <span className="text-3xl font-bold text-maroon-800 font-heading">{adminStats.totalPdfResources}</span>
            </div>
          </div>

          {/* Recent Audit Logs & Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-stone-800">
                Recent Governance Reviews
              </h3>
              <div className="divide-y divide-stone-100 text-xs">
                {adminStats.recentReviews?.map((r: any) => (
                  <div key={r.id} className="py-2.5">
                    <div className="flex items-center justify-between font-semibold text-stone-800">
                      <span>{r.reviewerName}</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {r.reviewStatus}
                      </span>
                    </div>
                    <p className="text-stone-500 mt-1">{r.reviewNotes}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-stone-800">
                Recent Audit Trail
              </h3>
              <div className="divide-y divide-stone-100 text-xs font-mono text-stone-600">
                {adminStats.recentAuditLogs?.map((log: any) => (
                  <div key={log.id} className="py-2 flex items-center justify-between">
                    <span>{log.action} ({log.entityType})</span>
                    <span className="text-stone-400 text-[10px]">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OCCASION MANAGEMENT */}
      {activeTab === 'occasions' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6">
          <div className="pb-4 border-b border-stone-200">
            <h3 className="font-heading text-lg font-bold text-stone-900">
              Create New Occasion / Festival Record
            </h3>
            <p className="text-xs text-stone-500 font-serif">
              PostgreSQL relational insertion with foreign key category association and year-specific observance date.
            </p>
          </div>

          <form onSubmit={handleCreateOccasion} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Occasion Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sri Krishna Janmashtami"
                  value={newOccasion.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setNewOccasion({ ...newOccasion, name, slug });
                  }}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={newOccasion.slug}
                  onChange={(e) => setNewOccasion({ ...newOccasion, slug: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Category *</label>
                <select
                  value={newOccasion.categoryId}
                  onChange={(e) => setNewOccasion({ ...newOccasion, categoryId: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Observance Date *</label>
                <input
                  type="date"
                  required
                  value={newOccasion.gregorianDate}
                  onChange={(e) => setNewOccasion({ ...newOccasion, gregorianDate: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Applicable Region</label>
                <input
                  type="text"
                  value={newOccasion.region}
                  onChange={(e) => setNewOccasion({ ...newOccasion, region: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Description *</label>
              <textarea
                required
                rows={3}
                value={newOccasion.description}
                onChange={(e) => setNewOccasion({ ...newOccasion, description: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-serif"
                placeholder="Detailed description of the occasion..."
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Spiritual Significance</label>
              <textarea
                rows={2}
                value={newOccasion.significance}
                onChange={(e) => setNewOccasion({ ...newOccasion, significance: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-serif"
                placeholder="Philosophical and traditional significance..."
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-maroon-800 hover:bg-maroon-700 text-gold-200 font-bold rounded-lg text-xs flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Occasion Record</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: SLOKA MANAGEMENT */}
      {activeTab === 'slokas' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6">
          <div className="pb-4 border-b border-stone-200">
            <h3 className="font-heading text-lg font-bold text-stone-900">
              Create New Canonical Sloka Record
            </h3>
            <p className="text-xs text-stone-500 font-serif">
              Register canonical stotra metadata with explicit historical evidence and traditional notes separation.
            </p>
          </div>

          <form onSubmit={handleCreateSloka} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Canonical Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sri Aditya Hrudaya Stotram"
                  value={newSloka.canonicalTitle}
                  onChange={(e) => {
                    const canonicalTitle = e.target.value;
                    const slug = canonicalTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setNewSloka({ ...newSloka, canonicalTitle, slug });
                  }}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={newSloka.slug}
                  onChange={(e) => setNewSloka({ ...newSloka, slug: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Category *</label>
                <select
                  value={newSloka.categoryId}
                  onChange={(e) => setNewSloka({ ...newSloka, categoryId: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Associated Deity</label>
                <select
                  value={newSloka.deityId}
                  onChange={(e) => setNewSloka({ ...newSloka, deityId: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                >
                  <option value="">Select Deity (Optional)</option>
                  {deities.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Background Context</label>
              <textarea
                rows={2}
                value={newSloka.backgroundContext}
                onChange={(e) => setNewSloka({ ...newSloka, backgroundContext: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-serif"
                placeholder="Textual origin, author, and chapter context..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Historical Evidence Notes</label>
                <textarea
                  rows={2}
                  value={newSloka.historicalNotes}
                  onChange={(e) => setNewSloka({ ...newSloka, historicalNotes: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-serif"
                  placeholder="Manuscript references and commentaries..."
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Traditional Devotional Uses</label>
                <textarea
                  rows={2}
                  value={newSloka.traditionalNotes}
                  onChange={(e) => setNewSloka({ ...newSloka, traditionalNotes: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-serif"
                  placeholder="Daily puja and parayanam practice..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-maroon-800 hover:bg-maroon-700 text-gold-200 font-bold rounded-lg text-xs flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Register Canonical Sloka</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: REVIEWS & GOVERNANCE */}
      {activeTab === 'reviews' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6">
          <div className="pb-4 border-b border-stone-200">
            <h3 className="font-heading text-lg font-bold text-stone-900">
              Content Review & Publishing Pipeline
            </h3>
            <p className="text-xs text-stone-500 font-serif">
              Every imported text version requires verified review before public indexing.
            </p>
          </div>

          <div className="divide-y divide-stone-200">
            {pendingReviews.map((rev) => (
              <div key={rev.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                      {rev.entityType}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      rev.reviewStatus === 'PUBLISHED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {rev.reviewStatus}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-stone-900">
                    Review ID: {rev.id.slice(0, 8)}... (Entity: {rev.entityId})
                  </h4>
                  <p className="text-xs text-stone-600 font-serif">
                    {rev.reviewNotes}
                  </p>
                  <span className="text-[11px] text-stone-400 block">
                    Reviewed by <strong>{rev.reviewerName}</strong> on {new Date(rev.reviewedAt).toLocaleDateString()}
                  </span>
                </div>

                {rev.reviewStatus !== 'PUBLISHED' && (
                  <button
                    onClick={() => handleApproveReview(rev.id, rev.entityType, rev.entityId)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shrink-0"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify & Publish</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ADM RELATIONAL SQL CONSOLE */}
      {activeTab === 'adm' && (
        <div className="space-y-6">
          <div className="bg-stone-900 text-stone-100 p-6 rounded-2xl border border-stone-800 shadow-lg space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-gold-400" />
                  <h3 className="font-heading text-lg font-bold text-white tracking-wide">
                    ADM Relational SQL Demonstration Console
                  </h3>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  Direct read-only PostgreSQL execution interface demonstrating normalized schema views, multi-table JOINs, cross-tabulations, and referential integrity for academic evaluation.
                </p>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-stone-800 text-emerald-400 border border-stone-700">
                  Schema: slokasetu
                </span>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-stone-800 text-gold-400 border border-stone-700">
                  Mode: Safe READ-ONLY
                </span>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-stone-300 uppercase tracking-wider block">
                Curated Demonstration Queries:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {admPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setCurrentQuery(preset.sql);
                      handleRunQuery(preset.sql);
                    }}
                    className="text-left p-3 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700 hover:border-gold-500/50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-gold-300 transition-colors">
                        {preset.name || preset.title}
                      </span>
                      <Play className="w-3.5 h-3.5 text-stone-400 group-hover:text-gold-400 transition-colors shrink-0" />
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Query Editor Box */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-stone-400 flex items-center space-x-1.5">
                  <Terminal className="w-4 h-4 text-stone-500" />
                  <span>SQL Query Editor:</span>
                </span>
                <button
                  onClick={() => handleRunQuery()}
                  disabled={queryLoading}
                  className="px-4 py-2 bg-gold-600 hover:bg-gold-500 text-stone-950 font-bold text-xs rounded-lg flex items-center space-x-1.5 transition-colors disabled:opacity-50 shadow-xs"
                >
                  {queryLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span>{queryLoading ? 'Executing Query...' : 'Execute SQL'}</span>
                </button>
              </div>

              <textarea
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                rows={4}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs font-mono text-emerald-300 focus:outline-hidden focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 resize-y"
                placeholder="Enter SELECT query..."
              />
            </div>
          </div>

          {/* Error Message */}
          {queryError && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Query Execution Error</strong>
                <span className="font-mono mt-1 block">{queryError}</span>
              </div>
            </div>
          )}

          {/* Query Results */}
          {queryResult && (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs space-y-3">
              <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-stone-900 font-heading">
                    Query Results ({queryResult.rowCount} rows)
                  </span>
                  <span className="text-[11px] font-mono bg-stone-200 text-stone-700 px-2 py-0.5 rounded">
                    Latency: {queryResult.executionTimeMs} ms
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 font-mono">
                  Columns: {queryResult.columns?.length || 0}
                </span>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-100 text-stone-700 font-mono border-b border-stone-200">
                      {queryResult.columns?.map((col: string) => (
                        <th key={col} className="px-4 py-2.5 font-bold uppercase tracking-wider text-[11px]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono text-stone-700">
                    {queryResult.rows?.length === 0 ? (
                      <tr>
                        <td colSpan={queryResult.columns?.length || 1} className="px-4 py-8 text-center text-stone-400 italic">
                          Query returned zero rows.
                        </td>
                      </tr>
                    ) : (
                      queryResult.rows?.map((row: any, idx: number) => (
                        <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                          {queryResult.columns?.map((col: string) => {
                            const val = row[col];
                            return (
                              <td key={col} className="px-4 py-2.5 max-w-xs truncate" title={String(val ?? '')}>
                                {val === null || val === undefined ? (
                                  <span className="text-stone-300 italic">NULL</span>
                                ) : typeof val === 'object' ? (
                                  JSON.stringify(val)
                                ) : (
                                  String(val)
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
