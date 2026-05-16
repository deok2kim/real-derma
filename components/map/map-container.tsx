'use client';

import { useEffect, useState, useRef } from 'react';
import { Map, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { useMapStore } from '@/store/map-store';
import { useFavoritesStore } from '@/store/favorites-store';
import type { Clinic, MapBounds } from '@/types';

// Red marker with heart (same shape as markerStar but red + heart)
const HEART_MARKER_SVG = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="35" viewBox="0 0 24 35">
  <path d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 23 12 23s12-15.8 12-23C24 5.4 18.6 0 12 0z" fill="#EF4444"/>
  <path d="M12 6.5c-.6-.7-1.5-1.2-2.5-1.2C7.6 5.3 6 6.9 6 8.8c0 2.2 2 4 5 6.7l1 .9 1-.9c3-2.7 5-4.5 5-6.7 0-1.9-1.6-3.5-3.5-3.5-1 0-1.9.5-2.5 1.2z" fill="white"/>
</svg>`)}`;

function MapInner() {
  const { center, zoom, clinics, selectedClinic, myLocation, setSelectedClinic, setBounds, setCenter, setZoom } = useMapStore();
  const isFavorite = useFavoritesStore((s) => s.isFavorite);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const clustererRef = useRef<kakao.maps.MarkerClusterer | null>(null);

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

  const handleMapCreate = (map: kakao.maps.Map) => {
    mapRef.current = map;
    clustererRef.current = new kakao.maps.MarkerClusterer({
      map,
      averageCenter: true,
      minLevel: 5,
      disableClickZoom: false,
      styles: [{
        width: '44px', height: '44px',
        background: 'rgba(59,130,246,0.85)',
        borderRadius: '50%',
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: '44px',
        fontSize: '14px',
        border: '2px solid white',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      }],
    });
  };

  // 클러스터러 마커 업데이트
  useEffect(() => {
    if (!clustererRef.current || !mapRef.current) return;
    const K = window.kakao.maps;

    const markers = clinics.map((clinic: Clinic) => {
      const isSelected = selectedClinic?.id === clinic.id;
      const saved = isFavorite(clinic.id);

      let imageSrc = '';
      let imageW = 24, imageH = 35;

      if (isSelected) {
        imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png';
        imageW = 33; imageH = 36;
      } else if (saved) {
        imageSrc = HEART_MARKER_SVG;
      } else if (clinic.is_real_derma) {
        imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
      }

      const markerImage = imageSrc
        ? new K.MarkerImage(imageSrc, new K.Size(imageW, imageH))
        : undefined;

      const marker = new K.Marker({
        position: new K.LatLng(clinic.latitude, clinic.longitude),
        title: clinic.name,
        zIndex: isSelected ? 10 : saved ? 5 : 1,
        ...(markerImage && { image: markerImage }),
      });
      K.event.addListener(marker, 'click', () => setSelectedClinic(clinic));
      return marker;
    });

    clustererRef.current.clear();
    clustererRef.current.addMarkers(markers);
  }, [clinics, selectedClinic, isFavorite, setSelectedClinic]);

  return (
    <Map
      center={{ lat: center.lat, lng: center.lng }}
      level={zoom}
      className="w-full h-full"
      onBoundsChanged={handleBoundsChanged}
      onCenterChanged={handleCenterChanged}
      onZoomChanged={handleZoomChanged}
      onCreate={handleMapCreate}
    >
      {myLocation && (
        <CustomOverlayMap position={myLocation} zIndex={20}>
          <div className="relative flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
            <div className="absolute w-8 h-8 bg-blue-500/20 rounded-full animate-ping" />
          </div>
        </CustomOverlayMap>
      )}
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
