'use client';

import { useAppStore } from '@/store/useAppStore';
import { Exchange } from '@/types';
import { exchanges } from '@/data/exchanges';
import PerformanceMetrics from './PerformanceMetrics';
import { useLatencyUpdates } from '@/hooks/useLatencyUpdates';

interface ControlPanelProps {
  selectedExchange: Exchange | null;
}

export default function ControlPanel({ selectedExchange }: ControlPanelProps) {
  const {
    selectedCloudProvider,
    showHistorical,
    showRealTime,
    showRegions,
    darkMode,
    searchQuery,
    timeRange,
    setSelectedCloudProvider,
    setShowHistorical,
    setShowRealTime,
    setShowRegions,
    toggleDarkMode,
    setSearchQuery,
    setTimeRange,
  } = useAppStore();

  const { isLoading, useRealTimeData, setUseRealTimeData } = useLatencyUpdates();

  return (
    <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 w-72 sm:w-80 max-h-[90vh] overflow-y-auto z-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Controls</h2>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search Exchanges
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Cloud Provider Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Cloud Provider
        </label>
        <select
          value={selectedCloudProvider}
          onChange={(e) => setSelectedCloudProvider(e.target.value as 'aws' | 'gcp' | 'azure' | 'all')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Providers</option>
          <option value="aws">AWS</option>
          <option value="gcp">GCP</option>
          <option value="azure">Azure</option>
        </select>
      </div>

      {/* Visualization Toggles */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Visualization Layers
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showRealTime}
              onChange={(e) => setShowRealTime(e.target.checked)}
              className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Real-time Latency</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showHistorical}
              onChange={(e) => setShowHistorical(e.target.checked)}
              className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Historical Trends</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showRegions}
              onChange={(e) => setShowRegions(e.target.checked)}
              className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Cloud Regions</span>
          </label>
        </div>
      </div>

      {/* Data Source Toggle */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Data Source
        </label>
        <div className="space-y-2">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {useRealTimeData ? 'Cloudflare Radar' : 'Simulated Data'}
            </span>
            <button
              onClick={() => setUseRealTimeData(!useRealTimeData)}
              disabled={isLoading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                useRealTimeData ? 'bg-blue-600' : 'bg-gray-300'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  useRealTimeData ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
          {isLoading && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Loading latency data...
            </p>
          )}
          {useRealTimeData && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Using Cloudflare Radar API for real-time latency data
            </p>
          )}
        </div>
      </div>

      {/* Time Range Selector */}
      {showHistorical && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Time Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['1h', '24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Legend
        </label>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
            <span className="text-gray-700 dark:text-gray-300">AWS</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span className="text-gray-700 dark:text-gray-300">GCP</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span className="text-gray-700 dark:text-gray-300">Azure</span>
          </div>
          <div className="flex items-center mt-3">
            <div className="w-8 h-1 bg-green-500 rounded mr-2"></div>
            <span className="text-gray-700 dark:text-gray-300">Low Latency (&lt;50ms)</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-1 bg-yellow-500 rounded mr-2"></div>
            <span className="text-gray-700 dark:text-gray-300">Medium (50-100ms)</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-1 bg-red-500 rounded mr-2"></div>
            <span className="text-gray-700 dark:text-gray-300">High (&gt;100ms)</span>
          </div>
        </div>
      </div>

      {/* Selected Exchange Info */}
      {selectedExchange && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Selected: {selectedExchange.name}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {selectedExchange.country} • {selectedExchange.cloudProvider.toUpperCase()}
          </p>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="mt-4">
        <PerformanceMetrics />
      </div>
    </div>
  );
}

