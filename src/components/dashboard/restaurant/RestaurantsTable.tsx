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
import { Restaurant } from "@/types";
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

interface RestaurantsTableProps {
  restaurants: Restaurant[];
}

export default function RestaurantsTable({
  restaurants,
}: RestaurantsTableProps) {
  const [searchRes, setSearchRes] = useState("");
  const [localRestaurants, setLocalRestaurants] = useState(restaurants ?? []);

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
          <Link href="/dashboard/superadmin/restaurant/new/">
            <Button variant="outline" className="h-12 cursor-pointer font-bold">
              Create
            </Button>
          </Link>
        </div>
      </div>
      {restaurants.length === 0 ? (
        <div className="flex items-center justify-center">No Record</div>
      ) : (
        <div className="bg-card rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>No.</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Restaurant Name</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Billing Cycle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restaurants.map((restaurant, index) => {
                const statusStyles: Record<string, string> = {
                  trial: "bg-yellow-100 text-yellow-800",
                  active: "bg-green-100 text-green-800",
                  expired: "bg-red-100 text-red-800",
                  pending: "bg-yellow-100 text-yellow-800",
                  cancelled: "bg-gray-100 text-gray-800",
                };
                return (
                  <TableRow
                    key={restaurant.id}
                    className={`${index % 2 !== 0 ? "bg-muted" : ""} border-none`}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {restaurant.SystemSetting?.logo_url && (
                        <SafeRestaurantImage
                          src={restaurant.SystemSetting.logo_url}
                          alt={`${restaurant.restaurant_name} logo`}
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {restaurant.restaurant_name}
                    </TableCell>

                    <TableCell>
                      {restaurant.Subscriptions.length > 0
                        ? restaurant.Subscriptions[0].Plan.name
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {restaurant.Subscriptions.length > 0
                        ? restaurant.Subscriptions[0].Plan.billing_cycle
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {
                        <span
                          className={`rounded px-2 py-1 text-sm font-medium ${
                            statusStyles[restaurant.status] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {restaurant.status}
                        </span>
                      }
                    </TableCell>
                    <TableCell>
                      {restaurant.Subscriptions.length > 0
                        ? new Date(
                            restaurant.Subscriptions[0].start_date,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {restaurant.Subscriptions.length > 0
                        ? new Date(
                            restaurant.Subscriptions[0].end_date,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
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
