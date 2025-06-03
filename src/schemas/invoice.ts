import { z } from "zod";

export const invoiceSchema = z.object({
  issueDate: z.string().min(1, "発行日は必須です"),
  billToName: z
    .string()
    .min(1, "請求先名は必須です")
    .min(2, "請求先名は2文字以上で入力してください"),
  productName: z
    .string()
    .min(1, "品名は必須です")
    .min(2, "品名は2文字以上で入力してください"),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
