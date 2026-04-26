import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { UserCard } from "../components/UserCard";
import { UserForm } from "../components/UserForm";
import { useMyProfile, useUpdateProfile } from "../hooks/useUsers";
import type { UserProfileFormData } from "../schema";

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const userIdFromQuery = searchParams.get("userId") ?? undefined;

  const { data: profile, isLoading, isError } = useMyProfile(userIdFromQuery);
  const updateMutation = useUpdateProfile();

  const defaultValues = useMemo(() => {
    if (!profile) return undefined;

    return {
      fullName: profile.fullName ?? "",
      userName: profile.userName ?? "",
      phoneNumber: profile.phoneNumber ?? "",
      address: profile.address ?? "",
      password: "",
    };
  }, [profile]);

  const handleSubmit = (data: UserProfileFormData) => {
    if (!profile?.id) return;

    updateMutation.mutate({
      id: profile.id,
      data: {
        fullName: data.fullName || undefined,
        userName: data.userName || undefined,
        phoneNumber: data.phoneNumber || undefined,
        address: data.address || undefined,
        password: data.password || undefined,
        profilePicture: data.profilePicture?.[0] ?? null,
      },
    });
  };

  if (isLoading) {
    return <LoadingSpinner className="py-20" size="lg" />;
  }

  if (isError || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Không tải được hồ sơ"
          description="Vui lòng thử lại sau hoặc đăng nhập lại."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto grid gap-6 px-4 py-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <UserCard user={profile} />
      </div>

      <div className="lg:col-span-2">
        <UserForm
          defaultValues={defaultValues}
          currentPicture={profile.profilePicture}
          onSubmit={handleSubmit}
          isPending={updateMutation.isPending}
          submitLabel="Cập nhật hồ sơ"
        />
      </div>
    </div>
  );
}
