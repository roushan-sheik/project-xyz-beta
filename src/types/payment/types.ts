export interface SubscriptionPlan {
  uid: string;
  name: string;
  description: string;
  amount_jpy: number;
  billing_interval: string;
  billing_interval_label: string;
  is_active: boolean;
}

export interface SubscriptionPlansResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SubscriptionPlan[];
}

export interface CreateCheckoutSessionRequest {
  plan_id: string;
  success_url: string;
  cancel_url: string;
}

export interface CreateCheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
}

export interface ConfirmSubscriptionRequest {
  session_id: string;
}

export interface ConfirmSubscriptionResponse {
  detail: string;
  is_premium: boolean;
  status: string;
  current_period_end: string;
}

export interface SubscriptionStatus {
  has_subscription: boolean;
  is_premium: boolean;
  plan_name: string;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface CancelSubscriptionResponse {
  detail: string;
  ends_on: string;
}

export interface CreateProductCheckoutRequest {
  product_id: string;
  amount: string;
  success_url: string;
  cancel_url: string;
  quantity: number;
}

export interface CreateProductCheckoutResponse {
  checkout_url: string;
}

export interface VerifyProductPurchaseResponse {
  status: string;
  stripe_order_id: string;
  amount: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}
