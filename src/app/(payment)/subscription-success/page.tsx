"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { subscriptionApiClient } from "@/infrastructure/subscription/subscriptionAPIClient";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { ToastContainer, toast } from "react-toastify";
import { user_role } from "@/constants/role";

const SubscriptionSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  useEffect(() => {
    const confirmSubscription = async () => {
      try {
        // Get session_id from URL params
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
          // Try to get from localStorage (fallback)
          const storedSessionId = localStorage.getItem("checkout_session_id");
          if (!storedSessionId) {
            throw new Error("Session ID not found");
          }

          // Confirm subscription with stored session ID
          const response = await subscriptionApiClient.confirmSubscription(
            storedSessionId
          );
          setSubscriptionData(response);
          setStatus("success");

          // Clean up stored session ID
          localStorage.removeItem("checkout_session_id");

          // Show success toast
          toast.success("サブスクリプションが正常に確認されました！");

          const role = localStorage.getItem("role");
          if (role === user_role.SUPER_ADMIN) {
            router.push("/admin");
          }

          //   Redirect to home after 3 seconds
          setTimeout(() => {
            router.push("/");
          }, 5000);
        } else {
          // Confirm subscription with URL session ID
          const response = await subscriptionApiClient.confirmSubscription(
            sessionId
          );
          setSubscriptionData(response);
          setStatus("success");

          // Clean up stored session ID
          localStorage.removeItem("checkout_session_id");

          // Show success toast
          toast.success("サブスクリプションが正常に確認されました！");

          // Redirect to home after 3 seconds
          setTimeout(() => {
            router.push("/");
          }, 3000);
        }
      } catch (error) {
        console.error("Subscription confirmation failed:", error);
        setStatus("error");
        toast.error("サブスクリプションの確認に失敗しました");
      }
    };

    confirmSubscription();
  }, [searchParams, router]);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleRetry = () => {
    setStatus("loading");
    // Retry the confirmation process
    window.location.reload();
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen main_gradient_bg text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-white mx-auto mb-4" size={48} />
          <h1 className="text-2xl text-white font-bold mb-2">
            サブスクリプションを確認中...
          </h1>
          <p className="text-gray-300">少々お待ちください</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen main_gradient_bg text-white flex items-center justify-center">
        <ToastContainer />
        <div className="text-center max-w-md">
          <XCircle className="text-red-400 mx-auto mb-4" size={48} />
          <h1 className="text-2xl text-blue-300 font-bold mb-2">
            確認に失敗しました
          </h1>
          <p className="text-gray-300 mb-6">
            サブスクリプションの確認中にエラーが発生しました。
          </p>
          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              variant="glassBrand"
              className="w-full"
            >
              再試行
            </Button>
            <Button
              onClick={() => router.push("/subscription-plans")}
              variant="glass"
              className="w-full"
            >
              プラン一覧に戻る
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen main_gradient_bg text-white flex items-center justify-center">
      <ToastContainer />
      <div className="text-center max-w-md">
        <CheckCircle className="text-green-400 mx-auto mb-4" size={48} />
        <h1 className="text-3xl text-white font-bold mb-2">
          サブスクリプション完了！
        </h1>
        <p className="text-gray-300 mb-6">
          プレミアムプランへの登録が完了しました。すべての機能をお楽しみください。
        </p>

        {subscriptionData && (
          <div className="glass-card p-6 rounded-lg mb-6 text-left">
            <h3 className="font-semibold text-white mb-3">
              サブスクリプション詳細
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">ステータス:</span>
                <span className="text-green-400 capitalize">
                  {subscriptionData.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">プレミアム:</span>
                <span
                  className={
                    subscriptionData.is_premium
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {subscriptionData.is_premium ? "はい" : "いいえ"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">次回更新:</span>
                <span>
                  {new Date(
                    subscriptionData.current_period_end
                  ).toLocaleDateString("ja-JP")}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleGoHome}
            variant="glassBrand"
            className="w-full"
          >
            ホームに移動
          </Button>
          <p className="text-sm text-gray-400">
            3秒後に自動的にホームページに移動します...
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccessPage;
