import { z } from "zod";

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "メールアドレスを入力してください")
      .email("有効なメールアドレスを入力してください"),
    password: z.string().min(6, "パスワードは6文字以上で入力してください"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "パスワードが一致しません",
    path: ["confirm_password"],
  });
