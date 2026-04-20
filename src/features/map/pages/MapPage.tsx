import { useState } from "react";
import MapView from "../components/MapView";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Search, Navigation } from "lucide-react";
import { toast } from "sonner";

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [destinationCoords, setDestinationCoords] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);
  const [searchResults, setSearchResults] = useState<
    Array<{ name: string; lat: number; lng: number }>
  >([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      // Use VietMap Reverse Geocoding/Search API
      const apiKey = import.meta.env.VITE_VIETMAP_API_KEY;

      // Try using the correct VietMap API endpoint
      const response = await fetch(
        `https://maps.vietmap.vn/api/autocomplete?text=${encodeURIComponent(
          searchQuery,
        )}&apikey=${apiKey}`,
      );

      if (response.ok) {
        const data = await response.json();
        // VietMap returns data in 'predictions' field
        const results = (data.predictions ||
          data.suggestions ||
          data.results ||
          []) as Array<Record<string, unknown>>;

        const formatted = results.map((item) => {
          const geometry = item.geometry as Record<string, unknown>;
          const location = geometry?.location as Record<string, unknown>;

          return {
            name:
              (item.description as string) ||
              (item.main_text as string) ||
              (item.name as string) ||
              (item.place_name as string) ||
              "Địa chỉ",
            lat: (location?.lat as number) || (item.lat as number) || 0,
            lng: (location?.lng as number) || (item.lng as number) || 0,
          };
        });

        setSearchResults(formatted.slice(0, 5));
      } else {
        // If autocomplete fails, try alternative approach with GeoDecode API
        const geoResponse = await fetch(
          `https://maps.vietmap.vn/api/geode?address=${encodeURIComponent(
            searchQuery,
          )}&apikey=${apiKey}`,
        );

        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          const results = geoData.results || [];

          const formatted = results.map((item: Record<string, unknown>) => {
            const geometry = item.geometry as Record<string, unknown>;
            const location = geometry?.location as Record<string, unknown>;

            return {
              name: (item.formatted_address as string) || "Địa chỉ",
              lat: (location?.lat as number) || 0,
              lng: (location?.lng as number) || 0,
            };
          });

          setSearchResults(formatted.slice(0, 5));
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Không thể tìm kiếm địa chỉ. Vui lòng thử lại.");
    }
  };

  const handleSelectLocation = (location: (typeof searchResults)[0]) => {
    setDestinationCoords({
      lat: location.lat,
      lng: location.lng,
      name: location.name,
    });
    setSearchResults([]);
    setSearchQuery(location.name);
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bản đồ vị trí</h1>
        <p className="mt-2 text-muted-foreground">
          Hiển thị vị trí hiện tại của bạn trên bản đồ Việt Nam
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm địa chỉ</CardTitle>
          <CardDescription>
            Tìm kiếm địa chỉ và xem lộ trình từ vị trí hiện tại của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Nhập địa chỉ cần tìm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  className="pl-9"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
                className="gap-2"
              >
                <Search className="size-4" />
                Tìm
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="border rounded-md overflow-hidden">
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectLocation(result)}
                    className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground border-b last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Navigation className="size-4" />
                      <div>
                        <p className="font-medium">{result.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {result.lat.toFixed(4)}, {result.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Destination */}
            {destinationCoords && (
              <div className="p-3 bg-accent/10 rounded-md border border-accent">
                <p className="text-sm font-medium">📍 Địa chỉ đã chọn:</p>
                <p className="text-sm text-muted-foreground">
                  {destinationCoords.name}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle>Vị trí của bạn</CardTitle>
          <CardDescription>
            Bản đồ tự động cập nhật vị trí của bạn mỗi 5 giây
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MapView
            height="600px"
            zoom={16}
            allowMapControls={true}
            destinationCoords={destinationCoords}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn sử dụng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Điều kiện tiên quyết:</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Trình duyệt phải hỗ trợ Geolocation API</li>
              <li>Bạn cần cấp quyền truy cập vị trí cho ứng dụng</li>
              <li>Kết nối Internet ổn định</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Cách sử dụng:</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Bản đồ sẽ tự động lấy vị trí hiện tại của bạn</li>
              <li>
                Mọi khi phát hiện vị trí mới, bản đồ sẽ tự động cập nhật marker
              </li>
              <li>Sử dụng nút điều hướng ở góc phải để phóng to/thu nhỏ</li>
              <li>
                Sử dụng nút toàn màn hình để xem bản đồ ở chế độ toàn màn hình
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Ghi chú:</h3>
            <p className="text-muted-foreground">
              Độ chính xác của vị trí tùy thuộc vào thiết bị và điều kiện kết
              nối. Vị trí có thể chênh lệch từ vài mét đến vài chục mét.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
