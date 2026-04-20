import type { UserLocation, LocationTrackingOptions } from "./types";

export function getUserLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Trình duyệt chưa hỗ trợ GPS"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        });
      },
      (err) => reject(err),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  });
}

export function watchUserLocation(
  onSuccess: (location: UserLocation) => void,
  onError: (error: GeolocationPositionError) => void,
  options?: LocationTrackingOptions,
): number {
  if (!navigator.geolocation) {
    onError(new GeolocationPositionError());
    return -1;
  }

  const watchOptions = {
    enableHighAccuracy: options?.enableHighAccuracy ?? true,
    timeout: options?.timeout ?? 10000,
    maximumAge: options?.maximumAge ?? 0,
  };

  return navigator.geolocation.watchPosition(
    (pos) => {
      onSuccess({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp,
      });
    },
    onError,
    watchOptions,
  );
}

export function clearLocationWatch(watchId: number): void {
  if (watchId > -1) {
    navigator.geolocation.clearWatch(watchId);
  }
}
