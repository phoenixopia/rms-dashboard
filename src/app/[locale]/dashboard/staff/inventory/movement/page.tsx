"use client";

import { useState, useEffect } from "react";
import { Package, AlertTriangle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { getAuthToken } from "@/auth/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [movements, setMovements] = useState<any[]>([]);
  const [stats, setStats] = useState({ all: 0, in: 0, out: 0, wastage: 0 });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
  const [branchId, setBranchId] = useState<string | null>(null);

  const fetchMovements = async () => {
    try {
      const token = await getAuthToken();
      const res = await axios.get(`${API_BASE}/inventory/inventory-transactions`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit, search, sortBy, order, branchId },
      });
      setMovements(res.data.data.items || []);
      setTotalPages(res.data.data.meta.totalPages || 1);
    } catch (err) {
      console.error("Error fetching stock movements:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const token = await getAuthToken();
      const res = await axios.get(`${API_BASE}/inventory/inventory-transaction-kpis`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.data;
      setStats({
        all: data.allStockTransaction || 0,
        in: data.stockIn || 0,
        out: data.stockOut || 0,
        wastage: data.wastage || 0,
      });
    } catch (err) {
      console.error("Error fetching KPIs:", err);
    }
  };

  useEffect(() => {
    fetchMovements();
    fetchStats();
  }, [page, search, sortBy, order, branchId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // reset to first page on search
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Stock Movement</h1>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search items..."
            value={search}
            onChange={handleSearchChange}
            className="w-60"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-medium">All Stock Movement</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Package className="h-5 w-5 text-gray-500" />
            <span className="text-xl font-bold">{stats.all}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stock In</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Package className="h-5 w-5 text-green-500" />
            <span className="text-xl font-bold">{stats.in}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stock Out</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span className="text-xl font-bold">{stats.out}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stock Wastage</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-xl font-bold">{stats.wastage}</span>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Movement</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((row, idx) => {
                const date = new Date(row.created_at);
                const formattedDate = date.toLocaleDateString();
                const formattedTime = date.toLocaleTimeString();
                return (
                  <TableRow key={row.id}>
                    <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                    <TableCell>{row.inventory_name}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.quantity}</TableCell>
                    <TableCell>{row.reason || "-"}</TableCell>
                    <TableCell>{`${formattedDate} ${formattedTime}`}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
