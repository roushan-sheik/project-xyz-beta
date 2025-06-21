"use client";
import React, { useState } from "react";
import { useForm, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "./style.css";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Menu from "@/components/home/Menu";
import photoEditingSchema from "@/schemas/photoEdit";
import { z } from "zod";
import { userApiClient } from "@/infrastructure/user/userAPIClient";
import { UserPhotoEditRequest } from "@/infrastructure/user/utils/types"; // Import the type for the API request body

type PhotoEditingFormData = z.infer<typeof photoEditingSchema>;

export default function PhotoEditingPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false); // State for error notification
  const [imagePreviews, setImagePreviews] = useState<{
    image1?: string;
    image2?: string;
    image3?: string;
  }>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<PhotoEditingFormData>({
    resolver: zodResolver(photoEditingSchema),
    defaultValues: {
      template: "default", // Set a default value
    },
  });

  const onSubmit = async (data: PhotoEditingFormData) => {
    console.log("Form submitted:", data);

    try {
      const requestFiles: string[] = [];
      if (data.images?.image1 && data.images.image1.length > 0) {
        requestFiles.push(`file_${data.images.image1[0].name}`);
      }
      if (data.images?.image2 && data.images.image2.length > 0) {
        requestFiles.push(`file_${data.images.image2[0].name}`);
      }
      if (data.images?.image3 && data.images.image3.length > 0) {
        requestFiles.push(`file_${data.images.image3[0].name}`);
      }

      // Convert completionDate to ISO 8601 format (e.g., "YYYY-MM-DDTHH:mm:ss.sssZ")
      // We're taking the date from the form and converting it to the start of that day in UTC.
      const desireDeliveryDate = data.completionDate
        ? new Date(data.completionDate).toISOString()
        : "";

      const apiRequestBody: UserPhotoEditRequest = {
        description: data.processingContent,
        special_note: data.referenceInfo || "", // referenceInfo is optional
        desire_delivery_date: data.completionDate,
        request_files: requestFiles,
      };

      console.log("API Request Body:", apiRequestBody);

      // Send the POST request using the userApiClient
      await userApiClient.userPhotoEditRequests(apiRequestBody);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setShowError(false); // Clear any previous error
    } catch (error) {
      console.error("Failed to submit photo edit request:", error);
      setShowError(true); // Show error notification
      setShowSuccess(false); // Hide success notification if it was showing
      setTimeout(() => setShowError(false), 5000); // Hide error after 5 seconds
    }
  };

  const handleImageUpload = (
    imageKey: "image1" | "image2" | "image3",
    files: FileList | null
  ) => {
    if (files && files.length > 0) {
      const file = files[0];
      setValue(`images.${imageKey}`, files);
      clearErrors(`images.${imageKey}`);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => ({
          ...prev,
          [imageKey]: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (imageKey: "image1" | "image2" | "image3") => {
    setValue(`images.${imageKey}`, undefined);
    setImagePreviews((prev) => ({
      ...prev,
      [imageKey]: undefined,
    }));
  };

  const getImageErrorMessage = (
    imageKey: "image1" | "image2" | "image3"
  ): string | undefined => {
    const error = errors.images?.[imageKey];
    if (error && typeof error === "object" && "message" in error) {
      return (error as FieldError).message;
    }
    return undefined;
  };

  return (
    <div className="main_gradient_bg">
      <Menu text="アリバイ写真加工" position="left" className="pl-10" />
      <div className="main-gradient-bg min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center gap-4 mb-6">
              <Button variant="glassSec" className="w-full">
                新規依頼
              </Button>
              <Button variant="glass" className="w-full">
                依頼一覧
              </Button>
            </div>
          </div>

          {showSuccess && (
            <div className="glass-card success-notification p-4 mb-6 text-center">
              <p className="font-medium">依頼が正常に送信されました！</p>
            </div>
          )}

          {showError && (
            <div className="glass-card error-notification p-4 mb-6 text-center">
              <p className="font-medium">
                依頼の送信に失敗しました。もう一度お試しください。
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="glass-card p-8">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">画像アップロード</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(["image1", "image2", "image3"] as const).map(
                    (imageKey, index) => (
                      <div key={imageKey} className="space-y-2">
                        <label className="block text-sm font-medium">
                          画像{index + 1}
                          {index === 0 ? " *" : ""}
                        </label>
                        <div
                          className={`upload-area h-40 flex items-center justify-center relative overflow-hidden rounded-lg ${
                            imagePreviews[imageKey] ? "has-image" : ""
                          }`}
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(imageKey, e.target.files)
                            }
                            id={`image-${index + 1}`}
                          />

                          {imagePreviews[imageKey] ? (
                            <>
                              <Image
                                width={200}
                                height={150}
                                src={imagePreviews[imageKey] as string}
                                alt={`Preview ${index + 1}`}
                                className="image-preview object-cover rounded-lg w-full h-full"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  padding: "10px",
                                }}
                              />
                              <div className="upload-overlay">
                                <div className="flex flex-col items-center gap-2">
                                  <label
                                    htmlFor={`image-${index + 1}`}
                                    className="change-image-text cursor-pointer bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs"
                                  >
                                    画像を変更
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => removeImage(imageKey)}
                                    className="text-red-400 text-sm hover:text-red-300 bg-black bg-opacity-50 px-2 py-1 rounded"
                                  >
                                    削除
                                  </button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <label
                              htmlFor={`image-${index + 1}`}
                              className="cursor-pointer text-center w-full h-full flex items-center justify-center"
                            >
                              <div className="text-sm text-gray-300">
                                <div className="mb-2 text-2xl">📸</div>
                                <div>クリックして画像を選択</div>
                              </div>
                            </label>
                          )}
                        </div>
                        {getImageErrorMessage(imageKey) && (
                          <p className="error-message">
                            {getImageErrorMessage(imageKey)}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  加工したい内容 *
                </label>
                <textarea
                  {...register("processingContent")}
                  className="glass-input w-full p-3 h-32 resize-none"
                  placeholder="加工内容の詳細を入力してください"
                />
                {errors.processingContent && (
                  <p className="error-message">
                    {errors.processingContent.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  引継ぎ事項
                </label>
                <textarea
                  {...register("referenceInfo")}
                  className="glass-input w-full p-3 h-24 resize-none"
                  placeholder="特記事項があれば入力してください"
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium mb-2">
                  納品希望日 *
                </label>
                <input
                  type="date"
                  {...register("completionDate")}
                  className="glass-input w-full p-3"
                />
                {errors.completionDate && (
                  <p className="error-message">
                    {errors.completionDate.message}
                  </p>
                )}
              </div>

              <Button type="submit" variant="glassBrand" className="w-full">
                依頼を送信
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
