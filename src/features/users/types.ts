import type { BaseFilterParams, PaginatedResponse } from "@/shared/types";
import type { UserProfileFormData } from "./schema";

export interface UserProfile {
  id: string;
  email?: string;
  fullName?: string;
  userName?: string;
  phoneNumber?: string;
  address?: string;
  vietMapRefId?: string;
  vietMapDisplay?: string;
  latitude?: number;
  longitude?: number;
  trustScore?: number;
  profilePicture?: string;
  isVerify?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserFilterParams extends BaseFilterParams {
  searchTerm?: string;
}

export type UserListResponse = PaginatedResponse<UserProfile>;

export interface UpdateUserProfileDto {
  fullName?: string;
  password?: string;
  phoneNumber?: string;
  address?: string;
  vietMapRefId?: string;
  vietMapDisplay?: string;
  userName?: string;
  profilePicture?: File | null;
}

export interface CreateShipperDto {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
}

export interface UserFormProps {
  defaultValues?: Partial<UserProfileFormData>;
  currentPicture?: string;
  onSubmit: (data: UserProfileFormData) => void;
  isPending?: boolean;
  submitLabel?: string;
}
