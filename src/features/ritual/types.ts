import type {
  BaseFilterParams,
  PaginatedResponse,
  SelectOptions,
} from "@/shared/types";
import type { RitualFormData } from "./schema";

// ─── Ritual Entity ───────────────────────────────────────
export interface Ritual {
  id: string;
  name: string;
  timeOfExecution?: string;
  dateLunar: string;
  dateSolar?: string;
  difficultyLevel: "dễ" | "trung bình" | "khó" | "rất khó";
  description?: string;
  content?: string;
  reference?: string;
  isHot: boolean;
  ritualCategoryId?: string;
  ritualCategory?: RitualCategory;
  prayers?: Prayer[];
  ritualMedias?: RitualMedia[];
  ritualOfferings?: RitualOffering[];
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface RitualCategory {
  id: string;
  name: string;
}

export interface Prayer {
  id: string;
  name: string;
  content: string;
  note?: string;
  description?: string;
  ritualId: string;
}

export interface RitualMedia {
  id: string;
  type: "image" | "video" | "audio" | "document";
  url?: string;
  alt?: string;
  ritualId: string;
}

export interface RitualOffering {
  id: string;
  name: string;
  description?: string;
  ritualId: string;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
}

// ─── Filter params ───────────────────────────────────────
export interface RitualFilterParams extends BaseFilterParams {
  difficultyLevel?: string;
  isHot?: boolean;
  ritualCategoryId?: string;
}

// ─── Response types ──────────────────────────────────────
export type RitualListResponse = PaginatedResponse<Ritual>;

// ─── Create / Update DTOs ────────────────────────────────
export interface CreateRitualDto {
  name: string;
  dateLunar: string;
  dateSolar?: string;
  timeOfExecution?: string;
  difficultyLevel: string;
  description?: string;
  content?: string;
  reference?: string;
  isHot?: boolean;
  ritualCategoryId?: string;
}

export type UpdateRitualDto = Partial<CreateRitualDto>;

// ─── Select option cho dropdown ──────────────────────────
export type RitualSelectOption = SelectOptions;


export interface RitualFromProps {
  defaultValues?: Partial<CreateRitualDto>;
  onSubmit: (data: RitualFormData) => void;
  isPending?: boolean;
  submitLabel?: string;
}