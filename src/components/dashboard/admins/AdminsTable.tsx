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
import { useMemo, useState, useTransition } from "react";
import Fuse from "fuse.js";
import { Loader2, SearchIcon } from "lucide-react";
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
import { BASEURL } from "@/actions/api";
import { getAuthToken } from "@/auth/auth";
import { toast } from "sonner";

interface AdminTableProps {
  users: User[];
}

export default function AdminsTable({ users }: AdminTableProps) {
  const [searchRes, setSearchRes] = useState("");
  const [localRestaurants, setLocalRestaurants] = useState(users ?? []);
  const [pending, startTransition] = useTransition();
  const handleDeleteAdmin = (userId: string) => {
    startTransition(async () => {
      try {
        const url = `${BASEURL}/user/delete/${userId}`;
        const token = await getAuthToken();

        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const res = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const e = await res.json();
          console.log(e);
          throw new Error(`${e}`);
        }

        toast.success("Admin deleted successfully!");
      } catch (e) {
        console.error("Error deleting admin:", e);
        toast.error("Failed to delete admin.");
      }
    });
  };
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
            placeholder="Search Admins"
            value={searchRes}
            onChange={(e) => setSearchRes(e.target.value)}
          />
        </div>
        <div className="w-full">
          <Link href="/dashboard/superadmin/admins/new/">
            <Button variant="outline" className="h-12 cursor-pointer font-bold">
              Create
            </Button>
          </Link>
        </div>
      </div>
      {users.length === 0 ? (
        <h1 className="flex items-center justify-center">Empty Record</h1>
      ) : (
        <div className="bg-card rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>No.</TableHead>
                <TableHead>Profile</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Permission Count</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => {
                return (
                  <TableRow
                    key={user.id}
                    className={`${index % 2 !== 0 ? "bg-muted" : ""} border-none`}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {user.profile_picture && (
                        <SafeRestaurantImage
                          src={user.profile_picture}
                          alt={`${user.first_name} logo`}
                        />
                      )}
                    </TableCell>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{user.last_name}</TableCell>

                    <TableCell>{user.email ?? "N/A"}</TableCell>
                    <TableCell>{user.phone_number ?? "N/A"}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded px-2 py-1 text-sm font-medium ${user.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {user.is_active ? "Active" : "Pending"}
                      </span>
                    </TableCell>
                    <TableCell>{user.Role.name}</TableCell>

                    <TableCell>{user.Role.total_permission}</TableCell>

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

                          <DropdownMenuItem className="item-center flex cursor-pointer justify-center">
                            {pending ? (
                              <Loader2 />
                            ) : (
                              <span
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Are you sure you want to delete ${user.first_name} ${user.last_name}?`,
                                    )
                                  ) {
                                    alert("Not Supported");
                                    // handleDeleteAdmin(user.id);
                                  }
                                }}
                              >
                                Delete
                              </span>
                            )}
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
