"use client";
import { AppSidebar } from "@/components/dashboard/App-Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import { roleRoutes } from "@/lib/roleRoutes";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const userRole = user.role;
  const routes = userRole ? roleRoutes[userRole] : [];

  if (!routes || routes.length === 0) {
    // Handle case where user role does not have defined routes
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
        <main className="bg bg-background flex flex-1 flex-col px-4">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
