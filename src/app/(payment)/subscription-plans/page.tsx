"use client";
import React, { useState, useEffect } from "react";
import {
  subscriptionApiClient,
  SubscriptionPlan,
} from "@/infrastructure/subscription/subscriptionAPIClient";
import Button from "@/components/ui/Button";
import { ToastContainer, toast } from "react-toastify";
import { Crown, Check, Loader2 } from "lucide-react";
import { user_role } from "@/constants/role";

const SubscriptionPlansPage = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await subscriptionApiClient.getSubscriptionPlans();
        setPlans(response.results);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        toast.error("プランの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    setSubscribing(plan.uid);
    try {
      const successUrl = `${window.location.origin}/subscription-success`;
      const cancelUrl = `${window.location.origin}/subscription-plans`;

      const response = await subscriptionApiClient.createCheckoutSession(
        plan.uid,
        successUrl,
        cancelUrl
      );

      // Store session ID for later confirmation
      localStorage.setItem("checkout_session_id", response.session_id);

      // Redirect to Stripe checkout
      window.location.href = response.checkout_url;
    } catch (error) {
      console.error("Subscription failed:", error);
      toast.error("サブスクリプションの作成に失敗しました");
      setSubscribing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen main_gradient_bg text-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="animate-spin" size={24} />
          <span>プランを読み込み中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen main_gradient_bg text-white">
      <ToastContainer />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Crown className="text-yellow-400 mr-2" size={32} />
            <h1 className="text-4xl text-white font-bold">プレミアムプラン</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            最高の体験を得るために、プレミアムプランにアップグレードしてください
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.uid}
              className="glass-card rounded-xl p-8 relative overflow-hidden border border-white/20"
            >
              {/* Popular badge for 6-month plan */}
              {plan.billing_interval === "six_months" && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                  人気
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl text-white font-bold mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-300 mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl text-blue-400 font-bold">
                    ¥{plan.amount_jpy.toLocaleString()}
                  </span>
                  <span className="text-gray-400 ml-2">
                    / {plan.billing_interval_label}
                  </span>
                </div>

                {/* Price per month calculation */}
                <div className="text-sm text-gray-400 mb-6">
                  {plan.billing_interval === "six_months" && (
                    <span>
                      月額 ¥{Math.round(plan.amount_jpy / 6).toLocaleString()}
                    </span>
                  )}
                  {plan.billing_interval === "month" && (
                    <span>月額 ¥{plan.amount_jpy.toLocaleString()}</span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 text-blue-300 mb-8">
                <div className="flex items-center">
                  <Check className="text-green-400 mr-3" size={20} />
                  <span>プレミアム機能へのフルアクセス</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-green-400 mr-3" size={20} />
                  <span>優先サポート</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-green-400 mr-3" size={20} />
                  <span>広告なし体験</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-green-400 mr-3" size={20} />
                  <span>高品質コンテンツ</span>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => handleSubscribe(plan)}
                loading={subscribing === plan.uid}
                variant="glassBrand"
                disabled={subscribing !== null}
              >
                {subscribing === plan.uid ? "処理中..." : "プランを選択"}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl text-white font-bold text-center mb-8">
            よくある質問
          </h2>
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-400">
                いつでもキャンセルできますか？
              </h3>
              <p className="text-gray-300">
                はい、いつでもキャンセルできます。請求期間の終了時にサブスクリプションが終了します。
              </p>
            </div>
            <div className="glass-card p-6 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-400">
                支払い方法は何ですか？
              </h3>
              <p className="text-gray-300">
                Stripeを通じてクレジットカードでお支払いいただけます。安全で確実な決済システムです。
              </p>
            </div>
            <div className="glass-card p-6 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-400">
                プランは変更できますか？
              </h3>
              <p className="text-gray-300">
                現在のプランをキャンセルして、新しいプランに再登録していただく必要があります。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPlansPage;
