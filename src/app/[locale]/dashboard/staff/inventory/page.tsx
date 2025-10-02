"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, Package, AlertTriangle, XCircle, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getAuthToken } from "@/auth/auth";
import { useRouter, usePathname } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function InventoryPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [inventory, setInventory] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalStockItems: 0,
    availableItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
  });
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);

  // Overlay dialog state
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [type, setType] = useState("in");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch inventory items with pagination
  const fetchInventory = async (page = 1) => {
    try {
      const token = await getAuthToken();
      const res = await axios.get(`${API_BASE}/inventory/get-all-inventory`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit, search },
      });
      setInventory(res.data.data?.items || []);
      setCurrentPage(res.data.data?.meta?.currentPage || 1);
      setTotalPages(res.data.data?.meta?.totalPages || 1);
      console.log(res);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  };

  // Fetch KPI stats
  const fetchStats = async () => {
    try {
      const token = await getAuthToken();
      const res = await axios.get(`${API_BASE}/inventory/inventory-kpis`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data.data || {});
    } catch (err) {
      console.error("Error fetching KPIs:", err);
    }
  };

  useEffect(() => {
    fetchInventory(currentPage);
    fetchStats();
  }, [currentPage, search]);

  const getStatus = (quantity: number, threshold: number) => {
    if (quantity <= 0) return "Out of Stock";
    if (quantity <= threshold) return "Low Stock";
    return "In Stock";
  };

  const openAddStock = (id: string) => {
    setSelectedId(id);
    setType("in");
    setQuantity("");
    setReason("");
    setOpen(true);
  };

  const handleConfirmAdjust = async () => {
    if (!quantity) {
      toast.error("Enter a quantity");
      return;
    }
    setLoading(true);
    try {
      const token = await getAuthToken();
      await axios.post(
        `${API_BASE}/inventory/adjust-inventory/${selectedId}`,
        { type, quantity: Number(quantity), reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Stock adjusted successfully");
      fetchInventory(currentPage);
      setOpen(false);
    } catch (err) {
      toast.error("Failed to adjust stock");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id: string) => {
    const basePath = pathname.split("/inventory")[0];
    router.push(`${basePath}/inventory/update/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const token = await getAuthToken();
      await axios.delete(`${API_BASE}/inventory/delete-inventory/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item deleted successfully");
      fetchInventory(currentPage);
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Filter locally (optional) in addition to backend search
  const filteredData = inventory.filter((item: any) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Inventory Stock</h1>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-60"
          />
          <Link href={`${pathname.split("/inventory")[0]}/inventory/form`}>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" /> Add Stock Items
            </Button>
          </Link>
          <Link href={`${pathname.split("/inventory")[0]}/inventory/movement`}>
            <Button className="flex items-center gap-2">Stock Movement</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">All Stock Items</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Package className="h-5 w-5 text-gray-500" />
            <span className="text-xl font-bold">{stats.totalStockItems}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Items</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Package className="h-5 w-5 text-green-500" />
            <span className="text-xl font-bold">{stats.availableItems}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span className="text-xl font-bold">{stats.lowStockItems}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock Items</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-xl font-bold">{stats.outOfStockItems}</span>
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
                <TableHead>Unit</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated On</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row: any, idx: number) => {
                const status = getStatus(row.quantity, row.threshold);
                return (
                  <TableRow key={row.id}>
                    <TableCell>{idx + 1 + (currentPage - 1) * limit}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.unit || "-"}</TableCell>
                    <TableCell>{row.quantity}</TableCell>
                    <TableCell>{row.threshold}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          status === "In Stock"
                            ? "bg-green-100 text-green-700"
                            : status === "Low Stock"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(row.updatedAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openAddStock(row.id)}>
                            Add Stock Movement
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdate(row.id)}>
                            Update Item
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(row.id)}
                          >
                            Delete Item
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex items-center px-2">{`${currentPage} / ${totalPages}`}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overlay Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Inventory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">In</SelectItem>
                  <SelectItem value="out">Out</SelectItem>
                  <SelectItem value="wastage">Wastage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <Label>Reason</Label>
              <Textarea
                placeholder="Enter reason (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAdjust} disabled={loading}>
              {loading ? "Saving..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
