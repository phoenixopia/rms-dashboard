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
import { RouteItem } from "@/lib/roleRoutes";
import { use } from "react";
import { useTranslations } from "use-intl";
interface SidebarProps {
  routes: RouteItem[];
}

export function AppSidebar({ routes }: SidebarProps) {
  const pathname = usePathname();
  const t =useTranslations("full");
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
              {routes.map((route) => {
                const isActive = pathname.startsWith(route.href);
                return (
                  <SidebarMenuItem className="pl-4" key={route.href}>
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
