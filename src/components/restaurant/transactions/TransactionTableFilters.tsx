"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TransactionTableFilters({ branches }: { branches: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // const [search, setSearch] = useState(searchParams.get("search") || "");s
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [branchId, setBranchId] = useState(searchParams.get("branch_id") || "");
  const [startDate, setStartDate] = useState(searchParams.get("start_date") || "");
  const [endDate, setEndDate] = useState(searchParams.get("end_date") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    // if (search) params.set("search", search);
    // else params.delete("search");

    if (status) params.set("status", status);
    else params.delete("status");

    if (branchId) params.set("branch_id", branchId);
    else params.delete("branch_id");

    if (startDate) params.set("start_date", startDate);
    else params.delete("start_date");

    if (endDate) params.set("end_date", endDate);
    else params.delete("end_date");

    params.set("page", "1"); 

    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    // setSearch("");
    setStatus("");
    setBranchId("");
    setStartDate("");
    setEndDate("");
  
    router.push("?page=1");
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full space-y-4 p-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-row flex-wrap gap-4">
       
        {/* <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by table number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}

   
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
            Branch
          </label>
          <select
            id="branch"
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

       
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

     
      <div className="flex flex-col px-4 gap-3 pt-2">
        <Button 
          type="submit" 
          className="px-4 py-2 cursor-pointer font-medium bg-blue-600 hover:bg-blue-700 text-white"
        >
          Apply Filters
        </Button>
        
        <Button 
          type="button" 
          onClick={clearFilters}
          variant="outline"
          className="px-4 py-2 font-medium cursor-pointer"
        >
          Clear Filters
        </Button>
      </div>
    </form>
  );
}