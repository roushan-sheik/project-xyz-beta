"use client";

import Button from "@/components/ui/Button";
import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";

interface Photo {
  id: number | string;
  url: string;
  title?: string;
  created_at: string;
}

type UploadFunction = (options: {
  file: File;
}) => Promise<{ url: string; error?: string }>;
type UseUploadResponse = [UploadFunction, { loading: boolean }];

const MainComponent: React.FC = () => {
  const [albums, setAlbums] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  //   const [upload, { loading: uploading }] = useUpload() as UseUploadResponse;

  useEffect(() => {
    // fetchAlbums();
  }, [selectedCategory]);

  const fetchAlbums = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/photo-albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: selectedCategory }),
      });

      if (!response.ok) {
        throw new Error("アルバムデータの取得に失敗しました");
      }

      const data = await response.json();
      setAlbums(data.albums || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (file: File): Promise<void> => {
    try {
      //   const { url, error: uploadError } = await upload({ file });
      //   if (uploadError) throw new Error(uploadError);

      //   const response = await fetch("/api/admin/photo-albums/create", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       imageUrl: url,
      //       category: selectedCategory === "all" ? "other" : selectedCategory,
      //     }),
      //   });

      //   if (!response.ok) {
      //     throw new Error("写真の登録に失敗しました");
      //   }

      await fetchAlbums();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleDeletePhoto = async (photoId: number | string): Promise<void> => {
    if (!confirm("この写真を削除してもよろしいですか？")) return;

    try {
      const response = await fetch("/api/admin/photo-albums/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId }),
      });

      if (!response.ok) {
        throw new Error("写真の削除に失敗しました");
      }

      await fetchAlbums();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-admin">
      <div className="flex-1">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <h1
            className="text-2xl font-medium text-gray-800"
            style={{ fontFamily: "var(--font-family-sans)" }}
          >
            アリバイ写真アルバム管理
          </h1>
        </header>

        <main className="lg:p-6 p-3">
          <div className="mb-6 flex items-center justify-between">
            <select
              value={selectedCategory}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedCategory(e.target.value)
              }
              className="rounded-lg border border-gray-300 px-2 lg:px-3 w-30 lg:w-50 py-3 "
            >
              <option value="all">すべてのカテゴリー</option>
              <option value="work">仕事</option>
              <option value="travel">旅行</option>
              <option value="event">イベント</option>
              <option value="other">その他</option>
            </select>

            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  e.target.files && handlePhotoUpload(e.target.files[0])
                }
                // disabled={uploading}
              />
              <Button
                variant="glass"
                leftIcon={<Upload className="h-4 w-4" />}
                className="bg-[#357AFF] text-white  hover:bg-[#2E69DE]"
                // disabled={uploading}
              >
                新規写真をアップロード
              </Button>
            </label>
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
                <div
                  key={photo.id}
                  className="group overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.title || "アリバイ写真"}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <p className="mb-1 truncate text-sm text-gray-800">
                      {photo.title || "タイトルなし"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(photo.created_at).toLocaleDateString("ja-JP")}
                    </p>
                    <div className="mt-2 flex justify-end space-x-2">
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="text-gray-600 hover:text-red-500"
                      >
                        <i className="fa-regular fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
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
    </div>
  );
};

export default MainComponent;
