'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppStore } from '@/store/useAppStore';
import { Exchange, CloudRegion } from '@/types';
import { generateHistoricalLatencyData } from '@/lib/latencySimulator';

interface HistoricalChartProps {
  from: Exchange | CloudRegion;
  to: Exchange | CloudRegion;
}

export default function HistoricalChart({ from, to }: HistoricalChartProps) {
  const { timeRange } = useAppStore();
  
  const hours = timeRange === '1h' ? 1 : timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
  const historicalData = generateHistoricalLatencyData(from, to, hours);
  
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    if (timeRange === '1h') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit' });
  };

  const chartData = historicalData.map((point) => ({
    time: formatTimestamp(point.timestamp),
    latency: point.latency,
    timestamp: point.timestamp,
  }));

  const stats = {
    min: Math.min(...historicalData.map(d => d.latency)),
    max: Math.max(...historicalData.map(d => d.latency)),
    avg: Math.round(historicalData.reduce((sum, d) => sum + d.latency, 0) / historicalData.length),
  };

  const fromName = from.name;
  const toName = to.name;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Historical Latency: {fromName} → {toName}
      </h3>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Min</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.min}ms</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Max</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.max}ms</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Average</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.avg}ms</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#374151' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="latency"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Latency (ms)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

