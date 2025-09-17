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
import { useTranslations } from "next-intl";
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
import { deleteTable, updateTable } from "@/actions/table/api";
import RestaurantSupportTicketTableFilters from "./RestaurantSupportTicketTableFilters";

interface AdminTableProps {
  data: User[];
}

const schema = z.object({
  branch_id: z.string().min(1, "Branch is required"),
  table_number: z.string().min(1, "Table number required"),
  capacity: z.number().min(1, "Capacity required"),
  is_active: z.boolean().default(true).optional(),
});

type CateringFormValues = z.infer<typeof schema>;

export default function RestaurantSupportTicketTable({ data }: any) {
  const [searchRes, setSearchRes] = useState("");
  const [branches, setBranches] = useState<any[]>([]);
  const [addFilter,setAddFilter]=useState(false);
  const [menu, setMenu] = useState<{ id: string; name: string } | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const router = useRouter();
  const [localRestaurants, setLocalRestaurants] = useState(data ?? []);
  const [detailMenuItem, setDetailMenuItem] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [menuTagsList, setMenuTagsList] = useState<any[]>([]);
  const [editMenuItem, setEditMenuItem] = useState<any | null>(null);
  const t = useTranslations("full");
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
          branch_id: "",
    table_number: "",
    capacity: undefined,
        is_active: true,
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
      const res = await updateTable(values, editMenuItem?.id);
      if (res.success) {
        toast.success("Restaurant table updated successfully");
        setEditMenuItem(null);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update restaurant table");
      }
    } catch (e: any) {
      toast.error(e.message || "Unexpected error");
    }
  };

  console.log(data,'suppor ticket in client side')

  return (
    <>
   <div className="flex flex-col gap-6 w-full mb-6">
  
  <div className="flex items-center justify-between">
    {/* <Button
      variant="outline"
      onClick={() => setAddFilter(!addFilter)}
      className="h-11 px-5 font-medium rounded-lg shadow-sm hover:bg-accent transition-colors"
    >
      {addFilter ? "Close Filters" : "Add Filters"}
    </Button> */}

    <Link href="/dashboard/restaurant/support-ticket/new">
      <Button className="h-11 px-6 font-semibold rounded-lg bg-primary shadow-md hover:bg-primary/90 transition-colors">
        + Create Support Ticket 
      </Button>
    </Link>
  </div>


  {addFilter && (
    <div className="p-5 border rounded-xl bg-muted/40 shadow-sm animate-in fade-in-50">
      <RestaurantSupportTicketTableFilters branches={branches} />
    </div>
  )}
</div>

      {data?.length === 0 ? (
        <h1 className="flex items-center justify-center">Empty Record</h1>
      ) : (
        <div className="bg-card rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead>{t("User")}</TableHead>
                <TableHead>{t("Priority")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead>{t("Title")}</TableHead>
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
                    <TableCell>{user?.User?.email}</TableCell>
                    <TableCell>{user?.priority ?? "N/A"}</TableCell>
                    <TableCell>{user?.status ?? "N/A"}</TableCell>
                    <TableCell>{user?.title ?? "N/A"}</TableCell>
                    
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
                    <h2 className="text-lg font-bold">Edit Catering Service</h2>
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
                          <div>
                             <label>Branch</label>
                             <Select
                               value={watch("branch_id") || ""}
                               onValueChange={(val) => setValue("branch_id", val)}
                             >
                               <SelectTrigger>
                                 <SelectValue placeholder="Select branch" />
                               </SelectTrigger>
                               <SelectContent className="flex flex-col z-200">
                                 {branches?.map((branch) => (
                                   <SelectItem key={branch.id} value={branch.id}>
                                     {branch?.name}
                                   </SelectItem>
                                 ))}
                               </SelectContent>
                             </Select>
                           </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium">Table Number</label>
                        <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                         {...register("table_number")} />
                        {errors.table_number && (
                          <p className="text-sm text-red-500">{errors.table_number.message}</p>
                        )}
                      </div>

                      
                   

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium">Table Capacity</label>
                          <Input 
                            type="number" 
                            {...register("capacity",{valueAsNumber:true})} 
                          />
                          {errors.capacity && (
                            <p className="text-sm text-red-500">{errors.capacity.message}</p>
                          )}
                        </div>

                      
                      </div>

                  

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={watch("is_active")}
                          onCheckedChange={(checked) => setValue("is_active", !!checked)}
                        />
                        <label>Active</label>
                      </div>

                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Update Restaurant Table"}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            )}

          

            {deleteItemId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full space-y-4">
                  <h2 className="text-lg font-semibold">Confirm Deletion</h2>
                  <p>Are you sure you want to delete this restaurant table?</p>

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
                          const res = await deleteTable(deleteItemId);
                          if (res.success) {
                            toast.success("Restaurant table deleted successfully");
                            router.refresh();
                          } else {
                            toast.error(res.message || "Failed to delete restaurant table");
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

            {detailMenuItem && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-xl">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold">Restaurant Support Ticket</h2>
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
                      <p>{detailMenuItem?.title}</p>
                    </div>
            
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description:</label>
                      <p>{detailMenuItem?.description || "N/A"}</p>
                    </div>
            
                    <div>
                      <label className="flex flex-row flex-gap text-sm font-medium text-gray-700 dark:text-gray-300">User Name:</label>
                      <div className="flex flex-row gap-2">
                                              <p>{detailMenuItem?.User?.first_name}</p>
                      <p>{detailMenuItem?.User?.last_name}</p> 
                        </div>

                    </div>
        
                      <div>
                        <label className="block text-sm font-medium">Created At:</label>
                        <p>{detailMenuItem?.createdAt}</p>
                      </div>
            
                      <div>
                        <label className="block text-sm font-medium">Priority:</label>
                        <p>{detailMenuItem?.priority }</p>
                      </div>
                    
            
          
            

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