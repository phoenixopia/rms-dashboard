"use client";

import { useForm } from "react-hook-form";
import { useActionState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";

import z from "zod";


export const updateRestaurantAdminSchema = z.object({

  role_id: z.string(),

});

export type UpdateRestaurantAdminValues = z.infer<
  typeof updateRestaurantAdminSchema
>;
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

export function UpdateRestaurantStaffForm({ roles,staffData,onSuccess }: any) {
  const [pending, startTransition] = useTransition();
  const [state, formAction] = useActionState(createRestaurantStaffAction, null);
  const router =useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    // setError,
    // clearErrors,
    formState: { errors },
  } = useForm<UpdateRestaurantAdminValues>({
    resolver: zodResolver(updateRestaurantAdminSchema),
    defaultValues: {
      role_id:staffData?.Role?.id || "",
    },
  });

  const selectedRole = watch("role_id");

  const onSubmit = (data: any) => {
    
    startTransition(async () => {
      const result = await updateRestaurantStaffAction(null, data,staffData?.id);

      if (result.success) {
        router.refresh()
        toast.success(result.message || "Staff updated successfully!");
        onSuccess()
      } else {
        toast.error(result.message || "Failed to update staff.");
      }
    });
 

  };

    useEffect(() => {
      if (staffData) {
        reset({
                role_id:staffData?.Role?.id,



        });
      }
    }, [staffData, reset]);

  return (
    <div>

         <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-start gap-4 py-10"
    >

         <div className="flex w-4/6 flex-col gap-2 lg:w-3/6">
        <Label htmlFor="role_id">Role</Label>
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
          <SelectContent className="flex z-100">
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
      <Button type="submit" disabled={pending}>
        {pending ? "updating..." : "Update Staff"}
        {}
      </Button>
    </form> 
  </div>
 
  );
}
