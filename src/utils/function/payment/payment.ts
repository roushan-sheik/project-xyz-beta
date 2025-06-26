import { SubscriptionStatus } from "@/types/payment/types";

export const formatPrice = (
  amount: number,
  currency: string = "JPY"
): string => {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getSubscriptionStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "active":
      return "text-green-400";
    case "canceled":
    case "cancelled":
      return "text-red-400";
    case "past_due":
      return "text-yellow-400";
    case "unpaid":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
};

export const getSubscriptionStatusText = (
  status?: SubscriptionStatus
): string => {
  if (!status?.has_subscription) return "サブスクリプションなし";

  switch (status.status) {
    case "active":
      return status.cancel_at_period_end ? "キャンセル予定" : "アクティブ";
    case "canceled":
      return "キャンセル済み";
    case "past_due":
      return "支払い遅延";
    case "unpaid":
      return "未払い";
    default:
      return status.status;
  }
};

export const isSubscriptionActive = (status?: SubscriptionStatus): boolean => {
  return (
    status?.has_subscription &&
    status?.status === "active" &&
    !status?.cancel_at_period_end
  );
};

export const isSubscriptionExpiring = (
  status?: SubscriptionStatus
): boolean => {
  if (!status?.current_period_end) return false;

  const endDate = new Date(status.current_period_end);
  const now = new Date();
  const daysUntilExpiry = Math.ceil(
    (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
};

export const getDaysUntilExpiry = (status?: SubscriptionStatus): number => {
  if (!status?.current_period_end) return 0;

  const endDate = new Date(status.current_period_end);
  const now = new Date();
  return Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

export const calculateDiscountPercent = (
  originalPrice: number,
  discountedPrice: number
): number => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

export const getRecommendedPlan = (
  monthlyPrice: number,
  sixMonthPrice: number
): "monthly" | "six_months" => {
  const monthlyTotal = monthlyPrice * 6;
  const savings = monthlyTotal - sixMonthPrice;
  const savingsPercent = (savings / monthlyTotal) * 100;

  return savingsPercent >= 10 ? "six_months" : "monthly";
};

export const validatePaymentAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 999999; // Max amount for JPY
};

export const sanitizeProductId = (productId: string): string => {
  return productId.replace(/[^a-zA-Z0-9_-]/g, "_");
};
