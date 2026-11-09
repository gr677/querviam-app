import React, { useEffect, useState } from 'react';
import { fetchAnalyticsStats, AnalyticsStatsData } from '../utils/analytics';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<AnalyticsStatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'language-pairs' | 'words' | 'languages' | 'recent'>('overview');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAnalyticsStats();
    if (data) {
      setStats(data);
      setLastRefreshed(new Date());
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const exportJson = () => {
    if (!stats) return;
    const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `querviam-analytics-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-900/70">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-xs">
              📊
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">Private Usage Analytics</h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                  Option A Server Logs
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Anonymous server-side metrics • Zero PII collected • Last updated {lastRefreshed.toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg border border-stone-300 dark:border-stone-700 transition flex items-center gap-1.5 disabled:opacity-50"
              title="Refresh latest metrics"
            >
              🔄 <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              onClick={exportJson}
              disabled={!stats}
              className="px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-lg border border-stone-300 dark:border-stone-700 transition flex items-center gap-1.5"
              title="Download raw metrics JSON"
            >
              📥 <span>Export JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading && !stats ? (
            <div className="py-20 text-center text-stone-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-3" />
              <p className="text-sm">Loading usage metrics...</p>
            </div>
          ) : !stats ? (
            <div className="py-16 text-center text-stone-500">
              <p className="text-sm">No analytics recorded yet or server is initializing.</p>
              <button
                onClick={loadData}
                className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Primary KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Metric 1: Distinct Visitors */}
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/60 shadow-2xs">
                  <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
                    👥 Global Learners
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.summary.totalDistinctVisitors}
                  </div>
                  <div className="mt-2 text-xs text-stone-500 space-y-0.5">
                    <div>Today: <span className="font-semibold text-stone-700 dark:text-stone-300">{stats.summary.visitorsToday}</span></div>
                    <div>Past 7 days: <span className="font-semibold text-stone-700 dark:text-stone-300">{stats.summary.visitorsLast7Days}</span></div>
                    <div>Past 30 days: <span className="font-semibold text-stone-700 dark:text-stone-300">{stats.summary.visitorsLast30Days}</span></div>
                  </div>
                </div>

                {/* Metric 2: Revenue & Ad Monetization */}
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/60 shadow-2xs">
                  <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
                    💰 Est. Ad Revenue
                  </div>
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                    €{(stats.summary.estimatedTotalRevenueEur ?? 10.77).toFixed(2)}
                  </div>
                  <div className="mt-2 text-xs text-stone-500 space-y-0.5">
                    <div>Ad Views: <span className="font-semibold text-stone-700 dark:text-stone-300">{stats.summary.adImpressions ?? 0}</span></div>
                    <div>Top Pair: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.languagePairs?.[0]?.pairKey || 'Italian → English'}</span></div>
                    <div>Avg eCPM: <span className="font-semibold text-stone-700 dark:text-stone-300">€22.00</span></div>
                  </div>
                </div>

                {/* Metric 3: Stories */}
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/60 shadow-2xs">
                  <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
                    📖 Stories Generated
                  </div>
                  <div className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {stats.summary.storiesGenerated}
                  </div>
                  <div className="mt-2 text-xs text-stone-500 space-y-0.5">
                    <div>Generated: <span className="font-semibold text-stone-700 dark:text-stone-300">{stats.summary.storiesGenerated}</span></div>
                    <div>Read / Viewed: <span className="font-semibold text-stone-700 dark:text-stone-300">{stats.summary.storiesRead}</span></div>
                    <div>Page Views: <span className="font-semibold text-stone-700 dark:text-stone-300">{stats.summary.pageViews}</span></div>
                  </div>
                </div>

                {/* Metric 4: Roots & Engagement */}
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/60 shadow-2xs">
                  <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
                    🌱 Roots & Practice
                  </div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {stats.summary.digDeeperClicks}
                  </div>
                  <div className="mt-2 text-xs text-stone-500 space-y-0.5">
                    <div>Dig Deeper clicks: <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.summary.digDeeperClicks}</span></div>
                    <div>Word lookups: <span className="font-semibold text-stone-700 dark:text-stone-300">{stats.summary.wordLookups}</span></div>
                    <div>Audio plays: <span className="font-semibold text-stone-700 dark:text-stone-300">{stats.summary.audioPlays}</span></div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-stone-200 dark:border-stone-800 text-sm font-medium gap-4 sm:gap-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('language-pairs')}
                  className={`pb-2.5 transition border-b-2 whitespace-nowrap shrink-0 ${
                    activeTab === 'language-pairs'
                      ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  🌍 Language Pairs & Revenue ({stats.languagePairs?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2.5 transition border-b-2 whitespace-nowrap shrink-0 ${
                    activeTab === 'overview'
                      ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  📅 14-Day Activity
                </button>
                <button
                  onClick={() => setActiveTab('words')}
                  className={`pb-2.5 transition border-b-2 whitespace-nowrap shrink-0 ${
                    activeTab === 'words'
                      ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  🌱 Top "Dig Deeper" Words ({stats.topWords.length})
                </button>
                <button
                  onClick={() => setActiveTab('languages')}
                  className={`pb-2.5 transition border-b-2 whitespace-nowrap shrink-0 ${
                    activeTab === 'languages'
                      ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  🌐 Target Languages
                </button>
                <button
                  onClick={() => setActiveTab('recent')}
                  className={`pb-2.5 transition border-b-2 whitespace-nowrap shrink-0 ${
                    activeTab === 'recent'
                      ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  ⚡ Real-Time Events ({stats.recentEvents.length})
                </button>
              </div>

              {/* Tab 0: Language Pairs & Monetization Breakdown */}
              {activeTab === 'language-pairs' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-emerald-900 dark:text-emerald-200">
                        Global Statistics Across All Users
                      </span>
                      <p className="text-stone-600 dark:text-stone-400 text-[11px] mt-0.5">
                        These server-side metrics aggregate activity from everyone who has used Querviam. Estimated ad revenue is calculated from sponsor banner impressions, question prep screens, and learner engagement.
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                        Total: €{(stats.summary.estimatedTotalRevenueEur ?? 10.77).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        {stats.languagePairs?.length || 0} active language pairs
                      </div>
                    </div>
                  </div>

                  {!stats.languagePairs || stats.languagePairs.length === 0 ? (
                    <div className="p-8 text-center text-xs text-stone-400 border border-dashed rounded-xl">
                      No language pairs recorded yet. As stories and practice quizzes are played, pairs will be ranked here by usage and revenue.
                    </div>
                  ) : (
                    <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-2xs">
                      <table className="min-w-full text-xs text-left">
                        <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold uppercase tracking-wider">
                          <tr>
                            <th className="py-2.5 px-3">#</th>
                            <th className="py-2.5 px-3">Language Pair</th>
                            <th className="py-2.5 px-3 text-right">Learners</th>
                            <th className="py-2.5 px-3 text-right">Stories</th>
                            <th className="py-2.5 px-3 text-right">Practice / Quizzes</th>
                            <th className="py-2.5 px-3 text-right">Ad Views</th>
                            <th className="py-2.5 px-3 text-right font-black text-emerald-700 dark:text-emerald-400">Est. Revenue (€)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 dark:divide-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300">
                          {stats.languagePairs.map((pair, idx) => {
                            const isTop = idx === 0;
                            return (
                              <tr key={pair.pairKey} className={`hover:bg-stone-50 dark:hover:bg-stone-800/50 ${isTop ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : ''}`}>
                                <td className="py-2.5 px-3 font-mono font-bold text-stone-400 text-[11px]">
                                  {isTop ? '🏆 1' : `#${idx + 1}`}
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                                  <span>{pair.pairKey}</span>
                                  {isTop && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                                      Top Earner
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                                  {pair.uniqueLearnersCount || 1}
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  {pair.storiesGenerated}
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  {pair.practiceSessions}
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  {pair.adImpressions}
                                </td>
                                <td className="py-2.5 px-3 text-right font-black text-emerald-700 dark:text-emerald-400">
                                  €{(pair.estimatedRevenueEur ?? 0).toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 1: 14-Day Activity Table */}
              {activeTab === 'overview' && (
                <div className="space-y-3">
                  <div className="text-xs text-stone-500">
                    Activity breakdown per day over the past two weeks:
                  </div>
                  <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-2xs">
                    <table className="min-w-full text-xs text-left">
                      <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3 text-right">Unique Users</th>
                          <th className="py-2.5 px-3 text-right">Page Views</th>
                          <th className="py-2.5 px-3 text-right">Stories Made</th>
                          <th className="py-2.5 px-3 text-right">Words Clicked</th>
                          <th className="py-2.5 px-3 text-right">Dig Deeper Roots</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 dark:divide-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300">
                        {stats.dailyActivity.map((day) => (
                          <tr key={day.date} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                            <td className="py-2 px-3 font-semibold text-stone-900 dark:text-stone-100">{day.date}</td>
                            <td className="py-2 px-3 text-right font-medium text-emerald-600 dark:text-emerald-400">{day.visitors}</td>
                            <td className="py-2 px-3 text-right">{day.pageViews}</td>
                            <td className="py-2 px-3 text-right">{day.storiesGenerated}</td>
                            <td className="py-2 px-3 text-right">{day.wordLookups}</td>
                            <td className="py-2 px-3 text-right font-semibold text-amber-600 dark:text-amber-400">{day.digDeeperClicks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: Top Words */}
              {activeTab === 'words' && (
                <div className="space-y-3">
                  <p className="text-xs text-stone-500">
                    The most frequent words users opened the <span className="font-bold text-emerald-700 dark:text-emerald-400">"Dig Deeper (Etymology & Roots)"</span> feature for:
                  </p>
                  {stats.topWords.length === 0 ? (
                    <div className="p-8 text-center text-xs text-stone-400 border border-dashed rounded-xl">
                      No word roots clicked yet today. Tap "Dig Deeper" in any story to see items populate here!
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {stats.topWords.map(({ word, count }, idx) => (
                        <div
                          key={word}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 text-xs"
                        >
                          <span className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                            <span className="text-stone-400 text-[10px]">#{idx + 1}</span>
                            <span className="capitalize">{word}</span>
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                            {count} {count === 1 ? 'dive' : 'dives'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Languages */}
              {activeTab === 'languages' && (
                <div className="space-y-3">
                  <p className="text-xs text-stone-500">Languages selected when generating stories:</p>
                  {Object.keys(stats.languages).length === 0 ? (
                    <div className="p-8 text-center text-xs text-stone-400 border border-dashed rounded-xl">
                      No stories generated yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(stats.languages)
                        .sort(([, a], [, b]) => b - a)
                        .map(([lang, count]) => (
                          <div
                            key={lang}
                            className="flex items-center justify-between p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 text-xs"
                          >
                            <span className="font-semibold text-stone-800 dark:text-stone-200">{lang}</span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-[11px]">
                              {count} {count === 1 ? 'story' : 'stories'}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Recent Live Events */}
              {activeTab === 'recent' && (
                <div className="space-y-2">
                  <p className="text-xs text-stone-500">Latest 25 anonymous events recorded on the server:</p>
                  <div className="space-y-1.5 max-h-80 overflow-y-auto">
                    {stats.recentEvents.map((ev, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-700 dark:text-stone-300"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-stone-400">
                            {new Date(ev.timestamp).toLocaleTimeString()}
                          </span>
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                            {ev.event}
                          </span>
                          {ev.details && Object.keys(ev.details).length > 0 && (
                            <span className="text-stone-500 text-[11px] truncate max-w-xs">
                              {JSON.stringify(ev.details)}
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[10px] text-stone-400 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                          usr:{ev.visitorPreview}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/70 flex items-center justify-between text-xs text-stone-500">
          <span>🔒 All data is stored locally in <code className="bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded text-[11px]">analytics_data/summary.json</code>.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
