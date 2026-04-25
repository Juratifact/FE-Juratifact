import { z } from "zod";

export const CONDITIONS = ["New", "Like new", "Good"] as const;

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
    .min(0, "Price cannot be negative")
    .max(999999999, "Price is too high"),

  image: optionalFileListSchema,

  video: optionalFileListSchema,
});

export type ProductFormData = z.infer<typeof productSchema>;
