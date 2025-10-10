"use client";
import { AppSidebar } from "@/components/dashboard/App-Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashBoardHeader";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import { allRoutes, filterRoutesByPermission } from "@/lib/roleRoutes";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);



  useEffect(() => {
    if (user !== null) {
      setAuthChecked(true);
      
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.requiresPasswordChange) {
        router.push("/change-password");
      }
    }
  }, [isAuthenticated, user, router]);

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.requiresPasswordChange) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Redirecting...</p>
      </div>
    );
  }
  console.log(user,'user info')
  const routes = user ? filterRoutesByPermission(allRoutes, user) : [];
   console.log(routes,'routes details')
  if (!routes || routes.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>No dashboard routes defined for your role.</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar routes={routes} />
      <div className="flex min-h-full w-full flex-col">
        <DashboardHeader />
        <main className="bg bg-background flex flex-1 flex-col px-4">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}