export type VideoStatus = "pending" | "approved" | "rejected";

export interface RestaurantInfo {
  id: string;
  restaurant_name: string;
  SystemSetting?: {
    logo_url?: string;
  };
}

export interface Video {
  id: string;
  restaurant_id: string;
  branch_id: string | null;
  uploaded_by: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url: string;
  menu_item_id: string;
  duration: number;
  status: "pending" | "approved" | "rejected";
  is_featured: boolean;
  createdAt: string;
  updatedAt?: string;
  Restaurant?: RestaurantInfo;
}

export interface VideoListResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    has_next_page: boolean;
    rows: Video[];
  };
}
