import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormData } from "../schema";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Loader2, X, ImagePlus } from "lucide-react";
import { PRODUCT_CONDITIONS } from "@/shared/constants";
import { toast } from "sonner";

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData>;
  initialImageUrls?: string[];
  onSubmit: (data: ProductFormData) => void;
  isPending?: boolean;
  submitLabel?: string;
}

export function ProductForm({
  defaultValues,
  initialImageUrls,
  onSubmit,
  isPending,
  submitLabel = "Save product",
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
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

  const [currentInitialUrls, setCurrentInitialUrls] = useState<string[]>(
    initialImageUrls ?? [],
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [newVideoFiles, setNewVideoFiles] = useState<File[]>([]);
  const [newVideoPreviews, setNewVideoPreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const addedFiles = Array.from(files);
      const addedPreviews = addedFiles.map((file) => URL.createObjectURL(file));

      setNewFiles((prev) => [...prev, ...addedFiles]);
      setNewPreviews((prev) => [...prev, ...addedPreviews]);
    }
    e.target.value = "";
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
      const addedFiles = Array.from(files);
      
      const validFiles = addedFiles.filter(file => file.size <= MAX_VIDEO_SIZE);
      const invalidFilesCount = addedFiles.length - validFiles.length;

      if (invalidFilesCount > 0) {
        toast.error(`${invalidFilesCount} video(s) exceed the 100MB size limit and were skipped.`);
      }

      if (validFiles.length > 0) {
        const addedPreviews = validFiles.map((file) => URL.createObjectURL(file));
        setNewVideoFiles((prev) => [...prev, ...validFiles]);
        setNewVideoPreviews((prev) => [...prev, ...addedPreviews]);
      }
    }
    e.target.value = "";
  };

  useEffect(() => {
    setValue("image", newFiles as unknown as FileList);
  }, [newFiles, setValue]);

  useEffect(() => {
    setValue("video", newVideoFiles as unknown as FileList);
  }, [newVideoFiles, setValue]);

  useEffect(() => {
    setValue("imageUrls", currentInitialUrls);
  }, [currentInitialUrls, setValue]);

  const removeInitialImage = (url: string) => {
    setCurrentInitialUrls((prev) => prev.filter((u) => u !== url));
  };

  const removeNewImage = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeNewVideo = (index: number) => {
    setNewVideoFiles((prev) => prev.filter((_, i) => i !== index));
    setNewVideoPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  useEffect(() => {
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
      newVideoPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newPreviews, newVideoPreviews]);

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit({
      ...data,
    });
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
          type="text"
          placeholder="1.000.000"
          className={errors.price ? "border-destructive" : ""}
          required
          onChange={(e) => {
            const rawValue = e.target.value.replace(/\D/g, "");
            const numericValue = parseInt(rawValue, 10) || 0;
            
            // Update form state with raw number
            setValue("price", numericValue, { shouldValidate: true });
            
            // Update display with dots
            e.target.value = numericValue > 0 
              ? numericValue.toLocaleString("vi-VN").replace(/,/g, ".") 
              : "";
          }}
          defaultValue={defaultValues?.price ? defaultValues.price.toLocaleString("vi-VN").replace(/,/g, ".") : ""}
        />
        {errors.price && (
          <p className="text-destructive text-xs">{errors.price.message}</p>
        )}
      </div>

      {/* Media */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="image" className="flex items-center gap-2">
            <ImagePlus className="h-4 w-4" />
            Images
          </Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="cursor-pointer"
          />
          {(currentInitialUrls.length > 0 || newFiles.length > 0) && (
            <div className="grid grid-cols-3 gap-2 pt-2">
              {/* Initial Images */}
              {currentInitialUrls.map((url, idx) => (
                <div
                  key={`initial-${idx}`}
                  className="group relative aspect-square overflow-hidden rounded-md border bg-muted"
                >
                  <img
                    src={url}
                    alt={`Existing ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeInitialImage(url)}
                    className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {/* New Images */}
              {newPreviews.map((url, idx) => (
                <div
                  key={`new-${idx}`}
                  className="group relative aspect-square overflow-hidden rounded-md border bg-muted"
                >
                  <img
                    src={url}
                    alt={`New ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            You can select multiple images.
          </p>
          {errors.image && (
            <p className="text-destructive text-xs">{errors.image.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="video">Videos (optional)</Label>
          <Input
            id="video"
            type="file"
            accept="video/*"
            multiple
            onChange={handleVideoChange}
            className="cursor-pointer"
          />
          {newVideoFiles.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-2">
              {newVideoPreviews.map((url, idx) => (
                <div
                  key={`video-${idx}`}
                  className="group relative aspect-video overflow-hidden rounded-md border bg-muted"
                >
                  <video
                    src={url}
                    className="h-full w-full object-cover"
                    muted
                  />
                  <button
                    type="button"
                    onClick={() => removeNewVideo(idx)}
                    className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            You can select multiple videos.
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
