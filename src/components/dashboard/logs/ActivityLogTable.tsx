"use client"; // This is a Client Component

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming shadcn-ui table is here

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

import { ActivityLog } from "@/types/activity";
import { useState } from "react";

interface ActivityLogProps {
  logs: ActivityLog[];
}

export default function ActivityLogTable({ logs }: ActivityLogProps) {
  const [searchRes, setSearchRes] = useState("");

  return (
    <>
      <div className="mb-6 flex w-full items-center justify-between gap-4">
        <div className="relative flex flex-4/5 items-center">
          <SearchIcon className="absolute left-2 size-4" />
          <Input
            className="bg-muted h-12 pl-8 text-sm"
            placeholder="Search Restaurants"
            value={searchRes}
            onChange={(e) => setSearchRes(e.target.value)}
          />
        </div>
        {/* <div className="w-full">
          <Link href="/dashboard/superadmin/restaurant/new/">
            <Button variant="outline" className="h-12 cursor-pointer font-bold">
              Create
            </Button>
          </Link>
        </div> */}
      </div>
      {logs.length === 0 ? (
        <div className="flex items-center justify-center">No Record</div>
      ) : (
        <div className="bg-card rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>No.</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, index) => {
                return (
                  <TableRow
                    key={log.id}
                    className={`${index % 2 !== 0 ? "bg-muted" : ""} border-none`}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {log.user
                        ? log.user?.first_name + " " + log.user?.last_name
                        : "N/A"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.customer
                        ? log.customer.first_name + " " + log.customer.last_name
                        : "N/A"}
                    </TableCell>

                    <TableCell>{log.module}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>
                      {new Date(log.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
