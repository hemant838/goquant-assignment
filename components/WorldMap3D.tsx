'use client';

import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sphere, Stars } from '@react-three/drei';
import { useAppStore } from '@/store/useAppStore';
import { Exchange, CloudRegion } from '@/types';
import { exchanges } from '@/data/exchanges';
import { cloudRegions } from '@/data/cloudRegions';
import * as THREE from 'three';

// Convert lat/lon to 3D coordinates on a sphere
function latLonToVector3(lat: number, lon: number, radius: number = 2) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function Globe() {
  // Load Earth texture - using a reliable Earth texture URL
  // Using a CDN-hosted Earth texture that's commonly available
  const earthTexture = useLoader(
    THREE.TextureLoader,
    'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'
  );
  
  // Load normal map for terrain detail
  const earthNormalMap = useLoader(
    THREE.TextureLoader,
    'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg'
  );
  
  // Load specular map for water/land distinction
  const earthSpecularMap = useLoader(
    THREE.TextureLoader,
    'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg'
  );

  return (
    <>
      <Sphere args={[2, 64, 64]} rotation={[0, 0, 0]}>
        <meshPhongMaterial
          map={earthTexture}
          normalMap={earthNormalMap}
          specularMap={earthSpecularMap}
          shininess={10}
          specular={new THREE.Color(0.3, 0.3, 0.3)}
        />
      </Sphere>
      {/* Add subtle atmosphere glow */}
      <Sphere args={[2.02, 32, 32]} rotation={[0, 0, 0]}>
        <meshBasicMaterial
          color={0x87ceeb}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>
    </>
  );
}

interface ExchangeMarkerProps {
  exchange: Exchange;
  onHover?: (exchange: Exchange | null) => void;
  onClick?: (exchange: Exchange) => void;
}

function ExchangeMarker({ exchange, onHover, onClick }: ExchangeMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const position = latLonToVector3(exchange.latitude, exchange.longitude, 2.05);
  
  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'aws': return '#facc15'; // Yellow
      case 'gcp': return '#ef4444'; // Red
      case 'azure': return '#3b82f6'; // Blue
      default: return '#ffffff';
    }
  };

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => onHover?.(exchange)}
        onPointerLeave={() => onHover?.(null)}
        onClick={() => onClick?.(exchange)}
      >
        <coneGeometry args={[0.05, 0.15, 8]} />
        <meshStandardMaterial color={getProviderColor(exchange.cloudProvider)} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color={getProviderColor(exchange.cloudProvider)} emissive={getProviderColor(exchange.cloudProvider)} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

interface RegionMarkerProps {
  region: CloudRegion;
  onHover?: (region: CloudRegion | null) => void;
}

function RegionMarker({ region, onHover }: RegionMarkerProps) {
  const position = latLonToVector3(region.latitude, region.longitude, 2.02);
  
  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'aws': return '#facc15'; // Yellow
      case 'gcp': return '#ef4444'; // Red
      case 'azure': return '#3b82f6'; // Blue
      default: return '#ffffff';
    }
  };

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh
        onPointerEnter={() => onHover?.(region)}
        onPointerLeave={() => onHover?.(null)}
      >
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshStandardMaterial
          color={getProviderColor(region.provider)}
          opacity={0.6}
          transparent
        />
      </mesh>
    </group>
  );
}

interface LatencyConnectionProps {
  from: Exchange | CloudRegion;
  to: Exchange | CloudRegion;
  latency: number;
  animated?: boolean;
}

function LatencyConnection({ from, to, latency, animated = true }: LatencyConnectionProps) {
  const getLatencyColor = (latency: number) => {
    if (latency < 50) return '#10b981';
    if (latency < 100) return '#f59e0b';
    return '#ef4444';
  };

  const points = useMemo(() => {
    const fromPos = latLonToVector3(from.latitude, from.longitude, 2.05);
    const toPos = latLonToVector3(to.latitude, to.longitude, 2.05);
    return [fromPos, toPos];
  }, [from.latitude, from.longitude, to.latitude, to.longitude]);
  
  const color = getLatencyColor(latency);
  const lineRef = useRef<THREE.Line>(null);

  useFrame((state) => {
    if (animated && lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      if (material) {
        const opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
        material.opacity = opacity;
      }
    }
  });

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [points]);

  const line = useMemo(() => {
    return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 }));
  }, [geometry, color]);

  return <primitive ref={lineRef} object={line} />;
}

interface WorldMap3DProps {
  onExchangeClick?: (exchange: Exchange) => void;
}

export default function WorldMap3D({ onExchangeClick }: WorldMap3DProps) {
  const { 
    selectedCloudProvider, 
    showRegions, 
    showRealTime,
    latencyConnections,
    searchQuery 
  } = useAppStore();

  const [hoveredItem, setHoveredItem] = useState<Exchange | CloudRegion | null>(null);

  const filteredExchanges = exchanges.filter(exchange => {
    if (selectedCloudProvider !== 'all' && exchange.cloudProvider !== selectedCloudProvider) {
      return false;
    }
    if (searchQuery && !exchange.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const filteredRegions = cloudRegions.filter(region => {
    if (selectedCloudProvider !== 'all' && region.provider !== selectedCloudProvider) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <directionalLight position={[-5, -3, -5]} intensity={0.3} />
        
        <Suspense fallback={null}>
          <Globe />
          <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Suspense>
        
        {filteredExchanges.map((exchange) => (
          <ExchangeMarker
            key={exchange.id}
            exchange={exchange}
            onHover={setHoveredItem}
            onClick={onExchangeClick}
          />
        ))}
        
        {showRegions && filteredRegions.map((region) => (
          <RegionMarker
            key={region.id}
            region={region}
            onHover={setHoveredItem}
          />
        ))}
        
        {showRealTime && latencyConnections.map((conn, idx) => (
          <LatencyConnection
            key={`${conn.from.id}-${conn.to.id}-${idx}`}
            from={conn.from}
            to={conn.to}
            latency={conn.latency}
          />
        ))}
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
        />
      </Canvas>
      
      {hoveredItem && (
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-10">
          <h3 className="font-bold text-lg">
            {hoveredItem.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {hoveredItem.country}
          </p>
          {'cloudProvider' in hoveredItem && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Provider: {hoveredItem.cloudProvider.toUpperCase()}
            </p>
          )}
          {'provider' in hoveredItem && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Provider: {hoveredItem.provider.toUpperCase()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

