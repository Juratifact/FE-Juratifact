export type UserLocation = {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
};

export type MapError = {
  code: number;
  message: string;
};

export type LocationTrackingOptions = {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watchPosition?: boolean;
};
