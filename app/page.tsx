'use client';

import { useState, useEffect } from 'react';
import WorldMap3D from '@/components/WorldMap3D';
import ControlPanel from '@/components/ControlPanel';
import HistoricalChart from '@/components/HistoricalChart';
import { useAppStore } from '@/store/useAppStore';
import { useLatencyUpdates } from '@/hooks/useLatencyUpdates';
import { Exchange } from '@/types';

export default function Home() {
  const { selectedExchange, darkMode, showHistorical } = useAppStore();
  const [comparisonExchange, setComparisonExchange] = useState<Exchange | null>(null);
  
  useLatencyUpdates();

  useEffect(() => {
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleExchangeClick = (exchange: Exchange) => {
    const currentSelected = useAppStore.getState().selectedExchange;
    if (currentSelected && currentSelected.id !== exchange.id) {
      // If we have a selected exchange, set this one as comparison
      setComparisonExchange(exchange);
    } else {
      // Otherwise, select this exchange
      useAppStore.getState().setSelectedExchange(exchange);
      setComparisonExchange(null);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>

      {/* Main Content */}
      <main className="relative w-full h-screen pt-24">
        {/* 3D Map */}
        <div className="absolute inset-0 w-full h-full">
          <WorldMap3D onExchangeClick={handleExchangeClick} />
        </div>

        {/* Control Panel */}
        <ControlPanel selectedExchange={selectedExchange} />

        {/* Historical Chart - Bottom Panel */}
        {showHistorical && selectedExchange && comparisonExchange && (
          <div className="absolute bottom-4 left-4 right-4 z-20 max-w-4xl mx-auto px-4">
            <HistoricalChart from={selectedExchange} to={comparisonExchange} />
          </div>
        )}

        {/* Instructions - Hidden on mobile when chart is visible */}
        {!(showHistorical && selectedExchange && comparisonExchange) && (
          <div className="absolute bottom-4 left-4 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs hidden md:block">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Instructions</h3>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Click on exchange markers to select</li>
              <li>• Drag to rotate, scroll to zoom</li>
              <li>• Use controls to filter and toggle layers</li>
              <li>• Hover over markers for details</li>
              <li>• Click a second exchange to compare</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
