"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SResponse, Subscription } from "@/types/subscription/subscription";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BASEURL } from "@/actions/api";
import { getAuthToken } from "@/auth/auth";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  RotateCcw,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  subscriptions: Subscription[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

interface Filters {
  status: string;
  billing_cycle: string;
  restaurant_name: string;
  page: number;
  limit: number;
  sort: string;
  order: "ASC" | "DESC";
}

export default function SubscriptionsTable({
  subscriptions: initialSubscriptions,
  totalPages: initialTotalPages,
  totalItems: initialTotalItems,
  currentPage: initialCurrentPage,
}: Props) {
  const [localSubscriptions, setLocalSubscriptions] =
    useState(initialSubscriptions);
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    billing_cycle: "all",
    restaurant_name: "",
    page: initialCurrentPage,
    limit: 10,
    sort: "created_at",
    order: "DESC",
  });

  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSubscriptions = async (filterParams: Filters) => {
    setIsLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("You are not authorized to perform this action.");
      }

      const queryParams = new URLSearchParams();
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value && value !== "all") {
          queryParams.append(key, value.toString());
        }
      });
      const response = await fetch(
        `${BASEURL}/admin/subscription/list-all?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions");
      }

      const result: SResponse = await response.json();
      if (result.data) {
        setLocalSubscriptions(result.data.data);
        setTotalPages(result.data.totalPages);
        setTotalItems(result.data.totalItems);
        setCurrentPage(result.data.currentPage);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to fetch subscriptions");
    } finally {
      setIsLoading(false);
    }
  };
  const handleFilterChange = (key: keyof Filters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSortChange = (field: string) => {
    setFilters((prev) => ({
      ...prev,
      sort: field,
      order: prev.sort === field && prev.order === "ASC" ? "DESC" : "ASC",
      page: 1,
    }));
  };

  const applyFilters = () => {
    fetchSubscriptions(filters);
  };

  const resetFilters = () => {
    const resetFilters: Filters = {
      status: "all",
      billing_cycle: "all",
      restaurant_name: "",
      page: 1,
      limit: 10,
      sort: "created_at",
      order: "DESC",
    };
    setFilters(resetFilters);
    fetchSubscriptions(resetFilters);
  };

  const goToPage = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchSubscriptions(newFilters);
  };

  useEffect(() => {
    setLocalSubscriptions(initialSubscriptions);
  }, [initialSubscriptions]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateSubscriptionStatus(id, newStatus);
      setLocalSubscriptions((prev) => {
        return prev.map((sub) => {
          if (sub.id === id) {
            return {
              ...sub,
              status: newStatus as
                | "active"
                | "pending"
                | "inactive"
                | "cancelled"
                | "expired",
            };
          }
          return sub;
        });
      });
      toast.success("Subscription status updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status",
      );
    }
  };

  async function updateSubscriptionStatus(
    subscriptionId: string,
    newStatus: string,
  ) {
    try {
      const token = await getAuthToken();
      if (!token || token === "") {
        throw new Error("You are not authorized to perform this action.");
      }
      const response = await fetch(
        `${BASEURL}/subscription/update-status/${subscriptionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to update status");
    } catch (e) {
      console.log(e);
      throw new Error(
        e instanceof Error
          ? e.message
          : "Failed to update subscription status.",
      );
    }
  }

  const renderSortIndicator = (field: string) => {
    if (filters.sort !== field) return null;
    return filters.order === "ASC" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };
  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Restaurant Name</label>
              <Input
                placeholder="Search by restaurant name"
                value={filters.restaurant_name}
                onChange={(e) =>
                  handleFilterChange("restaurant_name", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Billing Cycle</label>
              <Select
                value={filters.billing_cycle}
                onValueChange={(value) =>
                  handleFilterChange("billing_cycle", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cycles</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={resetFilters}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
            <Button onClick={applyFilters}>
              <Search className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortChange("id")}
              >
                <div className="flex items-center gap-1">
                  ID {renderSortIndicator("id")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortChange("restaurant_name")}
              >
                <div className="flex items-center gap-1">
                  Restaurant {renderSortIndicator("restaurant_name")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortChange("plan_name")}
              >
                <div className="flex items-center gap-1">
                  Plan {renderSortIndicator("plan_name")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortChange("billing_cycle")}
              >
                <div className="flex items-center gap-1">
                  Billing Cycle {renderSortIndicator("billing_cycle")}
                </div>
              </TableHead>
              <TableHead>Payment</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortChange("status")}
              >
                <div className="flex items-center gap-1">
                  Status {renderSortIndicator("status")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortChange("start_date")}
              >
                <div className="flex items-center gap-1">
                  Start Date {renderSortIndicator("start_date")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSortChange("end_date")}
              >
                <div className="flex items-center gap-1">
                  Expire Date {renderSortIndicator("end_date")}
                </div>
              </TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center">
                  Loading subscriptions...
                </TableCell>
              </TableRow>
            ) : localSubscriptions.length > 0 ? (
              localSubscriptions.map((sub, index) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    {(currentPage - 1) * filters.limit + index + 1}
                  </TableCell>
                  <TableCell>{sub.restaurant_name ?? "-"}</TableCell>
                  <TableCell>{sub.plan_name ?? "-"}</TableCell>
                  <TableCell>{sub.billing_cycle ?? "-"}</TableCell>
                  <TableCell>{sub.payment_method ?? "-"}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        sub.status === "active"
                          ? "bg-green-500"
                          : sub.status === "pending"
                            ? "bg-yellow-500"
                            : sub.status === "expired"
                              ? "bg-red-500"
                              : "bg-gray-500"
                      }
                    >
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(sub.start_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(sub.end_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <div className="cursor-pointer rounded-sm bg-[#FF7632] px-3 py-1 text-sm text-white">
                          Action
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-background">
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(
                              sub.id,
                              sub.status == "active" ? "inactive" : "active",
                            )
                          }
                          className="cursor-pointer"
                        >
                          {sub.status == "active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(sub.id, "cancelled")
                          }
                          className="cursor-pointer"
                        >
                          Cancel
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(sub.id, "expired")}
                          className="cursor-pointer"
                        >
                          Expire
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-muted-foreground text-center"
                >
                  No subscriptions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Rows per page:</span>
            <Select
              value={filters.limit.toString()}
              onValueChange={(value) =>
                handleFilterChange("limit", parseInt(value))
              }
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
