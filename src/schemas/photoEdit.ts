import { z } from "zod";

const photoEditingSchema = z.object({
  template: z.string().optional(),
  images: z.object({
    image1: z
      .any()
      .refine((files) => files && files.length > 0, "画像1を選択してください"),
    image2: z.any().optional(),
    image3: z.any().optional(),
  }),
  processingContent: z.string().min(1, "加工内容の詳細を入力してください"),
  referenceInfo: z.string().optional(),
  completionDate: z.string().min(1, "納品希望日を入力してください"),
});

export default photoEditingSchema;
