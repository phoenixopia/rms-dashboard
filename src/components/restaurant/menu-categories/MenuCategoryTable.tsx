"use client"; // This is a Client Component
import { use, useEffect } from "react";
import SafeRestaurantImage from "@/components/custome/shared/SafeImage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; 
import { useTranslations } from "next-intl";

import { User } from "@/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@/i18n/navigation";
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

interface AdminTableProps {
  data: User[];
}
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  is_active: z.boolean().default(true).optional(),
  menu_id: z.string().min(1, "Menu is required"),
  branchId: z.string().optional(),
  tags_ids: z.array(z.string()).default([]).optional(),

});

type MenuCategoryFormValues = z.infer<typeof schema>;
export default function MenuCategoryTable({ data }: any) {
  const [searchRes, setSearchRes] = useState("");
    const [branches, setBranches] = useState<any[]>([]);
  const [menu, setMenu] = useState<{ id: string; name: string } | null>(null);
const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
   const router =useRouter()
    const t=useTranslations('full');
  const [localRestaurants, setLocalRestaurants] = useState(data ?? []);
    const [detailMenuItem, setDetailMenuItem] = useState<any | null>(null);
   const [isLoading,setIsLoading]=useState(false)
  const [menuTagsList, setMenuTagsList] = useState<any[]>([]);
           const [editMenuItem, setEditMenuItem] = useState<{ id: string ,name:string,description:string,unit_price:number,is_active:boolean,seasonal:boolean,menu_category_id:string,tags_ids:string[]} | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MenuCategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      is_active: true,
      menu_id: "",
      branchId: "",
      tags_ids:[]
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
            setValue("menu_id", menuData.id); 
          }
  
          setBranches(branchRes?.data || []);
        } catch (error) {
          toast.error("Failed to load required data");
        }
      };
      fetchData();
    }, [setValue]);
  
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


  const tagIds = watch("tags_ids") || [];

      const onSubmit = async (values: any) => {
   
          const payload = {
    ...values,
    tags_ids: values.tags_ids?.map((tag: any) => tag.id ?? tag) || [],
  };
        try {
          const res = await updateMenuCategory(payload,editMenuItem?.id);
          if (res.success) {
            toast.success("Menu category saved successfully");
            router.refresh()
            setEditMenuItem(null)
            // onSuccess();
          } else {
            toast.error(res.message || "Failed to save category");
          }
        } catch (e: any) {
          toast.error(e.message || "Unexpected error");
        }
      };
      

  return (
    <>
      <div className="mb-6 flex w-full items-center justify-between gap-4">

        <div className="w-full">
          <Link href="/dashboard/restaurant/menu-categories/new">
            <Button variant="outline" className="h-12 cursor-pointer font-bold">
                {t("Create")}
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
                <TableHead>{t("Name")}</TableHead>
                <TableHead>{t("Menu items count")}</TableHead>
                <TableHead>{t("Branch Name")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead>{t("Action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.data?.map((user:any, index:any) => {
                return (
                  <TableRow
                    key={user.id}
                    className={`${index % 2 !== 0 ? "bg-muted" : ""} border-none`}
                  >
             
                    <TableCell>{user?.name}</TableCell>

                    <TableCell>{user?.menu_items_count ?? "N/A"}</TableCell>
                    <TableCell>{user?.Branch?.name ?? "N/A"}</TableCell>
                    
                    <TableCell>
                      <span
                        className={`rounded px-2 py-1 text-sm font-medium ${user.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {user.is_active ? "Active" : "Pending"}
                      </span>
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
                                  branchId: user.Branch?.id || "",
                                  // tags_ids:user?.CategoryTags || []
                                  tags_ids: user?.CategoryTags?.map((p:any) => p.id) || [],

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
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>


          <div>
                     {editMenuItem && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-xl">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold">Edit Menu Category</h2>
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
                          <label className="block text-sm font-medium">Name</label>
                          <Input {...register("name")} />
                          {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                          )}
                        </div>
            
                        <div>
                          <label className="block text-sm font-medium">Description</label>
                          <Textarea {...register("description")} />
                        </div>
            
                       <div className="flex items-center space-x-2">
                             <Checkbox
                               checked={watch("is_active")}
                               onCheckedChange={(checked) => setValue("is_active", !!checked)}
                             />
                             <label>Active</label>
                           </div>
                     
                           <div>
                             <label>Menu</label>
                             <Select
                               value={watch("menu_id")}
                               onValueChange={(val) => setValue("menu_id", val)}
                               disabled={!menu}
                             >
                               <SelectTrigger>
                                 <SelectValue placeholder="Select menu" />
                               </SelectTrigger>
                               <SelectContent>
                                 {menu && (
                                   <SelectItem value={menu?.id}>
                                     {menu?.name}
                                   </SelectItem>
                                 )}
                               </SelectContent>
                             </Select>
                             {errors.menu_id && <p className="text-sm text-red-500">{errors.menu_id.message}</p>}
                           </div>
                     
                     <div className="w-5/6 flex flex-col gap-2">
        <label>Menu tags</label>
        {isLoading ? (
          <p>Loading menu tags...</p>
        ) : (
          <div className="flex flex-wrap gap-4">
                        {menuTagsList.map((tags) => (
                      <div key={tags.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tags.id}`}
                          checked={tagIds.includes(tags.id)}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...tagIds, tags.id]
                              : tagIds.filter((id) => id !== tags.id);
                            setValue("tags_ids", updated);
                          }}
                        />
                        <label
                          htmlFor={`tag-${tags.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {tags.name}
                        </label>
                      </div>
                    ))}

          </div>
        )}
      </div>
                           <div>
                             <label>Branch (Optional)</label>
                             <Select
                               value={watch("branchId") || ""}
                               onValueChange={(val) => setValue("branchId", val)}
                             >
                               <SelectTrigger>
                                 <SelectValue placeholder="Select branch (optional)" />
                               </SelectTrigger>
                               <SelectContent>
                                 {branches?.map((branch) => (
                                   <SelectItem key={branch.id} value={branch.id}>
                                     {branch?.name}
                                   </SelectItem>
                                 ))}
                               </SelectContent>
                             </Select>
                           </div>
                     
            
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Saving..." : "Update Item"}
                        </Button>
                      </form>
                   
            
             
                  </div>
                </div>
              </div>
            )}
            
            {detailMenuItem && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-xl">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold">Menu Category Details</h2>
                    <Button
                      variant="ghost"
                      onClick={() => setDetailMenuItem(null)}
                    >
                      Close
                    </Button>
                  </div>
            
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name:</label>
                      <p>{detailMenuItem?.name}</p>
                    </div>
            
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description:</label>
                      <p>{detailMenuItem?.description || "N/A"}</p>
                    </div>
            
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit Price:</label>
                      <p>${detailMenuItem?.unit_price}</p>
                    </div>
            
                    <div className="flex items-center gap-4">
                      <div>
                        <label className="block text-sm font-medium">Active:</label>
                        <p>{detailMenuItem?.is_active ? "Yes" : "No"}</p>
                      </div>
            
                      <div>
                        <label className="block text-sm font-medium">Seasonal:</label>
                        <p>{detailMenuItem?.seasonal ? "Yes" : "No"}</p>
                      </div>
                    </div>
            
                    <div>
                      <label className="block text-sm font-medium">Menu Category:</label>
                      <p>{detailMenuItem?.MenuCategory?.name || "N/A"}</p>
                    </div>
            
            
                  </div>
                </div>
              </div>
            )}
            
            
            {deleteItemId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full space-y-4">
                  <h2 className="text-lg font-semibold">Confirm Deletion</h2>
                  <p>Are you sure you want to delete this menu category?</p>
            
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
                          const res = await deleteMenuCategory(deleteItemId);
                          if (res.success) {
                            toast.success("Menu category deleted successfully");
            
                          } else {
                            toast.error(res.message || "Failed to Menu category");
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
