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
} from "@/components/ui/table";
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
import { deleteCatering, updateMenuCatering } from "@/actions/catering/api";
// import TransactionTableFilters from "./TransactionTableFilters";

interface AdminTableProps {
  data: User[];
}

// New schema for catering
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  menu_summary: z.string().min(1, "Menu summary is required"),
  base_price: z.union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val >= 1, "Base price is required"),
  min_guest_count: z.union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val >= 1, "Minimum guest count required"),
  max_guest_count: z.union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val >= 1, "Maximum guest count required"),
  min_advance_days: z.union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val >= 1, "Minimum advance days required"),
  prepayment_percentage: z.union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val >= 1, "Prepayment percentage required"),
  include_service: z.boolean().default(false).optional(),
  delivery_available: z.boolean().default(false).optional(),
  service_area_description: z.string().optional(),
  contact_person: z.string().min(1, "Contact person name is required"),
  contact_info: z.string()
    .min(13, "Phone number must be 13 characters including +")
    .max(13, "Phone number must be 13 characters including +")
    .refine((val) => val.startsWith('+2519') || val.startsWith('+2517'), {
      message: "Phone number must start with +2519 or +2517"
    }),
  is_active: z.boolean().default(true).optional(),
});

type CateringFormValues = z.infer<typeof schema>;

export default function ActivityLogsTable({ data }: any) {
  const [searchRes, setSearchRes] = useState("");
  const [branches, setBranches] = useState<any[]>([]);
  const [menu, setMenu] = useState<{ id: string; name: string } | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const router = useRouter();
  const [localRestaurants, setLocalRestaurants] = useState(data ?? []);
  const [detailMenuItem, setDetailMenuItem] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [menuTagsList, setMenuTagsList] = useState<any[]>([]);
  const [editMenuItem, setEditMenuItem] = useState<any | null>(null);
  const [addFilter,setAddFilter]=useState(false);

useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, branchRes] = await Promise.all([
          getAllMenu(),
          getAllBranches(),
        ]);

        const menuData = menuRes?.data;
        if (menuData?.id) {
          setMenu({ id: menuData.id, name: menuData.name || "Unnamed Menu" });
        }

        setBranches(branchRes?.data || []);
      } catch (error) {
        toast.error("Failed to load required data");
      }
    };
    fetchData();
  }, []);

  console.log(data,' from activity logs')
  return (
    <>
      <div className="mb-6 flex w-full items-center justify-between gap-4">
        {/* <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setAddFilter(!addFilter)}
            className="h-11 px-5 font-medium rounded-lg shadow-sm hover:bg-accent transition-colors"
          >
            {addFilter ? "Close Filters" : "Add Filters"}
          </Button>
        </div> */}

          {/* {addFilter && (
            <div className="p-5 border rounded-xl bg-muted/40 shadow-sm animate-in fade-in-50">
              <TransactionTableFilters branches={branches} />
            </div>
          )} */}
      </div>
      {data?.length === 0 ? (
        <h1 className="flex items-center justify-center">Empty Record</h1>
      ) : (
        <div className="bg-card rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>User Name</TableHead>
                <TableHead>User Email</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((user: any, index: any) => {
                return (
                  <TableRow
                    key={user.id}
                    className={`${index % 2 !== 0 ? "bg-muted" : ""} border-none`}
                  > 
                    <TableCell>{user?.user?.first_name || "-"} {user?.user?.last_name || "-"} </TableCell>
                    <TableCell>{user?.user?.email || "-"}</TableCell>

                    <TableCell>{user?.action}</TableCell>
                    <TableCell>{user?.created_at ?? "N/A"}</TableCell>
                    {/* <TableCell>{user?.contact_info ?? "N/A"}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded px-2 py-1 text-sm font-medium ${user.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {user?.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell> */}
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
             
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div>
      

         {detailMenuItem && (
  <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60">
    <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-xl">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold">Order Details</h2>
        <Button variant="ghost" onClick={() => setDetailMenuItem(null)}>
          Close
        </Button>
      </div>

      <div className="p-6 space-y-6">
      
        <div>
          <h3 className="text-md font-semibold mb-2">Branch</h3>
          <p><strong>Name:</strong> {detailMenuItem?.Order?.Branch?.name || "N/A"}</p>
          <p><strong>Opening Time:</strong> {detailMenuItem?.Order?.Branch?.opening_time}</p>
          <p><strong>Closing Time:</strong> {detailMenuItem?.Order?.Branch?.closing_time}</p>
          <p><strong>Status:</strong> {detailMenuItem?.Order?.Branch?.status}</p>
        </div>

       
        <div>
          <h3 className="text-md font-semibold mb-2">Order</h3>
          <p><strong>Order Date:</strong> {detailMenuItem?.order_date}</p>
          <p><strong>Status:</strong> {detailMenuItem?.status}</p>
          <p><strong>Type:</strong> {detailMenuItem?.type}</p>
          <p><strong>Total Amount:</strong> ${detailMenuItem?.total_amount}</p>
          <p><strong>Payment Status:</strong> {detailMenuItem?.payment_status}</p>
        </div>

        <div>
          <h3 className="text-md font-semibold mb-2">User</h3>
          <p><strong>Name:</strong> {detailMenuItem?.User?.first_name} {detailMenuItem?.User?.last_name}</p>
          <p><strong>Email:</strong> {detailMenuItem?.User?.email}</p>
          <p><strong>Phone:</strong> {detailMenuItem?.User?.phone_number || "N/A"}</p>
        </div>

      
        <div>
          <h3 className="text-md font-semibold mb-2">Payment</h3>
          <p><strong>Amount:</strong> ${detailMenuItem?.amount}</p>
          <p><strong>Method:</strong> {detailMenuItem?.payment_method}</p>
          <p><strong>Status:</strong> {detailMenuItem?.status}</p>
          <p><strong>Date:</strong> {detailMenuItem?.payment_date}</p>
        </div>

        <div>
          <h3 className="text-md font-semibold mb-2">Order Items</h3>
          <ul className="list-disc list-inside space-y-1">
            {detailMenuItem?.OrderItems?.map((item: any, idx: number) => (
              <li key={idx}>
                <strong>{item?.MenuItemname?.name}</strong> - {item?.quantity} × ${item?.unit_price}
              </li>
            )) || <p>No items found</p>}
          </ul>
        </div>
      </div>
    </div>
  </div>
)}

            {deleteItemId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full space-y-4">
                  <h2 className="text-lg font-semibold">Confirm Deletion</h2>
                  <p>Are you sure you want to delete this catering service?</p>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setDeleteItemId(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        try {
                          const res = await deleteCatering(deleteItemId);
                          if (res.success) {
                            toast.success("Catering service deleted successfully");
                            router.refresh();
                          } else {
                            toast.error(res.message || "Failed to delete catering service");
                          }
                        } catch (err) {
                          toast.error("Unexpected error during deletion");
                        } finally {
                          setDeleteItemId(null);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}