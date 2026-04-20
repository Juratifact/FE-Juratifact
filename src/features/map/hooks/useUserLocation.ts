import { useQuery } from "@tanstack/react-query";
import type { UserLocation } from "../types";
import { QUERY_KEYS } from "@/shared/constants";
import { getUserLocation } from "@/features/map/services";

export function useUserLocationQuery() {
  return useQuery<UserLocation>({
    queryKey: QUERY_KEYS.USER_LOCATION,
    queryFn: getUserLocation,
    refetchInterval: 5000,
    retry: 2,
    staleTime: 2000,
    gcTime: 10000,
  });
}
