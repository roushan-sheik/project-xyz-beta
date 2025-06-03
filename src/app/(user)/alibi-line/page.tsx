"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import "./style.css";
import Button from "@/components/ui/Button";
import Menu from "@/components/home/Menu";
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

type DependencyFormData = z.infer<typeof alibiLineFormSchema>;

interface DependencyFormProps {
  onSubmit?: (data: DependencyFormData) => void;
  loading?: boolean;
}

const AliviLineForm: React.FC<DependencyFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<DependencyFormData>({
    resolver: zodResolver(alibiLineFormSchema),
    defaultValues: {
      title: "",
      messageContent: "",
      messageCount: 1,
      startDate: "",
      endDate: "",
      additionalNotes: "",
    },
  });

  const onFormSubmit = async (data: DependencyFormData) => {
    try {
      console.log("Dependency form submitted:", data);
      if (onSubmit) {
        await onSubmit(data);
      }
      // Reset form after successful submission
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const formValues = watch();

  return (
    <div className="min-h-screen text-white  main_gradient_bg">
      <Menu text="アリバイLINEの依頼" position="left" className="pl-10" />
      <div className="max-w-2xl mt-6 mx-auto">
        {/* <Menu text="アリバイLINEの依頼" /> */}
        {/* Header */}
        {/* <h1
          className="text-xl font-medium mb-8"
          style={{ color: "var(--color-neutral-100)" }}
        >
          アリバイLINEの依頼
        </h1> */}

        {/* Form Container */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Title Section */}
            <div className="space-y-3">
              <label
                className="block text-sm font-medium"
                style={{ color: "var(--color-neutral-300)" }}
                htmlFor="title"
              >
                タイトル <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                type="text"
                {...register("title")}
                placeholder="依頼のタイトルを入力してください"
                className={`w-full px-4 py-3 glass border-0 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.title ? "ring-2 ring-red-500" : ""
                }`}
                style={{
                  "--tw-ring-color": errors.title
                    ? "#ef4444"
                    : "var(--color-brand-500)",
                  color: "var(--color-white)",
                }}
                disabled={isSubmitting || loading}
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            {/* Message Content Section */}
            <div className="space-y-3">
              <label
                className="block text-sm font-medium"
                style={{ color: "var(--color-neutral-300)" }}
                htmlFor="messageContent"
              >
                メッセージの内容 <span className="text-red-400">*</span>
              </label>
              <textarea
                id="messageContent"
                {...register("messageContent")}
                placeholder="希望するメッセージや取り組みの内容を具体的に記入してください"
                rows={6}
                className={`w-full px-4 py-3 glass border-0 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                  errors.messageContent ? "ring-2 ring-red-500" : ""
                }`}
                style={{
                  "--tw-ring-color": errors.messageContent
                    ? "#ef4444"
                    : "var(--color-brand-500)",
                  color: "var(--color-white)",
                }}
                disabled={isSubmitting || loading}
              />
              <div className="flex justify-between items-center">
                {errors.messageContent && (
                  <p className="text-red-400 text-sm">
                    {errors.messageContent.message}
                  </p>
                )}
                <p className="text-gray-400 text-xs ml-auto">
                  {formValues.messageContent?.length || 0}/1000
                </p>
              </div>
            </div>
            {/* Message Count Section */}
            <div className="space-y-3">
              <label
                className="block text-sm font-medium"
                style={{ color: "var(--color-neutral-300)" }}
                htmlFor="messageCount"
              >
                メッセージ数 <span className="text-red-400">*</span>
              </label>
              <input
                id="messageCount"
                type="number"
                {...register("messageCount", { valueAsNumber: true })}
                min="1"
                max="100"
                className={`w-full px-4 py-3 glass border-0 text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.messageCount ? "ring-2 ring-red-500" : ""
                }`}
                style={{
                  "--tw-ring-color": errors.messageCount
                    ? "#ef4444"
                    : "var(--color-brand-500)",
                  color: "var(--color-white)",
                }}
                disabled={isSubmitting || loading}
              />
              {errors.messageCount && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.messageCount.message}
                </p>
              )}
            </div>
            {/* Date Range Section */}
            <div className="grid grid-cols-2 gap-6">
              {/* Start Date */}
              <div className="space-y-3">
                <label
                  className="block text-sm font-medium"
                  style={{ color: "var(--color-neutral-300)" }}
                  htmlFor="startDate"
                >
                  開始日時 <span className="text-red-400">*</span>
                </label>
                <input
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                  className={`w-full px-4 py-3 glass border-0 text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.startDate ? "ring-2 ring-red-500" : ""
                  }`}
                  style={{
                    "--tw-ring-color": errors.startDate
                      ? "#ef4444"
                      : "var(--color-brand-500)",
                    color: "var(--color-white)",
                    colorScheme: "dark",
                  }}
                  disabled={isSubmitting || loading}
                />
                {errors.startDate && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div className="space-y-3">
                <label
                  className="block text-sm font-medium"
                  style={{ color: "var(--color-neutral-300)" }}
                  htmlFor="endDate"
                >
                  終了日時 <span className="text-red-400">*</span>
                </label>
                <input
                  id="endDate"
                  type="date"
                  {...register("endDate")}
                  className={`w-full px-4 py-3 glass border-0 text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.endDate ? "ring-2 ring-red-500" : ""
                  }`}
                  style={{
                    "--tw-ring-color": errors.endDate
                      ? "#ef4444"
                      : "var(--color-brand-500)",
                    color: "var(--color-white)",
                    colorScheme: "dark",
                  }}
                  disabled={isSubmitting || loading}
                />
                {errors.endDate && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
            {/* Additional Notes Section */}
            <div className="space-y-3">
              <label
                className="block text-sm font-medium"
                style={{ color: "var(--color-neutral-300)" }}
                htmlFor="additionalNotes"
              >
                追加メモ
              </label>
              <textarea
                id="additionalNotes"
                {...register("additionalNotes")}
                placeholder="その他の要望があれば記入してください"
                rows={4}
                className="w-full px-4 py-3 glass border-0 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 resize-none"
                style={{
                  "--tw-ring-color": "var(--color-brand-500)",
                  color: "var(--color-white)",
                }}
                disabled={isSubmitting || loading}
              />
              <p className="text-gray-400 text-xs">
                {formValues.additionalNotes?.length || 0}/500
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="glassBrand"
              className="w-full"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>送信中...</span>
                </div>
              ) : (
                "依頼を送信する"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AliviLineForm;
