"use client";

import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// import {
//   CreateRestaurantFormValues,
//   createRestaurantSchema,
// } from "@/lib/schemas/restaurant";
// import { useActionState } from "react-dom";
// import { createRestaurant } from "@/actions/restaurant/create";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User } from "@/types";
import { getAllCreatedUsers } from "@/actions/user/api";
import {
  CreateRestaurantFormValues,
  createRestaurantSchema,
} from "@/schemas/schemas";
import { createRestaurant } from "@/actions/restaurant/api";
import { Link } from "@/i18n/navigation";

export function CreateRestaurantForm() {
  const [state, formAction] = useActionState(createRestaurant, null);
  const [admins, setAdmins] = useState<User[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateRestaurantFormValues>({
    resolver: zodResolver(createRestaurantSchema),
    defaultValues: {
      restaurant_name: "",
      restaurant_admin_id: null,
      language: "en",
      theme: "Light",
      rtl_enabled: false,
      primary_color: undefined,
    },
  });

  // Fetch admin users
  useEffect(() => {
    async function fetchAdmins() {
      setLoadingAdmins(true);
      try {
        const response = await getAllCreatedUsers();
        setAdmins(response.data.data);
      } catch (e) {
        toast.error("Failed to fetch admin users.");
      } finally {
        setLoadingAdmins(false);
      }
    }
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message);
    }
    if (state?.errors) {
      Object.keys(state.errors).forEach((key) => {
        setError(key as keyof CreateRestaurantFormValues, {
          type: "server",
          message: state.errors[key as keyof typeof state.errors]?.[0],
        });
      });
    }
  }, [state, setError]);

  return (
    <form
      action={formAction}
      // onSubmit={handleSubmit(() => {})}
      className="flex flex-col items-center justify-start gap-4 py-10"
    >
      <div className="flex w-4/6 justify-between gap-2 lg:w-3/6">
        <p className="text-lg font-bold lg:text-2xl">{"Create Restaurant"}</p>
        <Link href="/dashboard/superadmin/restaurant">
          <Button variant="outline" className="cursor-pointer">
            Cancel
          </Button>
        </Link>
      </div>
      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="restaurant_name">Restaurant Name</Label>
        <Input
          id="restaurant_name"
          {...register("restaurant_name")}
          placeholder="e.g. Yod Abyssinia"
        />
        {errors.restaurant_name && (
          <p className="mt-1 text-sm text-red-500">
            {errors.restaurant_name.message}
          </p>
        )}
      </div>

      {/* Admin Select */}
      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="restaurant_admin_id">Assign Admin</Label>
        <Select
          onValueChange={(value) => setValue("restaurant_admin_id", value)}
          defaultValue={watch("restaurant_admin_id") || undefined}
          disabled={loadingAdmins}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an admin" />
          </SelectTrigger>
          <SelectContent>
            {admins.map((admin) => (
              <SelectItem key={admin.id} value={admin.id.toString()}>
                {admin.first_name} {admin.last_name} ({admin.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.restaurant_admin_id && (
          <p className="mt-1 text-sm text-red-500">
            {errors.restaurant_admin_id.message}
          </p>
        )}
      </div>

      {/* Language */}
      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="language">Language</Label>
        <Input
          id="language"
          {...register("language")}
          placeholder="en, ar, etc."
        />
      </div>

      {/* Theme */}
      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="theme">Theme</Label>
        <select
          id="theme"
          {...register("theme")}
          className="mt-1 w-full rounded-md border p-2"
        >
          <option value="Light">Light</option>
          <option value="Dark">Dark</option>
          <option value="System">System</option>
        </select>
      </div>

      {/* RTL Switch */}
      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Switch
          id="rtl_enabled"
          checked={watch("rtl_enabled")}
          onCheckedChange={(checked) => setValue("rtl_enabled", checked)}
        />
        <Label htmlFor="rtl_enabled">Enable RTL (Right-to-left layout)</Label>
      </div>

      {/* Primary Color */}
      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="primary_color">Primary Color</Label>
        <Input
          type="color"
          id="primary_color"
          {...register("primary_color")}
          className="h-10 w-16 border-0 p-0"
        />
        {errors.primary_color && (
          <p className="mt-1 text-sm text-red-500">
            {errors.primary_color.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Restaurant"}
      </Button>
    </form>
  );
}
