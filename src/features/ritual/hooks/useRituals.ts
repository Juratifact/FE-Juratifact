import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import type {
  CreateRitualDto,
  RitualFilterParams,
  UpdateRitualDto,
} from "../types";
import { ritualCategoryService, ritualService } from "../services";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import { useMemo } from "react";

export function useRituals() {
  const [searchParams] = useSearchParams();
  const filter = useMemo<RitualFilterParams>(() => {
    //useMemo la 1 cai bo nho cache,luu may cai value lai, chi tinh toan lai khi dependency thay doi
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      search: searchParams.get("search") || undefined,
      difficultyLevel: searchParams.get("difficultyLevel") || undefined,
      ritualCategoryId: searchParams.get("ritualCategoryId") || undefined,
    };
  }, [searchParams]); //chi tinh lai khi URL params thay doi
  //useCallback la 1 cai bo nho cache, luu may cai function lai
  //thuong kh dung useEffect thi de bi bug, bi loop
  const query = useQuery({
    queryKey: [QUERY_KEYS.RITUALS, filter],
    //goi api vs filter hien tia
    queryFn: () => ritualService.getAll(filter),
    //giu data cu trong khi dang fetch moi -> UX muot hon
    placeholderData: (prev) => prev, //hien thi data cu trong khi dang fetch moi, tranh tinh trang loading
  });
  return {
    rituals: query.data?.data ?? [],
    pagination: query.data?.meta,
    isLoading: query.isLoading,
    error: query.error,
  };
}
export function useCreateRitual() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRitualDto) => ritualService.create(data),
    onSuccess: () => {
      toast.success("Tạo nghi thức thành công");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RITUALS });
      navigate("/admin/ritual");
    },
  });
}
export function useUpdateRitual() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRitualDto }) =>
      ritualService.update(id, data),
    onSuccess: (_data, variables) => {
      toast.success("Cập nhật nghi lễ thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RITUALS });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RITUAL_DETAIL(variables.id),
      });
      navigate("/admin/ritual");
    },
  });
}
export function useDeleteRitual() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ritualService.remove(id),
    onSuccess: () => {
      toast.success("Xóa nghi lễ thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RITUALS });
    },
  });
}
export function useRitualDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.RITUAL_DETAIL(id),
    queryFn: () => ritualService.getById(id),
    enabled: !!id,
  });
}
export function useRitualCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.RITUAL_CATEGORIES,
    queryFn: () => ritualCategoryService.getSelectOptions(),
    staleTime: 10 * 60 * 1000,
  });
}
