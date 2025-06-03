import { z } from "zod";

// Zod validation schema
const alibiLineFormSchema = z
  .object({
    title: z
      .string()
      .min(1, "依頼のタイトルは必須です")
      .max(100, "タイトルは100文字以内で入力してください"),
    messageContent: z
      .string()
      .min(10, "メッセージ内容は10文字以上で入力してください")
      .max(1000, "メッセージ内容は1000文字以内で入力してください"),
    messageCount: z
      .number()
      .min(1, "メッセージ数は1以上で入力してください")
      .max(100, "メッセージ数は100以下で入力してください"),
    startDate: z.string().min(1, "開始日時は必須です"),
    endDate: z.string().min(1, "終了日時は必須です"),
    additionalNotes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: "終了日時は開始日時以降の日付を選択してください",
      path: ["endDate"],
    }
  );

export default alibiLineFormSchema;
