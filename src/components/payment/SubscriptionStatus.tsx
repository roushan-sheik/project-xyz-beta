"use client";
import React, { useState, useEffect } from "react";
import { SubscriptionStatus as SubscriptionStatusType } from "@/types/payment/types";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Crown,
  Calendar,
  CreditCard,
} from "lucide-react";
import { paymentApiClient } from "@/infrastructure/payment/payemntAPIClient";

const SubscriptionStatus: React.FC = () => {
  const [status, setStatus] = useState<SubscriptionStatusType | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await paymentApiClient.getSubscriptionStatus();
      setStatus(response);
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
      toast.error("サブスクリプション状態の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("本当にサブスクリプションをキャンセルしますか？")) {
      return;
    }

    setCancelling(true);
    try {
      const response = await paymentApiClient.cancelSubscription();
      toast.success(response.detail);
      await fetchSubscriptionStatus(); // Refresh status
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      toast.error("サブスクリプションのキャンセルに失敗しました");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusIcon = () => {
    if (!status?.has_subscription)
      return <XCircle className="h-8 w-8 text-red-400" />;

    switch (status.status) {
      case "active":
        return <CheckCircle className="h-8 w-8 text-green-400" />;
      case "canceled":
        return <AlertTriangle className="h-8 w-8 text-yellow-400" />;
      default:
        return <Clock className="h-8 w-8 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    if (!status?.has_subscription) return "サブスクリプションなし";

    switch (status.status) {
      case "active":
        return status.cancel_at_period_end ? "キャンセル予定" : "アクティブ";
      case "canceled":
        return "キャンセル済み";
      default:
        return status.status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="glass-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <CreditCard className="mr-3 h-6 w-6" />
            サブスクリプション状態
          </h2>
          {status?.is_premium && (
            <div className="flex items-center text-yellow-400">
              <Crown className="h-5 w-5 mr-2" />
              <span className="font-semibold">プレミアム</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center">
              {getStatusIcon()}
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">
                  {getStatusText()}
                </h3>
                <p className="text-gray-400">現在の状態</p>
              </div>
            </div>

            {status?.has_subscription && (
              <>
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">{status.plan_name}</p>
                      <p className="text-sm text-gray-400">現在のプラン</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <div className="flex items-center text-gray-300">
                    <Clock className="h-5 w-5 mr-3" />
                    <div>
                      <p className="font-medium">
                        {formatDate(status.current_period_end)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {status.cancel_at_period_end ? "終了日" : "次回更新日"}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            {status?.has_subscription ? (
              <div className="space-y-3">
                {status.status === "active" && !status.cancel_at_period_end && (
                  <Button
                    onClick={handleCancelSubscription}
                    loading={cancelling}
                    variant="outline"
                    className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    {cancelling
                      ? "キャンセル中..."
                      : "サブスクリプションをキャンセル"}
                  </Button>
                )}

                {status.cancel_at_period_end && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center text-yellow-400">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      <span className="font-medium">キャンセル予定</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">
                      {formatDate(status.current_period_end)}{" "}
                      にサブスクリプションが終了します
                    </p>
                  </div>
                )}

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h4 className="font-medium text-blue-400 mb-2">
                    プレミアム特典
                  </h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• 無制限のコンテンツアクセス</li>
                    <li>• 優先サポート</li>
                    <li>• 広告なし体験</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-400 mb-4">
                  サブスクリプションに登録して、すべての機能をお楽しみください
                </p>
                <Button
                  onClick={() => (window.location.href = "/subscription")}
                  variant="glassBrand"
                  className="w-full"
                >
                  プランを選択
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatus;
