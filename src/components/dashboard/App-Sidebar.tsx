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

interface SidebarProps {
  routes: RouteItem[];
}

export function AppSidebar({ routes }: SidebarProps) {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarContent className="bg-background">
        <SidebarGroup className="relative">
          <SidebarGroupLabel>
            <h1 className="text-xl font-bold">Dashboared</h1>
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
                        <span>{route.label}</span>
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
