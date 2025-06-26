"use client";
import React, { useState, useEffect } from "react";

import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { Loader2, Check, Clock } from "lucide-react";
import { SubscriptionPlan } from "@/types/payment/types";
import { paymentApiClient } from "@/infrastructure/payment/payemntAPIClient";

interface SubscriptionPlansProps {
  onPlanSelect?: (plan: SubscriptionPlan) => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  onPlanSelect,
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribingPlan, setSubscribingPlan] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await paymentApiClient.getSubscriptionPlans();
      setPlans(response.results);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      toast.error("プランの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    setSubscribingPlan(plan.uid);

    try {
      const checkoutData = {
        plan_id: plan.uid,
        success_url: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/payment/cancel`,
      };

      const response = await paymentApiClient.createSubscriptionCheckout(
        checkoutData
      );

      // Redirect to Stripe Checkout
      window.location.href = response.checkout_url;
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      toast.error("チェックアウトセッションの作成に失敗しました");
      setSubscribingPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          サブスクリプションプラン
        </h2>
        <p className="text-gray-300">あなたに最適なプランを選択してください</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.uid}
            className="glass-card rounded-lg p-6 border-2 border-transparent hover:border-blue-500 transition-all duration-300"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-300 mb-4">{plan.description}</p>
              <div className="text-4xl font-bold text-blue-400 mb-2">
                ¥{plan.amount_jpy.toLocaleString()}
              </div>
              <p className="text-gray-400">{plan.billing_interval_label}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-3" />
                <span>プレミアム機能へのアクセス</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-3" />
                <span>無制限のコンテンツ</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Check className="h-5 w-5 text-green-400 mr-3" />
                <span>24/7 サポート</span>
              </div>
              {plan.billing_interval === "six_months" && (
                <div className="flex items-center text-gray-300">
                  <Check className="h-5 w-5 text-green-400 mr-3" />
                  <span>6ヶ月プランで10%お得</span>
                </div>
              )}
            </div>

            <Button
              className="w-full"
              onClick={() => handleSubscribe(plan)}
              loading={subscribingPlan === plan.uid}
              disabled={!plan.is_active || subscribingPlan !== null}
              variant="glassBrand"
            >
              {subscribingPlan === plan.uid ? "処理中..." : "プランを選択"}
            </Button>

            {!plan.is_active && (
              <p className="text-center text-red-400 mt-2 text-sm">
                このプランは現在利用できません
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
