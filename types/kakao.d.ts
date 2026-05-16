declare namespace kakao.maps {
  class Map {
    getBounds(): LatLngBounds;
    getCenter(): LatLng;
    getLevel(): number;
  }
  class LatLng {
    constructor(lat: number, lng: number);
    getLat(): number;
    getLng(): number;
  }
  class LatLngBounds {
    getSouthWest(): LatLng;
    getNorthEast(): LatLng;
  }
  class Size {
    constructor(width: number, height: number);
  }
  class MarkerImage {
    constructor(src: string, size: Size, options?: object);
  }
  interface MarkerOptions {
    position: LatLng;
    title?: string;
    zIndex?: number;
    image?: MarkerImage;
  }
  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
  }
  class MarkerClusterer {
    constructor(options: {
      map: Map;
      averageCenter?: boolean;
      minLevel?: number;
      disableClickZoom?: boolean;
      styles?: object[];
    });
    addMarkers(markers: Marker[]): void;
    clear(): void;
  }
  namespace event {
    function addListener(target: object, type: string, handler: () => void): void;
  }
  function load(callback: () => void): void;
}

interface Window {
  kakao: typeof kakao;
}
