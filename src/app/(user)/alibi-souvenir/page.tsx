// pages/index.tsx or app/page.tsx
"use client";
import OrderForm from "@/components/form/OrderForm";
import Menu from "@/components/home/Menu";
import ProductSevinior from "@/components/product/ProductSevinior";
import ProductCard from "@/components/ui/ProductCard";
import { products } from "@/constants/products";
import React, { useState } from "react";

const EcommercePage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
  };

  const handleOrderSubmit = (data: any) => {
    console.log("Order submitted:", {
      productId: selectedProduct,
      ...data,
    });
    // Handle order submission logic here
    alert("注文が送信されました！");
  };

  return (
    <div className="main_gradient_bg min-h-screen">
      <Menu text="アリバイお土産の注文" position="left" className="pl-10" />
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Selection Section */}
          <div className="lg:col-span-1">
            <h1 className="text-white text-2xl font-bold mb-6">商品を選択</h1>
            <div className="grid md:grid-cols-2 gap-6">
              {products.map((product) => (
                <ProductSevinior
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

          {/* Order Form Section */}
          <div className="lg:col-span-1">
            <h2 className="text-white text-xl font-semibold mb-6">注文詳細</h2>
            <OrderForm onSubmit={handleOrderSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcommercePage;
