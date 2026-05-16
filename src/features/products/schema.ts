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
      message: "Đầu vào tệp không hợp lệ",
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
      message: "Kích thước video không được vượt quá 100MB",
    },
  )
  .optional();

export const productSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề sản phẩm là bắt buộc")
    .min(5, "Tiêu đề sản phẩm phải có ít nhất 5 ký tự"),

  description: z
    .string()
    .max(2000, "Mô tả không được vượt quá 2000 ký tự")
    .optional(),

  condition: z.enum(CONDITIONS, {
    message: "Vui lòng chọn tình trạng sản phẩm",
  }),

  price: z
    .number()
    .min(1000, "Giá phải ít nhất 1000 VNĐ")
    .max(999999999, "Giá quá cao"),

  image: optionalFileListSchema,

  video: videoFileListSchema,
  imageUrls: z.array(z.string()).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
