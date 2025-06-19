import { z } from "zod";

export const uploadSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  category: z.string().min(1, "カテゴリーを選択してください"),
  description: z.string().optional(),
  file: z
    .any()
    .refine((file) => {
      if (typeof window === "undefined") return true;
      return file instanceof File;
    }, "写真ファイルを選択してください")
    .refine((file) => {
      if (typeof window === "undefined") return true;
      return file?.size && file.size <= 5000000;
    }, "ファイルサイズは5MB以下にしてください")
    .refine((file) => {
      if (typeof window === "undefined") return true;
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      return file?.type && allowedTypes.includes(file.type);
    }, "対応していないファイル形式です"),
});

export type UploadFormData = z.infer<typeof uploadSchema>;
