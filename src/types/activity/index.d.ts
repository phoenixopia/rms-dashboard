export interface LogBackResponse {
  success: boolean;
  message: string;
  data: LogResponse;
}

export interface LogResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: ActivityLog[];
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
}

export interface ActivityLog {
  id: string;
  user?: User | null;
  customer?: User | null;
  module: string;
  action: string;
  // details?: Record<string, any>;
  created_at: string;
}
