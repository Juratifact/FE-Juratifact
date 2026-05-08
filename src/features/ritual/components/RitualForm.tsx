import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ritualSchema, type RitualFormData } from "../schema";
import { useRitualCategories } from "../hooks/useRituals";
import { DIFFICULTY_LEVELS } from "@/shared/constants";

interface RitualFormProps {
  defaultValues?: Partial<RitualFormData>;
  onSubmit: (data: RitualFormData) => void;
  isPending?: boolean;
  submitLabel?: string;
}

/**
 * Form tạo/sửa ritual – sử dụng React Hook Form + Zod validation.
 * Dùng chung cho cả trang Create và Edit.
 */
export function RitualForm({
  defaultValues,
  onSubmit,
  isPending = false,
  submitLabel = "Lưu",
}: RitualFormProps) {
  const { data: categories } = useRitualCategories();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RitualFormData>({
    resolver: zodResolver(ritualSchema),
    defaultValues: {
      name: "",
      dateLunar: "",
      dateSolar: "",
      timeOfExecution: "",
      difficultyLevel: "dễ",
      description: "",
      content: "",
      reference: "",
      ritualCategoryId: "",
      ...defaultValues,
    },
  });

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Thông tin nghi lễ</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Tên nghi lễ */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên nghi lễ <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="VD: Cúng Giao thừa"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Row: Ngày âm lịch + Ngày dương lịch */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dateLunar">
                Ngày âm lịch <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dateLunar"
                placeholder="VD: 30 tháng Chạp"
                {...register("dateLunar")}
              />
              {errors.dateLunar && (
                <p className="text-sm text-destructive">
                  {errors.dateLunar.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateSolar">Ngày dương lịch</Label>
              <Input
                id="dateSolar"
                placeholder="VD: Tháng 1-2 dương lịch"
                {...register("dateSolar")}
              />
            </div>
          </div>

          {/* Row: Thời gian + Độ khó */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="timeOfExecution">Thời gian thực hiện</Label>
              <Input
                id="timeOfExecution"
                placeholder="VD: Tối 30 Tết"
                {...register("timeOfExecution")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficultyLevel">
                Độ khó <span className="text-destructive">*</span>
              </Label>
              <select
                id="difficultyLevel"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register("difficultyLevel")}
              >
                {DIFFICULTY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors.difficultyLevel && (
                <p className="text-sm text-destructive">
                  {errors.difficultyLevel.message}
                </p>
              )}
            </div>
          </div>

          {/* Danh mục */}
          <div className="space-y-2">
            <Label htmlFor="ritualCategoryId">Danh mục</Label>
            <select
              id="ritualCategoryId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("ritualCategoryId")}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả ngắn</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Mô tả tóm tắt về nghi lễ..."
              {...register("description")}
            />
          </div>

          {/* Nội dung chi tiết */}
          <div className="space-y-2">
            <Label htmlFor="content">Nội dung chi tiết</Label>
            <Textarea
              id="content"
              rows={6}
              placeholder="Hướng dẫn chi tiết các bước thực hiện nghi lễ..."
              {...register("content")}
            />
          </div>

          {/* Tham khảo */}
          <div className="space-y-2">
            <Label htmlFor="reference">Tài liệu tham khảo</Label>
            <Input
              id="reference"
              placeholder="Nguồn tham khảo..."
              {...register("reference")}
            />
          </div>

          {/* Nổi bật */}
          <div className="flex items-center gap-2">
            <input
              id="isHot"
              type="checkbox"
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              {...register("isHot")}
            />
            <Label htmlFor="isHot" className="cursor-pointer">
              Đánh dấu là nghi lễ nổi bật
            </Label>
          </div>
        </CardContent>

        <CardFooter className="justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
