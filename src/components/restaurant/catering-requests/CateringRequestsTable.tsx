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
import { useTranslations } from "next-intl";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { deleteMenuCategory, deleteMenuItem, getAllMenu, getAllMenuTags, updateMenuCategory, updateMenuItem } from "@/actions/menu/api";
import { getAllBranches } from "@/actions/branch/api";
import { acceptMenuCateringRequest, deleteCatering, rejectCateringRequests, updateMenuCatering } from "@/actions/catering/api";

interface AdminTableProps {
  data: User[];
}

const schema = z.object({
  estimated_price: z.number().min(1, "Estimated price is required"),
  description: z.string().min(1, "Description is required"),
});

type CateringFormValues = z.infer<typeof schema>;

export default function CateringRequestsTable({ data }: any) {
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
  const t =useTranslations("full");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CateringFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
    
      description: "",
      estimated_price: 0,
    
    },
  });

  const fuse = useMemo(() => {
    return new Fuse(localRestaurants, {
      keys: ["restaurant_name", "status"],
      threshold: 0.4,
    });
  }, [localRestaurants]);

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

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const data = await getAllMenuTags();
        setMenuTagsList(data?.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch menu tags:", error);
        toast.error("Failed to load menu tags data");
        setMenuTagsList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  const filterdRestaurants = searchRes
    ? fuse.search(searchRes).map((result) => result.item)
    : localRestaurants;

  const onSubmit = async (values: any) => {

    try {
      const res = await acceptMenuCateringRequest(values, editMenuItem?.id);
      if (res.success) {
        toast.success("Catering service accepted successfully");
        setEditMenuItem(null);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to accept catering service requests");
      }
    } catch (e: any) {
      toast.error(e.message || "Unexpected error");
    }
  };

  return (
    <>
      <div className="mb-6 flex w-full items-center justify-between gap-4">
        {/* <div className="relative flex flex-4/5 items-center">
          <SearchIcon className="absolute left-2 size-4" />
          <Input
            className="bg-muted h-12 pl-8 text-sm"
            placeholder="Search catering services"
            value={searchRes}
            onChange={(e) => setSearchRes(e.target.value)}
          />
        </div> */}
  
      </div>
      {data?.length === 0 ? (
        <h1 className="flex items-center justify-center">Empty Record</h1>
      ) : (
        <div className="bg-card rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>{t("Title")}</TableHead>
                <TableHead>{t("Customer")}</TableHead>
                <TableHead>{t("Event date")}</TableHead>
                <TableHead>{t("Event type")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead>{t("Action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((user: any, index: any) => {
                return (
                  <TableRow
                    key={user.id}
                    className={`${index % 2 !== 0 ? "bg-muted" : ""} border-none`}
                  >
                    <TableCell>{user?.catering?.title}</TableCell>
                    <TableCell>{user?.customer?.name ?? "N/A"}</TableCell>
                    <TableCell>{user?.event_date ?? "N/A"}</TableCell>
                    <TableCell>{user?.event_type ?? "N/A"}</TableCell>
                    <TableCell>{user?.status ?? "N/A"}</TableCell>
                    

          
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
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setDetailMenuItem(user)}
                          >
                            <span>Detail</span>
                          </DropdownMenuItem>
                          {user?.status === "pending"&&   <>
                                <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              setEditMenuItem(user);
                              // reset({
                              //   title: user.title || "",
                              //   description: user.description || "",
                              //   menu_summary: user.menu_summary || "",
                              //   base_price: user.base_price || 0,
                              //   min_guest_count: user.min_guest_count || 0,
                              //   max_guest_count: user.max_guest_count || 0,
                              //   min_advance_days: user.min_advance_days || 0,
                              //   prepayment_percentage: user.prepayment_percentage || 0,
                              //   include_service: user.include_service || false,
                              //   delivery_available: user.delivery_available || false,
                              //   service_area_description: user.service_area_description || "",
                              //   contact_person: user.contact_person || "",
                              //   contact_info: user.contact_info || "",
                              //   is_active: user.is_active ?? true,
                              // });
                            }}
                          >
                            Accept with quote
                          </DropdownMenuItem>
                          
                             <DropdownMenuItem
                            className="cursor-pointer text-red-600"
                            onClick={() => setDeleteItemId(user.id)}
                          >
                            Reject
                          </DropdownMenuItem>
                          </>}
                    
                       
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div>
            {editMenuItem && (
              <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60">
                <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-xl">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold">Accept Catering Service Request?</h2>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setEditMenuItem(null);
                        reset();
                      }}
                    >
                      Close
                    </Button>
                  </div>

                  <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">Description</label>
                        <Input {...register("description")} />
                        {errors.description && (
                          <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                      </div>

                     

                        <div>
                          <label className="block text-sm font-medium">Estimated price</label>
                          <Input 
                            type="number" 
                            {...register("estimated_price", { valueAsNumber: true })} 
          

                          />
                          {errors.estimated_price && (
                            <p className="text-sm text-red-500">{errors.estimated_price.message}</p>
                          )}
                        </div>
                    

                      

                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : "Accept with quote"}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {detailMenuItem && (
              <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60">
                <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-xl">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold">Catering Service Details</h2>
                    <Button
                      variant="ghost"
                      onClick={() => setDetailMenuItem(null)}
                    >
                      Close
                    </Button>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title:</label>
                      <p>{detailMenuItem?.catering?.title || ""}</p>
                    </div>
 <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Name:</label>
                      <p>{detailMenuItem?.customer?.name || ""}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Date:</label>
                      <p>{detailMenuItem?.event_date || "N/A"}</p>
                    </div>
                      <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Type:</label>
                      <p>{detailMenuItem?.event_type || "N/A"}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Guests:</label>
                      <p>{detailMenuItem?.guest_count || ""}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location:</label>
                      <p>{detailMenuItem?.location?.address || ""}</p>
                    </div>
               

                 
                   

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
                      <p>{detailMenuItem?.is_active ? "Active" : "Inactive"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {deleteItemId && (
              <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full space-y-4">
                  <h2 className="text-lg font-semibold">Confirm Rejection</h2>
                  <p>Are you sure you want to reject this catering service request?</p>

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
                          const res = await rejectCateringRequests(deleteItemId);
                          if (res.success) {
                            toast.success("Catering service request rejected successfully");
                            router.refresh();
                          } else {
                            toast.error(res.message || "Failed to reject catering service request");
                          }
                        } catch (err) {
                          toast.error("Unexpected error during rejection");
                        } finally {
                          setDeleteItemId(null);
                        }
                      }}
                    >
                      Reject
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