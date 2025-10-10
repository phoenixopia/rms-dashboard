"use client";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import RestaurantAdminDashboard from "@/components/dashboard/restaurant_admin/Dashboard";
import { useAuth } from "@/lib/auth";
import React, { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";

export default function DashboardNavigator() {
  const router = useRouter();
  const { user } = useAuth();
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  useEffect(() => {
    if (user && user.role_tag == "restaurant_admin" && !isRedirecting) {
      setIsRedirecting(true);
      router.push("/dashboard/restaurant");
    } else if (user && user.role_tag == "super_admin" && !isRedirecting) {
      setIsRedirecting(true);
      router.push("/dashboard/superadmin");
    } else if (user && user.role_tag == "staff" && !isRedirecting) {
      setIsRedirecting(true);
      router.push("/dashboard/staff");
    }
  }, [user, router, isRedirecting]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }


  if (isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Redirecting...</p>
      </div>
    );
  }
  console.log(user,'user details')
  return (
    
    user.role_tag === "super_admin" ? (
    <AdminDashboard />
  ) : user.role_tag === "restaurant_admin" ?(
    <RestaurantAdminDashboard />
  ):user.role_tag === "staff" ?(
    <RestaurantAdminDashboard />
  ):(<div className="flex min-h-screen items-center justify-center">
        <p>Unauthorized Access</p>
      </div>)
  )
}