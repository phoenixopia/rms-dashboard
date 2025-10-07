"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import { RouteItem } from "@/lib/roleRoutes";
import { useRouteGuard } from "@/lib/useRouteGuard";
import { use } from "react";
import { useTranslations } from "use-intl";
import AccessDenied from "../AccessDenied";
interface SidebarProps {
  routes: RouteItem[];
}

export function AppSidebar({ routes }: SidebarProps) {
  const pathname = usePathname();
  const t =useTranslations("full");
    const { isAuthenticated, user } = useAuth();
  
  const accessState = useRouteGuard(user);


    if (accessState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (accessState === 'denied') {
    return <AccessDenied />;
  }
  return (
    <Sidebar className="bg-card z-100 border-none">
      <SidebarContent className="bg-card">
        <SidebarGroup className="relative">
          <SidebarGroupLabel className="flex flex-col items-start">
            <h1 className="text-xl font-bold">RMS</h1>
            <span className="text-xs">Admin Dashboared</span>
          </SidebarGroupLabel>
          <SidebarGroupContent className="pt-8">
            <SidebarMenu className="flex flex-col gap-2">
              {routes.map((route,key) => {
                const isActive = pathname.startsWith(route.href);
                return (
                  <SidebarMenuItem className="pl-4" key={key}>
                    <SidebarMenuButton
                      asChild
                      className={`${isActive ? "bg-muted" : ""}`}
                    >
                      <Link href={route.href} className="">
                        <route.icon className="h-4 w-4" />
                        <span>{t(`${route.label}`)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="text-muted-foreground text-xs">
        Developed By Phoenixopia
      </SidebarFooter>
    </Sidebar>
  );
}
