import { NextRequest, NextResponse } from 'next/server';

interface LatencyRequest {
  from: {
    latitude: number;
    longitude: number;
    country: string;
  };
  to: {
    latitude: number;
    longitude: number;
    country: string;
  };
}



function calculateLatencyFromDistance(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number }
): number {
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
  
  // Add some variation (±15%)
  const variation = baseLatency * 0.15 * (Math.random() * 2 - 1);
  
  return Math.max(5, Math.round(baseLatency + variation));
}


async function fetchCloudflareRadarLatency(
  fromCountry: string,
  _toCountry: string
): Promise<number | null> {
  try {
    // Cloudflare Radar API base URL
    const baseUrl = 'https://api.cloudflare.com/client/v4/radar';
    
    // Get country code (simplified - you may need a country code mapping)
    const getCountryCode = (country: string): string => {
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
    };

    const fromCode = getCountryCode(fromCountry);

    // Try to fetch speed test summary which includes latency data
    // Endpoint: /radar/quality/speed/summary
    const summaryUrl = `${baseUrl}/quality/speed/summary?location=${fromCode}`;
    
    const response = await fetch(summaryUrl, {
      headers: {
        'Content-Type': 'application/json',
        // Add API key if you have one (optional for some endpoints)
        ...(process.env.CLOUDFLARE_API_KEY && {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_KEY}`
        }),
      },
      // Cache for 60 seconds to avoid rate limits
      next: { revalidate: 60 },
    });

    if (response.ok) {
      const data = await response.json();
      
      // Extract latency from the response
      // The actual response structure may vary - adjust based on API documentation
      if (data.result && data.result.latency) {
        // If latency is an object with percentiles, use median or p50
        const latency = typeof data.result.latency === 'object' 
          ? data.result.latency.p50 || data.result.latency.median || data.result.latency.mean
          : data.result.latency;
        
        if (latency && typeof latency === 'number') {
          return Math.round(latency);
        }
      }
      
      // Try alternative endpoint: IQI time series
      const iqiUrl = `${baseUrl}/quality/iqi/timeseries_groups?location=${fromCode}&metric=latency`;
      const iqiResponse = await fetch(iqiUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.CLOUDFLARE_API_KEY && {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_KEY}`
          }),
        },
        next: { revalidate: 60 },
      });

      if (iqiResponse.ok) {
        const iqiData = await iqiResponse.json();
        // Extract latest latency value from time series
        if (iqiData.result && iqiData.result.timeseries && iqiData.result.timeseries.length > 0) {
          const latest = iqiData.result.timeseries[iqiData.result.timeseries.length - 1];
          if (latest && latest.value) {
            return Math.round(latest.value);
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching from Cloudflare Radar:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: LatencyRequest = await request.json();
    const { from, to } = body;

    // Try to fetch from Cloudflare Radar API
    let latency: number | null = null;
    
    // Attempt to get real latency data from Cloudflare Radar
    if (from.country && to.country) {
      latency = await fetchCloudflareRadarLatency(from.country, to.country);
    }

    // Fallback to distance-based calculation if API fails
    if (latency === null) {
      latency = calculateLatencyFromDistance(from, to);
    }

    return NextResponse.json({
      latency,
      timestamp: Date.now(),
      source: latency ? 'cloudflare-radar' : 'calculated',
    });
  } catch (error) {
    console.error('Error in latency API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latency data' },
      { status: 500 }
    );
  }
}

