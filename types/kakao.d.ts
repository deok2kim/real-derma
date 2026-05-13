declare namespace kakao.maps {
  class Map {
    getBounds(): LatLngBounds;
    getCenter(): LatLng;
    getLevel(): number;
  }
  class LatLng {
    getLat(): number;
    getLng(): number;
  }
  class LatLngBounds {
    getSouthWest(): LatLng;
    getNorthEast(): LatLng;
  }
  function load(callback: () => void): void;
}

interface Window {
  kakao: typeof kakao;
}
