import { baseUrl } from "@/constants/baseApi";

export interface SubscriptionPlan {
  uid: string;
  name: string;
  description: string;
  amount_jpy: number;
  billing_interval: string;
  billing_interval_label: string;
  is_active: boolean;
}

export interface SubscriptionStatus {
  has_subscription: boolean;
  is_premium: boolean;
  plan_name: string;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface CheckoutResponse {
  checkout_url: string;
  session_id: string;
}

export interface ConfirmResponse {
  detail: string;
  is_premium: boolean;
  status: string;
  current_period_end: string;
}

class SubscriptionAPIClient {
  private getAuthHeaders() {
    const token = localStorage.getItem("accessToken");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  async getSubscriptionPlans(): Promise<{ results: SubscriptionPlan[] }> {
    const response = await fetch(`${baseUrl}/payment/subscription/plans/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch subscription plans");
    }

    return response.json();
  }

  async createCheckoutSession(
    planId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutResponse> {
    const response = await fetch(`${baseUrl}/payment/subscription/subscribe/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        plan_id: planId,
        success_url: successUrl,
        cancel_url: cancelUrl,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    return response.json();
  }

  async confirmSubscription(sessionId: string): Promise<ConfirmResponse> {
    const response = await fetch(`${baseUrl}/payment/subscription/confirm/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to confirm subscription");
    }

    return response.json();
  }

  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    const response = await fetch(`${baseUrl}/payment/subscription/status/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch subscription status");
    }

    return response.json();
  }

  async cancelSubscription(): Promise<{ detail: string; ends_on: string }> {
    const response = await fetch(`${baseUrl}/payment/subscription/cancel/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to cancel subscription");
    }

    return response.json();
  }
}

export const subscriptionApiClient = new SubscriptionAPIClient();
