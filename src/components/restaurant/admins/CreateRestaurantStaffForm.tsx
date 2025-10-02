"use client";

import { useForm } from "react-hook-form";
import { useActionState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { useTranslations } from "next-intl";

import {
  createRestaurantAdminSchema,
  CreateRestaurantAdminValues,
} from "@/schemas/schemas";

import { createRestaurantAdminAction,createRestaurantStaffAction, updateRestaurantStaffAction } from "@/actions/user/api";
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

export function CreateRestaurantStaffForm({ roles,staffData,onSuccess }: any) {
  const [pending, startTransition] = useTransition();
  const [state, formAction] = useActionState(createRestaurantStaffAction, null);
  const t = useTranslations("full");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    // setError,
    // clearErrors,
    formState: { errors },
  } = useForm<CreateRestaurantAdminValues>({
    resolver: zodResolver(createRestaurantAdminSchema),
    defaultValues: {
      creatorMode: "email",
      email: "",
      phone_number: "",
      role_id:staffData?.Role?.id || "",
    },
  });

  const creatorMode = watch("creatorMode");
  const selectedRole = watch("role_id");

  const onSubmit = (data: any) => {

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
      if(staffData){
         
    startTransition(async () => {
      const result = await updateRestaurantStaffAction(null, formData,staffData?.id);

      if (result.success) {
        toast.success(result.message || "Staff updated successfully!");
      } else {
        toast.error(result.message || "Failed to update staff.");
      }
    });
      }else{
    startTransition(async () => {
      const result = await createRestaurantStaffAction(null, formData);

      if (result.success) {
        toast.success(result.message || "Staff created successfully!");
      } else {
        toast.error(result.message || "Failed to create admin.");
      }
    });
      }

  };

    useEffect(() => {
      if (staffData) {
        reset({
                role_id:staffData?.Role?.id,
                last_name:staffData?.last_name 


        });
      }
    }, [staffData, reset]);
 
  return (
    <div>

         <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-start gap-4 py-10"
    >

      {staffData?
         <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="role_id">{t("Role")}</Label>
        {/* <label className="block font-medium">Role Tag</label> */}
        <Select
      

             value={watch("role_id")}
             onValueChange={(value) =>
            setValue("role_id", value === "none" ? "" : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {roles?.map((role:any) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role_id && (
          <p className="text-sm text-red-500">{errors.role_id.message}</p>
        )}
      </div>:<div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="flex w-4/6 justify-between gap-2 lg:w-3/6">
         
        <p className="text-lg font-bold lg:text-2xl">{t("Create Restaurant Staff")}</p>
        

        <Link href="/dashboard/superadmin/admins">    <Button variant="outline" className="cursor-pointer">
            {t("Cancel")}
          </Button>
        </Link>
       
      </div>
      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="first_name">{t("First Name")}</Label>
        <Input {...register("first_name")} />
        {errors.first_name && (
          <p className="text-sm text-red-500">{errors.first_name.message}</p>
        )}
      </div>

      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="last_name">{t("Last Name")}</Label>
        <Input {...register("last_name")} />
        {errors.last_name && (
          <p className="text-sm text-red-500">{errors.last_name.message}</p>
        )}
      </div>

      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="password">{t("Password")}</Label>
        <Input type="password" {...register("password")} />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="creatorMode">{t("Creation Mode")}</Label>
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
            <SelectItem value="email">{t("Email")}</SelectItem>
            <SelectItem value="phone">{t("Phone")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {creatorMode === "email" && (
        <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
          <Label htmlFor="email">{t("Email")}</Label>
          <Input {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
      )}

      {creatorMode === "phone" && (
        <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
          <Label htmlFor="phone_number">{t("Phone Number")}</Label>
          <Input {...register("phone_number")} />
          {errors.phone_number && (
            <p className="text-sm text-red-500">
              {errors.phone_number.message}
            </p>
          )}
        </div>
      )}


      <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="role_id">{t("Role")}</Label>
        {/* <label className="block font-medium">Role Tag</label> */}
        <Select
      

             value={watch("role_id")}
             onValueChange={(value) =>
            setValue("role_id", value === "none" ? "" : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {roles.map((role:any) => (
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
      </div>}
      <Button type="submit" disabled={pending}>
        {staffData?pending ? "updating..." : "Update Staff":pending ? "Creating..." : ` ${t('Create Staff')}`}
      </Button>
    </form> 
  </div>
 
  );
}
