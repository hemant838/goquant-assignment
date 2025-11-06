import { CloudRegion } from '@/types';

export const cloudRegions: CloudRegion[] = [
  // AWS Regions
  { id: 'aws-us-east-1', provider: 'aws', name: 'US East (N. Virginia)', code: 'us-east-1', latitude: 38.9072, longitude: -77.0369, country: 'USA' },
  { id: 'aws-us-west-2', provider: 'aws', name: 'US West (Oregon)', code: 'us-west-2', latitude: 45.5152, longitude: -122.6784, country: 'USA' },
  { id: 'aws-eu-west-1', provider: 'aws', name: 'Europe (Ireland)', code: 'eu-west-1', latitude: 53.3498, longitude: -6.2603, country: 'Ireland' },
  { id: 'aws-eu-west-2', provider: 'aws', name: 'Europe (London)', code: 'eu-west-2', latitude: 51.5074, longitude: -0.1278, country: 'UK' },
  { id: 'aws-ap-southeast-1', provider: 'aws', name: 'Asia Pacific (Singapore)', code: 'ap-southeast-1', latitude: 1.3521, longitude: 103.8198, country: 'Singapore' },
  { id: 'aws-ap-northeast-1', provider: 'aws', name: 'Asia Pacific (Tokyo)', code: 'ap-northeast-1', latitude: 35.6762, longitude: 139.6503, country: 'Japan' },
  
  // GCP Regions
  { id: 'gcp-us-central1', provider: 'gcp', name: 'Iowa', code: 'us-central1', latitude: 41.8781, longitude: -93.0977, country: 'USA' },
  { id: 'gcp-us-west1', provider: 'gcp', name: 'Oregon', code: 'us-west1', latitude: 45.5152, longitude: -122.6784, country: 'USA' },
  { id: 'gcp-europe-west4', provider: 'gcp', name: 'Netherlands', code: 'europe-west4', latitude: 52.3676, longitude: 4.9041, country: 'Netherlands' },
  { id: 'gcp-asia-northeast1', provider: 'gcp', name: 'Tokyo', code: 'asia-northeast1', latitude: 35.6762, longitude: 139.6503, country: 'Japan' },
  { id: 'gcp-asia-southeast1', provider: 'gcp', name: 'Singapore', code: 'asia-southeast1', latitude: 1.3521, longitude: 103.8198, country: 'Singapore' },
  
  // Azure Regions
  { id: 'azure-eastus', provider: 'azure', name: 'East US', code: 'eastus', latitude: 38.9072, longitude: -77.0369, country: 'USA' },
  { id: 'azure-westus2', provider: 'azure', name: 'West US 2', code: 'westus2', latitude: 47.6062, longitude: -122.3321, country: 'USA' },
  { id: 'azure-westeurope', provider: 'azure', name: 'West Europe', code: 'westeurope', latitude: 52.3676, longitude: 4.9041, country: 'Netherlands' },
  { id: 'azure-southeastasia', provider: 'azure', name: 'Southeast Asia', code: 'southeastasia', latitude: 1.3521, longitude: 103.8198, country: 'Singapore' },
  { id: 'azure-germanywestcentral', provider: 'azure', name: 'Germany West Central', code: 'germanywestcentral', latitude: 52.5200, longitude: 13.4050, country: 'Germany' },
];

