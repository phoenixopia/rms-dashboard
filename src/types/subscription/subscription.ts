export interface Subscription {
  id: string;
  restaurant_name: string | null;
  plan_name: string | null;
  billing_cycle: string | null;
  payment_method: string | null;
  start_date: string;
  end_date: string;
  receipt: string | null;
  status: "active" | "pending" | "inactive" | "cancelled" | "expired";
  // created_at: string;
}

export interface SubscriptionResponse {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  data: Subscription[];
}

export interface SResponse {
  success: boolean;
  message: string;
  data: SubscriptionResponse;
}
