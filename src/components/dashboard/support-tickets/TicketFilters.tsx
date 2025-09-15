"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TicketFilters as Filters } from "@/types/tickets/";

interface TicketFiltersProps {
  onFilterChange: (filters: Filters) => void;
  initialFilters: Filters;
}

export default function TicketFilters({
  onFilterChange,
  initialFilters,
}: TicketFiltersProps) {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const handleFilterChange = (key: keyof Filters, value: string | number) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      page: 1,
      limit: 10,
      search: "",
      sortBy: "created_at",
      order: undefined,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-card flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Search by title..."
          value={filters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="md:max-w-sm"
        />

        <Select
          value={filters.status || ""}
          onValueChange={(value) =>
            value === "all"
              ? handleFilterChange("status", "")
              : handleFilterChange("status", value)
          }
        >
          <SelectTrigger className="md:max-w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priority || ""}
          onValueChange={(value) =>
            value === "all"
              ? handleFilterChange("priority", "")
              : handleFilterChange("priority", value)
          }
        >
          <SelectTrigger className="md:max-w-[180px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Select
          value={filters.sortBy || "created_at"}
          onValueChange={(value) =>
            value === "all"
              ? handleFilterChange("sortBy", "")
              : handleFilterChange("sortBy", value)
          }
        >
          <SelectTrigger className="md:max-w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Created Date</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.order || "DESC"}
          onValueChange={(value) =>
            value === "all"
              ? handleFilterChange("order", "")
              : handleFilterChange("order", value as "ASC" | "DESC")
          }
        >
          <SelectTrigger className="md:max-w-[180px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DESC">Descending</SelectItem>
            <SelectItem value="ASC">Ascending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
