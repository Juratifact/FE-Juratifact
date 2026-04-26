import { z } from "zod";

const optionalFileListSchema = z
  .custom<FileList | undefined>(
    (value) =>
      value === undefined ||
      value === null ||
      (typeof value === "object" && value !== null && "length" in value),
    {
      message: "Tệp tải lên không hợp lệ",
    },
  )
  .optional();

export const userProfileSchema = z.object({
  fullName: z
    .string()
    .max(120, "Họ tên tối đa 120 ký tự")
    .optional()
    .or(z.literal("")),
  userName: z
    .string()
    .max(50, "Tên người dùng tối đa 50 ký tự")
    .optional()
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .max(20, "Số điện thoại tối đa 20 ký tự")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(255, "Địa chỉ tối đa 255 ký tự")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(100, "Mật khẩu tối đa 100 ký tự")
    .optional()
    .or(z.literal("")),
  profilePicture: optionalFileListSchema,
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
