import { z } from "zod";

export const CONDITIONS = ["New", "Like new", "Good"] as const;

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

const optionalFileListSchema = z
  .custom<FileList | undefined>(
    (value) =>
      value === undefined ||
      value === null ||
      (typeof value === "object" && value !== null && "length" in value),
    {
      message: "Invalid file input",
    },
  )
  .optional();

const videoFileListSchema = z
  .custom<FileList | undefined>(
    (value) => {
      if (value === undefined || value === null) return true;
      if (!(typeof value === "object" && "length" in value)) return false;
      
      const files = Array.from(value as unknown as FileList);
      return files.every((file) => file.size <= MAX_VIDEO_SIZE);
    },
    {
      message: "Video size must be 100MB or less",
    },
  )
  .optional();

export const productSchema = z.object({
  title: z
    .string()
    .min(1, "Product title is required")
    .min(5, "Product title must be at least 5 characters"),

  description: z
    .string()
    .max(2000, "Description must be 2000 characters or fewer")
    .optional(),

  condition: z.enum(CONDITIONS, {
    message: "Please select a product condition",
  }),

  price: z
    .number()
    .min(1000, "Price must be at least 1000 VND")
    .max(999999999, "Price is too high"),

  image: optionalFileListSchema,

  video: videoFileListSchema,
  imageUrls: z.array(z.string()).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
