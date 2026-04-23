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
      const apiKey = import.meta.env.VITE_VIETMAP_API_KEY;
      // Using VietMap API endpoint
      const response = await fetch(
        `https://maps.vietmap.vn/api/autocomplete?text=${encodeURIComponent(
          searchQuery,
        )}&apikey=${apiKey}`,
      );

      if (response.ok) {
        const data = await response.json();
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
        <h1 className="text-3xl font-bold tracking-tight">Map Location</h1>
        <p className="mt-2 text-muted-foreground">
          Show your current location on the Vietnam map
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Search Address</CardTitle>
          <CardDescription>
            Search for an address and view directions from your current location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter address to search..."
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
                Search
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
                <p className="text-sm font-medium">📍 Selected Address:</p>
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
          <CardTitle>Your Location</CardTitle>
          <CardDescription>
            The map automatically updates your location every 5 seconds
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
    </div>
  );
}
