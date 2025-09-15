"use client"; 
import { useEffect } from "react";
import SafeRestaurantImage from "@/components/custome/shared/SafeImage";
import { useRouter } from "@/i18n/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming shadcn-ui table is here
import { User } from "@/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { BASEURL } from "@/actions/api";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { deleteMenuCategory, deleteMenuItem, getAllMenu, getAllMenuTags, updateMenuCategory, updateMenuItem } from "@/actions/menu/api";
import { getAllBranches } from "@/actions/branch/api";
import { deleteCatering } from "@/actions/catering/api";
interface AdminTableProps {
  data: User[];
}
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  // sort_order: z
  //   .union([z.string(), z.number()])
  //   .transform((val) => Number(val))
  //   .optional(),
  is_active: z.boolean().default(true).optional(),
  menu_id: z.string().min(1, "Menu is required"),
  branchId: z.string().optional(),
  tags_ids: z.array(z.string()).default([]).optional(),

});

type MenuCategoryFormValues = z.infer<typeof schema>;
export default function SubscriptionTable({ data }: any) {
  const [searchRes, setSearchRes] = useState("");

  const [localRestaurants, setLocalRestaurants] = useState(data ?? []);
  
       


  return (
    <>
      <div className="mb-6 flex w-full items-center justify-between gap-4">

        <div className="w-full">
          <Link href="/dashboard/restaurant/subscription/new">
            <Button variant="outline" className="h-12 cursor-pointer font-bold">
              Create
            </Button>
          </Link>
        </div>
      </div>
      {data?.length === 0 ? (
        <h1 className="flex items-center justify-center">Empty Record</h1>
      ) : (
        <div className="bg-card rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>Plan name</TableHead>
                <TableHead>Billing cycle</TableHead>
                <TableHead>Payment method</TableHead>
                <TableHead>Start date</TableHead>
                <TableHead>End date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.data?.map((user:any, index:any) => {
                return (
                  <TableRow
                    key={user.id}
                    className={`${index % 2 !== 0 ? "bg-muted" : ""} border-none`}
                  >
             
                    <TableCell>{user?.plan_name}</TableCell>

                    <TableCell>{user?.billing_cycle ?? "N/A"}</TableCell>
                    <TableCell>{user?.payment_method ?? "N/A"}</TableCell>
                    <TableCell>{user?.start_date ?? "N/A"}</TableCell>
                    <TableCell>{user?.end_date ?? "N/A"}</TableCell>

                    <TableCell>{user?.status ?? "N/A"}</TableCell>

 
      

                    {/* <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <div className="cursor-pointer rounded-sm bg-[#FF7632] px-3 py-1 text-sm text-white">
                            Action
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-background">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                         <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => setDetailMenuItem(user)}
                        >
                          <span>Detail</span>
                        </DropdownMenuItem>
                    <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => {
                                setEditMenuItem(user); 
                                reset({
                                  name: user.name || "",
                                  description: user.description || "",
                                  is_active: user.is_active ?? true,
                                  menu_id: user.menu_id || "",
                                  branchId: user.Branch?.id || ""
                                });
                              }}
                            >
                              Edit
                            </DropdownMenuItem>

                           <DropdownMenuItem
                              className="cursor-pointer text-red-600"
                              onClick={() => setDeleteItemId(user.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell> */}
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
