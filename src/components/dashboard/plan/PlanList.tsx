"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import { PlansResponse } from "@/types/plan";
import Fuse from "fuse.js";
import { SearchIcon } from "lucide-react";

import React, { useMemo, useState } from "react";

export default function PlanList({ plansData }: { plansData: PlansResponse }) {
  const { plans } = plansData;

  const [searchRes, setSearchRes] = useState("");
  const [localRestaurants, setLocalRestaurants] = useState([]);

  const fuse = useMemo(() => {
    return new Fuse(localRestaurants, {
      keys: ["restaurant_name", "status"],
      threshold: 0.4,
    });
  }, [localRestaurants]);

  const filterdRestaurants = searchRes
    ? fuse.search(searchRes).map((result) => result.item)
    : localRestaurants;

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
        <div className="w-full">
          <Link href="/dashboard/superadmin/plan/new/">
            <Button variant="outline" className="h-12 cursor-pointer font-bold">
              Create
            </Button>
          </Link>
        </div>
      </div>
      <div className="bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Billing Cycle</TableHead>
              <TableHead>Limits</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan, index) => (
              <TableRow
                key={plan.id}
                className={`${index % 2 !== 0 ? "bg-muted" : ""} border-none`}
              >
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>${plan.price}</TableCell>
                <TableCell className="capitalize">
                  {plan.billing_cycle}
                </TableCell>
                <TableCell>
                  {plan.PlanLimits?.length ? (
                    <ul className="list-disc pl-4">
                      {plan.PlanLimits.map((limit) => (
                        <li key={limit.id}>
                          <span className="font-semibold">{limit.key}:</span>{" "}
                          {String(limit.value)} ({limit.data_type})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No limits defined"
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <div className="cursor-pointer rounded-sm bg-[#FF7632] px-3 py-1 text-sm text-white">
                        Action
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-background">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <Link href="#">Detail</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Link href="#">Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Link href="#">Delete</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
