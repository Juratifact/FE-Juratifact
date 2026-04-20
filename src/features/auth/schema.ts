import { z } from "zod";
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: "FullName la bat buoc" })
      .min(3, { message: "FullName phai co it nhat 3 ky tu" }),

    email: z
      .email({ message: "Email kh dung dinh dang" })
      .min(1, { message: "Email la bat buoc" }),
    password: z
      .string()
      .min(1, { message: "Password la bat buoc" })
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
    confirmPassword: z.string(),
    date_of_birth: z.coerce
      .date()
      .max(new Date(), "Không được chọn ngày tương lai")
      .refine((date) => {
        const today = new Date();
        let age = today.getFullYear() - date.getFullYear();
        const m = today.getMonth() - date.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
          age--;
        }
        return age >= 18;
      }, "Phải đủ 18 tuổi")
      .transform((date) => date.toISOString()),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    //Custom validation cho ca object
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Nhap lai mat khau, khong khop",
        path: ["confirmPassword"], //gan loi vao truong du lieu nay
      });
    }
  });

export const loginSchema = z.object({
  email: z
    .email({ message: "Email kh dung dinh dang" })
    .min(1, { message: "Email la bat buoc" }),
  password: z.string().min(6, { message: "Mật khẩu phải ít nhất 6 ký tự" }),

  rememberMe: z.boolean().optional(),
});
export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterFormInput = z.input<typeof registerSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
