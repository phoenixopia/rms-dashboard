"use client";

import { useForm } from "react-hook-form";
import { useActionState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTransition } from "react";

import {
  createRestaurantAdminSchema,
  CreateRestaurantAdminValues,
} from "@/schemas/schemas";

import { createRestaurantAdminAction,createRestaurantStaffAction } from "@/actions/user/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { RoleData } from "@/types";

interface adminFormProps {
  roles: RoleData[];
}

export function CreateRestaurantStaffForm({ roles }: adminFormProps) {
  const [pending, startTransition] = useTransition();
  const [state, formAction] = useActionState(createRestaurantStaffAction, null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    // setError,
    // clearErrors,
    formState: { errors },
  } = useForm<CreateRestaurantAdminValues>({
    resolver: zodResolver(createRestaurantAdminSchema),
    defaultValues: {
      creatorMode: "email",
      email: "",
      phone_number: "",
      role_id: "",
    },
  });

  const creatorMode = watch("creatorMode");
  const selectedRole = watch("role_id");

  const onSubmit = (data: CreateRestaurantAdminValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    startTransition(async () => {
      const result = await createRestaurantStaffAction(null, formData);

      if (result.success) {
        toast.success(result.message || "Staff created successfully!");
      } else {
        toast.error(result.message || "Failed to create admin.");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-start gap-4 py-10"
    >
      <div className="flex w-4/6 justify-between gap-2 lg:w-3/6">
        <p className="text-lg font-bold lg:text-2xl">Create Restaurant Staff</p>
        <Link href="/dashboard/superadmin/admins">
          <Button variant="outline" className="cursor-pointer">
            Cancel
          </Button>
        </Link>
      </div>
      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="first_name">First Name</Label>
        <Input {...register("first_name")} />
        {errors.first_name && (
          <p className="text-sm text-red-500">{errors.first_name.message}</p>
        )}
      </div>

      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="last_name">Last Name</Label>
        <Input {...register("last_name")} />
        {errors.last_name && (
          <p className="text-sm text-red-500">{errors.last_name.message}</p>
        )}
      </div>

      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="password">Password</Label>
        <Input type="password" {...register("password")} />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="creatorMode">Creation Mode</Label>
        <Select
          value={creatorMode}
          onValueChange={(val) =>
            setValue("creatorMode", val as "email" | "phone")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {creatorMode === "email" && (
        <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
          <Label htmlFor="email">Email</Label>
          <Input {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
      )}

      {creatorMode === "phone" && (
        <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input {...register("phone_number")} />
          {errors.phone_number && (
            <p className="text-sm text-red-500">
              {errors.phone_number.message}
            </p>
          )}
        </div>
      )}
      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="role_id">Role</Label>
        {/* <label className="block font-medium">Role Tag</label> */}
        <Select
          value={selectedRole || "none"}
          onValueChange={(value) =>
            setValue("role_id", value === "none" ? "" : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role_id && (
          <p className="text-sm text-red-500">{errors.role_id.message}</p>
        )}
      </div>

      {/* Optional: Assign restaurant */}
      {/* <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="restaurant_id">Restaurant ID</Label>
        <Input
          {...register("restaurant_id")}
          placeholder="Optional restaurant_id"
        />
        {errors.restaurant_id && (
          <p className="text-sm text-red-500">{errors.restaurant_id.message}</p>
        )}
      </div> */}

      <Button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create Staff"}
      </Button>
    </form>
  );
}
