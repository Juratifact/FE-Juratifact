export interface CreateDisputeDto {
  sellerOrderId: string;
  reason: string;
}

export interface DisputeItem {
  disputeId: string;
  orderId: string;
  sellerOrderId: string;
  productId?: string;
  buyerId: string;
  reason: string;
  status: number;
  resolution: number;
  adminNote: string | null;
  resolvedByAdminId: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface PaginatedDisputes {
  items: DisputeItem[];
  totalItems: number;
  pageSize: number;
  pageIndex: number;
}

