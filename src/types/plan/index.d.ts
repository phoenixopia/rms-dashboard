// Plans
export interface PlanLimit {
  id: string;
  plan_id: string;
  key: string;
  value: string | number | boolean;
  data_type: "number" | "boolean" | "string";
  description?: string | null;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  billing_cycle: "monthly" | "yearly";
  PlanLimits: PlanLimit[];
}

export interface PlansResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  plans: Plan[];
}

export interface RequestResponse {
  success: boolean;
  message: string;
  data: PlansResponse;
}
