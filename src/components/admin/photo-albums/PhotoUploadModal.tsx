"use client";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { X } from "lucide-react";
import { UploadFormData, uploadSchema } from "@/schemas/adminAlbumUpload";

// Custom Modal with Light Gray Blur Background
const CustomModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Light gray blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-10 w-full max-w-2xl mx-4 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Photo Upload Modal Component
const PhotoUploadModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UploadFormData) => void;
  selectedCategory: string;
}> = ({ isOpen, onClose, onSubmit, selectedCategory }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      category: selectedCategory === "all" ? "other" : selectedCategory,
      description: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue("file", file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleClose = () => {
    onClose();
    reset();
    setSelectedFile(null);
    setPreviewUrl("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleFormSubmit = (data: UploadFormData) => {
    onSubmit(data);
    handleClose();
  };

  const categoryOptions = [
    { value: "work", label: "仕事" },
    { value: "travel", label: "旅行" },
    { value: "event", label: "イベント" },
    { value: "other", label: "その他" },
  ];

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title="新しい写真をアップロード"
    >
      <div className="space-y-4">
        {/* File Upload */}
        <Input
          label="写真ファイル"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          error={
            typeof errors.title?.message === "string"
              ? errors.title.message
              : undefined
          }
        />

        {/* Preview */}
        {previewUrl && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              プレビュー
            </label>
            <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
              <img
                src={previewUrl}
                alt="アップロード予定の写真"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Title */}
        <Input
          label="タイトル"
          placeholder="写真のタイトルを入力"
          register={register("title")}
          error={errors.title?.message}
        />

        {/* Category */}
        <Select
          label="カテゴリー"
          options={categoryOptions}
          register={register("category")}
          error={errors.category?.message}
        />

        {/* Description */}
        <Textarea
          label="説明（オプション）"
          placeholder="写真の説明を入力"
          register={register("description")}
        />

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={handleClose}>
            キャンセル
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={!selectedFile}
          >
            アップロード
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

export default PhotoUploadModal;
