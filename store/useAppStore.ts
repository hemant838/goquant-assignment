import { create } from 'zustand';
import { Exchange, CloudRegion, LatencyConnection } from '@/types';

interface AppState {
  selectedExchange: Exchange | null;
  selectedCloudProvider: 'aws' | 'gcp' | 'azure' | 'all';
  showHistorical: boolean;
  showRealTime: boolean;
  showRegions: boolean;
  latencyConnections: LatencyConnection[];
  darkMode: boolean;
  searchQuery: string;
  timeRange: '1h' | '24h' | '7d' | '30d';
  
  setSelectedExchange: (exchange: Exchange | null) => void;
  setSelectedCloudProvider: (provider: 'aws' | 'gcp' | 'azure' | 'all') => void;
  setShowHistorical: (show: boolean) => void;
  setShowRealTime: (show: boolean) => void;
  setShowRegions: (show: boolean) => void;
  setLatencyConnections: (connections: LatencyConnection[]) => void;
  toggleDarkMode: () => void;
  setSearchQuery: (query: string) => void;
  setTimeRange: (range: '1h' | '24h' | '7d' | '30d') => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedExchange: null,
  selectedCloudProvider: 'all',
  showHistorical: true,
  showRealTime: true,
  showRegions: true,
  latencyConnections: [],
  darkMode: false,
  searchQuery: '',
  timeRange: '24h',
  
  setSelectedExchange: (exchange) => set({ selectedExchange: exchange }),
  setSelectedCloudProvider: (provider) => set({ selectedCloudProvider: provider }),
  setShowHistorical: (show) => set({ showHistorical: show }),
  setShowRealTime: (show) => set({ showRealTime: show }),
  setShowRegions: (show) => set({ showRegions: show }),
  setLatencyConnections: (connections) => set({ latencyConnections: connections }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setTimeRange: (range) => set({ timeRange: range }),
}));

