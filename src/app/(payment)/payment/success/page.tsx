"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { CheckCircle, Loader2, XCircle, Home, Receipt } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { paymentApiClient } from "@/infrastructure/payment/payemntAPIClient";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      confirmSubscription(sessionId);
    } else {
      setError("セッションIDが見つかりません");
      setLoading(false);
    }
  }, [sessionId]);

  const confirmSubscription = async (sessionId: string) => {
    try {
      const response = await paymentApiClient.confirmSubscription({
        session_id: sessionId,
      });

      setSubscriptionData(response);
      setSuccess(true);
      toast.success("サブスクリプションが正常に確認されました！");
    } catch (error) {
      console.error("Failed to confirm subscription:", error);
      setError("サブスクリプションの確認に失敗しました");
      toast.error("サブスクリプションの確認に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen main_gradient_bg text-white">
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="max-w-md w-full">
          {loading ? (
            <div className="glass-card rounded-lg p-8 text-center">
              <Loader2 className="animate-spin h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">処理中...</h2>
              <p className="text-gray-300">
                サブスクリプションを確認しています
              </p>
            </div>
          ) : success ? (
            <div className="glass-card rounded-lg p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4 text-green-400">
                支払い完了！
              </h2>
              <p className="text-gray-300 mb-6">
                サブスクリプションが正常にアクティベートされました
              </p>

              {subscriptionData && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-semibold text-blue-400 mb-3 flex items-center">
                    <Receipt className="mr-2 h-4 w-4" />
                    サブスクリプション詳細
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">ステータス:</span>
                      <span className="text-green-400 font-medium">
                        {subscriptionData.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">プレミアム:</span>
                      <span className="text-green-400 font-medium">
                        {subscriptionData.is_premium ? "有効" : "無効"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">次回更新日:</span>
                      <span className="text-white font-medium">
                        {formatDate(subscriptionData.current_period_end)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Link href="/dashboard">
                  <Button variant="glassBrand" className="w-full">
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
                支払いエラー
              </h2>
              <p className="text-gray-300 mb-6">
                {error || "支払いの処理中にエラーが発生しました"}
              </p>

              <div className="space-y-3">
                <Link href="/subscription">
                  <Button variant="glassBrand" className="w-full">
                    もう一度試す
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

export default PaymentSuccessPage;
