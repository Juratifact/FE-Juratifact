

export const TransactionType = {
  ORDER_PAYMENT: 0,
  SERVICE_FEE: 1,
  SELLER_SETTLEMENT: 2,
  COMMISSION_DEDUCTION: 3,
  REFUND: 4,
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export const TransactionStatus = {
  PENDING: 0,
  SUCCESS: 1,
  FAILED: 2,
  EXPIRED: 3,
  REFUNDED: 4,
} as const;

export type TransactionStatus = typeof TransactionStatus[keyof typeof TransactionStatus];

export interface Transaction {
  id: string;
  sepayId: string | null;
  amount: number;
  externalTransactionId: string | null;
  description: string | null;
  referenceCode: string;
  feeAmount: number | null;
  transactionType: TransactionType;
  status: TransactionStatus;
  createdAt: string;
}

export interface TransactionFilterParams {
  pageIndex?: number;
  pageSize?: number;
  transactionType?: number;
  status?: number;
}

export interface TransactionListResponse {
  items: Transaction[];
  totalItems: number;
  pageSize: number;
  pageIndex: number;
}

export interface TransactionApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[] | null;
  traceId: string | null;
  timeStampUtc: string;
}
