// hooks/usePayment.ts

import { paymentApiClient } from "@/infrastructure/payment/payemntAPIClient";
import { SubscriptionPlan, SubscriptionStatus } from "@/types/payment/types";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useSubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await paymentApiClient.getSubscriptionPlans();
      setPlans(response.results);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "プランの取得に失敗しました"
      );
      toast.error("プランの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return { plans, loading, error, refetch: fetchPlans };
};

export const useSubscriptionStatus = () => {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await paymentApiClient.getSubscriptionStatus();
      setStatus(response);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ステータスの取得に失敗しました"
      );
      toast.error("サブスクリプション状態の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const cancelSubscription = async () => {
    try {
      const response = await paymentApiClient.cancelSubscription();
      toast.success(response.detail);
      await fetchStatus(); // Refresh status
      return true;
    } catch (err) {
      toast.error("サブスクリプションのキャンセルに失敗しました");
      return false;
    }
  };

  return {
    status,
    loading,
    error,
    refreshStatus: fetchStatus,
    cancelSubscription,
  };
};

export const useProductPurchase = () => {
  const [loading, setLoading] = useState(false);

  const purchaseProduct = async (
    productId: string,
    amount: number,
    quantity: number = 1
  ) => {
    setLoading(true);
    try {
      const checkoutData = {
        product_id: productId,
        amount: amount.toString(),
        success_url: `${window.location.origin}/payment/product-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/payment/cancel`,
        quantity: quantity,
      };

      const response = await paymentApiClient.createProductCheckout(
        checkoutData
      );

      // Redirect to Stripe Checkout
      window.location.href = response.checkout_url;
      return true;
    } catch (error) {
      console.error("Failed to create product checkout:", error);
      toast.error("チェックアウトの作成に失敗しました");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { purchaseProduct, loading };
};
