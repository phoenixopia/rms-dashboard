"use client";
import { createRole, updateRole } from "@/actions/role/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import { createRoleFormSchema, RoleFormValues } from "@/schemas/schemas";
import { Permission, RoleData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";

interface RoleFormProps {
  role?: RoleData | null;
  allPermissions: Permission[];
  onSuccess: () => void;
}

import React, { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function RoleForm({
  role,
  allPermissions,
  onSuccess,
}: RoleFormProps) {
  const isUpdateMode = !!role;

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
      permissions: role?.Permissions.map((p) => p.id) || [],
    },
  });

  useEffect(() => {
    reset({
      name: role?.name || "",
      description: role?.description || "",
      permissions: role?.Permissions.map((p) => p.id) || [],
    });
  }, [role, reset]);

  const permissions = watch("permissions") || [];

  const togglePermission = (id: string) => {
    const updated = permissions.includes(id)
      ? permissions.filter((pid) => pid !== id)
      : [...permissions, id];

    setValue("permissions", updated);
  };

  const onSubmit = async (values: RoleFormValues) => {
    try {
      if (isUpdateMode) {
        await updateRole(values, role.id);
      } else {
        await createRole(values);
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
          {isUpdateMode ? "Update Role" : "Create New Role"}
        </p>
        <Link href="/dashboard/superadmin/role">
          <Button variant="outline" className="cursor-pointer">
            Cancel
          </Button>
        </Link>
      </div>

      {/* Name Field */}
      <div className="flex w-5/6 flex-col gap-2">
        <label className="block font-medium">Role Name</label>
        <Input placeholder="e.g., restaurant_admin" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="flex w-4/6 flex-col gap-2 lg:w-5/6">
        <label className="block font-medium">Description</label>
        <Textarea
          placeholder="A brief description of the role's purpose."
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Permissions */}
      <div className="flex w-5/6 flex-col gap-2">
        <label className="mb-2 block font-medium">Permissions</label>
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
        {errors.permissions && (
          <p className="mt-2 text-sm text-red-500">
            {errors.permissions.message}
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
