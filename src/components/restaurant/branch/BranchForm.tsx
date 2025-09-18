"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "@/i18n/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { toast } from "sonner";
import { createBranch, updateBranch } from "@/actions/branch/api";
import { Link } from "@/i18n/navigation";

import { Permission, RoleData, RoleTag } from "@/types";
import { getAllStaffUsers } from "@/actions/user/api";


const createBranchFormSchema = z.object({
  name: z.string().min(1, "Branch name is required."),
  opening_time: z.string().min(1, "Opening time is required."),
  closing_time: z.string().min(1, "Closing time is required."),
  main_branch: z.boolean().default(false).optional(),
  address: z.string().min(1, "Address is required."),
  latitude: z.number().min(-90, "Invalid latitude").max(90, "Invalid latitude"),
  longitude: z.number().min(-180, "Invalid longitude").max(180, "Invalid longitude"),
  status: z.enum(["active", "inactive"]).default("active").optional(),
  manager_id: z.string().optional(),
  staff_ids: z.array(z.string()).optional(),
});


type BranchFormValues = z.infer<typeof createBranchFormSchema>;

interface BranchFormProps {
  branch?: any | null;
  onSuccess: () => void;
}

export default function BranchForm({
  branch,
  onSuccess,
}: BranchFormProps) {
  const isUpdateMode = !!branch;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BranchFormValues>({
    resolver: zodResolver(createBranchFormSchema),
    defaultValues: {
      name: branch?.name || "",
      opening_time: branch?.opening_time || "",
      closing_time: branch?.closing_time || "",
      main_branch:branch?.main_branch || false,
      address: branch?.location?.address || "",
      latitude: branch?.location?.latitude || 9.019100813742908,
      longitude: branch?.location?.longitude || 38.801783780716995,
      status: branch?.status || "active",
      manager_id: branch?.manager?.id || "none",
      staff_ids:  branch?.assigned_users?.map((p:any) => p.id) || [], 
      

    },
  });
   
  useEffect(() => {
    if (branch) {
      reset({
        name: branch.name || "",
        opening_time: branch.opening_time || "",
        closing_time: branch.closing_time || "",
        address: branch?.location?.address || "",
        main_branch: branch.main_branch || false,
        latitude: branch?.location?.latitude || 23.8103,
        longitude: branch?.location?.longitude || 90.4125,
        status: branch.status || "active",
        manager_id: branch?.manager?.id || "none",
        
      staff_ids:  branch?.assigned_users?.map((p:any) => p.id) || [], 

      });
    }
  }, [branch, reset]);
    const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API;

  const latitude = watch("latitude") ?? 23.8103;
  const longitude = watch("longitude") ?? 90.4125;
  const staffIds = watch("staff_ids") || [];
  const managerId = watch("manager_id");
   const router =useRouter();
  const onDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setValue("latitude", e.latLng.lat());
      setValue("longitude", e.latLng.lng());
    }
  };

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: `${googleApiKey}`
    });

  const [staffList, setStaffList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setIsLoading(true);
        const data = await getAllStaffUsers();
        setStaffList(data?.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch staff:", error);
        toast.error("Failed to load staff data");
        setStaffList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const onSubmit = async (values: any) => {
      
        if (values.manager_id === 'none') {
      delete values.manager_id;
    }
    try {
      if (isUpdateMode) {
  
 

        if (values.manager_id === 'none' || values.manager_id  ==="") {
          delete values.manager_id;
        }


        const payload = {
          ...values,
          staff_ids: values.staff_ids?.map((ids: any) => ids.id ?? ids) || [],
        };

       let response=   await updateBranch(payload,branch.id);
        
          if(response?.success){
            toast.success("Branch Updated");
            router.refresh();
          }else{
            toast.error(response?.message || 'Failed to update branch!')
          }
      } else {
      const response=  await createBranch(values);
      if(response.success) {
        router.refresh();
        toast.success("Branch Created");
      } else {
        toast.error(response?.message || "Failed to create branch");
      }
      }
      onSuccess();
    } catch (error: any) {
      console.error("Form submission failed:", error);
      toast.error(error.message || "Form submission failed");
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
        {/* <Link href="/dashboard/restaurant/branch">
          <Button variant="outline">Cancel</Button>
        </Link> */}
      </div>

      {/* Branch Name */}
      <div className="w-5/6 flex flex-col gap-2">
        <label>Branch Name</label>
        <Input placeholder="Branch Name" {...register("name")} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      {/* Opening & Closing Time */}
      <div className="flex w-5/6 gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <label>Opening Time</label>
          <Input type="time" {...register("opening_time")} />
          {errors.opening_time && <p className="text-sm text-red-500">{errors.opening_time.message}</p>}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <label>Closing Time</label>
          <Input type="time" {...register("closing_time")} />
          {errors.closing_time && <p className="text-sm text-red-500">{errors.closing_time.message}</p>}
        </div>
      </div>

      {/* Address */}
      <div className="w-5/6 flex flex-col gap-2">
        <label>Address</label>
        <Input placeholder="Branch Address" {...register("address")} />
        {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
      </div>

      {/* Coordinates */}
      <div className="flex w-5/6 gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <label>Latitude</label>
          <Input 
            type="number" 
            step="any" 
            {...register("latitude", { 
              valueAsNumber: true,
              setValueAs: (v) => v === "" ? undefined : Number(v)
            })} 
          />
          {errors.latitude && <p className="text-sm text-red-500">{errors.latitude.message}</p>}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <label>Longitude</label>
          <Input 
            type="number" 
            step="any" 
            {...register("longitude", { 
              valueAsNumber: true,
              setValueAs: (v) => v === "" ? undefined : Number(v)
            })} 
          />
          {errors.longitude && <p className="text-sm text-red-500">{errors.longitude.message}</p>}
        </div>
      </div>

      {/* Status */}
      <div className="w-5/6 flex flex-col gap-2 ">
        <label>Status</label>
        <Select 
          value={watch("status")}
          onValueChange={(val: "active" | "inactive") => setValue("status", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="flex flex-col  z-200">
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
      </div>

      <div className="flex w-5/6 items-center gap-2">
        <Checkbox
          checked={watch("main_branch")}
          onCheckedChange={(val) => setValue("main_branch", !!val)}
        />
        <label>Main Branch</label>
      </div>

      <div className="w-5/6 flex flex-col gap-2">
        <label>Manager</label>
        {isLoading ? (
          <Input disabled placeholder="Loading staff..." />
        ) : (
       <Select
            value={watch("manager_id") || "none"}
            onValueChange={(val) => setValue("manager_id", val === "none" ? "" : val)}
          >

            
            <SelectTrigger>
              <SelectValue placeholder="Select Manager" />
            </SelectTrigger>
            <SelectContent className="flex flex-col  z-200">
              <SelectItem className="flex space-x-2" value="none">
                  <span>None</span>
                </SelectItem>
              {staffList.map((staff) => (
                <SelectItem className="flex space-x-2" key={staff.id} value={staff.id}>
                  {staff?.first_name} {staff?.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {errors.manager_id && <p className="text-sm text-red-500">{errors.manager_id.message}</p>}
      </div>


      <div className="w-5/6 flex flex-col gap-2">
        <label>Staff Members</label>
        {isLoading ? (
          <p>Loading staff...</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {staffList.map((staff) => (
              <div key={staff.id} className="flex items-center space-x-2">
                {isUpdateMode?    
                
                        <Checkbox
                         id={`staff-${staff?.id}`}
                          checked={staffIds.includes(staff.id)}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...staffIds, staff.id]
                              : staffIds.filter((id) => id !== staff.id);
                            setValue("staff_ids", updated);
                          }}
                        />
                
        //         <Checkbox
        //   id={`staff-${staff?.id}`}
        //   checked={staffIds.some((s: any) => s.id === staff?.id)}
        //   onCheckedChange={(checked) => {
        //     const updated:any = checked
        //       ? [...staffIds, { id: staff.id }]
        //       : staffIds.filter((s: any) => s.id !== staff.id);
        //     setValue("staff_ids", updated);
        //   }}
        // />
        :    <Checkbox
                  id={`staff-${staff.id}`}
                  checked={staffIds.includes(staff?.id)}
                  onCheckedChange={(checked) => {
                    const updated = checked
                      ? [...staffIds, staff.id]
                      : staffIds.filter((id: string) => id !== staff.id);
                    setValue("staff_ids", updated);
                  }}
                />
}
            
                <label
                  htmlFor={`staff-${staff.id}`}
                  className="text-sm space-x-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {staff?.first_name} {staff?.last_name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>


      <div className="w-5/6 flex flex-col gap-2 col-span-2">
        <label>Branch Location</label>
        <span className="text-sm text-gray-600 dark:text-gray-200">
          Use the pointer to allocate the area
        </span>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "25rem" }}
            center={{ lat: latitude, lng: longitude }}
            zoom={16}
          >
            <MarkerF
              position={{ lat: latitude, lng: longitude }}
              draggable
              onDragEnd={onDragEnd}
            />
          </GoogleMap>
        ) : (
          <p className="text-center text-sm text-gray-800 dark:text-white">Loading map...</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting || isLoading}>
        {isSubmitting
          ? "Saving..."
          : isUpdateMode
          ? "Update Branch"
          : "Create Branch"}
      </Button>
    </form>
  );
}