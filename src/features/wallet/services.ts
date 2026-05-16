import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type { Wallet } from "./types";

export const walletService = {
  async getMyWallet(): Promise<Wallet> {
    const response = await apiClient.get<Wallet>(API_ENDPOINTS.WALLET.MY_WALLET);
    return response as unknown as Wallet;
  },
};
