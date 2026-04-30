import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Flame, BookOpen } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { useRitualDetail } from "../hooks/useRituals";

const difficultyVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  dễ: "secondary",
  "trung bình": "outline",
  khó: "default",
  "rất khó": "destructive",
};

/**
 * Trang chi tiết 1 nghi lễ – hiển thị đầy đủ thông tin, lễ vật, bài cúng.
 */
export function RitualDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: ritual, isLoading, isError } = useRitualDetail(id!);

  if (isLoading) {
    return <LoadingSpinner className="py-20" size="lg" />;
  }

  if (isError || !ritual) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg text-muted-foreground">
          Không tìm thấy nghi lễ này.
        </p>
        <Button variant="link" asChild className="mt-4">
          <Link to="/ritual">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Back link */}
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/ritual">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-3">
          <h1 className="text-3xl font-bold">{ritual.name}</h1>
          {ritual.isHot && (
            <Badge variant="destructive" className="mt-1 gap-1">
              <Flame className="h-3 w-3" />
              Hot
            </Badge>
          )}
        </div>

        {/* Metadata */}
        <div className="mt-4 flex flex-wrap gap-3">
          <Badge
            variant={difficultyVariant[ritual.difficultyLevel] ?? "outline"}
          >
            {ritual.difficultyLevel}
          </Badge>

          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Âm lịch: {ritual.dateLunar}
          </span>

          {ritual.dateSolar && (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Dương lịch: {ritual.dateSolar}
            </span>
          )}

          {ritual.timeOfExecution && (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {ritual.timeOfExecution}
            </span>
          )}

          {ritual.ritualCategory && (
            <Badge variant="outline">{ritual.ritualCategory.name}</Badge>
          )}
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Mô tả */}
      {ritual.description && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">Mô tả</h2>
          <p className="text-muted-foreground leading-relaxed">
            {ritual.description}
          </p>
        </section>
      )}

      {/* Nội dung chi tiết */}
      {ritual.content && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Hướng dẫn chi tiết</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line text-sm leading-relaxed">
              {ritual.content}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lễ vật */}
      {ritual.ritualOfferings && ritual.ritualOfferings.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">Lễ vật cần chuẩn bị</h2>
          <div className="space-y-2">
            {ritual.ritualOfferings.map((offering) => (
              <Card key={offering.id}>
                <CardContent className="flex items-start gap-3 py-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <span className="font-medium">{offering.name}</span>
                    {offering.description && (
                      <p className="text-sm text-muted-foreground">
                        {offering.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Bài cúng */}
      {ritual.prayers && ritual.prayers.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
            <BookOpen className="h-5 w-5" />
            Bài cúng
          </h2>
          <div className="space-y-4">
            {ritual.prayers.map((prayer) => (
              <Card key={prayer.id}>
                <CardHeader>
                  <CardTitle className="text-base">{prayer.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
                    {prayer.content}
                  </div>
                  {prayer.note && (
                    <p className="text-xs italic text-muted-foreground">
                      Ghi chú: {prayer.note}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Tham khảo */}
      {ritual.reference && (
        <section className="mb-8">
          <Separator className="mb-6" />
          <h2 className="mb-2 text-lg font-semibold">Tài liệu tham khảo</h2>
          <p className="text-sm text-muted-foreground">{ritual.reference}</p>
        </section>
      )}
    </div>
  );
}
