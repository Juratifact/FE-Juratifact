import { Link } from "react-router-dom";
import { Flame, Calendar } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import type { Ritual } from "../types";

interface RitualCardProps {
  ritual: Ritual;
}

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
 * Card hiển thị 1 ritual trong danh sách catalog.
 * Sử dụng shadcn Card + Badge.
 */
export function RitualCard({ ritual }: RitualCardProps) {
  return (
    <Link to={`/ritual/${ritual.id}`} className="group block">
      <Card className="h-full transition-all hover:shadow-md hover:border-primary/30">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {ritual.name}
            </CardTitle>
            {ritual.isHot && (
              <Badge variant="destructive" className="shrink-0 gap-1">
                <Flame className="h-3 w-3" />
                Hot
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Description */}
          {ritual.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {ritual.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={difficultyVariant[ritual.difficultyLevel] ?? "outline"}
            >
              {ritual.difficultyLevel}
            </Badge>

            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {ritual.dateLunar}
            </span>

            {ritual.ritualCategory && (
              <Badge variant="outline">{ritual.ritualCategory.name}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
