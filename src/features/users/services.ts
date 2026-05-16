import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type {
  UserFilterParams,
  UserListResponse,
  UserProfile,
  UpdateUserProfileDto,
  CreateShipperDto,
} from "./types";

type UserApiItem = Partial<UserProfile> & {
  userId?: string;
  profilePictureUrl?: string;
  [key: string]: unknown;
};

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

const pickString = (
  item: UserApiItem,
  ...keys: string[]
): string | undefined => {
  for (const key of keys) {
    const value = item[key];
    if (
      typeof value === "string" &&
      value.length > 0 &&
      value !== EMPTY_GUID
    ) {
      return value;
    }
  }

  return undefined;
};

const normalizeUser = (
  item: UserApiItem,
  fallbackId?: string,
): UserProfile => ({
  id:
    pickString(item, "userId", "UserId", "userID", "id") ??
    fallbackId ??
    crypto.randomUUID(),
  email: pickString(item, "email", "Email"),
  fullName: pickString(item, "fullName", "FullName"),
  userName: pickString(item, "userName", "UserName"),
  phoneNumber: pickString(item, "phoneNumber", "PhoneNumber"),
  address: pickString(item, "address", "Address", "vietMapDisplay"),
  vietMapRefId: pickString(item, "vietMapRefId", "VietMapRefId"),
  vietMapDisplay: pickString(item, "vietMapDisplay"),
  latitude: Number(item.latitude ?? 0),
  longitude: Number(item.longitude ?? 0),
  trustScore: Number(item.trustScore ?? 0),
  profilePicture: pickString(
    item,
    "profilePicture",
    "ProfilePicture",
    "profilePictureUrl",
  ),
  isVerify: item.isVerify === true || item.IsVerify === true,
  createdAt: pickString(item, "createdAt", "CreatedAt"),
  updatedAt: pickString(item, "updatedAt", "UpdatedAt"),
});

const toOptional = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const buildProfileFormData = (data: UpdateUserProfileDto) => {
  const formData = new FormData();

  const fullName = toOptional(data.fullName);
  const password = toOptional(data.password);
  const phoneNumber = toOptional(data.phoneNumber);
  const address = toOptional(data.address);
  const userName = toOptional(data.userName);

  if (fullName) formData.append("FullName", fullName);
  if (password) formData.append("Password", password);
  if (phoneNumber) formData.append("PhoneNumber", phoneNumber);
  if (address) formData.append("Address", address);
  if (data.vietMapRefId) formData.append("VietMapRefId", data.vietMapRefId);
  if (userName) formData.append("UserName", userName);
  if (data.profilePicture) {
    formData.append("ProfilePicture", data.profilePicture);
  }

  return formData;
};

export const userService = {
  async getAll(params?: UserFilterParams): Promise<UserListResponse> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;

    const raw = (await apiClient.get(API_ENDPOINTS.USER.GET_ALL, {
      params: {
        searchTerm: params?.search ?? params?.searchTerm,
        pageIndex: page,
        pageSize: limit,
      },
    })) as {
      items?: UserApiItem[];
      data?: UserApiItem[];
      meta?: {
        totalItems?: number;
        totalCount?: number;
        totalPages?: number;
        currentPage?: number;
        pageIndex?: number;
        itemsPerPage?: number;
        pageSize?: number;
        hasPreviousPage?: boolean;
        hasNextPage?: boolean;
      };
      totalItems?: number;
      totalCount?: number;
      totalPages?: number;
      currentPage?: number;
      pageIndex?: number;
      itemsPerPage?: number;
      pageSize?: number;
      hasPreviousPage?: boolean;
      hasNextPage?: boolean;
    };

    const users = (raw.items ?? raw.data ?? []).map((item) =>
      normalizeUser(item),
    );

    const currentPage =
      raw.meta?.currentPage ??
      raw.meta?.pageIndex ??
      raw.currentPage ??
      raw.pageIndex ??
      page;

    const itemsPerPage =
      raw.meta?.itemsPerPage ??
      raw.meta?.pageSize ??
      raw.itemsPerPage ??
      raw.pageSize ??
      limit;

    const totalItems =
      raw.meta?.totalItems ??
      raw.meta?.totalCount ??
      raw.totalItems ??
      raw.totalCount;

    let totalPages =
      raw.meta?.totalPages ??
      raw.totalPages ??
      (typeof totalItems === "number" && itemsPerPage > 0
        ? Math.max(1, Math.ceil(totalItems / itemsPerPage))
        : currentPage);

    // Smart fallback: if the page is full, assume there might be more
    if (users.length >= itemsPerPage && totalPages <= currentPage) {
      totalPages = currentPage + 1;
    }
    
    // Ensure we can always see the pagination to go back if we are not on page 1
    totalPages = Math.max(totalPages, currentPage);

    const hasNextPage =
      raw.meta?.hasNextPage ??
      raw.hasNextPage ??
      currentPage < totalPages;

    const hasPreviousPage =
      raw.meta?.hasPreviousPage ?? raw.hasPreviousPage ?? currentPage > 1;

    return {
      data: users,
      meta: {
        totalItems:
          typeof totalItems === "number"
            ? totalItems
            : (currentPage - 1) * itemsPerPage + users.length,
        totalPages,
        itemsPerPage,
        currentPage,
        hasPreviousPage,
        hasNextPage,
      },
    };
  },

  async getUserByName(userName: string): Promise<UserProfile[]> {
    const raw = (await apiClient.get(
      API_ENDPOINTS.USER.GET_BY_USERNAME(userName),
    )) as UserApiItem | UserApiItem[] | { data?: UserApiItem[] } | null;

    if (!raw) return [];

    if (Array.isArray(raw)) {
      return raw.map((item) => normalizeUser(item));
    }

    if (
      typeof raw === "object" &&
      raw !== null &&
      "data" in raw &&
      Array.isArray(raw.data)
    ) {
      return raw.data.map((item) => normalizeUser(item));
    }

    return [normalizeUser(raw as UserApiItem)];
  },

  async getMyProfile(userId: string): Promise<UserProfile> {
    const response = (await apiClient.get(
      API_ENDPOINTS.USER.GET_BY_ID(userId),
    )) as any;

    const raw = response?.data ?? response;
    return normalizeUser(raw, userId);
  },

  async updateProfile(
    id: string,
    data: UpdateUserProfileDto,
  ): Promise<UserProfile> {
    const formData = buildProfileFormData(data);

    const updated = (await apiClient.put(
      API_ENDPOINTS.USER.UPDATE(id),
      formData,
    )) as UserApiItem | string | null;

    if (updated && typeof updated === "object" && !Array.isArray(updated)) {
      return normalizeUser(updated as UserApiItem, id);
    }

    return normalizeUser({ userId: id }, id);
  },

  async createShipper(data: CreateShipperDto): Promise<UserProfile> {
    const formData = new FormData();
    formData.append("Email", data.email);
    formData.append("FullName", data.fullName);
    formData.append("Password", data.password);
    formData.append("PhoneNumber", data.phoneNumber);

    const raw = (await apiClient.post(
      API_ENDPOINTS.USER.SHIPPERS,
      formData,
    )) as UserApiItem;
    return normalizeUser(raw);
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.USER.DELETE(id));
  },
};
