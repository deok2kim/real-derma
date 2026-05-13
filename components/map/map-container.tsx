'use client';

import { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useMapStore } from '@/store/map-store';
import type { Clinic, MapBounds } from '@/types';

function MapInner() {
  const { center, zoom, clinics, setSelectedClinic, setBounds, setCenter, setZoom } = useMapStore();

  const handleBoundsChanged = (map: kakao.maps.Map) => {
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    setBounds({
      south: sw.getLat(),
      west: sw.getLng(),
      north: ne.getLat(),
      east: ne.getLng(),
    } satisfies MapBounds);
  };

  const handleCenterChanged = (map: kakao.maps.Map) => {
    const c = map.getCenter();
    setCenter({ lat: c.getLat(), lng: c.getLng() });
  };

  const handleZoomChanged = (map: kakao.maps.Map) => {
    setZoom(map.getLevel());
  };

  return (
    <Map
      center={{ lat: center.lat, lng: center.lng }}
      level={zoom}
      className="w-full h-full"
      onBoundsChanged={handleBoundsChanged}
      onCenterChanged={handleCenterChanged}
      onZoomChanged={handleZoomChanged}
    >
      {clinics.map((clinic: Clinic) => (
        <MapMarker
          key={clinic.id}
          position={{ lat: clinic.latitude, lng: clinic.longitude }}
          image={
            clinic.is_real_derma
              ? {
                  src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                  size: { width: 24, height: 35 },
                }
              : undefined
          }
          title={clinic.name}
          onClick={() => setSelectedClinic(clinic)}
        />
      ))}
    </Map>
  );
}

export default function MapContainer() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If already loaded
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => setIsLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services,clusterer`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => setIsLoaded(true));
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup only if we added it
      const existing = document.querySelector(
        `script[src*="dapi.kakao.com"]`
      );
      // Leave the script tag; removing it causes issues with kakao SDK
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">지도 로딩중...</p>
        </div>
      </div>
    );
  }

  return <MapInner />;
}
