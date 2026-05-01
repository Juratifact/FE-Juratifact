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
  totalItems?: number;
  pageSize?: number;
  pageIndex?: number;
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
    const items = data.items ?? [];
    const totalItems = data.totalItems ?? items.length;
    const itemsPerPage = data.pageSize ?? params?.limit ?? 10;
    const currentPage = data.pageIndex ?? params?.page ?? 1;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    return {
      data: items,
      meta: {
        totalItems,
        totalPages,
        itemsPerPage,
        currentPage,
        hasPreviousPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
      },
    } satisfies ReportListResponse;
  },
});

// ─── Additional API calls for report actions ─────────────
export const approveReport = async (reportId: string): Promise<void> => {
  await apiClient.put(
    `${API_ENDPOINTS.REPORT.APPROVE}`,
    {},
    {
      params: { reportId },
    },
  );
};

export const rejectReport = async (reportId: string): Promise<void> => {
  await apiClient.put(
    `${API_ENDPOINTS.REPORT.REJECT}`,
    {},
    {
      params: { reportId },
    },
  );
};
