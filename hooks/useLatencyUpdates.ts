'use client';

import { useEffect, useCallback, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { exchanges } from '@/data/exchanges';
import { cloudRegions } from '@/data/cloudRegions';
import { fetchLatencyFromCloudflareRadar } from '@/lib/cloudflareRadar';
import { generateLatencyData } from '@/lib/latencySimulator';
import { LatencyConnection } from '@/types';

export function useLatencyUpdates() {
  const { setLatencyConnections, showRealTime } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [useRealTimeData, setUseRealTimeData] = useState(true);

  const updateLatencyConnections = useCallback(async () => {
    if (!showRealTime) return;

    setIsLoading(true);
    const connections: LatencyConnection[] = [];
    
    try {
      // Generate connections between exchanges and regions
      // Connect each exchange to nearby cloud regions
      const connectionPromises: Promise<void>[] = [];

      exchanges.forEach((exchange) => {
        cloudRegions.forEach((region) => {
          // Only connect to regions in the same or nearby geographic areas
          const distance = Math.sqrt(
            Math.pow(exchange.latitude - region.latitude, 2) +
            Math.pow(exchange.longitude - region.longitude, 2)
          );
          
          if (distance < 20) { // Connect if within ~20 degrees (roughly same continent)
            const fetchLatency = async () => {
              let latencyData;
              
              if (useRealTimeData) {
                // Try to fetch from Cloudflare Radar API
                const radarData = await fetchLatencyFromCloudflareRadar(exchange, region);
                
                if (radarData) {
                  latencyData = radarData;
                } else {
                  // Fallback to simulated data if API fails
                  latencyData = generateLatencyData(exchange, region);
                }
              } else {
                // Use simulated data
                latencyData = generateLatencyData(exchange, region);
              }

              connections.push({
                from: exchange,
                to: region,
                latency: latencyData.latency,
                timestamp: latencyData.timestamp,
              });
            };
            
            connectionPromises.push(fetchLatency());
          }
        });
      });

      // Also connect some exchanges to each other
      for (let i = 0; i < exchanges.length; i++) {
        for (let j = i + 1; j < exchanges.length; j++) {
          const distance = Math.sqrt(
            Math.pow(exchanges[i].latitude - exchanges[j].latitude, 2) +
            Math.pow(exchanges[i].longitude - exchanges[j].longitude, 2)
          );
          
          if (distance < 30) { // Connect exchanges within ~30 degrees
            const fetchLatency = async () => {
              let latencyData;
              
              if (useRealTimeData) {
                const radarData = await fetchLatencyFromCloudflareRadar(exchanges[i], exchanges[j]);
                
                if (radarData) {
                  latencyData = radarData;
                } else {
                  latencyData = generateLatencyData(exchanges[i], exchanges[j]);
                }
              } else {
                latencyData = generateLatencyData(exchanges[i], exchanges[j]);
              }

              connections.push({
                from: exchanges[i],
                to: exchanges[j],
                latency: latencyData.latency,
                timestamp: latencyData.timestamp,
              });
            };
            
            connectionPromises.push(fetchLatency());
          }
        }
      }

      // Wait for all latency fetches to complete
      await Promise.all(connectionPromises);
      
      setLatencyConnections(connections);
    } catch (error) {
      console.error('Error updating latency connections:', error);
      // On error, fall back to simulated data
      const fallbackConnections: LatencyConnection[] = [];
      
      exchanges.forEach((exchange) => {
        cloudRegions.forEach((region) => {
          const distance = Math.sqrt(
            Math.pow(exchange.latitude - region.latitude, 2) +
            Math.pow(exchange.longitude - region.longitude, 2)
          );
          
          if (distance < 20) {
            const latencyData = generateLatencyData(exchange, region);
            fallbackConnections.push({
              from: exchange,
              to: region,
              latency: latencyData.latency,
              timestamp: latencyData.timestamp,
            });
          }
        });
      });

      setLatencyConnections(fallbackConnections);
    } finally {
      setIsLoading(false);
    }
  }, [showRealTime, setLatencyConnections, useRealTimeData]);

  useEffect(() => {
    updateLatencyConnections();
    
    // Update every 10 seconds to avoid rate limiting with Cloudflare Radar API
    const interval = setInterval(() => {
      updateLatencyConnections();
    }, 10000);

    return () => clearInterval(interval);
  }, [updateLatencyConnections]);

  return { isLoading, useRealTimeData, setUseRealTimeData };
}

