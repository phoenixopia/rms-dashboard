"use client";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import RestaurantAdminDashboard from "@/components/dashboard/restaurant_admin/Dashboard";
import { useAuth } from "@/lib/auth";
import React from "react";

export default function DashboardNavigator() {
  const { user } = useAuth();
  return user?.role_tag === "super_admin" ? (
    <AdminDashboard />
  ) : (
    <AdminDashboard />
    // <RestaurantAdminDashboard />
  );
}
