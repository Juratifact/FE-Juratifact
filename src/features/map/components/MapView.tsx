import { useRef, useEffect } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */
// Load vietmap dynamically on the client to avoid bundler/SSR resolve errors
// import will be performed inside useEffect
import { useUserLocationQuery } from "../hooks/useUserLocation";
import { toast } from "sonner";

interface MapViewProps {
  height?: string;
  zoom?: number;
  allowMapControls?: boolean;
  destinationCoords?: {
    lat: number;
    lng: number;
    name: string;
  } | null;
}

export default function MapView({
  height = "500px",
  zoom = 15,
  allowMapControls = true,
  destinationCoords = null,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any | null>(null);
  const markerRef = useRef<any | null>(null);
  const destMarkerRef = useRef<any | null>(null);
  const vietmapModuleRef = useRef<any | null>(null);

  const { data, error } = useUserLocationQuery();
  useEffect(() => {
    if (
      mapRef.current ||
      !mapContainer.current ||
      typeof window === "undefined"
    )
      return;

    let cancelled = false;
    (async () => {
      try {
        // load css + module only on client
        await import("@vietmap/vietmap-gl-js/dist/vietmap-gl.css");
        const mod = await import("@vietmap/vietmap-gl-js");
        const vietmapgl = (mod && (mod.default ?? mod)) as any;
        vietmapModuleRef.current = vietmapgl;

        if (cancelled) return;

        mapRef.current = new vietmapgl.Map({
          container: mapContainer.current,
          style: `https://maps.vietmap.vn/maps/styles/tm/style.json?apikey=${import.meta.env.VITE_VIETMAP_API_KEY}`,
          center: [106.66, 10.762],
          zoom,
        });

        if (allowMapControls) {
          const nav = new vietmapgl.NavigationControl();
          mapRef.current.addControl(nav, "top-right");

          const fullscreen = new vietmapgl.FullscreenControl();
          mapRef.current.addControl(fullscreen, "top-right");
        }
      } catch (err) {
        console.error("Failed to initialize map:", err);
        toast.error("Không thể khởi tạo bản đồ");
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [zoom, allowMapControls]);

  useEffect(() => {
    if (!data || !mapRef.current) return;

    const { lat, lng } = data;

    mapRef.current.setCenter([lng, lat]);

    const vm = vietmapModuleRef.current;

    if (!markerRef.current) {
      const el = document.createElement("div");
      el.className =
        "w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg";
      el.style.backgroundImage =
        "radial-gradient(circle, rgba(239,68,68,1) 0%, rgba(239,68,68,0.7) 70%)";

      markerRef.current = new vm.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(
          new vm.Popup({ offset: 25 }).setHTML(
            `<div class="text-sm font-medium">
              <p>Vị trí của bạn</p>
              <p class="text-xs text-gray-500">Độ chính xác: ${data.accuracy?.toFixed(2)}m</p>
            </div>`,
          ),
        )
        .addTo(mapRef.current);
    } else {
      markerRef.current.setLngLat([lng, lat]);
    }
  }, [data]);

  useEffect(() => {
    if (!destinationCoords || !mapRef.current) return;

    if (destMarkerRef.current) {
      destMarkerRef.current.remove();
    }
    const destEl = document.createElement("div");
    destEl.className =
      "w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg";
    destEl.style.backgroundImage =
      "radial-gradient(circle, rgba(59,130,246,1) 0%, rgba(59,130,246,0.7) 70%)";
    const vm = vietmapModuleRef.current;

    destMarkerRef.current = new vm.Marker({ element: destEl })
      .setLngLat([destinationCoords.lng, destinationCoords.lat])
      .setPopup(
        new vm.Popup({ offset: 25 }).setHTML(
          `<div class="text-sm font-medium">
            <p>Điểm đến</p>
            <p class="text-xs text-gray-500">${destinationCoords.name}</p>
          </div>`,
        ),
      )
      .addTo(mapRef.current);

    // Fit bounds to show both current location and destination
    if (data) {
      const vm = vietmapModuleRef.current;
      const bounds = new vm.LngLatBounds();
      bounds.extend([data.lng, data.lat]);
      bounds.extend([destinationCoords.lng, destinationCoords.lat]);
      mapRef.current.fitBounds(bounds, { padding: 100 });
    }
  }, [destinationCoords, data]);

  // Handle location errors
  useEffect(() => {
    if (!error) return;

    let message = "Không thể lấy vị trí của bạn";

    if ("code" in error) {
      const code = (error as Record<string, unknown>).code as number;

      if (code === 1) message = "Bạn đã từ chối cấp quyền truy cập vị trí";
      else if (code === 2) message = "Không thể xác định vị trí của bạn";
      else if (code === 3) message = "Yêu cầu vị trí đã hết thời gian";
    }

    toast.error(message);
  }, [error]);

  return (
    <div
      ref={mapContainer}
      style={{
        height,
        borderRadius: "0.5rem",
        overflow: "hidden",
      }}
      className="border border-border shadow-sm"
    />
  );
}
