"use client"; 
import { useRef } from "react";
import SafeRestaurantImage from "@/components/custome/shared/SafeImage";
import { useEffect,useState,useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming shadcn-ui table is here
import { User } from "@/types";
import { toast } from "sonner";
import Fuse from "fuse.js";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createMenuItem, createMenuItemImage, deleteMenuItem, getAllMenuCategory, getAllMenuCategoryByBranch, updateMenuItem } from "@/actions/menu/api";
import Image from "next/image";

interface AdminTableProps {
  data: User[];
}
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  unit_price: z.number().positive("Must be a positive number"),
  is_active: z.boolean().default(true).optional(),
  seasonal: z.boolean().default(false).optional(),
  menu_category_id: z.string().min(1, "Category is required"),
});

type MenuItemFormValues = z.infer<typeof schema>;

export default function MenuCategoryItemsTable({ data }: any) {
      const fileInputRef = useRef<HTMLInputElement>(null);
      const route =useRouter();
  const [searchRes, setSearchRes] = useState("");
  const [detailMenuItem, setDetailMenuItem] = useState<any | null>(null);
const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [localRestaurants, setLocalRestaurants] = useState(data ?? []);
  const [itemForm,setItemForm]=useState(true);
  const [itemImageForm,setItemImageForm]=useState(false);
  const [isLoading,setIsLoading]=useState(false);
           const [editMenuItem, setEditMenuItem] = useState<{ id: string ,name:string,description:string,unit_price:number,is_active:boolean,seasonal:boolean,menu_category_id:string,menu_category_branch_id:string} | null>(null);
    const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      unit_price: 0,
      is_active: true,
      seasonal: false,
      menu_category_id:"",
    },
  });

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllMenuCategoryByBranch(editMenuItem?.menu_category_branch_id);
        setCategories(data?.data?.data || []);
      } catch {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, [data,editMenuItem]);

  // useEffect(() => {
  //   if (item) {
  //     reset(item);
  //   }
  // }, [item, reset]);

  const onSubmit = async (values: any) => {
    try {
      const res = await updateMenuItem(values,editMenuItem?.id);
      if (res.success) {
        toast.success("Menu item saved successfully");
        // onSuccess();
        route.refresh()
      } else {
        toast.error(res.message || "Failed to save item");
      }
    } catch (e: any) {
      toast.error(e.message || "Unexpected error");
    }
  };
useEffect(() => {
  if (editMenuItem) {
    reset({
      name: editMenuItem.name || "",
      description: editMenuItem.description || "",
      unit_price: editMenuItem.unit_price || 0,
      is_active: editMenuItem.is_active ?? true,
      seasonal: editMenuItem.seasonal ?? false,
      menu_category_id: editMenuItem.menu_category_id || "",
    });
  }
}, [editMenuItem, reset]);

  const fuse = useMemo(() => {
    return new Fuse(localRestaurants, {
      keys: ["restaurant_name", "status"],
      threshold: 0.4,
    });
  }, [localRestaurants]);

  const filterdRestaurants = searchRes
    ? fuse.search(searchRes).map((result:any) => result.item)
    : localRestaurants;

  return (
    <>
      <div className="mb-6 flex w-full items-center justify-between gap-4">
        {/* <div className="relative flex flex-4/5 items-center">
          <SearchIcon className="absolute left-2 size-4" />
          <Input
            className="bg-muted h-12 pl-8 text-sm"
            placeholder="Search staffs"
            value={searchRes}
            onChange={(e) => setSearchRes(e.target.value)}
          />
        </div> */}
        <div className="w-full">
          <Link href="/dashboard/restaurant/menu-items/new">
            <Button variant="outline" className="h-12 cursor-pointer font-bold">
              Create
            </Button>
          </Link>
        </div>
      </div>
      {data?.data?.data?.length === 0 ? (
        <h1 className="flex items-center justify-center">Empty Record</h1>
      ) : (
        <div className="bg-card rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>MenuCategory</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.items.map((user:any, index:any) => {
                return (
                  <TableRow
                    key={user.id}
                    className={`${index % 2 !== 0 ? "bg-muted" : ""} border-none`}
                  >
                     <TableCell className="flex justify-center items-center">     {user?.image ? (
            <Image
              src={user?.image}
              alt={user?.name}
              width={200}
              height={200}
              className="w-20 h-20 rounded-full object-cover items-center  justify-center"
            />
          ) : (
            <p>No image available</p>
          )}</TableCell>
                    <TableCell>{user?.name}</TableCell>

                    <TableCell>{user?.unit_price ?? "N/A"}</TableCell>
                    <TableCell>{user?.MenuCategory?.name ?? "N/A"}</TableCell>
      

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
                          <DropdownMenuItem className="cursor-pointer" onClick={()=>setEditMenuItem({id:user?.id,name:user?.name,description:user?.description,unit_price:user?.unit_price,is_active:user?.is_active,seasonal:user?.seasonal,menu_category_id:user?.MenuCategory?.id,menu_category_branch_id:user?.MenuCategory?.Branch?.id})}>
                          <span>Edit</span>
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
        </div>
      )}

              <div>
         {editMenuItem && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-xl">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold">Edit Menu Item</h2>
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

    
      <div className="flex justify-evenly border-b">
        <div
          onClick={() => (setItemForm(true), setItemImageForm(false))}
          className={`w-full text-center p-3 cursor-pointer ${
            itemForm ? "bg-muted font-semibold" : ""
          }`}
        >
          Item Data
        </div>
        <div
          onClick={() => (setItemForm(false), setItemImageForm(true))}
          className={`w-full text-center p-3 cursor-pointer ${
            itemImageForm ? "bg-muted font-semibold" : ""
          }`}
        >
          Item Image
        </div>
      </div>

      <div className="p-6">
        {itemForm && (
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

            <div>
              <label className="block text-sm font-medium">Unit Price</label>
              <Input
                type="number"
                step="0.01"
                {...register("unit_price", { valueAsNumber: true })}
              />
              {errors.unit_price && (
                <p className="text-sm text-red-500">
                  {errors.unit_price.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={watch("is_active")}
                onCheckedChange={(checked) => setValue("is_active", !!checked)}
              />
              <label>Active</label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={watch("seasonal")}
                onCheckedChange={(checked) => setValue("seasonal", !!checked)}
              />
              <label>Seasonal</label>
            </div>

            <div>
              <label className="block text-sm font-medium">Menu Category</label>
           <Select
              value={watch("menu_category_id")}
              onValueChange={(val) => setValue("menu_category_id", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

              {errors.menu_category_id && (
                <p className="text-sm text-red-500">
                  {errors.menu_category_id.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Update Item"}
            </Button>
          </form>
        )}

        {itemImageForm && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              setIsLoading(true);
                  if (!fileInputRef.current?.files?.[0]) {
                          toast.error("Please select an image");
                          return;
                        }
                        formData.append('image', fileInputRef.current.files[0]);
              try {
                const response = await createMenuItemImage(formData,editMenuItem?.id)
                // const res = await fetch(`${BASEURL}/menu/upload-image/${editMenuItem?.id}`, {
                //   method: "PUT",
                //   body: formData,
                // });
              
                
                if (response?.success) {
                  toast.success("Image uploaded successfully");
                  setEditMenuItem(null);
                  setItemImageForm(false);
                  setItemForm(false);
                  setIsLoading(false);
                   reset(); ; 

                } else {
                  toast.error(response?.data?.message || "Upload failed");
                  setIsLoading(false);
                }
              } catch (err) {
                setIsLoading(false);
                toast.error("An error occurred while uploading image");
              }
            }}
            className="space-y-4"
          >
                 
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                 select image
              </label>
              <input
                ref={fileInputRef}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
                type="file"
                accept="image/*"
              />
            </div>

            <Button type="submit" disabled={isLoading}>{isLoading ? <p>Uploading...</p>:<p> Upload Image</p>}</Button>
          </form>
        )}
      </div>
    </div>
  </div>
)}

{detailMenuItem && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-xl">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold">Menu Item Details</h2>
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

        <div>
          <label className="block text-sm font-medium">Image:</label>
          {detailMenuItem?.image ? (
            <Image
              src={detailMenuItem?.image}
              alt={detailMenuItem?.name}
              width={600}
              height={600}
              className="w-40 h-40 object-cover rounded"
            />
          ) : (
            <p>No image available</p>
          )}
        </div>
      </div>
    </div>
  </div>
)}


{deleteItemId && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full space-y-4">
      <h2 className="text-lg font-semibold">Confirm Deletion</h2>
      <p>Are you sure you want to delete this menu item?</p>

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
              const res = await deleteMenuItem(deleteItemId);
              if (res.success) {
                toast.success("Menu item deleted successfully");
                setDeleteItemId(null)
                route.refresh();
              } else {
                toast.error(res.message || "Failed to delete item");
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
    </>
  );
}
