"use client";

import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { z } from "zod";
import PhotoCard from "@/components/admin/photo-albums/PhotoCard";
import Button from "@/components/admin/ui/Button";
import PhotoUploadModal from "@/components/admin/photo-albums/PhotoUploadModal";

export type Photo = {
  id: number | string;
  url: string;
  title?: string;
  created_at: string;
};

// Zod schema for photo upload form
export const uploadSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  category: z.string().min(1, "カテゴリーを選択してください"),
  description: z.string().optional(),
  file: z
    .any()
    .refine((file) => {
      if (typeof window === "undefined") return true; // Skip validation on server
      return file instanceof File;
    }, "写真ファイルを選択してください")
    .refine((file) => {
      if (typeof window === "undefined") return true;
      return file?.size && file.size <= 5000000;
    }, "ファイルサイズは5MB以下にしてください")
    .refine((file) => {
      if (typeof window === "undefined") return true;
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      return file?.type && allowedTypes.includes(file.type);
    }, "対応していないファイル形式です"),
});

export type UploadFormData = z.infer<typeof uploadSchema>;

// Category Filter Component
const CategoryFilter: React.FC<{
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}> = ({ selectedCategory, onCategoryChange }) => (
  <select
    value={selectedCategory}
    onChange={(e) => onCategoryChange(e.target.value)}
    className="rounded-lg border border-gray-300 px-2 lg:px-3 w-30 lg:w-50 py-3"
  >
    <option value="all">すべてのカテゴリー</option>
    <option value="work">仕事</option>
    <option value="travel">旅行</option>
    <option value="event">イベント</option>
    <option value="other">その他</option>
  </select>
);

// Main Component
const MainComponent: React.FC = () => {
  const [albums, setAlbums] = useState<Photo[]>([
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
      title: "山の風景",
      created_at: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop",
      title: "海の写真",
      created_at: "2024-01-20T14:15:00Z",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
      title: "森の小道",
      created_at: "2024-02-01T09:45:00Z",
    },
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const handleUploadModalOpen = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadModalClose = () => {
    setIsUploadModalOpen(false);
  };

  const handlePhotoUpload = (data: UploadFormData) => {
    const uploadData = {
      ...data,
      fileName: data.file.name,
      fileSize: data.file.size,
      fileType: data.file.type,
    };

    console.log("Photo Upload Data:", uploadData);
  };

  const handleDeletePhoto = async (photoId: number | string) => {
    if (!confirm("この写真を削除してもよろしいですか？")) return;
    console.log("Delete photo:", photoId);
    // Add your delete logic here
  };

  return (
    <div className="flex min-h-screen bg-gray-50 bg-red">
      <div className="flex-1">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <h1 className="text-2xl font-medium text-gray-800">
            アリバイ写真アルバム管理
          </h1>
        </header>

        <main className="lg:p-6 p-3">
          <div className="mb-6 flex items-center justify-between">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <Button
              variant="primary"
              leftIcon={<Upload className="h-4 w-4" />}
              onClick={handleUploadModalOpen}
            >
              新規写真をアップロード
            </Button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-gray-600">読み込み中...</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {albums.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  onDelete={handleDeletePhoto}
                />
              ))}
              {albums.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500">
                  写真が見つかりません
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <PhotoUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleUploadModalClose}
        onSubmit={handlePhotoUpload}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default MainComponent;
