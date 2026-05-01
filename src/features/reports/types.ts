import type {
  BaseFilterParams,
  PaginatedResponse,
  SelectOptions,
} from "@/shared/types";
import type { ReportFormData } from "./schema";

// ─── Status constants ────────────────────────────────────
export const REPORT_STATUS_MAP = {
  PROCESSING: 0,
  APPROVED: 1,
  REJECTED: 2,
  DISMISSED: 3,
} as const;

export const REPORT_STATUS_LABELS: Record<number, string> = {
  0: "Chờ xử lý",
  1: "Đã duyệt",
  2: "Bị từ chối",
  3: "Bị từ chối",
};

export const REPORT_STATUS_DISPLAY: Record<
  number,
  "pending" | "approved" | "rejected" | "dismissed"
> = {
  0: "pending",
  1: "approved",
  2: "rejected",
  3: "dismissed",
};

// ─── Report Entity ───────────────────────────────────────
export interface Report {
  id: string;
  reportId?: string;
  reason?: string;
  description?: string;
  status: number; // 0=Processing, 1=Approved, 2=Rejected, 3=Dismissed
  productId?: string;
  userId?: string;
  reportedProductId?: string;
  reportedProduct?: ReportedProduct;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReportedProduct {
  id: string;
  title: string;
  description?: string;
  price?: number;
  sellerId?: string;
}

// ─── Filter params ───────────────────────────────────────
export interface ReportFilterParams extends BaseFilterParams {
  status?: number | string; // Accept both numeric (0-3) and string values
}

// ─── Response types ──────────────────────────────────────
export type ReportListResponse = PaginatedResponse<Report>;

// ─── Create / Update DTOs ────────────────────────────────
export interface CreateReportDto {
  productId?: string;
  reportedProductId?: string;
  id?: string;
  reason: string;
  description?: string;
}

export type UpdateReportDto = Partial<CreateReportDto>;

// ─── Action DTOs ─────────────────────────────────────────
export interface ApproveReportDto {
  reportId: string;
}

export interface RejectReportDto {
  reportId: string;
}

// ─── Select option cho dropdown ──────────────────────────
export type ReportSelectOption = SelectOptions;

export interface ReportFormProps {
  defaultValues?: Partial<CreateReportDto>;
  onSubmit: (data: ReportFormData) => void;
  isPending?: boolean;
  submitLabel?: string;
}

// ─── Helper functions ────────────────────────────────────
export function getStatusLabel(status: number): string {
  return REPORT_STATUS_LABELS[status] || "Không xác định";
}

export function getStatusDisplay(
  status: number,
): "pending" | "approved" | "rejected" | "dismissed" {
  return REPORT_STATUS_DISPLAY[status] || "pending";
}
