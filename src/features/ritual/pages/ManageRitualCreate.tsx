import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { RitualForm } from "../components/RitualForm";
import { useCreateRitual } from "../hooks/useRituals";
import type { RitualFormData } from "../schema";

/**
 * Trang tạo nghi lễ mới (Admin).
 */
export default function ManageRitualCreate() {
  const { mutate: createRitual, isPending } = useCreateRitual();

  const handleSubmit = (data: RitualFormData) => {
    createRitual({
      ...data,
      ritualCategoryId: data.ritualCategoryId || undefined,
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/ritual">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Tạo nghi lễ mới</h2>

      <RitualForm
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Tạo nghi lễ"
      />
    </div>
  );
}
