"use client";
import { Activity, Building2, DollarSign, GitBranch, Table, User, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useState,useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
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
  BarChart,
  Bar,
} from "recharts";
import { getAllMenu, getAllMenuCatering } from "@/actions/catering/api";
import { getAllBranches } from "@/actions/branch/api";
import { getAllMenuItems } from "@/actions/menu/api";
import { getAllTables } from "@/actions/table/api";
import { set } from "zod";

const mockData = {
  metrics: [
    {
      title: "Total Mobile Users",
      value: "2,350",
      change: "+15% from last month",
      icon: Users,
    },
    {
      title: "Restaurant Admins",
      value: "120",
      change: "+3 new this week",
      icon: User,
    },
    {
      title: "Active Restaurants",
      value: "50",
      change: "+2% from last quarter",
      icon: Building2,
    },
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1% from last month",
      icon: DollarSign,
    },
  ],
  weeklyRevenueData: [
    { name: "Mon", revenue: 4000 },
    { name: "Tue", revenue: 3000 },
    { name: "Wed", revenue: 2000 },
    { name: "Thu", revenue: 2780 },
    { name: "Fri", revenue: 1890 },
    { name: "Sat", revenue: 2390 },
    { name: "Sun", revenue: 3490 },
  ],
  transactionsData: [
    { name: "Jan", transactions: 2400 },
    { name: "Feb", transactions: 1398 },
    { name: "Mar", transactions: 9800 },
    { name: "Apr", transactions: 3908 },
    { name: "May", transactions: 4800 },
    { name: "Jun", transactions: 3800 },
    { name: "Jul", transactions: 4300 },
    { name: "Aug", transactions: 7000 },
    { name: "Sep", transactions: 5000 },
    { name: "Oct", transactions: 6500 },
    { name: "Nov", transactions: 8200 },
    { name: "Dec", transactions: 9000 },
  ],
  userDistributionData: [
    { name: "Mobile Users", value: 2350, color: "#8884d8" },
    { name: "Restaurant Admins", value: 120, color: "#82ca9d" },
  ],
  topRestaurantsData: [
    { name: "Grill House", revenue: 8000 },
    { name: "Pasta Paradise", revenue: 6500 },
    { name: "Burger Barn", revenue: 5000 },
    { name: "Sushi Spot", revenue: 4200 },
    { name: "The Coffee Bean", revenue: 3800 },
  ],
  recentTransactions: [
    {
      id: "TXN123",
      customer: "John Doe",
      amount: "$50.00",
      restaurant: "Grill House",
      date: "2024-07-25",
    },
    {
      id: "TXN124",
      customer: "Jane Smith",
      amount: "$25.50",
      restaurant: "Pasta Paradise",
      date: "2024-07-25",
    },
    {
      id: "TXN125",
      customer: "Bob Johnson",
      amount: "$15.75",
      restaurant: "Burger Barn",
      date: "2024-07-24",
    },
    {
      id: "TXN126",
      customer: "Alice Williams",
      amount: "$75.20",
      restaurant: "Sushi Spot",
      date: "2024-07-24",
    },
  ],
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard(data:any) {
  const t = useTranslations("full");
  const [menu, setMenu] = useState();
  const [branches, setBranches] = useState();
  const [caterings, setCaterings] = useState();
  const [tables, setTables] = useState();

  console.log(data,"Dashboard Data:");


    useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, branchRes,caterings,tables] = await Promise.all([
          getAllMenuItems(),
          getAllBranches(),
          getAllMenuCatering(),
          getAllTables()
        ]);
        setMenu(menuRes || []);
        setBranches(branchRes || []);
        setCaterings(caterings || []);
        setTables(tables || []);
      } catch (error) {
        toast.error("Failed to load required data");
      }
    };
    fetchData();
  }, []);



  return (
    <div className="flex flex-col gap-6 p-5">
      <h1 className="text-3xl font-bold">{t("Dashboard Overview")}</h1>
      <p className="text-muted-foreground">
        {t("A quick look at your platform's key performance indicators")}.
      </p>

    
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  
            <Card  className="border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                 {t("Total Branches")}
                </CardTitle>
                <GitBranch className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
      
                    <div className="text-2xl font-bold">{((branches as any)?.data?.length || 0)}</div>
              
              </CardContent>
            </Card>

              <Card  className="border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                 {t("Total Menu Items")}
                </CardTitle>
                <GitBranch className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
      
                    <div className="text-2xl font-bold">{((menu as any)?.data?.pagination?.total || 0)}</div>
              
              </CardContent>
            </Card>
              <Card  className="border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                 {t("Total Tables")}
                </CardTitle>
                <GitBranch className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
      
                    <div className="text-2xl font-bold">{((tables as any)?.data?.pagination?.total || 0)}</div>
              
              </CardContent>
            </Card>
            <Card  className="border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                 {t("Total Caterings")}
                </CardTitle>
                <GitBranch className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
      
                    <div className="text-2xl font-bold">{((caterings as any)?.data?.total || 0)}</div>
              
              </CardContent>
            </Card>
     
      </div>


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      
        <Card className="col-span-4 border-none">
          <CardHeader>
            <CardTitle>Weekly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockData.weeklyRevenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

  
        <Card className="col-span-3 border-none">
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex h-[350px] items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.userDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockData.userDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      
        <Card className="col-span-4 border-none">
          <CardHeader>
            <CardTitle>Top Restaurants by Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockData.topRestaurantsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-none">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {data?.data?.length === 0 && (<p>No recent transactions found.</p>
              )}
              {data?.data?.map((tx:any) => (
                <li key={tx.id} className="flex items-center justify-between">
                  <div className="flex flex-row space-x-2">
                    <span className="text-sm font-sm">Customer Name:</span>

                    <span className="text-sm font-semibold">{tx.Customer?.first_name ? tx.Customer?.first_name :'-'} {tx.Customer?.last_name ?tx.Customer?.last_name :'-'}</span>
                    <span className="text-muted-foreground text-xs">
                      {tx.restaurant}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold">{tx.amount}</span>
                    <span className="text-muted-foreground text-xs">
                      {tx.date}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
