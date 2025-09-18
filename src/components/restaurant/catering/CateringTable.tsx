"use client"; 
import { useEffect,useRef } from "react";
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
import { createCateringImage, deleteCatering, updateMenuCatering } from "@/actions/catering/api";
import { table } from "console";
import Image from "next/image";

interface AdminTableProps {
  data: User[];
}

// New schema for catering
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  menu_summary: z.string().min(1, "Menu summary is required"),
  base_price: z.number().min(1, "Base price is required"),
  min_guest_count: z.number()
    .transform((val) => Number(val))
    .refine((val) => val >= 1, "Minimum guest count required"),
  max_guest_count: z.number()
    .transform((val) => Number(val))
    .refine((val) => val >= 1, "Maximum guest count required"),
  min_advance_days: z.number()
    .transform((val) => Number(val))
    .refine((val) => val >= 1, "Minimum advance days required"),
  prepayment_percentage: z.number()
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

export default function CateringTable({ data }: any) {
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
      const fileInputRef = useRef<HTMLInputElement>(null);
  const [itemForm,setItemForm]=useState(true);
  const [itemImageForm,setItemImageForm]=useState(false);
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
      title: "",
      description: "",
      menu_summary: "",
      base_price: 0,
      min_guest_count: 0,
      max_guest_count: 0,
      min_advance_days: 0,
      prepayment_percentage: 0,
      include_service: false,
      delivery_available: false,
      service_area_description: "",
      contact_person: "",
      contact_info: "",
      is_active: true,
    },
  });
  const t =useTranslations("full");
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
      const res = await updateMenuCatering(values, editMenuItem?.id);
      if (res.success) {
        toast.success("Catering service updated successfully");
        setEditMenuItem(null);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update catering service");
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
        <div className="w-full">
          <Link href="/dashboard/restaurant/catering/new">
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
                <TableHead>{t("Title")}</TableHead>
                <TableHead>{t("Contact Person")}</TableHead>
                <TableHead>{t("Contact Info")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead>{t("Action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.data?.map((user: any, index: any) => {
                return (
                  <TableRow
                    key={user.id}
                    className={`${index % 2 !== 0 ? "bg-muted" : ""} border-none`}
                  >
                    <TableCell>{user?.title}</TableCell>
                    <TableCell>{user?.contact_person ?? "N/A"}</TableCell>
                    <TableCell>{user?.contact_info ?? "N/A"}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded px-2 py-1 text-sm font-medium ${user.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {user?.is_active ? "Active" : "Inactive"}
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
                              setItemForm(true)
                              reset({
                                title: user.title || "",
                                description: user.description || "",
                                menu_summary: user.menu_summary || "",
                                base_price: user.base_price || 0,
                                min_guest_count: user.min_guest_count || 0,
                                max_guest_count: user.max_guest_count || 0,
                                min_advance_days: user.min_advance_days || 0,
                                prepayment_percentage: user.prepayment_percentage || 0,
                                include_service: user.include_service || false,
                                delivery_available: user.delivery_available || false,
                                service_area_description: user.service_area_description || "",
                                contact_person: user.contact_person || "",
                                contact_info: user.contact_info || "",
                                is_active: user.is_active ?? true,
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
        <h2 className="text-lg font-bold">Edit Catering Data</h2>
        <Button
          variant="ghost"
          onClick={() => {
            setEditMenuItem(null);
            setItemForm(false);
            setItemImageForm(false);
            reset(); 
          }}
        >
          Close
        </Button>
      </div>
                   <div className="flex flex-row p-2">
                          <div
                            onClick={() => (setItemForm(true), setItemImageForm(false))}
                            className={`w-full text-center p-3 cursor-pointer ${
                              itemForm ? "bg-muted font-semibold" : ""
                            }`}
                          >
                            Catering Item Data
                          </div>

                          <div
                            onClick={() => (setItemForm(false), setItemImageForm(true))}
                            className={`w-full text-center p-3 cursor-pointer ${
                              itemImageForm ? "bg-muted font-semibold" : ""
                            }`}
                          >
                              Catering Image
                            </div>
                  </div>
                 <div>
              
                  {itemForm &&     <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">Title</label>
                        <Input {...register("title")} />
                        {errors.title && (
                          <p className="text-sm text-red-500">{errors.title.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium">Description</label>
                        <Textarea {...register("description")} />
                        {errors.description && (
                          <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium">Menu Summary</label>
                        <Textarea {...register("menu_summary")} />
                        {errors.menu_summary && (
                          <p className="text-sm text-red-500">{errors.menu_summary.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium">Base Price</label>
                          <Input 
                            type="number" 
                            {...register("base_price",{valueAsNumber:true})} 
                          />
                          {errors.base_price && (
                            <p className="text-sm text-red-500">{errors.base_price.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium">Prepayment Percentage</label>
                          <Input 
                            type="number" 
                            {...register("prepayment_percentage",{valueAsNumber:true})} 
                          />
                          {errors.prepayment_percentage && (
                            <p className="text-sm text-red-500">{errors.prepayment_percentage.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium">Min Guest Count</label>
                          <Input 
                            type="number" 
                            {...register("min_guest_count")} 
                          />
                          {errors.min_guest_count && (
                            <p className="text-sm text-red-500">{errors.min_guest_count.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium">Max Guest Count</label>
                          <Input 
                            type="number" 
                            {...register("max_guest_count")} 
                          />
                          {errors.max_guest_count && (
                            <p className="text-sm text-red-500">{errors.max_guest_count.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium">Min Advance Days</label>
                        <Input 
                          type="number" 
                          {...register("min_advance_days")} 
                        />
                        {errors.min_advance_days && (
                          <p className="text-sm text-red-500">{errors.min_advance_days.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={watch("include_service")}
                            onCheckedChange={(checked) => setValue("include_service", !!checked)}
                          />
                          <label>Include Service</label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={watch("delivery_available")}
                            onCheckedChange={(checked) => setValue("delivery_available", !!checked)}
                          />
                          <label>Delivery Available</label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium">Service Area Description</label>
                        <Textarea {...register("service_area_description")} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium">Contact Person</label>
                          <Input {...register("contact_person")} />
                          {errors.contact_person && (
                            <p className="text-sm text-red-500">{errors.contact_person.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium">Contact Info</label>
                          <Input {...register("contact_info")} />
                          {errors.contact_info && (
                            <p className="text-sm text-red-500">{errors.contact_info.message}</p>
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
                        {isSubmitting ? "Saving..." : "Update Catering Service"}
                      </Button>
                    </form>
                  </div>
}
             
                     <div>
                       {itemImageForm && (
                        <div className="flex p-6">
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                setIsLoading(true)
                                const formData = new FormData(e.currentTarget);
                  
                                    if (!fileInputRef.current?.files?.[0]) {
                                            toast.error("Please select an image");
                                            return;
                                          }
                                          formData.append('cover_image', fileInputRef.current.files[0]);
                                try {
                                  const response = await createCateringImage(formData,editMenuItem?.id)
                                  // const res = await fetch(`${BASEURL}/menu/upload-image/${editMenuItem?.id}`, {
                                  //   method: "PUT",
                                  //   body: formData,
                                  // });
                                
                                  
                                  if (response?.success) {
                                    toast.success("Image uploaded successfully");
                                    setEditMenuItem(null);
                                    setItemImageForm(false);
                                    setItemForm(false);
                                     reset(); ; 
                                     setIsLoading(false)
                                  } else {
                                    toast.error(response?.data?.message || "Upload failed");
                                     setIsLoading(false)

                                  }
                                } catch (err) {
                                  toast.error("An error occurred while uploading image");
                                     setIsLoading(false)

                                }
                              }}
                              className="space-y-4"
                            >
                                   
                              <div>
                                <label className="block font-bold mb-2 text-sm text-gray-900 dark:text-white">
                                   Select image
                                </label>
                                <input
                                  ref={fileInputRef}
                                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
                                  type="file"
                                  accept="image/*"
                                />
                              </div>
                  
                              <Button type="submit" disabled={isLoading}>{isLoading ? <p>Uploading...</p> : <p>Upload Image</p>} </Button>
                            </form>
                          </div>

                          )}
                  </div>
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
                      <p>{detailMenuItem?.title}</p>
                    </div>


                         <div className="flex py-2">
                                    {/* <Image
                                      src={detailMenuItem?.cover_image_url}
                                      alt="catering cover image"
                                      width={100}
                                      height={25}
                                    /> */}
                                            <img
                                              src={detailMenuItem?.cover_image_url}
                                              alt="front cover"
                                              className="h-[20rem] w-[20rem]"
                                            />
                                  </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description:</label>
                      <p>{detailMenuItem?.description || "N/A"}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Menu Summary:</label>
                      <p>{detailMenuItem?.menu_summary || "N/A"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Base Price:</label>
                        <p>${detailMenuItem?.base_price}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prepayment Percentage:</label>
                        <p>{detailMenuItem?.prepayment_percentage}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Guest Count:</label>
                        <p>{detailMenuItem?.min_guest_count}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Guest Count:</label>
                        <p>{detailMenuItem?.max_guest_count}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Advance Days:</label>
                      <p>{detailMenuItem?.min_advance_days}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Include Service:</label>
                        <p>{detailMenuItem?.include_service ? "Yes" : "No"}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Available:</label>
                        <p>{detailMenuItem?.delivery_available ? "Yes" : "No"}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Area Description:</label>
                      <p>{detailMenuItem?.service_area_description || "N/A"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person:</label>
                        <p>{detailMenuItem?.contact_person || "N/A"}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Info:</label>
                        <p>{detailMenuItem?.contact_info || "N/A"}</p>
                      </div>
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