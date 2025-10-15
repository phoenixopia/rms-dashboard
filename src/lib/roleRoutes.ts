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
  Warehouse,
  Utensils,
  Camera,
  CreditCard,
  LucideIcon,
  Banknote,
  Folder,
  DollarSign,
  Logs

} from "lucide-react";

export interface RouteItem {
  href: string;
  label: string;
  icon: LucideIcon;
  permission?: string; 
  roles?: string[]; 
}

export const allRoutes: RouteItem[] = [

      {
      href: "/dashboard/superadmin",
      label: "Dashboard",
      icon: LayoutDashboard,
      permission: "",
      roles: ["super_admin"]
    },
    {
      href: "/dashboard/superadmin/restaurant",
      label: "Restaurants",
      icon: Building,
      permission: "",
      roles: ["super_admin"]
    },

    { href: "/dashboard/superadmin/admins", 
      label: "Admins",
       icon: Users ,
      permission: "",
      roles: ["super_admin"]
      },
    { href: "/dashboard/superadmin/role", 
      label: "Roles",
       icon: ShieldCheck,
            permission: "create_role",
      roles: ["super_admin"] },
    {
       href: "/dashboard/superadmin/plan",
       label: "Plans", 
       icon: Banknote,
            permission: "",
      roles: ["super_admin"] },
    {
      href: "/dashboard/superadmin/subscription",
      label: "Subscriptions",
      icon: BadgeDollarSign,
            permission: "",
      roles: ["super_admin"]
    },
    {
      href: "/dashboard/superadmin/support-tickets",
      label: "Support Tickets",
      icon: Ticket,
            permission: "",
      roles: ["super_admin"]
    },
    {
      href: "/dashboard/superadmin/videos",
      label: "Media Management",
      icon: Video,
            permission: "",
      roles: ["super_admin"]
    },
    {
      href: "/dashboard/superadmin/activity-log",
      label: "Activity Logs",
      icon: FileClock,
            permission: "",
      roles: ["super_admin"]
    },

    {
      href: "/dashboard/superadmin/settings",
      label: "Settings",
      icon: Settings,
            permission: "",
      roles: ["super_admin"]
    },
    {
       href: "/dashboard/superadmin/admins", 
       label: "Admins", 
       icon: Users,
       permission: "",
       roles: ["super_admin"] },
    { 
      href: "/dashboard/superadmin/role", 
      label: "Roles", 
      icon: ShieldCheck,
      permission: "",
      roles: ["super_admin"] },
    { 
      href: "/dashboard/superadmin/plan", 
      label: "Plans", 
      icon: Banknote,
      permission: "",
      roles: ["super_admin"]
     },
    { href: "/subscriptions", 
      label: "Subscriptions", 
      icon: BadgeDollarSign,
      permission: "",
      roles: ["super_admin"] },
    { 
      href: "/social-media", 
      label: "Approve Videos", 
      icon: Video,
      permission: "",
      roles: ["super_admin"] },
    { 
      href: "/logs", 
      label: "Logs", 
      icon: FileClock,
       permission: "",
      roles: ["super_admin"] },
    { 
      href: "/tickets", 
      label: "Support Tickets", 
      icon: Ticket,
       permission: "",
      roles: ["super_admin"] },
    { href: "/settings", 
      label: "Settings", 
      icon: Settings,
       permission: "",
      roles: ["super_admin"] },

    {
      href: "/dashboard/restaurant",
      label: "Dashboard",
      icon: LayoutDashboard,
      permission: "",
      roles: ["restaurant_admin"]
    },
    { href: "/dashboard/restaurant/role", 
      label: "Role", 
      icon: UserCog,
      permission: "",
      roles: ["restaurant_admin"]
     },
    { href: "/dashboard/restaurant/staff",
       label: "staff", icon: UserCog,
          permission: "",
      roles: ["restaurant_admin"] },
    { href: "/dashboard/restaurant/branch", label: "branch", icon: Store,
          permission: "",
      roles: ["restaurant_admin"]
     },
    { href: "/dashboard/restaurant/menu", label: "Menu", icon: ListOrdered,
          permission: "",
      roles: ["restaurant_admin"]
     },
    { href: "/dashboard/restaurant/menu-categories", 
      label: "Menu Categories",
       icon: Folder,
      permission: "",
      roles: ["restaurant_admin"]
     },
    { href: "/dashboard/restaurant/menu-items", label: "Menu Items", icon: ListOrdered,
          permission: "",
      roles: ["restaurant_admin"]
     },
    { href: "/dashboard/restaurant/tables", label: "Tables", icon: Utensils,
          permission: "",
      roles: ["restaurant_admin"]
     },
    { href: "/dashboard/restaurant/orders", label: "Orders", icon: ShoppingBasket,
          permission: "",
      roles: ["restaurant_admin"]
     },
    { href: "/dashboard/restaurant/catering", label: "Catering", icon: Utensils,
          permission: "",
      roles: ["restaurant_admin"]
     },
    { href: "/dashboard/restaurant/catering-requests", label: "Catering Requests", icon: Utensils,
          permission: "",
      roles: ["restaurant_admin"]
     },
    { href: "/dashboard/restaurant/accepted-catering-requests", label: "Accepted Catering Requests", icon: Utensils,
          permission: "",
      roles: ["restaurant_admin"]
     },
    { href: "/dashboard/restaurant/social-media", label: "Social Media", icon: Camera,
          permission: "",
      roles: ["restaurant_admin"]
     },
    { href: "/dashboard/restaurant/subscription", label: "Subscription", icon: CreditCard,
          permission: "",
      roles: ["restaurant_admin"]
     },
    { href: "/dashboard/restaurant/transactions", label: "Transactions", icon: DollarSign,
          permission: "",
      roles: ["restaurant_admin"]
     },
    { href: "/dashboard/restaurant/activity-logs", label: "Activity Logs", icon: Logs ,
          permission: "",
      roles: ["restaurant_admin"]
    },
    { href: "/dashboard/restaurant/support-ticket", label: "Support Ticket", icon: Ticket,
          permission: "",
      roles: ["restaurant_admin"]
     },
    { href: "/dashboard/restaurant/settings", 
      label: "Settings", icon: Settings,
          permission: "",
      roles: ["restaurant_admin"]
     },


    { 
      href: "/dashboard/staff", 
      label: "Dashboard", 
      icon: LayoutDashboard,
      permission: "",
      roles: ["staff"] 
    },
    { 
      href: "/dashboard/staff/orders", 
      label: "Orders", 
      icon: ShoppingBasket,
      permission: "",
      roles: ["staff"] 
     },
         { 
      href: "/dashboard/staff/inventory", 
      label: "Inventory", 
      icon: Warehouse,
      permission: "",
      roles: ["staff"] 
     },
    { 
      href: "/settings", 
      label: "Settings", 
      icon: Settings,
      permission: "",
      roles: ["staff"]  },
  ]
;


export const hasPermission = (user: any, permission: string): boolean => {
 
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
};

export const filterRoutesByPermission = (routes: RouteItem[], user: any): RouteItem[] => {

     console.log(user,'user permissions')
    

  return routes.filter(route => {
        
    if ((route.roles?.length !== 0) && route.roles && !route.roles.includes(user.role_tag)) {
      return false;
    }
    

    if (route.permission && route.permission !== "") {
      return hasPermission(user, route.permission);
    }
    
    return true;
  });
};