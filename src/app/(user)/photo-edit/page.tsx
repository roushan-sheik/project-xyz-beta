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
import {
  UserPhotoEditRequest,
  UserPhotoEditRequestResponse,
} from "@/infrastructure/user/utils/types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "@/components/ui/Spinner";
import { ClipboardList } from "lucide-react";

type PhotoEditingFormData = z.infer<typeof photoEditingSchema>;

export default function PhotoEditingPage() {
  const [imagePreviews, setImagePreviews] = useState<{
    image1?: string;
    image2?: string;
    image3?: string;
  }>({});
  const [activeTab, setActiveTab] = useState<"form" | "list">("form");
  const [requestList, setRequestList] = useState<
    UserPhotoEditRequestResponse[]
  >([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    reset,
  } = useForm<PhotoEditingFormData>({
    resolver: zodResolver(photoEditingSchema),
    defaultValues: {
      template: "default",
    },
  });

  const onSubmit = async (data: PhotoEditingFormData) => {
    try {
      const formData = new FormData();

      formData.append("description", data.processingContent);
      formData.append("special_note", data.referenceInfo || "");
      formData.append(
        "desire_delivery_date",
        data.completionDate ? new Date(data.completionDate).toISOString() : ""
      );

      if (data.images?.image1?.[0]) {
        formData.append("request_files", data.images.image1[0]);
      }
      if (data.images?.image2?.[0]) {
        formData.append("request_files", data.images.image2[0]);
      }
      if (data.images?.image3?.[0]) {
        formData.append("request_files", data.images.image3[0]);
      }

      await userApiClient.userPhotoEditRequests(formData);

      toast.success("依頼が正常に送信されました！");
      reset();
      setImagePreviews({});
    } catch (error) {
      console.error("Failed to submit photo edit request:", error);
      toast.error("依頼の送信に失敗しました。もう一度お試しください。");
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

  const fetchRequestList = async () => {
    setLoadingRequests(true);
    setRequestError(null);
    try {
      const data = await userApiClient.getUserPhotoEditRequests();
      setRequestList(
        Array.isArray(data)
          ? data
          : Array.isArray(data.results)
          ? data.results
          : []
      );
    } catch (err: any) {
      setRequestError(err.message || "依頼一覧の取得に失敗しました");
    } finally {
      setLoadingRequests(false);
    }
  };

  return (
    <div className="main_gradient_bg">
      <Menu text="アリバイ写真加工" position="left" className="pl-10" />
      <div className="main-gradient-bg min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center gap-4 mb-6">
              <Button
                variant={activeTab === "form" ? "glassSec" : "glass"}
                className="w-full"
                type="button"
                onClick={() => setActiveTab("form")}
              >
                新規依頼
              </Button>
              <Button
                variant={activeTab === "list" ? "glassSec" : "glass"}
                className="w-full"
                type="button"
                onClick={async () => {
                  setActiveTab("list");
                  fetchRequestList();
                }}
              >
                依頼一覧
              </Button>
            </div>
          </div>

          {activeTab === "form" && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="glass-card p-8">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">
                    画像アップロード
                  </h2>
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
          )}

          {activeTab === "list" && (
            <div className="glass-card p-8">
              <h2 className="text-lg text-center font-semibold mb-4">
                依頼一覧
              </h2>
              {loadingRequests ? (
                <Spinner />
              ) : requestError ? (
                <div className="text-red-500">{requestError}</div>
              ) : requestList.length === 0 ? (
                <div>依頼がありません。</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {requestList.map((req) => (
                    <div
                      key={req.uid}
                      className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl hover:border-blue-400 transition-all p-6 flex flex-col gap-3 text-white"
                    >
                      {/* Header with Title and Status */}
                      <div className="flex items-center justify-between">
                        <span className="text-blue-400 font-semibold text-base flex items-center gap-2">
                          <ClipboardList className="w-5 h-5" />
                          {req.description}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                            req.request_status === "completed"
                              ? "bg-gradient-to-r from-green-400 to-green-600"
                              : req.request_status === "pending"
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                              : "bg-gradient-to-r from-blue-400 to-blue-600"
                          }`}
                        >
                          {req.request_status}
                        </span>
                      </div>

                      {/* Special Note */}
                      {req.special_note && (
                        <div className="text-sm text-gray-300">
                          <span className="font-medium text-white">Note:</span>{" "}
                          {req.special_note}
                        </div>
                      )}

                      {/* Delivery Date */}
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="font-medium text-white">
                          Delivery:
                        </span>
                        <span>
                          {new Date(
                            req.desire_delivery_date
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Files Preview */}
                      {Array.isArray(req.request_files) &&
                        req.request_files.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {req.request_files.map((file, idx) => (
                              <a
                                key={idx}
                                href={file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-white/10 hover:bg-white/20 text-white border border-white/30 px-3 py-1 rounded-md text-xs font-mono truncate max-w-[140px] transition-all"
                              >
                                Image {idx + 1}
                              </a>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
