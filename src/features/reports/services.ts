import { createBaseService } from "@/shared/services/BaseService";
import type {
  CreateReportDto,
  Report,
  ReportFilterParams,
  UpdateReportDto,
  ReportListResponse,
} from "./types";
import { API_ENDPOINTS } from "@/shared/constants";
import apiClient from "@/lib/axios";

type ReportListApiWrapper = {
  items?: Report[];
  data?: Report[];
  totalItems?: number;
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
  pageIndex?: number;
  itemsPerPage?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  meta?: {
    totalItems?: number;
    totalCount?: number;
    totalPages?: number;
    currentPage?: number;
    pageIndex?: number;
    pageSize?: number;
    itemsPerPage?: number;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
  };
};

export const reportService = createBaseService<
  Report,
  CreateReportDto,
  UpdateReportDto,
  ReportFilterParams
>({
  endpoint: API_ENDPOINTS.REPORT.BASE,
  create: async (data) => {
    const productId = data.productId ?? data.reportedProductId;

    return (await apiClient.post(API_ENDPOINTS.REPORT.CREATE_REPORT, {
      id: data.id,
      reason: data.reason,
      description: data.description,
      productId,
    })) as Report;
  },
  getAll: async (params) => {
    const response = await apiClient.get<ReportListApiWrapper>(
      API_ENDPOINTS.REPORT.GET_REPORT,
      {
        params: {
          searchTerm: params?.search ?? "",
          pageSize: params?.limit ?? 10,
          pageIndex: params?.page ?? 1,
          status: params?.status,
        },
      },
    );

    const data = response as unknown as ReportListApiWrapper;
    const items = data.items ?? data.data ?? [];
    const currentPage =
      data.meta?.currentPage ??
      data.meta?.pageIndex ??
      data.currentPage ??
      data.pageIndex ??
      params?.page ??
      1;
    const itemsPerPage =
      data.meta?.itemsPerPage ??
      data.meta?.pageSize ??
      data.itemsPerPage ??
      data.pageSize ??
      params?.limit ??
      10;
    const totalItems =
      data.meta?.totalItems ??
      data.meta?.totalCount ??
      data.totalItems ??
      data.totalCount;
    const fallbackTotalItems = (currentPage - 1) * itemsPerPage + items.length;
    const looksLikeLastPage = items.length < itemsPerPage;
    const inferredHasNextPage =
      data.meta?.hasNextPage ??
      data.hasNextPage ??
      (!looksLikeLastPage && items.length === itemsPerPage);
    const totalPages =
      data.meta?.totalPages ??
      data.totalPages ??
      (typeof totalItems === "number" && itemsPerPage > 0
        ? Math.max(
            Math.ceil(Math.max(totalItems, fallbackTotalItems) / itemsPerPage),
            inferredHasNextPage ? currentPage + 1 : currentPage,
          )
        : currentPage + (inferredHasNextPage ? 1 : 0));
    const hasNextPage =
      inferredHasNextPage ??
      (typeof totalItems === "number"
        ? currentPage < totalPages
        : items.length >= itemsPerPage);
    const hasPreviousPage =
      data.meta?.hasPreviousPage ?? data.hasPreviousPage ?? currentPage > 1;

    return {
      data: items,
      meta: {
        totalItems:
          typeof totalItems === "number"
            ? Math.max(totalItems, fallbackTotalItems)
            : fallbackTotalItems,
        totalPages,
        itemsPerPage,
        currentPage,
        hasPreviousPage,
        hasNextPage,
      },
    } satisfies ReportListResponse;
  },
  getById: async (id) => {
    return (await apiClient.get(
      API_ENDPOINTS.REPORT.GET_BY_ID(String(id)),
    )) as Report;
  },
});

// ─── Additional API calls for report actions ─────────────
export const approveReport = async (reportId: string): Promise<void> => {
  await apiClient.put(API_ENDPOINTS.REPORT.APPROVE(reportId), {});
};

export const rejectReport = async (reportId: string): Promise<void> => {
  await apiClient.put(API_ENDPOINTS.REPORT.REJECT(reportId), {});
};
