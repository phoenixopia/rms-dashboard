"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function RestaurantSupportTicketTableFilters({ branches }: { branches: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [isActive, setIsActive] = useState(searchParams.get("is_active") || "");
  const [branchId, setBranchId] = useState(searchParams.get("branch_id") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (search) params.set("search", search);
    else params.delete("search");

    if (isActive) params.set("is_active", isActive);
    else params.delete("is_active");

    if (branchId) params.set("branch_id", branchId);
    else params.delete("branch_id");

    params.set("page", "1"); 

    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-4">

      <input
        type="text"
        placeholder="Search by table number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-md px-3 py-2"
      />

      <select
        value={isActive}
        onChange={(e) => setIsActive(e.target.value)}
        className="border rounded-md px-3 py-2"
      >
        <option value="">All Status</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>

      <select
        value={branchId}
        onChange={(e) => setBranchId(e.target.value)}
        className="border rounded-md px-3 py-2"
      >
        <option value="">All Branches</option>
        {branches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>

      
      <Button type="submit" className="px-4 py-2 font-bold">
        Apply Filters
      </Button>
    </form>
  );
}
