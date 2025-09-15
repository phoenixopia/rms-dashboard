import {
  LayoutDashboard,
  Building,
  Users,
  BadgeDollarSign,
  ShieldCheck,
  Video,
  FileClock,
  Ticket,
  Settings,
  UserCog,
  Store,
  ListOrdered,
  ShoppingBasket,
  Utensils,
  Camera,
  CreditCard,
  LucideIcon,
  Banknote,
} from "lucide-react";

export interface RouteItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const roleRoutes: Record<string, RouteItem[]> = {
  super_admin: [
    {
      href: "/dashboard/superadmin/overview",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/superadmin/restaurant",
      label: "Restaurants",
      icon: Building,
    },
    { href: "/dashboard/superadmin/admins", label: "Admins", icon: Users },
    { href: "/dashboard/superadmin/role", label: "Roles", icon: ShieldCheck },
    { href: "/dashboard/superadmin/plan", label: "Plans", icon: Banknote },
    {
      href: "/dashboard/superadmin/subscription",
      label: "Subscriptions",
      icon: BadgeDollarSign,
    },
    {
      href: "/dashboard/superadmin/support-tickets",
      label: "Support Tickets",
      icon: Ticket,
    },
    {
      href: "/dashboard/superadmin/videos",
      label: "Media Management",
      icon: Video,
    },
    {
      href: "/dashboard/superadmin/activity-log",
      label: "Activity Logs",
      icon: FileClock,
    },

    {
      href: "/dashboard/superadmin/settings",
      label: "Settings",
      icon: Settings,
    },
  ],
  restaurant_admin: [
    {
      href: "/dashboard/restaurantadmin/overview",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    { href: "/staff", label: "Staff", icon: UserCog },
    { href: "/branch", label: "Branch", icon: Store },
    { href: "/menu", label: "Menu", icon: ListOrdered },
    { href: "/orders", label: "Orders", icon: ShoppingBasket },
    { href: "/catering", label: "Catering", icon: Utensils },
    { href: "/social-media", label: "Social Media", icon: Camera },
    { href: "/transactions", label: "Transactions", icon: CreditCard },
    { href: "/settings", label: "Settings", icon: Settings },
  ],

  staff: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/orders", label: "Orders", icon: ShoppingBasket },
    { href: "/settings", label: "Settings", icon: Settings },
  ],
};
