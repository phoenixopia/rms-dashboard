"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createMenu, updateMenu } from "@/actions/menu/api"; 

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

type MenuFormValues = z.infer<typeof schema>;

export default function MenuForm({
  item,
  onSuccess,
}: {
  item?: any;
  onSuccess: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MenuFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: ""
    },
  });

  useEffect(() => {
    if (item) {
      reset({
        name: item.name || ""
      });
    }
  }, [item, reset]);

  const onSubmit = async (values: MenuFormValues) => {
    try {
      let res;
      if (item && item.id) {
     
        res = await updateMenu(item.id, values);
      } else {
      
        res = await createMenu(values);
      }
      
      if (res.success) {
        toast.success(item ? "Menu updated successfully" : "Menu created successfully");
        onSuccess();
      } else {
        toast.error(res.message || `Failed to ${item ? 'update' : 'create'} menu`);
      }
    } catch (e: any) {
      toast.error(e.message || "Unexpected error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input {...register("name")} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {!item &&      <Button
          type="button"
          variant="outline"
          onClick={() => onSuccess()}
        >
          Cancel
        </Button>}
   
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : item ? "Update Menu" : "Create Menu"}
        </Button>
      </div>
    </form>
  );
}