"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getAuthToken } from "@/auth/auth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Store, User, CreditCard } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// ======== Type Definitions ========
type Restaurant = {
  id: string;
  restaurant_name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type Subscription = {
  id: string;
  restaurant_name: string;
  plan_name: string;
  billing_cycle: string;
  payment_method: string;
  start_date: string;
  end_date: string;
  receipt: string | null;
  status: string;
};

// ======== Component ========
export default function SuperAdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalRestaurants: 0,
    totalAdmins: 0,
    totalSubscriptions: 0,
  });

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // === Fetch Dashboard Data ===
  const fetchDashboardData = async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        toast.error("You are not logged in. Redirecting...");
        window.location.href = "/login";
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [resRestaurants, resUsers, resSubscriptions] = await Promise.all([
        axios.get(`${API_BASE}/restaurant/all-registered-restaurants?page=${page}&limit=${limit}`, { headers }),
        axios.get(`${API_BASE}/user/get-all-users`, { headers }),
        axios.get(`${API_BASE}/subscription/list-all?page=${page}&limit=${limit}`, { headers }),
      ]);

      const restaurantData = resRestaurants.data?.data;
      const subscriptionData = resSubscriptions.data?.data;

      setMetrics({
        totalRestaurants: restaurantData?.total || 0,
        totalAdmins: resUsers.data?.data?.total || 0,
        totalSubscriptions: subscriptionData?.totalItems || 0,
      });

      setRestaurants(restaurantData?.data || []);
      setSubscriptions(subscriptionData?.data || []);
      setTotalPages(subscriptionData?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [page]);

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor restaurants, admins, and subscriptions.</p>
      </div>

      {/* METRIC CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Restaurants", value: metrics.totalRestaurants, icon: Store },
          { title: "Restaurant Admins", value: metrics.totalAdmins, icon: User },
          { title: "Total Subscriptions", value: metrics.totalSubscriptions, icon: CreditCard },
           { title: "total user", value: 0, icon: User },
        ].map((item, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Weekly Revenue */}
        <Card className="col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Weekly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { name: "Mon", revenue: 4000 },
                  { name: "Tue", revenue: 3000 },
                  { name: "Wed", revenue: 2000 },
                  { name: "Thu", revenue: 2780 },
                  { name: "Fri", revenue: 1890 },
                  { name: "Sat", revenue: 2390 },
                  { name: "Sun", revenue: 3490 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Pie Chart */}
        <Card className="col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex h-[350px] items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Restaurant Admins", value: metrics.totalAdmins },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* REGISTERED RESTAURANTS TABLE */}
<Card className="border-none shadow-sm mt-6">
  <CardHeader>
    <CardTitle>Registered Restaurants</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Created At</th>
            <th className="p-3 text-left">Updated At</th>
          </tr>
        </thead>
        <tbody>
          {restaurants?.length > 0 ? (
            restaurants.map((r, i) => (
              <tr key={i} className="border-b">
                <td className="p-3 font-medium">{r.restaurant_name}</td>
                <td
                  className={`p-3 font-semibold ${
                    r.status === "active" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {r.status}
                </td>
                <td className="p-3">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  {new Date(r.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-3 text-muted-foreground" colSpan={4}>
                No registered restaurants found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* PAGINATION FOR RESTAURANTS */}
    {totalPages > 1 && (
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded ${
              p === page
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    )}
  </CardContent>
</Card>


      {/* SUBSCRIPTION TABLE */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="p-3 text-left">Restaurant</th>
                  <th className="p-3 text-left">Plan</th>
                  <th className="p-3 text-left">Billing Cycle</th>
                  <th className="p-3 text-left">Start Date</th>
                  <th className="p-3 text-left">End Date</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions?.length > 0 ? (
                  subscriptions.map((s, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-3 font-medium">{s.restaurant_name}</td>
                      <td className="p-3">{s.plan_name}</td>
                      <td className="p-3 capitalize">{s.billing_cycle}</td>
                      <td className="p-3">{s.start_date}</td>
                      <td className="p-3">{s.end_date}</td>
                      <td
                        className={`p-3 font-semibold ${
                          s.status === "active" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {s.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3 text-muted-foreground" colSpan={6}>
                      No subscriptions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded ${
                    p === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
