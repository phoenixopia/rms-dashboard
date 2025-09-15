"use client";
import { createRole, createRoleRestuarant, updateRole } from "@/actions/role/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";

import { Permission, RoleData, RoleTag } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
 const createBranchFormSchema = z.object({
  name: z.string().min(1, "branch name is required."),
  opening_time:z.string(),
  closing_time:z.string()
});
interface RoleFormProps {
  role?: RoleData | null;
  allPermissions: Permission[];
  allRoleTags: RoleTag[];
  onSuccess: () => void;
}

import React, { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
export type RoleFormValues = z.infer<typeof createBranchFormSchema>;

export default function BranchForm({
  role,
  allPermissions,
  allRoleTags,
  onSuccess,
}: RoleFormProps) {
  const isUpdateMode = !!role;

  // const dRoleTagId =
  //   allRoleTags.find((r) => r.name === role?.role_tag_name)?.id || "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(createBranchFormSchema),
    defaultValues: {
      name: role?.name || "",
      opening_time: role?.description || "",
      closing_time: role?.description || "",
    },
  });

  useEffect(() => {
    reset({
      name: role?.name || "",
      opening_time: role?.description || "",
      closing_time: role?.description || "",
      // role_tag_id: role?.role_tag?.id || "",
    });
  }, [role, reset]);


  const onSubmit = async (values: any) => {

    console.log(values,"Form values");
    try {
      if (isUpdateMode) {
        await updateRole(values, role.id);
      } else {
        await createRoleRestuarant(values);
      }
      
      toast(isUpdateMode ? "Branch Updated" : "Branch Created");

      onSuccess();
    } catch (err: any) {
      toast.error("Form submission failed");
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-start gap-4 py-10"
    >
      <div className="flex w-5/6 justify-between gap-2">
        <p className="text-lg font-bold lg:text-2xl">
          {isUpdateMode ? "Update Branch" : "Create New Branch"}
        </p>
        <Link href="/dashboard/restaurant/branch">
          <Button variant="outline" className="cursor-pointer">
            Cancel
          </Button>
        </Link>
      </div>

      {/* Name Field */}
      <div className="flex w-5/6 flex-col gap-2">
        <label className="block font-medium">Branch Name</label>
        <Input placeholder="Branch Name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="flex w-4/6 flex-col gap-2 lg:w-5/6">
        <label className="block font-medium">Opening Time</label>
        <input type="time"
              className={cn(
                "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                
              )} 
          placeholder="A brief description of the role's purpose."
          {...register("opening_time")}
        />
        {errors.opening_time && (
          <p className="text-sm text-red-500">{errors.opening_time.message}</p>
        )}
      </div>



            <div className="flex w-4/6 flex-col gap-2 lg:w-5/6">
        <label className="block font-medium">Closing Time</label>
        <Textarea
          placeholder="A brief description of the role's purpose."
          {...register("opening_time")}
        />
        {errors.opening_time && (
          <p className="text-sm text-red-500">{errors.opening_time.message}</p>
        )}
      </div>


      {/* Role Tag Select */}
      {/* <div className="flex w-5/6 flex-col gap-2">
        <label className="block font-medium">Role Tag</label>
        <Select
          value={watch("role_tag_id") || "none"}
          onValueChange={(value) =>
            setValue("role_tag_id", value === "none" ? "" : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {allRoleTags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role_tag_id && (
          <p className="text-sm text-red-500">{errors.role_tag_id.message}</p>
        )}
      </div> */}



      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "Saving..."
          : isUpdateMode
            ? "Update Role"
            : "Create Role"}
      </Button>
    </form>
  );
}
