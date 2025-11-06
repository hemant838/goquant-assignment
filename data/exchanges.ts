import { Exchange } from '@/types';

export const exchanges: Exchange[] = [
  // OKX
  { id: 'okx-us', name: 'OKX', latitude: 40.7128, longitude: -74.0060, cloudProvider: 'aws', region: 'us-east-1', country: 'USA' },
  { id: 'okx-sg', name: 'OKX', latitude: 1.3521, longitude: 103.8198, cloudProvider: 'aws', region: 'ap-southeast-1', country: 'Singapore' },
  
  // Deribit
  { id: 'deribit-nl', name: 'Deribit', latitude: 52.3676, longitude: 4.9041, cloudProvider: 'gcp', region: 'europe-west4', country: 'Netherlands' },
  
  // Bybit
  { id: 'bybit-sg', name: 'Bybit', latitude: 1.3521, longitude: 103.8198, cloudProvider: 'azure', region: 'southeastasia', country: 'Singapore' },
  { id: 'bybit-us', name: 'Bybit', latitude: 37.7749, longitude: -122.4194, cloudProvider: 'aws', region: 'us-west-2', country: 'USA' },
  
  // Binance
  { id: 'binance-sg', name: 'Binance', latitude: 1.3521, longitude: 103.8198, cloudProvider: 'aws', region: 'ap-southeast-1', country: 'Singapore' },
  { id: 'binance-tokyo', name: 'Binance', latitude: 35.6762, longitude: 139.6503, cloudProvider: 'gcp', region: 'asia-northeast1', country: 'Japan' },
  { id: 'binance-london', name: 'Binance', latitude: 51.5074, longitude: -0.1278, cloudProvider: 'aws', region: 'eu-west-2', country: 'UK' },
  
  // Coinbase
  { id: 'coinbase-us', name: 'Coinbase', latitude: 37.7749, longitude: -122.4194, cloudProvider: 'aws', region: 'us-west-1', country: 'USA' },
  { id: 'coinbase-ireland', name: 'Coinbase', latitude: 53.3498, longitude: -6.2603, cloudProvider: 'aws', region: 'eu-west-1', country: 'Ireland' },
  
  // Kraken
  { id: 'kraken-us', name: 'Kraken', latitude: 47.6062, longitude: -122.3321, cloudProvider: 'aws', region: 'us-west-2', country: 'USA' },
  { id: 'kraken-germany', name: 'Kraken', latitude: 52.5200, longitude: 13.4050, cloudProvider: 'azure', region: 'germanywestcentral', country: 'Germany' },
  
  // BitMEX
  { id: 'bitmex-sg', name: 'BitMEX', latitude: 1.3521, longitude: 103.8198, cloudProvider: 'aws', region: 'ap-southeast-1', country: 'Singapore' },
];

