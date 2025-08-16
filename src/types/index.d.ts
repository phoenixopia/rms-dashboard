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
  id: string;
  name: string;
}

export interface UserPermissions {
  fromRole: Permission[];
  fromUser: Permission[];
}

export interface User {
  id: string;
  email?: string | null;
  full_name: string;
  phone_number?: string | null;
  profile_picture?: string | null;
  is_active: boolean;
  Role: {
    id: string;
    name: string;
    total_permission: string;
  };

  RoleTag: {
    id: string;
    name: string;
  };
}

export interface UsersResponse {
  total: number;
  page: number;
  pages: number;
  data: User[];
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
  full_name: string;
  email?: string | null;
  phone_number: string | null;
  profile_picture?: string | null;
  role_tag?: string | null;
  role_name?: string | null;
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

// Roles
// export interface Permission {
//   id: string;
//   name: string;
// }

export interface RoleData {
  id: string;
  name: string;
  description: string;
  role_tag: Permission;
  restaurant_name?: string | null;
  permission_count: number;

  permissions: Permission[];
}

export interface RolePagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  roles: RoleData[];
}

export interface RoleResponse {
  success: boolean;
  message: string;
  data: RolePagination;
}

export interface SingleRoleResponse {
  success: boolean;
  message: string;
  data: RoleData;
}

export interface PermissionsApiResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    permissions: Permission[];
  };
}

// Role Tag
export interface RoleTagResponse {
  success: boolean;
  message: string;
  data: RoleTag[];
}

export interface RoleTag {
  id: string;
  name: string;
  description: string;
}
