import { z } from "zod";

const videoEditingSchema = z.object({
  video:
    typeof window !== "undefined"
      ? z
          .custom<FileList>((val) => val instanceof FileList)
          .refine(
            (files) => files?.length > 0,
            "動画ファイルを選択してください"
          )
          .refine((files) => {
            if (files?.length > 0) {
              const file = files[0];
              return file.type.startsWith("video/");
            }
            return false;
          }, "有効な動画ファイルを選択してください")
          .refine((files) => {
            if (files?.length > 0) {
              const file = files[0];
              return file.size <= 100 * 1024 * 1024;
            }
            return true;
          }, "ファイルサイズは100MB以下にしてください")
      : z.any(),
  title: z
    .string()
    .min(1, "タイトルを入力してください")
    .max(100, "タイトルは100文字以内で入力してください"),
  description: z
    .string()
    .min(10, "依頼内容は10文字以上で入力してください")
    .max(1000, "依頼内容は1000文字以内で入力してください"),
  editType: z.string().min(1, "編集タイプを選択してください"),
  dueDate: z
    .string()
    .min(1, "希望納期を選択してください")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "希望納期は今日以降の日付を選択してください"),
  additionalNotes: z
    .string()
    .max(500, "追加メモは500文字以内で入力してください")
    .optional(),
});

export default videoEditingSchema;
