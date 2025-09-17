"use client";
import { createRole, createRoleRestuarant, updateRole } from "@/actions/role/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useTranslations } from "next-intl";

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
 const createRoleFormSchema = z.object({
  name: z.string().min(1, "Role name is required."),
  description: z.string().optional().or(z.literal("")),
  permissionIds: z.array(z.string()).optional(),
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
export type RoleFormValues = z.infer<typeof createRoleFormSchema>;

export default function RestaurantRoleForm({
  role,
  allPermissions,
  allRoleTags,
  onSuccess,
}: RoleFormProps) {
  const isUpdateMode = !!role;

  // const dRoleTagId =
  //   allRoleTags.find((r) => r.name === role?.role_tag_name)?.id || "";
   const t=useTranslations('full');
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(createRoleFormSchema),
    defaultValues: {
      name: role?.name || "",
      description: role?.description || "",
      permissionIds: role?.permissions.map((p) => p.id) || [],
    },
  });

  useEffect(() => {
    reset({
      name: role?.name || "",
      description: role?.description || "",
      permissionIds: role?.permissions.map((p) => p.id) || [],
      // role_tag_id: role?.role_tag?.id || "",
    });
  }, [role, reset]);

  const permissions = watch("permissionIds") || [];

  const togglePermission = (id: string) => {
    const updated = permissions.includes(id)
      ? permissions.filter((pid) => pid !== id)
      : [...permissions, id];

    setValue("permissionIds", updated);
  };

  const onSubmit = async (values: any) => {

    try {
      if (isUpdateMode) {
        await updateRole(values, role.id);
      } else {
        await createRoleRestuarant(values);
      }
      
      toast(isUpdateMode ? "Role Updated" : "Role Created");

      onSuccess();
    } catch (err: any) {
      toast.error("Form submission faild");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-start gap-4 py-10"
    >
      <div className="flex w-5/6 justify-between gap-2">
        <p className="text-lg font-bold lg:text-2xl">
          {isUpdateMode ? "Update Role" : `${t("Create New Role")}`}
        </p>
        {role?'':<Link href="/dashboard/superadmin/role">
          <Button variant="outline" className="cursor-pointer">
            {t("Cancel")}
          </Button>
        </Link>}
        
      </div>

      {/* Name Field */}
      <div className="flex w-5/6 flex-col gap-2">
        <label className="block font-medium">{t("Role Name")}</label>
        <Input placeholder="e.g., restaurant_admin" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="flex w-4/6 flex-col gap-2 lg:w-5/6">
        <label className="block font-medium">{t("Description")}</label>
        <Textarea
          placeholder="A brief description of the role's purpose."
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
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

      {/* Permissions */}
      <div className="flex w-5/6 flex-col gap-2">
        <label className="mb-2 block font-medium">{t("Permissions")}</label>
        <p className="text-muted-foreground mb-4 text-sm">
          Select the permissions this role will have.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {allPermissions.map((permission) => (
            <div key={permission.id} className="flex items-start space-x-3 p-1">
              <div className="border-muted-foreground rounded-md border px-1">
                <Checkbox
                  checked={permissions.includes(permission.id)}
                  onCheckedChange={() => togglePermission(permission.id)}
                />
              </div>

              <label className="text-xs capitalize">
                {permission.name.replace(/_/g, " ")}
              </label>
            </div>
          ))}
        </div>
        {errors.permissionIds && (
          <p className="mt-2 text-sm text-red-500">
            {errors.permissionIds.message}
          </p>
        )}
      </div>

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
