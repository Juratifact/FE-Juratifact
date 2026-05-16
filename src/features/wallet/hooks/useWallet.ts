import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import { walletService } from "../services";

export function useWallet() {
  return useQuery({
    queryKey: QUERY_KEYS.WALLET,
    queryFn: () => walletService.getMyWallet(),
  });
}
