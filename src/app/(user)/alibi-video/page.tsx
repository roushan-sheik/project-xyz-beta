"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "./style.css";
import Button from "@/components/ui/Button";
import Menu from "@/components/home/Menu";
import { z } from "zod";
import videoEditingSchema from "@/schemas/videoEdit";
import { userApiClient } from "@/infrastructure/user/userAPIClient"; // Import your API client
import { UserVideoAudioEditRequest } from "@/infrastructure/user/utils/types"; // Import the request type

type VideoEditingFormData = z.infer<typeof videoEditingSchema>;

const VideoEditingForm: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false); // State for error notification
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null); // Keep track of the actual File object

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
    console.log("Form submitted:", data);
    console.log({ videoFile });

    try {
      const requestFiles: string[] = [];
      if (videoFile) {
        requestFiles.push(`uploaded_video_${videoFile.name}`);
      }
      // If you had an audio file input:
      // if (audioFile) {
      //   requestFiles.push(`uploaded_audio_${audioFile.name}`);
      // }

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
          apiEditType = "other"; // Or a sensible default/error
          break;
      }

      // Convert dueDate to ISO 8601 format
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

      // Send the POST request using the userApiClient
      await userApiClient.userVideoAndAudioRequests(apiRequestBody);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setShowError(false);
    } catch (error) {
      console.error("Failed to submit video/audio edit request:", error);
      setShowError(true);
      setShowSuccess(false);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const handleVideoUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      setVideoFile(file);
      setValue("video", files);
      clearErrors("video");
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const removeVideo = () => {
    setValue("video", undefined);
    setVideoFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
  };

  return (
    <div className="main_gradient_bg">
      <Menu text="アリバイ動画音声の依頼" position="left" className="pl-10" />
      <div className="main-gradient-bg min-h-screen p-4">
        <div className="max-w-5xl mx-auto">
          {/* Success Notification */}
          {showSuccess && (
            <div className="glass-card success-notification p-4 mb-6 text-center">
              <p className="font-medium">依頼が正常に送信されました！</p>
            </div>
          )}

          {/* Error Notification */}
          {showError && (
            <div className="glass-card error-notification p-4 mb-6 text-center">
              <p className="font-medium">
                依頼の送信に失敗しました。もう一度お試しください。
              </p>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="glass-card p-8">
              {/* Video Upload Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2 text-white">
                  動画のアップロード
                </h2>
                <p className="text-sm text-gray-300 mb-4">
                  編集したい動画ファイルをアップロードしてください
                </p>

                <div
                  className={`video-upload-area h-64 flex items-center justify-center relative overflow-hidden rounded-lg ${
                    videoPreview ? "has-video" : ""
                  }`}
                >
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleVideoUpload(e.target.files)}
                    id="video-upload"
                  />

                  {videoPreview ? (
                    <>
                      <video
                        src={videoPreview}
                        className="video-preview object-cover rounded-lg w-full h-full"
                        controls
                        style={{
                          width: "100%",
                          height: "100%",
                          padding: "10px",
                        }}
                      />
                      <div className="upload-overlay">
                        <div className="flex flex-col items-center gap-2">
                          <label
                            htmlFor="video-upload"
                            className="change-video-text cursor-pointer bg-black bg-opacity-70 px-3 py-2 rounded text-white text-sm"
                          >
                            動画を変更
                          </label>
                          <button
                            type="button"
                            onClick={removeVideo}
                            className="text-red-400 text-sm hover:text-red-300 bg-black bg-opacity-70 px-3 py-2 rounded"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <label
                      htmlFor="video-upload"
                      className="cursor-pointer text-center w-full h-full flex items-center justify-center"
                    >
                      <div className="text-gray-300">
                        <div className="mb-4 text-4xl">🎬</div>
                        <div className="text-lg mb-2">
                          クリックして動画を選択
                        </div>
                        <div className="text-sm opacity-70">
                          MP4, MOV, AVI対応
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

              {/* Title */}
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
    </div>
  );
};

export default VideoEditingForm;
