import type { BaseFilterParams, PaginatedResponse } from "@/shared/types";
import type { UserProfileFormData } from "./schema";

export interface UserProfile {
  id: string;
  email?: string;
  fullName?: string;
  userName?: string;
  phoneNumber?: string;
  address?: string;
  profilePicture?: string;
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
  userName?: string;
  profilePicture?: File | null;
}

export interface UserFormProps {
  defaultValues?: Partial<UserProfileFormData>;
  currentPicture?: string;
  onSubmit: (data: UserProfileFormData) => void;
  isPending?: boolean;
  submitLabel?: string;
}
