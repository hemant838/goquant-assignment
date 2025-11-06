export interface Exchange {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  cloudProvider: 'aws' | 'gcp' | 'azure';
  region: string;
  country: string;
}

export interface CloudRegion {
  id: string;
  provider: 'aws' | 'gcp' | 'azure';
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  country: string;
}

export interface LatencyData {
  from: string;
  to: string;
  latency: number;
  timestamp: number;
}

export interface HistoricalLatencyData {
  timestamp: number;
  latency: number;
}

export type LatencyRange = 'low' | 'medium' | 'high';

export interface LatencyConnection {
  from: Exchange | CloudRegion;
  to: Exchange | CloudRegion;
  latency: number;
  timestamp: number;
}

