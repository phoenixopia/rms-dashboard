"use client";

import SafeRestaurantImage from "@/components/custome/shared/SafeImage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming shadcn-ui table is here
import { Restaurant, RoleData, RoleResponse } from "@/types";
import Image from "next/image";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { Edit, SearchIcon } from "lucide-react";
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

interface SuperAdminRoleTableProps {
  data: RoleData[];
}

export default function RestaurantsTable({ data }: SuperAdminRoleTableProps) {
  const [searchRes, setSearchRes] = useState("");
  const [localRoles, setLocalRestaurants] = useState(data ?? []);

  const fuse = useMemo(() => {
    return new Fuse(localRoles, {
      keys: ["restaurant_name", "status"],
      threshold: 0.4,
    });
  }, [localRoles]);

  // const filterdRestaurants = searchRes
  //   ? fuse.search(searchRes).map((result) => result.item)
  //   : localRestaurants;

  return (
    <>
      <div className="mb-6 flex w-full items-center justify-between gap-4">
        <div className="relative flex flex-4/5 items-center">
          <SearchIcon className="absolute left-2 size-4" />
          <Input
            className="bg-muted h-12 pl-8 text-sm"
            placeholder="Search Roles"
            value={searchRes}
            onChange={(e) => setSearchRes(e.target.value)}
          />
        </div>
        <div className="w-full">
          <Link href="/dashboard/restaurant/role/new">
            <Button variant="outline" className="h-12 cursor-pointer font-bold">
              Create
            </Button>
          </Link>
        </div>
      </div>
      <div className="bg-card rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>No.</TableHead>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Role Tag</TableHead>
              <TableHead>Restaurant Name</TableHead>
              <TableHead>Permission Count</TableHead>
              {/* <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead> */}
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((role, index) => {
              return (
                <TableRow
                  key={role.id}
                  className={`${index % 2 !== 0 ? "bg-muted" : ""} border-none`}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell className="font-medium">
                    {role.description}
                  </TableCell>
                  <TableCell>{role.role_tag?.name}</TableCell>
                  <TableCell>{role.restaurant_name ?? "Unknown"}</TableCell>

                  <TableCell>{role.permission_count}</TableCell>

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
                          <Link
                            href={`/dashboard/superadmin/role/new/${role.id}/edit`}
                          >
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Link href="#">Delete</Link>
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
    </>
  );
}
