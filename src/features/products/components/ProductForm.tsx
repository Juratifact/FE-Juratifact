import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormData } from "../schema";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Loader2 } from "lucide-react";
import { PRODUCT_CONDITIONS } from "@/shared/constants";

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  isPending?: boolean;
  submitLabel?: string;
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = "Save product",
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    mode: "onTouched",
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      condition: "Good" as const,
      price: 0,
      ...defaultValues,
    },
  });

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(
        handleFormSubmit as unknown as Parameters<typeof handleSubmit>[0],
      )}
      className="space-y-6"
    >
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Product title *</Label>
        <Input
          id="title"
          type="text"
          placeholder="e.g. iPhone 13 Pro Max"
          {...register("title")}
          className={errors.title ? "border-destructive" : ""}
          required
        />
        {errors.title && (
          <p className="text-destructive text-xs">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          placeholder="Describe your product..."
          {...register("description")}
          className={`min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            errors.description ? "border-destructive" : ""
          }`}
        />
        {errors.description && (
          <p className="text-destructive text-xs">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <Label htmlFor="condition">Condition *</Label>
        <div
          id="condition"
          className={`grid gap-2 sm:grid-cols-3 ${
            errors.condition ? "rounded-md border border-destructive p-2" : ""
          }`}
        >
          {PRODUCT_CONDITIONS.map((cond) => (
            <label
              key={cond.value}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm transition-all hover:border-primary/50"
            >
              <input
                type="radio"
                value={cond.value}
                className="h-4 w-4 accent-primary"
                {...register("condition")}
              />
              <span className="font-medium">{cond.label}</span>
            </label>
          ))}
        </div>
        {errors.condition && (
          <p className="text-destructive text-xs">{errors.condition.message}</p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Price (VND) *</Label>
        <Input
          id="price"
          type="number"
          placeholder="1000000"
          {...register("price", { valueAsNumber: true })}
          className={errors.price ? "border-destructive" : ""}
          required
        />
        {errors.price && (
          <p className="text-destructive text-xs">{errors.price.message}</p>
        )}
      </div>

      {/* Media */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="image">Image (optional)</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            {...register("image")}
          />
          <p className="text-xs text-muted-foreground">
            You can submit without image.
          </p>
          {errors.image && (
            <p className="text-destructive text-xs">{errors.image.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="video">Video (optional)</Label>
          <Input
            id="video"
            type="file"
            accept="video/*"
            {...register("video")}
          />
          <p className="text-xs text-muted-foreground">
            You can submit without video.
          </p>
          {errors.video && (
            <p className="text-destructive text-xs">{errors.video.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full flex items-center justify-center"
        disabled={isPending || isSubmitting}
      >
        {isPending || isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
