"use client";

import React, { useEffect, useState } from "react";
import Menu from "@/components/home/Menu";
import ProductCard from "@/components/ui/ProductCard";
import { userApiClient } from "@/infrastructure/user/userAPIClient";
import { GalleryItem } from "@/infrastructure/user/utils/types";

const AlibiPhotos = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
  console.log(galleryItems);
  useEffect(() => {
    fetchGallery();
  }, []);

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
  };

  return (
    <div className="main_gradient_bg">
      <Menu text="アリバイ写真ギャラリー" position="left" className="pl-10" />
      <div className="mt-10 mx-auto flex justify-center">
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-3 max-w-4xl gap-6">
            {galleryItems.map((item) => (
              <ProductCard
                key={item.uid}
                id={item.uid}
                title={item.title}
                file={item.file}
                file_type={item.file_type}
                selected={selectedProduct === item.uid}
                onSelect={handleProductSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlibiPhotos;
