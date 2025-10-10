"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getAuthToken } from "@/auth/auth";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// Swapping out Super Admin icons for Staff-relevant operational icons
import { ClipboardList, DollarSign, Utensils, Zap, Users } from "lucide-react";



const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// COLORS are re-used
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// ======== Type Definitions for Staff Dashboard ========

type StaffMetrics = {
  totalOrders: number;
  totalRevenue: number;
  activeTickets: number;
  staffOnShift: number;
};

type Order = {
  id: string;
  table_number: number;
  status: 'pending' | 'served' | 'paid' | 'cancelled';
  total_amount: number;
  createdAt: string;
};

type MenuItem = {
  id: number;
  name: string;
  price: number;
  is_active: boolean;
  categoryName: string; // Assumed combined field for display
};

type OrderStatusData = {
  name: string;
  value: number;
};

// ======== Component ========

export default function StaffDashboard() {
  const [metrics, setMetrics] = useState<StaffMetrics>({
    totalOrders: 0,
    totalRevenue: 0,
    activeTickets: 0,
    staffOnShift: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusData[]>([]);
  // Placeholder for the staff member's assigned branch ID
  const [branchId, setBranchId] = useState<string | null>(null);

  // === Fetch Dashboard Data ===
  const fetchDashboardData = async () => {
    let token: string | null = null;
    let currentBranchId: string | null = null;

    try {
      token = await getAuthToken();
    } catch (err) {
      console.error("No auth token found:", err);
      toast.error("You are not logged in. Redirecting to login...");
      window.location.href = "/login";
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    try {
        // 1. Fetch User Info to get the Branch ID (Inferred Endpoint)
        // A staff user is assigned to a branch [cite: 1693, 1533]
        const resUser = await axios.get(`${API_BASE}/user/my-details`, { headers });
        currentBranchId = resUser.data?.branch_id;
        if (!currentBranchId) {
            toast.error("User is not assigned to a branch.");
            return;
        }
        setBranchId(currentBranchId);

        // 2. Fetch Operational Data for the Branch (Inferred Endpoints)
        const [resMetrics, resOrders, resStatus] = await Promise.all([
            // Inferred: Get daily/shift metrics for the assigned branch
            axios.get(`${API_BASE}/branch/${currentBranchId}/metrics/today`, { headers }),
            // Inferred: Get the 10 most recent orders for the assigned branch
            axios.get(`${API_BASE}/order/list-recent?branchId=${currentBranchId}&limit=10`, { headers }),
            // Inferred: Get the count of orders by status for the pie chart
            axios.get(`${API_BASE}/order/status-summary?branchId=${currentBranchId}`, { headers }),
        ]);

        setMetrics({
            totalOrders: resMetrics.data?.totalOrders || 0,
            totalRevenue: resMetrics.data?.totalRevenue || 0,
            activeTickets: resMetrics.data?.activeTickets || 0,
            staffOnShift: resMetrics.data?.staffOnShift || 0,
        });

        setRecentOrders(resOrders.data?.orders || []);
        
        // Transform status data for Pie Chart
        setOrderStatusData([
            { name: "Pending", value: resStatus.data?.pending || 0 },
            { name: "Preparing", value: resStatus.data?.preparing || 0 },
            { name: "Ready/Served", value: resStatus.data?.served || 0 },
        ]);

    } catch (error) {
      console.error("Error fetching staff dashboard data:", error);
      toast.error("Failed to load operational data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Static data structure for daily revenue chart (re-used logic from SuperAdmin dashboard)
  const dailyRevenueData = [
    { name: "Mon", revenue: 400 },
    { name: "Tue", revenue: 500 },
    { name: "Wed", revenue: 350 },
    { name: "Thu", revenue: 700 },
    { name: "Fri", revenue: 950 },
    { name: "Sat", revenue: 1200 },
    { name: "Sun", revenue: 800 },
  ];

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
        case 'paid': return 'text-green-600';
        case 'pending': return 'text-yellow-600';
        case 'cancelled': return 'text-red-600';
        case 'served': return 'text-blue-600';
        default: return 'text-gray-600';
    }
  }

  return (
<div>staff dashboard page</div>
  );
}