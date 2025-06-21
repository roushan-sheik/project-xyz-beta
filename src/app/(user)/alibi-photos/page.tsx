"use client";
import Menu from "@/components/home/Menu";
import ProductCard from "@/components/ui/ProductCard";
import { products } from "@/constants/products";
import React, { useState } from "react";

const AlibiPhotos = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
  };

  return (
    <div className="main_gradient_bg">
      <Menu text="アリバイ写真ギャラリー" position="left" className="pl-10" />
      <div className="mt-10 mx-auto flex justify-center">
        <div className="grid md:grid-cols-3 max-w-4xl gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              selected={selectedProduct === product.id}
              onSelect={handleProductSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlibiPhotos;
