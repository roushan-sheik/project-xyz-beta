// hooks/useSubscriptionGuard.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  subscriptionApiClient,
  SubscriptionStatus,
} from "@/infrastructure/subscription/subscriptionAPIClient";
import Cookies from "js-cookie";

export const useSubscriptionGuard = (redirectToPlans: boolean = true) => {
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const token =
          localStorage.getItem("accessToken") || Cookies.get("accessToken");

        if (!token) {
          // User not logged in, redirect to login
          router.push("/login");
          return;
        }

        const status = await subscriptionApiClient.getSubscriptionStatus();
        setSubscriptionStatus(status);

        // If user doesn't have an active subscription and redirectToPlans is true
        if (
          redirectToPlans &&
          (!status.has_subscription || status.status !== "active")
        ) {
          router.push("/subscription-plans");
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error("Subscription check failed:", err);
        setError("Failed to check subscription status");

        // If API call fails, might be due to invalid token
        // Clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("role");

        router.push("/login");
      }
    };

    checkSubscription();
  }, [router, redirectToPlans]);

  const refreshSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const status = await subscriptionApiClient.getSubscriptionStatus();
      setSubscriptionStatus(status);
      setLoading(false);
    } catch (err) {
      console.error("Failed to refresh subscription status:", err);
      setError("Failed to refresh subscription status");
      setLoading(false);
    }
  };

  return {
    subscriptionStatus,
    loading,
    error,
    refreshSubscriptionStatus,
    hasActiveSubscription:
      subscriptionStatus?.has_subscription &&
      subscriptionStatus?.status === "active",
    isPremium: subscriptionStatus?.is_premium || false,
  };
};
