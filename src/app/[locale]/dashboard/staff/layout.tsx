"use client";

import { RouteGuard } from "@/lib/routeGuard";
import { allRoutes } from "@/lib/roleRoutes";
import { useAuth } from "@/lib/auth";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {

  const { isAuthenticated, user } = useAuth();



  return (
    <RouteGuard user={user} routes={allRoutes}>
      {children}
    </RouteGuard>
  );
}
