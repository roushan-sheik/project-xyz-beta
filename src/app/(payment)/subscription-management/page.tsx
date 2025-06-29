"use client";
import React, { useState } from "react";

import { subscriptionApiClient } from "@/infrastructure/subscription/subscriptionAPIClient";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  AlertTriangle,
  Crown,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { useSubscriptionGuard } from "@/hooks/payment/useSubscriptionGuard";

const SubscriptionManagePage = () => {
  const { subscriptionStatus, loading, refreshSubscriptionStatus } =
    useSubscriptionGuard(true);
  const [cancelling, setCancelling] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!window.confirm("本当にサブスクリプションをキャンセルしますか？")) {
      return;
    }

    setCancelling(true);
    try {
      const response = await subscriptionApiClient.cancelSubscription();
      toast.success("サブスクリプションがキャンセルされました");

      // Refresh subscription status
      await refreshSubscriptionStatus();

      console.log("Subscription cancelled:", response);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      toast.error("キャンセルに失敗しました");
    } finally {
      setCancelling(false);
    }
  };

  const handleGoBack = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen main_gradient_bg text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!subscriptionStatus) {
    return (
      <div className="min-h-screen main_gradient_bg text-white flex items-center justify-center">
        <div className="text-center">
          <p>サブスクリプション情報が見つかりません</p>
          <Button onClick={handleGoBack} className="mt-4">
            ホームに戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen main_gradient_bg text-white">
      <ToastContainer />

      {/* Header */}
      <header className="border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleGoBack}
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={16} />
              <span>戻る</span>
            </Button>
            <h1 className="text-xl font-bold">サブスクリプション管理</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Current Subscription Card */}
        <div className="glass-card p-6 rounded-xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center">
              <Crown className="text-yellow-400 mr-2" size={24} />
              現在のプラン
            </h2>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                subscriptionStatus.status === "active"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {subscriptionStatus.status === "active"
                ? "アクティブ"
                : subscriptionStatus.status}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">
                  プラン名
                </label>
                <p className="text-lg font-medium">
                  {subscriptionStatus.plan_name}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">
                  ステータス
                </label>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      subscriptionStatus.status === "active"
                        ? "bg-green-400"
                        : "bg-red-400"
                    }`}
                  ></div>
                  <span className="capitalize">
                    {subscriptionStatus.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">
                  プレミアムステータス
                </label>
                <span
                  className={
                    subscriptionStatus.is_premium
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {subscriptionStatus.is_premium
                    ? "プレミアム会員"
                    : "スタンダード会員"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">
                  次回更新日
                </label>
                <div className="flex items-center space-x-2">
                  <Calendar className="text-purple-400" size={16} />
                  <span>
                    {new Date(
                      subscriptionStatus.current_period_end
                    ).toLocaleDateString("ja-JP")}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">
                  自動更新
                </label>
                <span
                  className={
                    subscriptionStatus.cancel_at_period_end
                      ? "text-red-400"
                      : "text-green-400"
                  }
                >
                  {subscriptionStatus.cancel_at_period_end
                    ? "キャンセル予定"
                    : "有効"}
                </span>
              </div>

              {subscriptionStatus.cancel_at_period_end && (
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="text-yellow-400" size={16} />
                    <span className="text-sm text-yellow-400">
                      このサブスクリプションは期間終了時にキャンセルされます
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Billing Information */}
        <div className="glass-card p-6 rounded-xl mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <CreditCard className="text-blue-400 mr-2" size={20} />
            請求情報
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">
                決済方法
              </label>
              <p>Stripe経由でのクレジットカード決済</p>
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-1">
                次回請求予定
              </label>
              <p>
                {new Date(
                  subscriptionStatus.current_period_end
                ).toLocaleDateString("ja-JP")}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">アクション</h3>

          <div className="space-y-4">
            {!subscriptionStatus.cancel_at_period_end && (
              <div className="border border-red-500/30 rounded-lg p-4">
                <h4 className="font-medium mb-2 text-red-400">
                  サブスクリプションのキャンセル
                </h4>
                <p className="text-gray-300 text-sm mb-4">
                  サブスクリプションをキャンセルすると、現在の請求期間の終了時にアクセスが終了します。
                  それまでは引き続きプレミアム機能をご利用いただけます。
                </p>
                <Button
                  onClick={handleCancel}
                  loading={cancelling}
                  variant="primary"
                  className="bg-red-600 hover:bg-red-700"
                >
                  {cancelling
                    ? "キャンセル中..."
                    : "サブスクリプションをキャンセル"}
                </Button>
              </div>
            )}

            <div className="border border-blue-500/30 rounded-lg p-4">
              <h4 className="font-medium mb-2 text-blue-400">プラン変更</h4>
              <p className="text-gray-300 text-sm mb-4">
                現在、プラン変更機能は準備中です。プランを変更したい場合は、
                現在のプランをキャンセルしてから新しいプランにご登録ください。
              </p>
              <Button
                onClick={() => router.push("/subscription-plans")}
                variant="glass"
              >
                プラン一覧を見る
              </Button>
            </div>

            <div className="border border-gray-500/30 rounded-lg p-4">
              <h4 className="font-medium mb-2">サポート</h4>
              <p className="text-gray-300 text-sm mb-4">
                サブスクリプションに関してご質問がございましたら、
                カスタマーサポートまでお問い合わせください。
              </p>
              <Button
                onClick={() =>
                  window.open("mailto:support@example.com", "_blank")
                }
                variant="glass"
              >
                サポートに連絡
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionManagePage;
