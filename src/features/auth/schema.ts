import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: "FullName là bắt buộc" })
      .min(3, { message: "FullName phải có ít nhất 3 ký tự" }),

    userName: z
      .string()
      .min(1, { message: "UserName là bắt buộc" })
      .min(3, { message: "UserName phải có ít nhất 3 ký tự" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "UserName không được chứa ký tự đặc biệt",
      }),

    email: z
      .email({ message: "Email không đúng định dạng" })
      .min(1, { message: "Email là bắt buộc" }),

    phoneNumber: z
      .string()
      .min(1, { message: "Số điện thoại là bắt buộc" })
      .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, {
        message: "Số điện thoại không đúng định dạng Việt Nam",
      }),

    password: z
      .string()
      .min(1, { message: "Password là bắt buộc" })
      .min(8, "Tối thiểu 8 ký tự")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Phải có ít nhất 1 chữ hoa",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Phải có ít nhất 1 số",
      })
      .refine((val) => /[!@#$%^&*]/.test(val), {
        message: "Phải có ít nhất 1 ký tự đặc biệt",
      }),

    confirmPassword: z
      .string()
      .min(1, { message: "Vui lòng xác nhận mật khẩu" }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Nhập lại mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }
  });

export const loginSchema = z.object({
  email: z
    .email({ message: "Email không đúng định dạng" })
    .min(1, { message: "Email là bắt buộc" }),
  password: z.string().min(6, { message: "Mật khẩu phải ít nhất 6 ký tự" }),
  rememberMe: z.boolean().optional(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterFormInput = z.input<typeof registerSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
