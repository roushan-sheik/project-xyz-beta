"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "./style.css";
import Button from "@/components/ui/Button";
import Menu from "@/components/home/Menu";
import { z } from "zod";
import videoEditingSchema from "@/schemas/videoEdit";
import { userApiClient } from "@/infrastructure/user/userAPIClient";
import { UserVideoAudioEditRequest } from "@/infrastructure/user/utils/types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type VideoEditingFormData = z.infer<typeof videoEditingSchema>;

const VideoEditingForm: React.FC = () => {
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"video" | "audio" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<VideoEditingFormData>({
    resolver: zodResolver(videoEditingSchema),
    defaultValues: {
      editType: "動画編集",
    },
  });

  const onSubmit = async (data: VideoEditingFormData) => {
    // console.log("Form submitted:", data);
    // console.log({ mediaFile }); // Changed from videoFile to mediaFile

    try {
      const requestFiles: string[] = [];
      if (mediaFile) {
        // Changed from videoFile to mediaFile
        requestFiles.push(`uploaded_media_${mediaFile.name}`);
      }

      let apiEditType: UserVideoAudioEditRequest["edit_type"];
      switch (data.editType) {
        case "動画編集":
          apiEditType = "video_editing";
          break;
        case "音声編集":
          apiEditType = "audio_editing";
          break;
        case "動画・音声編集":
          apiEditType = "video_audio_editing";
          break;
        default:
          apiEditType = "other";
          break;
      }

      const desireDeliveryDate = data.dueDate
        ? new Date(data.dueDate).toISOString()
        : "";

      const apiRequestBody: UserVideoAudioEditRequest = {
        title: data.title,
        description: data.description,
        special_note: data.additionalNotes || "",
        desire_delivery_date: desireDeliveryDate,
        edit_type: apiEditType,
        request_files: requestFiles,
      };

      console.log("API Request Body:", apiRequestBody);

      await userApiClient.userVideoAndAudioRequests(apiRequestBody);

      // Show success toast
      toast.success("依頼が正常に送信されました！");
    } catch (error) {
      console.error("Failed to submit video/audio edit request:", error);
      // Show error toast
      toast.error("依頼の送信に失敗しました。もう一度お試しください。");
    }
  };

  const handleMediaUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      setMediaFile(file);
      setValue("video", files);
      clearErrors("video");

      if (file.type.startsWith("video/")) {
        setMediaType("video");
      } else if (file.type.startsWith("audio/")) {
        setMediaType("audio");
      } else {
        setMediaType(null);
      }

      const url = URL.createObjectURL(file);
      setMediaPreview(url);
    }
  };

  const removeMedia = () => {
    setValue("video", undefined);
    setMediaFile(null);
    setMediaType(null);
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
      setMediaPreview(null);
    }
  };

  return (
    <div className="main_gradient_bg">
      <Menu text="アリバイ動画音声の依頼" position="left" className="pl-10" />
      <div className="main-gradient-bg min-h-screen p-4">
        <div className="max-w-5xl mx-auto">
          {/* Main Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="glass-card p-8">
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2 text-white">
                  メディアのアップロード
                </h2>
                <p className="text-sm text-gray-300 mb-4">
                  編集したい動画または音声ファイルをアップロードしてください
                </p>

                <div
                  className={`video-upload-area h-64 flex items-center justify-center relative overflow-hidden rounded-lg ${
                    mediaPreview ? "has-video" : ""
                  }`}
                >
                  <input
                    type="file"
                    accept="video/*,audio/*"
                    className="hidden"
                    onChange={(e) => handleMediaUpload(e.target.files)}
                    id="media-upload"
                  />

                  {mediaPreview ? (
                    <>
                      {mediaType === "video" && (
                        <video
                          src={mediaPreview}
                          className="media-preview object-cover rounded-lg w-full h-full"
                          controls
                          style={{
                            width: "100%",
                            height: "100%",
                            padding: "10px",
                          }}
                        />
                      )}
                      {mediaType === "audio" && (
                        <audio
                          src={mediaPreview}
                          className="media-preview w-full h-24 p-2"
                          controls
                        />
                      )}
                      <div className="upload-overlay">
                        <div className="flex flex-col items-center gap-2">
                          <label
                            htmlFor="media-upload"
                            className="change-video-text cursor-pointer bg-black bg-opacity-70 px-3 py-2 rounded text-white text-sm"
                          >
                            メディアを変更
                          </label>
                          <button
                            type="button"
                            onClick={removeMedia}
                            className="text-red-400 text-sm hover:text-red-300 bg-black bg-opacity-70 px-3 py-2 rounded"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <label
                      htmlFor="media-upload"
                      className="cursor-pointer text-center w-full h-full flex items-center justify-center"
                    >
                      <div className="text-gray-300">
                        <div className="mb-4 text-4xl">🎬</div>
                        <div className="text-lg mb-2">
                          クリックしてメディアを選択
                        </div>
                        <div className="text-sm opacity-70">
                          動画: MP4, MOV, AVI | 音声: MP3, WAV
                        </div>
                      </div>
                    </label>
                  )}
                </div>
                {errors.video && (
                  <p className="error-message mt-2">
                    {errors.video.message as string}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-white">
                  タイトル
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className="glass-input w-full p-3"
                  placeholder="依頼のタイトル"
                />
                {errors.title && (
                  <p className="error-message">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-white">
                  依頼内容
                </label>
                <textarea
                  {...register("description")}
                  className="glass-input w-full p-3 h-32 resize-none"
                  placeholder="具体的な依頼内容を記入してください"
                />
                {errors.description && (
                  <p className="error-message">{errors.description.message}</p>
                )}
              </div>

              {/* Edit Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-white">
                  編集タイプ
                </label>
                <select
                  {...register("editType")}
                  className="glass-input w-full p-3"
                >
                  <option value="動画編集">動画編集</option>
                  <option value="音声編集">音声編集</option>
                  <option value="動画・音声編集">動画・音声編集</option>
                  <option value="その他">その他</option>
                </select>
                {errors.editType && (
                  <p className="error-message">{errors.editType.message}</p>
                )}
              </div>

              {/* Due Date */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-white">
                  希望納期
                </label>
                <input
                  type="date"
                  {...register("dueDate")}
                  className="glass-input w-full p-3"
                />
                {errors.dueDate && (
                  <p className="error-message">{errors.dueDate.message}</p>
                )}
              </div>

              {/* Additional Notes */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-2 text-white">
                  追加メモ
                </label>
                <textarea
                  {...register("additionalNotes")}
                  className="glass-input w-full p-3 h-24 resize-none"
                  placeholder="その他の要望があれば記入してください"
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" variant="glassBrand" className="w-full">
                依頼を送信する
              </Button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default VideoEditingForm;
