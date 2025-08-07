"use client";

import { useForm } from "react-hook-form";
import { useActionState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTransition } from "react";

import {
  createRestaurantAdminSchema,
  CreateRestaurantAdminValues,
} from "@/schemas/schemas";

import { createRestaurantAdminAction } from "@/actions/user/api";
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

export function CreateRestaurantAdminForm() {
  const [pending, startTransition] = useTransition();
  const [state, formAction] = useActionState(createRestaurantAdminAction, null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<CreateRestaurantAdminValues>({
    resolver: zodResolver(createRestaurantAdminSchema),
    defaultValues: {
      creatorMode: "email",
      email: "",
      phone_number: "",
    },
  });

  const creatorMode = watch("creatorMode");

  const onSubmit = (data: CreateRestaurantAdminValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    startTransition(() => formAction(formData));
  };

  if (state?.message) {
    if (state.success) toast.success(state.message);
    else toast.error(state.message);
  }

  if (state?.errors) {
    Object.entries(state.errors).forEach(([field, msg]) => {
      if (msg?.[0]) {
        setError(field as keyof CreateRestaurantAdminValues, {
          type: "server",
          message: msg[0],
        });
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-start gap-4 py-10"
    >
      <div className="flex w-4/6 justify-between gap-2 lg:w-3/6">
        <p className="text-lg font-bold lg:text-2xl">Create Restaurant Admin</p>
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

      {/* Optional: Assign restaurant */}
      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="restaurant_id">Restaurant ID</Label>
        <Input
          {...register("restaurant_id")}
          placeholder="Optional restaurant_id"
        />
        {errors.restaurant_id && (
          <p className="text-sm text-red-500">{errors.restaurant_id.message}</p>
        )}
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create Admin"}
      </Button>
    </form>
  );
}
