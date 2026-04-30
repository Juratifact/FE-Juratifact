import { createBaseService } from "@/shared/services/BaseService";
import type {
  CreateRitualDto,
  Ritual,
  RitualCategory,
  RitualFilterParams,
  UpdateRitualDto,
} from "./types";
import { API_ENDPOINTS } from "@/shared/constants";
import apiClient from "@/lib/axios";
import type { BaseFilterParams } from "@/shared/types";

export const ritualService = createBaseService<
  Ritual,
  CreateRitualDto,
  UpdateRitualDto,
  RitualFilterParams
>({
  endpoint: API_ENDPOINTS.RITUAL.BASE,
  remove: async (id) => {
    await apiClient.patch(`${API_ENDPOINTS.RITUAL.BASE}/${id}/soft-remove`);
  },
});
export const ritualCategoryService = createBaseService<
  RitualCategory,
  unknown,
  unknown,
  BaseFilterParams
>({
endpoint: API_ENDPOINTS.RITUAL_CATEGORY.BASE,

});
