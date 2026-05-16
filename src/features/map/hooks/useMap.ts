import { useQuery } from "@tanstack/react-query";
import { getAutocompleteSuggestions } from "../services";
import { QUERY_KEYS } from "@/shared/constants";

export function useAutocomplete(text: string) {
  return useQuery({
    queryKey: QUERY_KEYS.MAP_AUTOCOMPLETE(text),
    queryFn: () => getAutocompleteSuggestions(text),
    enabled: text.length >= 2, // Only fetch if text length is at least 2
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
