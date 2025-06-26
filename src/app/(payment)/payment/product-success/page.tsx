// app/payment/product-success/page.tsx

"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  CheckCircle,
  Loader2,
  XCircle,
  Home,
  Receipt,
  Download,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { paymentApiClient } from "@/infrastructure/payment/payemntAPIClient";

const ProductSuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [purchaseData, setPurchaseData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      verifyPurchase(sessionId);
    } else {
      setError("セッションIDが見つかりません");
      setLoading(false);
    }
  }, [sessionId]);

  const verifyPurchase = async (sessionId: string) => {
    try {
      const response = await paymentApiClient.verifyProductPurchase(sessionId);

      setPurchaseData(response);
      setSuccess(true);
      toast.success("商品の購入が正常に完了しました！");
    } catch (error) {
      console.error("Failed to verify purchase:", error);
      setError("購入の確認に失敗しました");
      toast.error("購入の確認に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen main_gradient_bg text-white">
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="max-w-md w-full">
          {loading ? (
            <div className="glass-card rounded-lg p-8 text-center">
              <Loader2 className="animate-spin h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">処理中...</h2>
              <p className="text-gray-300">購入を確認しています</p>
            </div>
          ) : success ? (
            <div className="glass-card rounded-lg p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-green-400">
                購入完了！
              </h2>
              <p className="text-gray-300 mb-6">
                商品の購入が正常に完了しました
              </p>

              {purchaseData && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-semibold text-blue-400 mb-3 flex items-center">
                    <Receipt className="mr-2 h-4 w-4" />
                    購入詳細
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">支払い状況:</span>
                      <span className="text-green-400 font-medium">
                        {purchaseData.status === "paid"
                          ? "支払い完了"
                          : purchaseData.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">注文ID:</span>
                      <span className="text-white font-medium font-mono text-xs">
                        {purchaseData.stripe_order_id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">支払い金額:</span>
                      <span className="text-white font-medium">
                        ¥{purchaseData.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                <p className="text-green-400 font-medium mb-2">
                  🎉 購入ありがとうございます！
                </p>
                <p className="text-sm text-gray-300">
                  商品へのアクセスが有効になりました。ダッシュボードから確認できます。
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  variant="glassBrand"
                  className="w-full flex items-center justify-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  商品にアクセス
                </Button>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">
                    ダッシュボードへ
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    ホームに戻る
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-lg p-8 text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-red-400">
                購入エラー
              </h2>
              <p className="text-gray-300 mb-6">
                {error || "購入の処理中にエラーが発生しました"}
              </p>

              <div className="space-y-3">
                <Link href="/products">
                  <Button variant="glassBrand" className="w-full">
                    商品ページに戻る
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    ホームに戻る
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductSuccessPage;
