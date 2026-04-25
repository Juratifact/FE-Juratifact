import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { RitualForm } from "../components/RitualForm";
import { useRitualDetail } from "../hooks/useRituals";
import { useUpdateRitual } from "../hooks/useRituals";
import type { RitualFormData } from "../schema";

/**
 * Trang sửa nghi lễ (Admin) – fetch data hiện có rồi prefill vào form.
 */
export default function ManageRitualEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: ritual, isLoading } = useRitualDetail(id!);
  const { mutate: updateRitual, isPending } = useUpdateRitual();

  const handleSubmit = (data: RitualFormData) => {
    updateRitual({
      id: id!,
      data: {
        ...data,
        ritualCategoryId: data.ritualCategoryId || undefined,
      },
    });
  };

  if (isLoading) {
    return <LoadingSpinner className="py-20" size="lg" />;
  }

  if (!ritual) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Không tìm thấy nghi lễ.</p>
        <Button variant="link" asChild className="mt-2">
          <Link to="/admin/ritual">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/ritual">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Sửa nghi lễ</h2>

      <RitualForm
        defaultValues={{
          name: ritual.name,
          dateLunar: ritual.dateLunar,
          dateSolar: ritual.dateSolar ?? "",
          timeOfExecution: ritual.timeOfExecution ?? "",
          difficultyLevel: ritual.difficultyLevel,
          description: ritual.description ?? "",
          content: ritual.content ?? "",
          reference: ritual.reference ?? "",
          isHot: ritual.isHot,
          ritualCategoryId: ritual.ritualCategoryId ?? "",
        }}
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Cập nhật"
      />
    </div>
  );
}
