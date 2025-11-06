import { Exchange, CloudRegion, LatencyData } from '@/types';

/**
 * Fetch real-time latency data from Cloudflare Radar API
 * Cloudflare Radar provides network quality and latency insights
 */
export async function fetchLatencyFromCloudflareRadar(
  from: Exchange | CloudRegion,
  to: Exchange | CloudRegion
): Promise<LatencyData | null> {
  try {
    // Call our Next.js API route which handles Cloudflare Radar integration
    const response = await fetch('/api/latency', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: {
          latitude: from.latitude,
          longitude: from.longitude,
          country: from.country,
        },
        to: {
          latitude: to.latitude,
          longitude: to.longitude,
          country: to.country,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch latency data');
    }

    const data = await response.json();
    
    return {
      from: from.id,
      to: to.id,
      latency: data.latency,
      timestamp: data.timestamp,
    };
  } catch (error) {
    console.error('Error fetching latency from Cloudflare Radar:', error);
    return null;
  }
}

/**
 * Fetch latency for multiple connections in parallel
 */
export async function fetchMultipleLatencies(
  connections: Array<{ from: Exchange | CloudRegion; to: Exchange | CloudRegion }>
): Promise<LatencyData[]> {
  const promises = connections.map(({ from, to }) =>
    fetchLatencyFromCloudflareRadar(from, to)
  );

  const results = await Promise.all(promises);
  
  // Filter out null results
  return results.filter((result): result is LatencyData => result !== null);
}

/**
 * Get country code from country name (helper function)
 */
export function getCountryCode(country: string): string {
  // Map country names to ISO codes if needed
  const countryMap: Record<string, string> = {
    'USA': 'US',
    'United States': 'US',
    'United Kingdom': 'GB',
    'UK': 'GB',
    'Singapore': 'SG',
    'Japan': 'JP',
    'Netherlands': 'NL',
    'Ireland': 'IE',
    'Germany': 'DE',
  };

  return countryMap[country] || country.substring(0, 2).toUpperCase();
}

