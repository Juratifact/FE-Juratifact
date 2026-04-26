import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type {
  UserFilterParams,
  UserListResponse,
  UserProfile,
  UpdateUserProfileDto,
} from "./types";

type UserApiItem = Partial<UserProfile> & {
  userId?: string;
  profilePictureUrl?: string;
  [key: string]: unknown;
};

const pickString = (
  item: UserApiItem,
  ...keys: string[]
): string | undefined => {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return undefined;
};

const normalizeUser = (item: UserApiItem): UserProfile => ({
  id:
    pickString(item, "id", "userId", "UserId", "userID") ?? crypto.randomUUID(),
  email: pickString(item, "email", "Email"),
  fullName: pickString(item, "fullName", "FullName"),
  userName: pickString(item, "userName", "UserName"),
  phoneNumber: pickString(item, "phoneNumber", "PhoneNumber"),
  address: pickString(item, "address", "Address"),
  profilePicture: pickString(
    item,
    "profilePicture",
    "ProfilePicture",
    "profilePictureUrl",
  ),
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

    const users = (raw.items ?? raw.data ?? []).map(normalizeUser);

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

    const totalPages =
      raw.meta?.totalPages ??
      raw.totalPages ??
      (typeof totalItems === "number" && itemsPerPage > 0
        ? Math.max(1, Math.ceil(totalItems / itemsPerPage))
        : currentPage + (users.length >= itemsPerPage ? 1 : 0));

    const hasNextPage =
      raw.meta?.hasNextPage ??
      raw.hasNextPage ??
      (typeof totalItems === "number"
        ? currentPage < totalPages
        : users.length >= itemsPerPage);

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
    const raw = (await apiClient.get(API_ENDPOINTS.USER.GET_BY_NAME, {
      params: { userName },
    })) as UserApiItem | UserApiItem[] | { data?: UserApiItem[] } | null;

    if (!raw) return [];

    if (Array.isArray(raw)) {
      return raw.map(normalizeUser);
    }

    if (
      typeof raw === "object" &&
      raw !== null &&
      "data" in raw &&
      Array.isArray(raw.data)
    ) {
      return raw.data.map(normalizeUser);
    }

    return [normalizeUser(raw as UserApiItem)];
  },

  async getMyProfile(userId: string): Promise<UserProfile> {
    const raw = (await apiClient.get(API_ENDPOINTS.USER.MY_PROFILE, {
      params: { userId },
    })) as UserApiItem;

    return normalizeUser(raw);
  },

  async updateProfile(
    id: string,
    data: UpdateUserProfileDto,
  ): Promise<UserProfile> {
    const formData = buildProfileFormData(data);

    const updated = (await apiClient.put(
      `${API_ENDPOINTS.USER.PROFILE}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    )) as UserApiItem;

    return normalizeUser(updated);
  },
};
