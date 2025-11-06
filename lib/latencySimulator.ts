import { Exchange, CloudRegion, LatencyData, HistoricalLatencyData } from '@/types';

// Simulate latency based on distance (rough approximation)
function calculateBaseLatency(from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }): number {
  // Haversine formula for distance
  const R = 6371; // Earth's radius in km
  const dLat = (to.latitude - from.latitude) * Math.PI / 180;
  const dLon = (to.longitude - from.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(from.latitude * Math.PI / 180) * Math.cos(to.latitude * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  
  // Rough latency calculation: ~5ms per 1000km, plus base 10ms
  const baseLatency = 10 + (distance / 1000) * 5;
  
  // Add some random variation (±20%)
  const variation = baseLatency * 0.2 * (Math.random() * 2 - 1);
  
  return Math.max(5, Math.round(baseLatency + variation));
}

export function generateLatencyData(from: Exchange | CloudRegion, to: Exchange | CloudRegion): LatencyData {
  return {
    from: from.id,
    to: to.id,
    latency: calculateBaseLatency(from, to),
    timestamp: Date.now(),
  };
}

export function generateHistoricalLatencyData(
  from: Exchange | CloudRegion,
  to: Exchange | CloudRegion,
  hours: number = 24
): HistoricalLatencyData[] {
  const data: HistoricalLatencyData[] = [];
  const baseLatency = calculateBaseLatency(from, to);
  const now = Date.now();
  const interval = (hours * 60 * 60 * 1000) / 100; // 100 data points
  
  for (let i = 0; i < 100; i++) {
    const timestamp = now - (100 - i) * interval;
    // Add time-based variation (simulate network congestion patterns)
    const timeVariation = Math.sin(timestamp / (1000 * 60 * 60)) * 10;
    const randomVariation = (Math.random() - 0.5) * 20;
    const latency = Math.max(5, Math.round(baseLatency + timeVariation + randomVariation));
    
    data.push({ timestamp, latency });
  }
  
  return data;
}

export function getLatencyColor(latency: number): string {
  if (latency < 50) return '#10b981'; // green
  if (latency < 100) return '#f59e0b'; // yellow
  return '#ef4444'; // red
}

export function getLatencyRange(latency: number): 'low' | 'medium' | 'high' {
  if (latency < 50) return 'low';
  if (latency < 100) return 'medium';
  return 'high';
}

