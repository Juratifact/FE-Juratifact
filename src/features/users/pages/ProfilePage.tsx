import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/features/auth/store";
import { UserCard } from "../components/UserCard";
import { UserForm } from "../components/UserForm";
import { useMyProfile, useUpdateProfile } from "../hooks/useUsers";
import type { UserProfileFormData } from "../schema";
import MyProductCatalog from "@/features/products/pages/MyProductCatalog";

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const userIdFromQuery = searchParams.get("userId") ?? undefined;
  const storedUserId = useAuthStore((state) => state.userId);

  const { data: profile, isLoading, isError } = useMyProfile(userIdFromQuery);
  const updateMutation = useUpdateProfile();
  const showMyProducts = !userIdFromQuery || storedUserId === profile?.id;

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
      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-4">
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
        </aside>

        <main className="min-w-0">
          {showMyProducts && <MyProductCatalog embedded />}
        </main>
      </div>
    </div>
  );
}
