"use client"; // This is a Client Component

import SafeRestaurantImage from "@/components/custome/shared/SafeImage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming shadcn-ui table is here
import { User } from "@/types";
// import Image from "next/image";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrderTableProps {
  users: User[];
}

export default function OrdersTable({ orders }: any) {
  const [searchRes, setSearchRes] = useState("");
  const [localRestaurants, setLocalRestaurants] = useState(orders ?? []);


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
            className="bg-muted pl-8 text-sm"
            placeholder="Search orders"
            value={searchRes}
            onChange={(e) => setSearchRes(e.target.value)}
          />
        </div>
        <div className="w-full">
          <Link href="/dashboard/restaurant/orders/new">
            <Button variant="outline" className="cursor-pointer font-bold text-xs" >
              Create
            </Button>
          </Link>
        </div>
      </div>
      {orders.length === 0 ? (
        <h1 className="flex items-center justify-center">Empty Record</h1>
      ) : (
        <div className="bg-card flex w-full items-center justify-center rounded-md border border-black">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="text-xs">No.</TableHead>
                
                <TableHead className="text-xs">Restaurant </TableHead>
                <TableHead className="text-xs">branch</TableHead>
                <TableHead className="text-xs">customer</TableHead>
                <TableHead className="text-xs">total amount</TableHead>
                <TableHead className="text-xs">status</TableHead>
                
                
                <TableHead className="text-xs">order date</TableHead>
                
                <TableHead className="text-xs"></TableHead>
                
                
              </TableRow>
            </TableHeader>
            <TableBody>
              {filterdRestaurants.map((order:any, index:number) => {
                return (
                  <TableRow
                    key={order.order_id}
                    className={`${index % 2 !== 0 ? "bg-muted" : ""} border-none`}
                  >
                    <TableCell className="text-xs">{index + 1}</TableCell>
                    
                    <TableCell className="text-xs">{order.restaurant_name}</TableCell>

                    <TableCell className="text-xs">{order.branch_name}</TableCell>
                    <TableCell className="text-xs">{order.customer_name}</TableCell>
                    <TableCell className="text-xs">{order.total_amount ?? "N/A"}</TableCell>
                    <TableCell className="text-xs">{order.status ?? "N/A"}</TableCell>
                    

                    
                    <TableCell className="text-xs">
                      {order.order_date}
                    </TableCell>

                    
                    
                    

                    <TableCell className="text-xs">
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
                            <Link href={`/dashboard/restaurant/orders/${order.kds_id}`}>Detail</Link>
                          </DropdownMenuItem>
                          
                        </DropdownMenuContent>
                      </DropdownMenu>
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
