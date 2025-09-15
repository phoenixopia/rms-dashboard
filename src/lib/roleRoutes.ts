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
     { href: "/dashboard/restaurant/orders", label: "Orders", icon: ShoppingBasket },
    { href: "/subscriptions", label: "Subscriptions", icon: BadgeDollarSign },
    { href: "/social-media", label: "Approve Videos", icon: Video },
    { href: "/logs", label: "Logs", icon: FileClock },
    { href: "/tickets", label: "Support Tickets", icon: Ticket },
    { href: "/settings", label: "Settings", icon: Settings },
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
     { href: "/dashboard/restaurant/orders", label: "Orders", icon: ShoppingBasket },
    { href: "/catering", label: "Catering", icon: Utensils },
    { href: "/social-media", label: "Social Media", icon: Camera },
    { href: "/transactions", label: "Transactions", icon: CreditCard },
    { href: "/settings", label: "Settings", icon: Settings },
  ],

  staff: [
  {
    href: "/dashboard/staff/overview",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  { href: "/dashboard/restaurant/orders", label: "Orders", icon: ShoppingBasket },
  {
    href: "/dashboard/staff/inventory",
    label: "Inventory",
    icon: ListOrdered,
  },
  {
    href: "/dashboard/staff/menu",
    label: "Menu",
    icon: Utensils,
  },
  {
    href: "/dashboard/staff/shifts",
    label: "Shifts",
    icon: FileClock,
  },
  {
    href: "/dashboard/staff/settings",
    label: "Settings",
    icon: Settings,
  },
],
};
