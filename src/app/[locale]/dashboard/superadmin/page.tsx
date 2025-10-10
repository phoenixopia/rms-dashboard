"use server";
import { Activity, Building2, DollarSign, User, Users } from "lucide-react";
import { Card,CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Dashboard from "@/components/restaurant/dashboard/Dashboard";

import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default async function  AdminDashboardPage() {
  let error: string | null = null;
  let data:any = [];
 

  return (
    <AdminDashboard />
  );
}
