"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { toast } from "sonner";
import { createMenuCategory, getAllMenuTags } from "@/actions/menu/api";
import { getAllMenu } from "@/actions/menu/api";
import { getAllBranches } from "@/actions/branch/api";
import { getAllStaffUsers } from "@/actions/user/api";

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

export default function MenuCategoryForm({
  allbranches,
  // item,
  onSuccess,
}: {
  allbranches:any,
  // item?: any;
  onSuccess: () => void;
}) {
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
      // sort_order: undefined,
      is_active: true,
      menu_id: "",
      branchId: "",
      tags_ids:  [],

    },
  });

  const [menu, setMenu] = useState<{ id: string; name: string } | null>(null);
  const [branches, setBranches] = useState<any[]>([]);
 const [isLoading,setIsLoading]=useState(false)
  const [menuTagsList, setMenuTagsList] = useState<any[]>([]);

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
          setValue("menu_id", menuData.id); // Set it directly since it's the only one
        }

        setBranches(branchRes?.data || []);
      } catch (error) {
        toast.error("Failed to load required data");
      }
    };
    fetchData();
  }, [setValue]);

    useEffect(() => {
      const fetchStaff = async () => {
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
  
      fetchStaff();
    }, []);
  // useEffect(() => {
  //   if (item) {
  //     reset(item);
  //   }
  // }, [item, reset]);
  const tagIds = watch("tags_ids") || [];

  const onSubmit = async (values: any) => {
    try {
      const res = await createMenuCategory(values);
      if (res.success) {
        toast.success("Menu category saved successfully");
        onSuccess();
      } else {
        toast.error(res.message || "Failed to save menu category");
      }
    } catch (e: any) {
      toast.error(e.message || "Unexpected error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl mx-auto py-6">
      <div>
        <label>Name</label>
        <Input {...register("name")} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label>Description</label>
        <Textarea {...register("description")} />
      </div>

      {/* <div>
        <label>Sort Order</label>
        <Input type="number" {...register("sort_order")} />
        {errors.sort_order && <p className="text-sm text-red-500">{errors.sort_order.message}</p>}
      </div> */}

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
                  id={`staff-${tags?.id}`}
                  checked={tagIds.includes(tags?.id)}
                  onCheckedChange={(checked) => {
                    const updated = checked
                      ? [...tagIds, tags?.id]
                      : tagIds.filter((id: string) => id !== tags?.id);
                    setValue("tags_ids", updated);
                  }}
                />

            
                <label
                  htmlFor={`staff-${tags?.id}`}
                  className="text-sm space-x-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {tags?.name} 
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
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Create Category"}
      </Button>
    </form>
  );
}
