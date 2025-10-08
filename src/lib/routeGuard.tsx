"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { filterRoutesByPermission } from "./roleRoutes";
import type { RouteItem } from "./roleRoutes";

interface RouteGuardProps {
  user: any;
  routes: RouteItem[];
  children: React.ReactNode;
}

export const RouteGuard = ({ user, routes, children }: RouteGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const pathWithoutLocale = pathname.replace(/^\/(en|am|amh|fr|ar)(?=\/|$)/, "");

    const allowedRoutes = filterRoutesByPermission(routes, user);

    const isAllowed = allowedRoutes.some(route =>
      pathWithoutLocale.startsWith(route.href)
    );

    if (!isAllowed) {
      router.push("/403");
    }
  }, [user, pathname, router, routes]);

  return <>{children}</>;
};
