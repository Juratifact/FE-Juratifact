import { createBaseService } from "@/shared/services/BaseService";
import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type {
  IdentifyDocument,
  IdentifyDocumentData,
  IdentifyDocumentResponse,
  UpdateIdentifyDto,
} from "./types";
import type { AxiosProgressEvent } from "axios";

type IdentifyListApiWrapper = {
  items?: IdentifyDocumentData[];
  totalItems?: number;
  pageSize?: number;
  pageIndex?: number;
};

interface IdentifyFilterParams {
  pageIndex?: number;
  pageSize?: number;
  status?: number;
}

export const identifyService = createBaseService<
  IdentifyDocument,
  FormData,
  UpdateIdentifyDto,
  IdentifyFilterParams
>({
  endpoint: API_ENDPOINTS.IDENTIFY_DOCUMENT.BASE,
  getById: async (documentId) => {
    return (await apiClient.get(
      API_ENDPOINTS.IDENTIFY_DOCUMENT.GET_BY_ID(String(documentId)),
    )) as IdentifyDocument;
  },
  getAll: async (params) => {
    const response = await apiClient.get<IdentifyListApiWrapper>(
      API_ENDPOINTS.IDENTIFY_DOCUMENT.GET_ALL,
      {
        params: {
          pageIndex: params?.pageIndex ?? 1,
          pageSize: params?.pageSize ?? 10,
          status: params?.status,
        },
      },
    );

    const data = response as unknown as IdentifyListApiWrapper;
    const items = data.items ?? [];
    const totalItems = data.totalItems ?? items.length;
    const itemsPerPage = data.pageSize ?? params?.pageSize ?? 10;
    const currentPage = data.pageIndex ?? params?.pageIndex ?? 1;
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
    };
  },
});

export const submitIdentifyDocument = async (
  formData: FormData,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<IdentifyDocumentResponse> => {
  return (await apiClient.post(
    API_ENDPOINTS.IDENTIFY_DOCUMENT.SUBMIT,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    },
  )) as IdentifyDocumentResponse;
};

export const getMyIdentifyDocument =
  async (): Promise<IdentifyDocumentData> => {
    return (await apiClient.get(
      API_ENDPOINTS.IDENTIFY_DOCUMENT.GET_MY_DOCUMENT,
    )) as IdentifyDocumentData;
  };

export const reSubmitIdentifyDocument = async (
  data: UpdateIdentifyDto,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<IdentifyDocumentResponse> => {
  const formData = new FormData();
  formData.append("documentId", data.documentId);

  if (data.idCardFrontUrl instanceof File) {
    formData.append("idCardFrontUrl", data.idCardFrontUrl);
  }
  if (data.idCardBackUrl instanceof File) {
    formData.append("idCardBackUrl", data.idCardBackUrl);
  }
  if (data.selfieUrl instanceof File) {
    formData.append("selfieUrl", data.selfieUrl);
  }

  return (await apiClient.put(
    API_ENDPOINTS.IDENTIFY_DOCUMENT.RE_SUBMIT,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    },
  )) as IdentifyDocumentResponse;
};

export const approveIdentifyDocument = async (
  documentId: string,
): Promise<void> => {
  await apiClient.put(API_ENDPOINTS.IDENTIFY_DOCUMENT.APPROVE(documentId), {});
};

export const rejectIdentifyDocument = async (
  documentId: string,
  reason: string,
): Promise<void> => {
  await apiClient.put(
    API_ENDPOINTS.IDENTIFY_DOCUMENT.REJECT(documentId),
    {},
    {
      params: { reason },
    },
  );
};
