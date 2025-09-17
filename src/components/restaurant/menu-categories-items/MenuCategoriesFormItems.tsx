"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createMenuItem } from "@/actions/menu/api";
import { getAllMenuCategory } from "@/actions/menu/api";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  unit_price: z.number().positive("Must be a positive number"),
  is_active: z.boolean().default(true).optional(),
  seasonal: z.boolean().default(false).optional(),
  menu_category_id: z.string().min(1, "Category is required"),
});

type MenuItemFormValues = z.infer<typeof schema>;

export default function MenuItemForm({ item, onSuccess }: { item?: any; onSuccess: () => void }) {
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
      menu_category_id: "",
    },
  });
   const t = useTranslations("full");
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllMenuCategory();
        setCategories(data?.data?.data || []);
      } catch {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item, reset]);

  const onSubmit = async (values: any) => {
    try {
      const res = await createMenuItem(values); 
      if (res.success) {
        toast.success("Menu item saved successfully");
        onSuccess();
      } else {
        toast.error(res.message || "Failed to save item");
      }
    } catch (e: any) {
      toast.error(e.message || "Unexpected error");
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl mx-auto py-6">
      <div>
        <label>{t("Name")}</label>
        <Input {...register("name")} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label>{t("Description")}</label>
        <Textarea {...register("description")} />
      </div>

      <div>
        <label>{t("Unit Price")}</label>
        <Input type="number" step="0.01" {...register("unit_price", { valueAsNumber: true })} />
        {errors.unit_price && <p className="text-sm text-red-500">{errors.unit_price.message}</p>}
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
        <label>Menu Category</label>
        <Select
          value={watch("menu_category_id")}
          onValueChange={(val) => setValue("menu_category_id", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id} className="flex flex-row gap-2 space-x-2">
                <span>{cat.name} </span>
                <span> {cat?.Branch?.name}</span>
               
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.menu_category_id && <p className="text-sm text-red-500">{errors.menu_category_id.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : item ? "Update Item" :`${t("Create Menu Item Food")}` }
      </Button>
    </form>
  );
}
