"use client";
import React, { useState } from "react";

import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { paymentApiClient } from "@/infrastructure/payment/payemntAPIClient";

interface ProductPurchaseProps {
  productId: string;
  productName: string;
  productDescription?: string;
  price: number;
  currency?: string;
  maxQuantity?: number;
  onPurchaseSuccess?: () => void;
}

const ProductPurchase: React.FC<ProductPurchaseProps> = ({
  productId,
  productName,
  productDescription,
  price,
  currency = "JPY",
  maxQuantity = 10,
  onPurchaseSuccess,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (increment: boolean) => {
    setQuantity((prev) => {
      if (increment) {
        return Math.min(prev + 1, maxQuantity);
      } else {
        return Math.max(prev - 1, 1);
      }
    });
  };

  const handlePurchase = async () => {
    setLoading(true);

    try {
      const checkoutData = {
        product_id: productId,
        amount: price.toString(),
        success_url: `${window.location.origin}/payment/product-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/payment/cancel`,
        quantity: quantity,
      };

      const response = await paymentApiClient.createProductCheckout(
        checkoutData
      );

      // Redirect to Stripe Checkout
      window.location.href = response.checkout_url;
    } catch (error) {
      console.error("Failed to create product checkout:", error);
      toast.error("チェックアウトの作成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = price * quantity;

  return (
    <div className="glass-card rounded-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{productName}</h3>
        {productDescription && (
          <p className="text-gray-300 mb-4">{productDescription}</p>
        )}
        <div className="text-3xl font-bold text-blue-400">
          ¥{price.toLocaleString()}
        </div>
        <p className="text-gray-400 text-sm">単価</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">数量:</span>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => handleQuantityChange(false)}
              disabled={quantity <= 1}
              variant="outline"
              className="w-8 h-8 p-0 flex items-center justify-center"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-white font-semibold text-lg w-8 text-center">
              {quantity}
            </span>
            <Button
              onClick={() => handleQuantityChange(true)}
              disabled={quantity >= maxQuantity}
              variant="outline"
              className="w-8 h-8 p-0 flex items-center justify-center"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-600 pt-4">
          <div className="flex items-center justify-between text-lg">
            <span className="text-gray-300">合計:</span>
            <span className="text-white font-bold">
              ¥{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <Button
        onClick={handlePurchase}
        loading={loading}
        disabled={loading}
        variant="glassBrand"
        className="w-full flex items-center justify-center"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {loading ? "処理中..." : "購入する"}
      </Button>

      <div className="mt-4 text-xs text-gray-400 text-center">
        <p>安全なStripe決済を使用</p>
      </div>
    </div>
  );
};

export default ProductPurchase;
