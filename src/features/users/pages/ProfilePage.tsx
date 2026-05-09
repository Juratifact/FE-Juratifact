import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Button } from "@/shared/components/ui/button";
import { UserCard } from "../components/UserCard";
import { UserForm } from "../components/UserForm";
import { useMyProfile, useUpdateProfile } from "../hooks/useUsers";
import type { UserProfileFormData } from "../schema";

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const userIdFromQuery = searchParams.get("userId") ?? undefined;

  const { data: profile, isLoading, isError } = useMyProfile(userIdFromQuery);
  const updateMutation = useUpdateProfile();

  const handleSubmit = (data: UserProfileFormData) => {
    if (!profile?.id) return;

    updateMutation.mutate(
      {
        id: profile.id,
        data: {
          fullName: data.fullName || undefined,
          userName: data.userName || undefined,
          phoneNumber: data.phoneNumber || undefined,
          address: data.address || undefined,
          password: data.password || undefined,
          profilePicture: data.profilePicture?.[0] ?? null,
        },
      },
      {
        onSuccess: () => setIsEditing(false),
      },
    );
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center">
        <div className="w-full max-w-2xl space-y-4">
          <UserCard user={profile} />
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                className="h-11 w-full text-base"
                onClick={() => setIsEditing(true)}
              >
                Update Profile
              </Button>
            ) : (
              <Button
                className="h-11 w-full text-base"
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={updateMutation.isPending}
              >
                Đóng form cập nhật
              </Button>
            )}
          </div>

          {isEditing && (
            <UserForm
              currentPicture={profile.profilePicture}
              onSubmit={handleSubmit}
              isPending={updateMutation.isPending}
              submitLabel="Cập nhật hồ sơ"
            />
          )}
        </div>
      </div>
    </div>
  );
}
