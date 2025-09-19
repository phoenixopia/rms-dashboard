"use server";
import { Activity, Building2, DollarSign, User, Users } from "lucide-react";
import { Card,CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Dashboard from "@/components/restaurant/dashboard/Dashboard";
import { getStatTransactions } from "@/actions/transactions/api";

export default async function  AdminDashboard() {
  let error: string | null = null;
  let data:any = [];
 
  try{
   data = await getStatTransactions();
  console.log(data,"Transaction Stats:");
  }
  catch (err: any) {
    console.error("Error fetching transaction data:", err);
    error = `Failed to load transactions. Please try again later.${err}`;
  }
  return (
    <Dashboard data={data?.data?.transactions} />
  );
}
