// Restaurant

export interface Plan {
  id: number;
  name: string;
  price: number;
  billing_cycle: string;
}

export interface Subscription {
  plan_id: number;
  start_date: string;
  end_date: string;
  payment_method: string;
  status: string;
  Plan: Plan;
}

export interface SystemSetting {
  logo_url: string;
  images: string[];
}

export interface Restaurant {
  id: number;
  restaurant_name: string;
  status: string;
  SystemSetting: SystemSetting | null;
  Subscriptions: Subscription[];
}

export interface RestaurantsResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: Restaurant[];
}

export interface BackendResponse {
  success: boolean;
  message: string;
  data: RestaurantsResponse;
}

export type PermissionNames = string[];

export interface Permission {
  id: number;
  name: string;
}

export interface UserPermissions {
  fromRole: Permission[];
  fromUser: Permission[];
}

export interface User {
  id: string;
  email?: string | null;
  first_name: string;
  last_name: string;
  phone_number?: string | null;
  profile_picture?: string | null;
  is_active: boolean;
  role_id: number;
  created_by: number;
  permissions: UserPermissions;
}

export interface UsersResponse {
  total: number;
  page: number;
  limit: number;
  users: User[];
}

export interface BackendAdminResponse {
  success: boolean;
  message: string;
  data: UsersResponse;
}

// Login Data
export type PermissionNames = string[];

export interface AdminLoginData {
  id: string;
  role: string | null;
  permissions: PermissionNames;
  restaurant_id: string | null;
  branch_id: string | null;
  requiresPasswordChange?: boolean;
}

export interface BackendAdminLoginResponse {
  success: boolean;
  message: string;
  token: string;
  data: AdminLoginData;
}
