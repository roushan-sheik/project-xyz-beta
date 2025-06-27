"use client";

import React, { useEffect, useState } from "react";
import Menu from "@/components/home/Menu";
import { userApiClient } from "@/infrastructure/user/userAPIClient";
import { GalleryItem } from "@/infrastructure/user/utils/types";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import Button from "@/components/ui/Button";

const IMAGES_PER_PAGE = 12;

const AlibiPhotos = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [previewImage, setPreviewImage] = useState<GalleryItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchGallery = async () => {
    try {
      const res = await userApiClient.getGalleryPhotos();
      setGalleryItems(res.results || []);
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
  };

  // Download a single image (fetch as blob for CORS)
  const handleDownload = async (url: string, title: string) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      saveAs(blob, title + ".jpg");
    } catch (err) {
      // Fallback: open in new tab if CORS fails
      window.open(url, "_blank");
      alert(
        "画像のダウンロードに失敗しました。新しいタブで画像が開きますので、右クリックで保存してください。"
      );
    }
  };

  // Download all images
  const handleDownloadAll = () => {
    galleryItems.forEach((item) => {
      if (item.file_type === "image") {
        handleDownload(item.file, item.title);
      }
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(galleryItems.length / IMAGES_PER_PAGE);
  const paginatedItems = galleryItems.slice(
    (currentPage - 1) * IMAGES_PER_PAGE,
    currentPage * IMAGES_PER_PAGE
  );

  return (
    <div className="main_gradient_bg min-h-screen">
      <Menu text="アリバイ写真ギャラリー" position="left" className="pl-10" />
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mt-10 mb-6">
          <h2 className="text-2xl font-bold text-white">ギャラリー</h2>
          <Button variant="glassSec" onClick={handleDownloadAll}>
            すべてダウンロード
          </Button>
        </div>
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {paginatedItems.map((item) => (
                <div
                  key={item.uid}
                  className="rounded-2xl bg-white/10 shadow-2xl border border-white/20 hover:border-blue-400 transition-all p-4 flex flex-col gap-3 glass-card backdrop-blur-xl hover:shadow-blue-200/40 group relative cursor-pointer"
                  onClick={() => setPreviewImage(item)}
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-blue-100/20 to-white/10 mb-3 group-hover:scale-105 transition-transform duration-200">
                    {item.file_type === "image" ? (
                      <img
                        src={item.file}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                      />
                    ) : (
                      <video controls className="w-full h-full object-cover">
                        <source src={item.file} />
                        Your browser does not support video.
                      </video>
                    )}
                  </div>
                  <h3 className="text-white font-semibold mb-1 text-base truncate">
                    {item.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-300 font-mono truncate max-w-[120px]">
                      {item.code}
                    </span>
                    {item.file_type === "image" && (
                      <Button
                        variant="glassSec"
                        size="sm"
                        leftIcon={<FiDownload className="text-base" />}
                        className="!px-3 !py-1 rounded-lg shadow-md border border-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(item.file, item.title);
                        }}
                      >
                        ダウンロード
                      </Button>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 line-clamp-2">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-white/10 text-blue-300 hover:bg-blue-400/20"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            )}
            {/* Image preview modal */}
            {previewImage && (
              <div className="fixed inset-0 z-50 flex items-center  justify-center bg-black/70 backdrop-blur-xl">
                <div className="glass-card bg-gradient-to-br  from-white/20 to-blue-100/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-0 max-w-2xl w-full relative flex flex-col items-center border border-white/30 overflow-hidden">
                  <button
                    className="absolute cursor-pointer top-14 right-9 text-blue-400 hover:text-blue-600 text-2xl font-bold bg-white/40 
                    rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-white/70 transition-all z-10 border border-white/30"
                    onClick={() => setPreviewImage(null)}
                  >
                    ×
                  </button>
                  <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-blue-100/30 to-white/10 rounded-b-3xl p-4">
                    <img
                      src={previewImage.file}
                      alt={previewImage.title}
                      className="max-h-80 object-contain rounded-2xl w-full shadow-xl border border-white/20"
                    />
                  </div>
                  <div className="w-full px-8 py-6 flex flex-col items-center">
                    <h3 className="text-2xl font-bold mb-2 text-white drop-shadow text-center">
                      {previewImage.title}
                    </h3>
                    <div className="text-sm text-gray-400 mb-4 text-center">
                      {previewImage.description}
                    </div>
                    <Button
                      variant="glassSec"
                      size="md"
                      leftIcon={<FiDownload className="text-lg" />}
                      className="rounded-lg shadow-md border border-white/20 mt-2"
                      onClick={() =>
                        handleDownload(previewImage.file, previewImage.title)
                      }
                    >
                      ダウンロード
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AlibiPhotos;
