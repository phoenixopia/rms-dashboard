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
} from "lucide-react";

export interface RouteItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const roleRoutes: Record<string, RouteItem[]> = {
  super_admin: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/restaurants", label: "Restaurants", icon: Building },
    { href: "/admins", label: "Admins", icon: Users },
    { href: "/subscriptions", label: "Subscriptions", icon: BadgeDollarSign },
    { href: "/roles", label: "Roles", icon: ShieldCheck },
    { href: "/social-media", label: "Approve Videos", icon: Video },
    { href: "/logs", label: "Logs", icon: FileClock },
    { href: "/tickets", label: "Support Tickets", icon: Ticket },
    { href: "/settings", label: "Settings", icon: Settings },
  ],
  restaurant_admin: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
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
