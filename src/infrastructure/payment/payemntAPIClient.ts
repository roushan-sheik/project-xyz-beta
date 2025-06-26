import Cookies from "js-cookie";
import {
  SubscriptionPlansResponse,
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
  ConfirmSubscriptionRequest,
  ConfirmSubscriptionResponse,
  SubscriptionStatus,
  CancelSubscriptionResponse,
  CreateProductCheckoutRequest,
  CreateProductCheckoutResponse,
  VerifyProductPurchaseResponse,
  ApiError,
} from "@/types/payment/types";
import { baseUrl } from "@/constants/baseApi";

class PaymentAPIClient {
  private baseURL = baseUrl;

  private getAuthHeaders(): HeadersInit {
    const token =
      Cookies.get("accessToken") || localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  // Subscription Plans
  async getSubscriptionPlans(): Promise<SubscriptionPlansResponse> {
    const response = await fetch(
      `${this.baseURL}/payment/subscription/plans/`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );

    return this.handleResponse<SubscriptionPlansResponse>(response);
  }

  // Create Subscription Checkout Session
  async createSubscriptionCheckout(
    data: CreateCheckoutSessionRequest
  ): Promise<CreateCheckoutSessionResponse> {
    const response = await fetch(
      `${this.baseURL}/payment/subscription/subscribe/`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    return this.handleResponse<CreateCheckoutSessionResponse>(response);
  }

  // Confirm Subscription
  async confirmSubscription(
    data: ConfirmSubscriptionRequest
  ): Promise<ConfirmSubscriptionResponse> {
    const response = await fetch(
      `${this.baseURL}/payment/subscription/confirm/`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    return this.handleResponse<ConfirmSubscriptionResponse>(response);
  }

  // Get Subscription Status
  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    const response = await fetch(
      `${this.baseURL}/payment/subscription/status/`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );

    return this.handleResponse<SubscriptionStatus>(response);
  }

  // Cancel Subscription
  async cancelSubscription(): Promise<CancelSubscriptionResponse> {
    const response = await fetch(
      `${this.baseURL}/payment/subscription/cancel/`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
      }
    );

    return this.handleResponse<CancelSubscriptionResponse>(response);
  }

  // Create Product Checkout
  async createProductCheckout(
    data: CreateProductCheckoutRequest
  ): Promise<CreateProductCheckoutResponse> {
    const response = await fetch(`${this.baseURL}/payment/product/create/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<CreateProductCheckoutResponse>(response);
  }

  // Verify Product Purchase
  async verifyProductPurchase(
    sessionId: string
  ): Promise<VerifyProductPurchaseResponse> {
    const response = await fetch(
      `${this.baseURL}/payment/product/verify/?session_id=${sessionId}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );

    return this.handleResponse<VerifyProductPurchaseResponse>(response);
  }
}

export const paymentApiClient = new PaymentAPIClient();
