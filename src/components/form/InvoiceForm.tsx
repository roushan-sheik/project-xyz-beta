"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema, type InvoiceFormData } from "@/schemas/invoice";
import Menu from "../home/Menu";
import Button from "../ui/Button";

interface InvoiceFormProps {
  onSubmit: (data: InvoiceFormData) => void;
}

export default function InvoiceForm({ onSubmit }: InvoiceFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showError, setShowError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      issueDate: new Date().toISOString().split("T")[0],
      billToName: "",
      productName: "",
    },
  });

  const handleFormSubmit = async (data: InvoiceFormData) => {
    try {
      setIsGenerating(true);
      setShowError(false);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      onSubmit(data);
      reset();
    } catch (error) {
      setShowError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen main_gradient_bg  ">
      <Menu text="ダミー請求書の作成" position="left" />
      <div className="flex items-center mt-8 justify-center">
        <div className="w-full max-w-3xl">
          {/* Header */}

          {/* Error Message */}
          {showError && (
            <div className="mb-6 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">請求書の生成に失敗しました</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="glass p-6">
              {/* Issue Date */}
              <div className="mb-4">
                <label
                  htmlFor="issueDate"
                  className="block text-white text-sm font-medium mb-2"
                >
                  発行日
                </label>
                <input
                  {...register("issueDate")}
                  type="date"
                  id="issueDate"
                  className="glass-input w-full px-4 py-3 text-white placeholder-gray-400"
                />
                {errors.issueDate && (
                  <p className="mt-1 text-red-400 text-sm">
                    {errors.issueDate.message}
                  </p>
                )}
              </div>

              {/* Bill To Name */}
              <div className="mb-4">
                <label
                  htmlFor="billToName"
                  className="block text-white text-sm font-medium mb-2"
                >
                  請求先名
                </label>
                <input
                  {...register("billToName")}
                  type="text"
                  id="billToName"
                  placeholder="クライアント名を入力"
                  className="glass-input w-full px-4 py-3 text-white placeholder-gray-400"
                />
                {errors.billToName && (
                  <p className="mt-1 text-red-400 text-sm">
                    {errors.billToName.message}
                  </p>
                )}
              </div>

              {/* Product Name */}
              <div className="">
                <label
                  htmlFor="productName"
                  className="block text-white text-sm font-medium mb-2"
                >
                  品名
                </label>
                <input
                  {...register("productName")}
                  type="text"
                  id="productName"
                  placeholder="商品名を入力"
                  className="glass-input w-full px-4 py-3 text-white placeholder-gray-400"
                />
                {errors.productName && (
                  <p className="mt-1 text-red-400 text-sm">
                    {errors.productName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button variant="glassBrand" className="w-full">
              {isGenerating ? "生成中..." : "PDFをダウンロード"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
