export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface SPUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
}

export interface Ticket {
  id: string;
  restaurant_id: string;
  branch_id: string | null;
  user_id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  User: SPUser;
}

export interface TicketsResponse {
  total: number;
  tickets: Ticket[];
  page: number;
  totalPages: number;
}

export interface TicketFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: "ASC" | "DESC";
  status?: string;
  priority?: string;
}

export interface BackResponse {
  success: boolean;
  message: string;
  data: TicketsResponse;
}
