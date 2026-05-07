import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import type {
  CreateReportDto,
  Report,
  ReportFilterParams,
  ReportListResponse,
  UpdateReportDto,
} from "../types";
import { reportService, approveReport, rejectReport } from "../services";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import { useMemo } from "react";

type ReportsCache = ReportListResponse | undefined;

const updateReportStatusInCache = (
  currentData: ReportsCache,
  reportId: string,
  status: number,
) => {
  if (!currentData?.data || !Array.isArray(currentData.data)) {
    return currentData;
  }

  return {
    ...currentData,
    data: currentData.data.map((report: Report) =>
      report.id === reportId ? { ...report, status } : report,
    ),
  };
};

export function useReports() {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();

  const filter = useMemo<ReportFilterParams>(() => {
    const params = new URLSearchParams(queryString);
    return {
      page: Number(params.get("page")) || 1,
      limit: Number(params.get("limit")) || 10,
      search: params.get("search") || undefined,
      // status removed: backend does not support filtering by status
    };
  }, [queryString]);

  const query = useQuery({
    queryKey: [QUERY_KEYS.REPORTS, filter],
    queryFn: () => reportService.getAll(filter),
    placeholderData: (prev) => prev,
  });

  return {
    reports: query.data?.data ?? [],
    pagination: query.data?.meta,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useCreateReport() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReportDto) => reportService.create(data),
    onSuccess: () => {
      toast.success("Báo cáo đã được tạo thành công");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REPORTS });
      navigate("/admin/reports");
    },
    onError: () => {
      toast.error("Không thể tạo báo cáo");
    },
  });
}

export function useUpdateReport() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReportDto }) =>
      reportService.update(id, data),
    onSuccess: (_data, variables) => {
      toast.success("Cập nhật báo cáo thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REPORTS });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REPORT_DETAIL(variables.id),
      });
      navigate("/admin/reports");
    },
    onError: () => {
      toast.error("Không thể cập nhật báo cáo");
    },
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reportService.remove(id),
    onSuccess: () => {
      toast.success("Xóa báo cáo thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REPORTS });
    },
    onError: () => {
      toast.error("Không thể xóa báo cáo");
    },
  });
}

export function useReportDetail(id: string) {
  const query = useQuery({
    queryKey: [QUERY_KEYS.REPORT_DETAIL(id)],
    queryFn: () => reportService.getById(id),
    enabled: !!id,
  });

  return {
    report: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useApproveReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportId: string) => approveReport(reportId),
    onSuccess: (_data, reportId) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.REPORTS },
        (currentData) =>
          updateReportStatusInCache(currentData as ReportsCache, reportId, 1),
      );
      toast.success("Duyệt báo cáo thành công!");
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.REPORTS],
        type: "active",
      });
    },
    onError: () => {
      toast.error("Không thể duyệt báo cáo");
    },
  });
}

export function useRejectReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportId: string) => rejectReport(reportId),
    onSuccess: (_data, reportId) => {
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.REPORTS },
        (currentData) =>
          updateReportStatusInCache(currentData as ReportsCache, reportId, 2),
      );
      toast.success("Từ chối báo cáo thành công!");
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.REPORTS],
        type: "active",
      });
    },
    onError: () => {
      toast.error("Không thể từ chối báo cáo");
    },
  });
}

export function useCreateProductReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReportDto) => reportService.create(data),
    onSuccess: () => {
      toast.success("Đã gửi báo cáo sản phẩm");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REPORTS });
    },
    onError: () => {
      toast.error("Không thể gửi báo cáo");
    },
  });
}
