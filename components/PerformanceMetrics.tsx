'use client';

import { useAppStore } from '@/store/useAppStore';

export default function PerformanceMetrics() {
  const { latencyConnections } = useAppStore();
  
  const activeConnections = latencyConnections.length;
  const avgLatency = latencyConnections.length > 0
    ? Math.round(latencyConnections.reduce((sum, conn) => sum + conn.latency, 0) / latencyConnections.length)
    : 0;
  
  const lowLatencyCount = latencyConnections.filter(conn => conn.latency < 50).length;
  const mediumLatencyCount = latencyConnections.filter(conn => conn.latency >= 50 && conn.latency < 100).length;
  const highLatencyCount = latencyConnections.filter(conn => conn.latency >= 100).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Performance Metrics</h3>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Active Connections:</span>
          <span className="font-medium text-gray-900 dark:text-white">{activeConnections}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Avg Latency:</span>
          <span className="font-medium text-gray-900 dark:text-white">{avgLatency}ms</span>
        </div>
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between mb-1">
            <span className="text-green-600 dark:text-green-400">Low (&lt;50ms):</span>
            <span className="font-medium text-gray-900 dark:text-white">{lowLatencyCount}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-yellow-600 dark:text-yellow-400">Medium (50-100ms):</span>
            <span className="font-medium text-gray-900 dark:text-white">{mediumLatencyCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-600 dark:text-red-400">High (&gt;100ms):</span>
            <span className="font-medium text-gray-900 dark:text-white">{highLatencyCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

