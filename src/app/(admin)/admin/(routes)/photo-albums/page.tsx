"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { z } from "zod";
import PhotoCard from "@/components/admin/photo-albums/PhotoCard";
import Button from "@/components/admin/ui/Button";
import PhotoUploadModal from "@/components/admin/photo-albums/PhotoUploadModal";
import { galleryAPIClient } from "@/infrastructure/gallery/galleryAPIClient";
import {
  useCreatePhoto,
  useDeletePhoto,
} from "@/hooks/admin/useGalleryMutations";
import { GALLERY_QUERIES } from "@/infrastructure/gallery/utils/queries";

// Zod schema for photo upload form
export const uploadSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  category: z.string().min(1, "カテゴリーを選択してください"),
  description: z.string().optional(),
  file: z
    .any()
    .refine((file) => {
      if (typeof window === "undefined") return true;
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
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);

  const createPhotoMutation = useCreatePhoto();
  const deletePhotoMutation = useDeletePhoto();

  const {
    data: galleryData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    ...GALLERY_QUERIES.getPhotos(currentPage, 20),
    enabled: isAuthenticated,
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      return !error.message.includes("認証が必要です") && failureCount < 3;
    },
  });

  useEffect(() => {
    // Check if token exists in localStorage or other storage
    const savedToken = localStorage.getItem("accessToken");
    if (savedToken) {
      galleryAPIClient.setAuthToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleUploadModalOpen = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadModalClose = () => {
    setIsUploadModalOpen(false);
  };

  const handlePhotoUpload = async (data: UploadFormData) => {
    try {
      await createPhotoMutation.mutateAsync({
        title: data.title,
        description: data.description || "",
        file: data.file,
      });
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("この写真を削除してもよろしいですか？")) return;

    try {
      await deletePhotoMutation.mutateAsync(photoId);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  const photos = galleryData?.results || [];
  const isUploading = createPhotoMutation.isPending;
  const isDeleting = deletePhotoMutation.isPending;

  return (
    <div className="flex min-h-screen bg-gray-50">
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
              disabled={isUploading}
            >
              {isUploading ? "アップロード中..." : "新規写真をアップロード"}
            </Button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500 flex items-center justify-between">
              <span>{error.message}</span>
              <Button variant="secondary" onClick={handleRetry}>
                再試行
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-gray-600">読み込み中...</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {photos.map((photo) => (
                  <PhotoCard
                    key={photo.uid}
                    photo={{
                      id: photo.uid,
                      url: `data:image/jpeg;base64,${photo.file}`,
                      title: photo.title,
                      created_at: photo.created_at || new Date().toISOString(),
                    }}
                    onDelete={() => handleDeletePhoto(photo.uid)}
                    isDeleting={isDeleting}
                  />
                ))}
                {photos.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-500">
                    写真が見つかりません
                  </div>
                )}
              </div>

              {/* Pagination */}
              {galleryData && (galleryData.next || galleryData.previous) && (
                <div className="mt-6 flex justify-center space-x-2">
                  <Button
                    variant="secondary"
                    disabled={!galleryData.previous || isLoading}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    前のページ
                  </Button>
                  <span className="flex items-center px-4 py-2 text-sm text-gray-600">
                    ページ {currentPage}
                  </span>
                  <Button
                    variant="secondary"
                    disabled={!galleryData.next || isLoading}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    次のページ
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <PhotoUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleUploadModalClose}
        onSubmit={handlePhotoUpload}
        selectedCategory={selectedCategory}
        isUploading={isUploading}
      />
    </div>
  );
};

export default MainComponent;
