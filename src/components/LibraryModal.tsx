import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Download,
  Upload,
  Trash2,
  Search,
  Sparkles,
  WifiOff,
  Share2,
  Calendar,
  ArrowUpDown,
  Lock,
  ShieldCheck,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { LibraryItemSummary, StoryData } from '../types';
import {
  getLocalLibrarySummaries,
  getLocalStory,
  deleteLocalStory,
  saveLocalStory,
} from '../utils/storage';
import { getT } from '../utils/translations';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStory: (story: StoryData, filename: string) => void;
  onStoryDeleted?: (filename: string) => void;
  onShareStory?: (story: StoryData) => void;
  isOnline: boolean;
  baseLang?: string;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectStory,
  onStoryDeleted,
  onShareStory,
  isOnline,
  baseLang = 'English',
}) => {
  const [libraryTab, setLibraryTab] = useState<'my-stories' | 'starter-samples'>('my-stories');
  const [localItems, setLocalItems] = useState<LibraryItemSummary[]>([]);
  const [starterItems, setStarterItems] = useState<LibraryItemSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterTense, setFilterTense] = useState('all');
  const [filterLength, setFilterLength] = useState('all');
  const [filterContentType, setFilterContentType] = useState('all');
  const [filterGenre, setFilterGenre] = useState('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title-asc' | 'title-desc'>('date-desc');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const fetchLibrary = async () => {
    setLoading(true);
    // 1. Load private stories from user's local device storage
    const summaries = getLocalLibrarySummaries();
    setLocalItems(summaries);

    // 2. Load built-in starter templates from server (read-only samples)
    if (isOnline) {
      try {
        const res = await fetch('/api/library/list');
        if (res.ok) {
          const sampleList = await res.json();
          setStarterItems(sampleList);
        }
      } catch (err) {
        console.warn('Could not fetch starter templates:', err);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchLibrary();
    }
  }, [isOpen, isOnline]);

  if (!isOpen) return null;
  const t = getT(baseLang);

  const handleLoadItem = async (item: LibraryItemSummary) => {
    try {
      // Check local cache first
      let data = getLocalStory(item.filename);

      if (!data && item.isStarterSample && isOnline) {
        const res = await fetch(`/api/library/item/${encodeURIComponent(item.filename)}`);
        if (res.ok) {
          data = await res.json();
          if (data) {
            saveLocalStory(item.filename, data);
          }
        }
      }

      if (data) {
        onSelectStory(data, item.filename);
        onClose();
      } else {
        alert('Could not load this story. Make sure you are connected or the file exists.');
      }
    } catch (err) {
      console.error('Error loading item:', err);
      alert('Failed to load selected story.');
    }
  };

  const handleDeleteItem = (filename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(t.deleteConfirm(filename))) return;

    deleteLocalStory(filename);
    setLocalItems((prev) => prev.filter((it) => it.filename !== filename));
    if (onStoryDeleted) {
      onStoryDeleted(filename);
    }
  };

  const handleExportJson = async (item: LibraryItemSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    let data = getLocalStory(item.filename);

    if (!data && item.isStarterSample && isOnline) {
      try {
        const res = await fetch(`/api/library/item/${encodeURIComponent(item.filename)}`);
        if (res.ok) data = await res.json();
      } catch (err) {
        console.warn('Fetch for export error:', err);
      }
    }

    if (!data) {
      alert('Story content is not available for export.');
      return;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.filename.endsWith('.json') ? item.filename : `${item.filename}.json`}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareItem = async (item: LibraryItemSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    let data = getLocalStory(item.filename);

    if (!data && item.isStarterSample && isOnline) {
      try {
        const res = await fetch(`/api/library/item/${encodeURIComponent(item.filename)}`);
        if (res.ok) data = await res.json();
      } catch (err) {
        console.warn('Fetch for share error:', err);
      }
    }

    if (!data) {
      alert('Story content is not available to share.');
      return;
    }

    if (onShareStory) {
      onShareStory(data);
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string) as StoryData;
        if (!parsed.title_target || !Array.isArray(parsed.sentences)) {
          throw new Error('File does not appear to be a valid Querviam story JSON.');
        }

        const safeTitle = (parsed.title_target || 'imported')
          .replace(/[^a-z0-9_\-]/gi, '_')
          .toLowerCase()
          .slice(0, 30);
        const filename = `imported_${safeTitle}_${Date.now()}.json`;

        saveLocalStory(filename, parsed);
        setLibraryTab('my-stories');
        fetchLibrary();
      } catch (err: any) {
        alert(err.message || 'Failed to import story file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Determine active item list based on active tab
  const activeItemsPool = libraryTab === 'my-stories' ? localItems : starterItems;

  const filteredItems = activeItemsPool.filter((item) => {
    const meta = item._meta || {};

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (item.title_target || '').toLowerCase().includes(q);
      const matchEn = (item.title_en || '').toLowerCase().includes(q);
      const matchPrompt = (meta.prompt || '').toLowerCase().includes(q);
      if (!matchTitle && !matchEn && !matchPrompt) return false;
    }

    if (filterLanguage !== 'all') {
      const itemLang = (meta.targetLang || '').toLowerCase();
      if (!itemLang.includes(filterLanguage.toLowerCase())) return false;
    }
    if (filterDifficulty !== 'all') {
      const itemDiff = (meta.difficulty || '').toLowerCase();
      const targetDiff = filterDifficulty.toLowerCase();
      if (targetDiff === 'introduction') {
        if (!itemDiff.includes('introduction')) return false;
      } else if (targetDiff.includes('master')) {
        if (!itemDiff.includes('master')) return false;
      } else if (meta.difficulty !== filterDifficulty) {
        return false;
      }
    }
    if (filterTense !== 'all' && meta.tense !== filterTense) return false;
    if (filterLength !== 'all' && String(meta.length) !== String(filterLength)) return false;
    if (filterContentType !== 'all' && (item.contentType || meta.contentType) !== filterContentType) return false;
    if (filterGenre !== 'all' && String(meta.isFact) !== filterGenre) return false;

    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return (b.createdAt || 0) - (a.createdAt || 0);
    }
    if (sortBy === 'date-asc') {
      return (a.createdAt || 0) - (b.createdAt || 0);
    }
    if (sortBy === 'title-asc') {
      return (a.title_target || '').localeCompare(b.title_target || '', undefined, { sensitivity: 'base' });
    }
    if (sortBy === 'title-desc') {
      return (b.title_target || '').localeCompare(a.title_target || '', undefined, { sensitivity: 'base' });
    }
    return 0;
  });

  const activeFilters = [
    filterLanguage !== 'all' && {
      key: 'lang',
      label: filterLanguage,
      clear: () => setFilterLanguage('all'),
    },
    filterDifficulty !== 'all' && {
      key: 'diff',
      label: filterDifficulty.replace(/\s*\(.*\)/, ''),
      clear: () => setFilterDifficulty('all'),
    },
    filterTense !== 'all' && {
      key: 'tense',
      label: filterTense.replace(/\s*\(.*\)/, ''),
      clear: () => setFilterTense('all'),
    },
    filterLength !== 'all' && {
      key: 'len',
      label: `~${filterLength} sent.`,
      clear: () => setFilterLength('all'),
    },
    filterContentType !== 'all' && {
      key: 'type',
      label: filterContentType,
      clear: () => setFilterContentType('all'),
    },
    filterGenre !== 'all' && {
      key: 'genre',
      label: filterGenre === 'true' ? 'Non-Fiction' : 'Fiction',
      clear: () => setFilterGenre('all'),
    },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  const activeFilterCount = activeFilters.length;

  const clearAllFilters = () => {
    setFilterLanguage('all');
    setFilterDifficulty('all');
    setFilterTense('all');
    setFilterLength('all');
    setFilterContentType('all');
    setFilterGenre('all');
    setSearchQuery('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden h-[94vh] sm:h-auto sm:max-h-[90vh] flex flex-col animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Unified Top Bar (Combined Tabs + Actions in ONE compact ~40px row) */}
        <div className="sm:hidden flex items-center justify-between px-3 py-1.5 border-b border-slate-100 bg-[#fbfcfd] shrink-0 gap-2">
          {/* Segmented Tab Switcher */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs font-bold">
            <button
              type="button"
              onClick={() => setLibraryTab('my-stories')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                libraryTab === 'my-stories'
                  ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>{t.myStoriesTab} ({localItems.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setLibraryTab('starter-samples')}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                libraryTab === 'starter-samples'
                  ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>{t.samplesTab} ({starterItems.length})</span>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 shrink-0">
            <label
              className="p-1.5 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer transition flex items-center"
              title={t.importStoryBtn}
            >
              <Upload className="w-3.5 h-3.5" />
              <input type="file" accept=".json" className="hidden" onChange={handleImportJson} />
            </label>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              aria-label={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-[#fbfcfd] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#008450] shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 truncate">
                <span>{t.libraryTitle}</span>
                {!isOnline && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0">
                    <WifiOff className="w-3 h-3" /> {t.offlineBadge}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500">
                {t.librarySubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer transition">
              <Upload className="w-3.5 h-3.5" />
              <span>{t.importStoryBtn}</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportJson}
              />
            </label>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              aria-label={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Library Mode Tabs (Private Stories vs Curated Starter Samples) */}
        <div className="hidden sm:flex items-center justify-between border-b border-slate-200 px-6 pt-2 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLibraryTab('my-stories')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                libraryTab === 'my-stories'
                  ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-xl shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 rounded-t-xl'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{t.myStoriesTab} ({localItems.length})</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                {t.privateBadge}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setLibraryTab('starter-samples')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                libraryTab === 'starter-samples'
                  ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-xl shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 rounded-t-xl'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{t.samplesTab} ({starterItems.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.privateDeviceStorageTitle}</span>
          </div>
        </div>

        {/* Privacy Assurance Banner - Hidden on mobile to maximize search results space */}
        <div className="hidden sm:block px-4 sm:px-6 pt-3 pb-1 shrink-0">
          {libraryTab === 'my-stories' ? (
            <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-950 shadow-2xs">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>{t.privateDeviceStorageTitle}:</strong> {t.privateDeviceStorageDesc}
                </span>
              </div>
              <span className="hidden md:inline-block px-2 py-0.5 bg-white/90 border border-emerald-300 rounded-lg text-[10px] font-bold text-emerald-800">
                🔒 {t.privateBadge}
              </span>
            </div>
          ) : (
            <div className="p-3 bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 border border-amber-200/90 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-950 shadow-2xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>{t.starterSamplesTitle}:</strong> {t.starterSamplesDesc}
                </span>
              </div>
              <span className="hidden md:inline-block px-2 py-0.5 bg-white/90 border border-amber-300 rounded-lg text-[10px] font-bold text-amber-800">
                🌟 {t.sampleBadge}
              </span>
            </div>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="p-2 sm:p-3.5 border-b border-slate-100 bg-slate-50/70 space-y-1.5 sm:space-y-2 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="relative flex-1 min-w-[110px]">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t.searchLibraryPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008450] focus:border-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                  title={t.clearFiltersBtn}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Button (opens dedicated bottom-sheet modal) */}
            <button
              type="button"
              onClick={() => setShowFiltersMobile(true)}
              className={`sm:hidden flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition cursor-pointer shrink-0 ${
                activeFilterCount > 0
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.filtersBtn}</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#008450] text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Desktop Sort Controls */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0 bg-white border border-slate-200 p-1 rounded-xl shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 pl-2 pr-1 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.sortLabel}</span>
              </span>
              <button
                type="button"
                onClick={() => setSortBy(sortBy === 'date-desc' ? 'date-asc' : 'date-desc')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  sortBy.startsWith('date')
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t.sortDate} {sortBy === 'date-desc' ? '↓' : sortBy === 'date-asc' ? '↑' : ''}</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy(sortBy === 'title-asc' ? 'title-desc' : 'title-asc')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  sortBy.startsWith('title')
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{t.sortTitle} {sortBy === 'title-asc' ? 'A–Z' : sortBy === 'title-desc' ? 'Z–A' : ''}</span>
              </button>
            </div>

            {/* Mobile Compact Sort Select */}
            <div className="sm:hidden flex items-center shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#008450]"
                aria-label={t.sortLabel}
              >
                <option value="date-desc">{t.sortDate} ↓</option>
                <option value="date-asc">{t.sortDate} ↑</option>
                <option value="title-asc">A–Z</option>
                <option value="title-desc">Z–A</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips on Mobile */}
          {activeFilters.length > 0 && (
            <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto pt-0.5 no-scrollbar text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">{t.activeLabel}</span>
              {activeFilters.map((flt) => (
                <button
                  key={flt.key}
                  type="button"
                  onClick={flt.clear}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md text-[11px] font-semibold shrink-0 cursor-pointer"
                >
                  <span>{flt.label}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[11px] text-emerald-700 font-bold underline shrink-0 pl-1 cursor-pointer"
              >
                {t.resetBtnLabel}
              </button>
            </div>
          )}

          {/* Desktop Filter Dropdowns: ONLY visible on desktop (sm:flex), NEVER inlined on phone */}
          <div className="hidden sm:flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs pt-1 border-t border-slate-200/70">
            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#008450]"
            >
              <option value="all">{t.allLanguages}</option>
              <option value="Italian">Italian</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Norwegian">Norwegian</option>
              <option value="Hungarian">Hungarian</option>
              <option value="Czech">Czech</option>
            </select>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#008450]"
            >
              <option value="all">{t.allLevels}</option>
              <option value="Introduction (A0-A1)">{t.diffIntro}</option>
              <option value="Beginner (A1-A2)">{t.diffBeginner}</option>
              <option value="Intermediate (B1-B2)">{t.diffIntermediate}</option>
              <option value="Advanced (C1-C2)">{t.diffAdvanced}</option>
              <option value="Master (Literary & Poetic C2+)">{t.diffMaster}</option>
            </select>

            <select
              value={filterTense}
              onChange={(e) => setFilterTense(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#008450]"
            >
              <option value="all">{t.allTenses}</option>
              <option value="Present Tense Only">{t.tensePresent}</option>
              <option value="Past Tense (Passato Prossimo)">{t.tensePast}</option>
              <option value="Imperfect Tense (Imperfetto)">{t.tenseImperfect}</option>
              <option value="Future Tense (Futuro)">{t.tenseFuture}</option>
              <option value="Conditional Tense">{t.tenseConditional}</option>
              <option value="Subjunctive (Congiuntivo)">{t.tenseSubjunctive}</option>
              <option value="Natural / Mixed Tenses">{t.tenseMixed}</option>
            </select>

            <select
              value={filterLength}
              onChange={(e) => setFilterLength(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#008450]"
            >
              <option value="all">{t.allLengths}</option>
              <option value="6">{t.lengthShort}</option>
              <option value="10">{t.lengthMedium}</option>
              <option value="16">{t.lengthLong}</option>
              <option value="22">{t.lengthMax}</option>
            </select>

            <select
              value={filterContentType}
              onChange={(e) => setFilterContentType(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#008450]"
            >
              <option value="all">{t.allFormats}</option>
              <option value="story">{t.story}</option>
              <option value="discussion">{t.dialogue}</option>
            </select>

            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#008450]"
            >
              <option value="all">{t.allGenres}</option>
              <option value="true">{t.nonFiction}</option>
              <option value="false">{t.fiction}</option>
            </select>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-lg transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.resetAllBtn}</span>
              </button>
            )}
          </div>
        </div>

        {/* Results summary bar */}
        <div className="px-3.5 sm:px-6 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0 font-medium">
          <span>
            {t.storiesFound(sortedItems.length)}
            {activeFilterCount > 0 ? ` · ${activeFilterCount}` : ''}
          </span>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-[#008450] font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.clearFiltersBtn}</span>
            </button>
          )}
        </div>

        {/* Stories List - flex-1 takes 100% of remaining vertical height */}
        <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100 p-2 sm:p-4">
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              {t.loadingLibrary}
            </div>
          ) : libraryTab === 'my-stories' && localItems.length === 0 ? (
            <div className="py-12 px-4 text-center max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">{t.emptyPrivateLibraryTitle}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.emptyPrivateLibraryDesc}
              </p>
              <button
                type="button"
                onClick={() => setLibraryTab('starter-samples')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.browseStarterSamplesBtn}</span>
              </button>
            </div>
          ) : sortedItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm space-y-1">
              <div className="font-bold text-slate-700">{t.noMatchingStoriesTitle}</div>
              <div className="text-xs">{t.noMatchingStoriesDesc}</div>
            </div>
          ) : (
            sortedItems.map((item) => {
              const meta = item._meta || {};
              const format = item.contentType || meta.contentType || 'story';
              const isDialogue = format === 'discussion';

              return (
                <div
                  key={item.filename}
                  onClick={() => handleLoadItem(item)}
                  className="py-2.5 px-2.5 sm:py-3.5 sm:px-3 rounded-xl hover:bg-emerald-50/60 border border-transparent hover:border-emerald-200/80 transition flex items-center justify-between gap-2.5 sm:gap-4 cursor-pointer group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className="text-sm sm:text-base">{isDialogue ? '🎙️' : '📖'}</span>
                      <h4 className="font-bold text-slate-900 truncate text-xs sm:text-base group-hover:text-[#008450] transition">
                        {item.title_target}
                      </h4>
                      {item.title_en && (
                        <span className="text-[11px] sm:text-xs text-slate-500 font-normal hidden sm:inline truncate">
                          ({item.title_en})
                        </span>
                      )}
                      {item.isStarterSample ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                          {t.sampleBadge}
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-0.5 shrink-0">
                          <Lock className="w-2.5 h-2.5 text-emerald-600" />
                          <span>{t.privateBadge}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1 mt-1 sm:mt-1.5">
                      {item.createdAt ? (
                        <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/80">
                          <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-700" />
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      ) : null}
                      {meta.targetLang && (
                        <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          {meta.targetLang}
                        </span>
                      )}
                      {meta.difficulty && (
                        <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium bg-slate-100 text-slate-700">
                          {meta.difficulty}
                        </span>
                      )}
                      {meta.tense && (
                        <span className="hidden xs:inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium bg-slate-100 text-slate-700">
                          {meta.tense}
                        </span>
                      )}
                      {meta.length && (
                        <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium bg-slate-100 text-slate-700">
                          ~{meta.length}
                        </span>
                      )}
                      {meta.isFact !== undefined && (
                        <span className="hidden sm:inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium bg-slate-100 text-slate-700">
                          {meta.isFact ? t.nonFiction : t.fiction}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    <button
                      type="button"
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#008450] text-white text-xs font-bold rounded-lg shadow-xs hover:bg-[#006b40] transition cursor-pointer"
                    >
                      {t.openBtn}
                    </button>
                    {onShareStory && (
                      <button
                        type="button"
                        onClick={(e) => handleShareItem(item, e)}
                        className="p-1 sm:px-2.5 sm:py-1.5 rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95 flex items-center gap-1"
                        title={t.shareStoryTitle}
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#008450]" />
                        <span className="hidden sm:inline">{t.shareShort}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleExportJson(item, e)}
                      className="p-1 sm:p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                      title="JSON"
                    >
                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    {!item.isStarterSample && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteItem(item.filename, e)}
                        className="p-1 sm:p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title={t.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Mobile Filter Drawer Overlay Sheet - Anchored to Top */}
        {showFiltersMobile && (
          <div
            className="sm:hidden fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex flex-col justify-start"
            onClick={() => setShowFiltersMobile(false)}
          >
            <div
              className="bg-white rounded-b-2xl shadow-2xl border-b border-slate-200 p-4 max-h-[85vh] flex flex-col animate-slide-down"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#008450] flex items-center justify-center">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{t.filterStoriesBtn}</h4>
                    <p className="text-[11px] text-slate-500">{t.targetLangLabel} • {t.difficultyLevel}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFiltersMobile(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  aria-label={t.close}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-3 overflow-y-auto space-y-3 flex-1 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.targetLangLabel}</label>
                  <select
                    value={filterLanguage}
                    onChange={(e) => setFilterLanguage(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#008450]"
                  >
                    <option value="all">{t.allLanguages}</option>
                    <option value="Italian">Italian</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Norwegian">Norwegian</option>
                    <option value="Hungarian">Hungarian</option>
                    <option value="Czech">Czech</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.difficultyLevel}</label>
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#008450]"
                  >
                    <option value="all">{t.allLevels}</option>
                    <option value="Introduction (A0-A1)">{t.diffIntro}</option>
                    <option value="Beginner (A1-A2)">{t.diffBeginner}</option>
                    <option value="Intermediate (B1-B2)">{t.diffIntermediate}</option>
                    <option value="Advanced (C1-C2)">{t.diffAdvanced}</option>
                    <option value="Master (Literary & Poetic C2+)">{t.diffMaster}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.tenseFocus}</label>
                  <select
                    value={filterTense}
                    onChange={(e) => setFilterTense(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#008450]"
                  >
                    <option value="all">{t.allTenses}</option>
                    <option value="Present Tense Only">{t.tensePresent}</option>
                    <option value="Past Tense (Passato Prossimo)">{t.tensePast}</option>
                    <option value="Imperfect Tense (Imperfetto)">{t.tenseImperfect}</option>
                    <option value="Future Tense (Futuro)">{t.tenseFuture}</option>
                    <option value="Conditional Tense">{t.tenseConditional}</option>
                    <option value="Subjunctive (Congiuntivo)">{t.tenseSubjunctive}</option>
                    <option value="Natural / Mixed Tenses">{t.tenseMixed}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t.storyLength}</label>
                    <select
                      value={filterLength}
                      onChange={(e) => setFilterLength(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#008450]"
                    >
                      <option value="all">{t.allLengths}</option>
                      <option value="6">{t.lengthShort}</option>
                      <option value="10">{t.lengthMedium}</option>
                      <option value="16">{t.lengthLong}</option>
                      <option value="22">{t.lengthMax}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{t.formatAndGenre}</label>
                    <select
                      value={filterContentType}
                      onChange={(e) => setFilterContentType(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#008450]"
                    >
                      <option value="all">{t.allFormats}</option>
                      <option value="story">{t.story}</option>
                      <option value="discussion">{t.dialogue}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.allGenres}</label>
                  <select
                    value={filterGenre}
                    onChange={(e) => setFilterGenre(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#008450]"
                  >
                    <option value="all">{t.allGenres}</option>
                    <option value="true">{t.nonFiction}</option>
                    <option value="false">{t.fiction}</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    clearAllFilters();
                    setShowFiltersMobile(false);
                  }}
                  className="px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl transition cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t.resetAllBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowFiltersMobile(false)}
                  className="flex-1 px-4 py-2 bg-[#008450] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#006b40] transition cursor-pointer text-center"
                >
                  {t.showNStoriesBtn(sortedItems.length)}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
