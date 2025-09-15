"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState,useEffect } from "react";
import { toast } from "sonner";
import { createCatering } from "@/actions/catering/api";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getAllBranches } from "@/actions/branch/api";
import { createTable } from "@/actions/table/api";
const schema = z.object({
  branch_id: z.string().min(1, "Branch is required"),
  table_number: z.string().min(1, "Table number required"),
  capacity: z.number().min(1, "Capacity required"),
  is_active: z.boolean().default(true).optional(),
});

type CateringFormValues = z.infer<typeof schema>;

export default function RestaurantTabelForm(onSuccess:any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branches,setBranches]=useState<any[]>([])
  const router=useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CateringFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
         branch_id: "",
    table_number: "",
    capacity: undefined,
        is_active: true,
    },
  });

  // const deliveryAvailable = watch("delivery_available");
useEffect(() => {
    const fetchData = async () => {
      try {
        const [ branchRes] = await Promise.all([
       
          getAllBranches(),
        ]);

   

        setBranches(branchRes?.data || []);
      } catch (error) {
        toast.error("Failed to load required data");
      }
    };
    fetchData();
  }, [setValue]);

  const onSubmit = async (data: any) => {
    console.log(data,'data for creating catering')
    setIsSubmitting(true);
    try {
        const res = await createTable(data);
      
           if (res.success) {
             toast.success("Restaurant table saved successfully");
             router.push("/dashboard/restaurant/tables")
           } else {
             toast.error(res.message || "Failed to save restaurant table");
           }
     
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Restaurant Table</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         
        <div>
        <label>Branch</label>
        <Select
          value={watch("branch_id") || ""}
          onValueChange={(val) => setValue("branch_id", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            {branches?.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

        
      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Table Number *</label>
              <input
                {...register("table_number")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Table Number (T-12)"
              />
              {errors.table_number && <p className="mt-1 text-sm text-red-600">{errors.table_number.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Table Capacity *</label>
              <input
                {...register("capacity",{valueAsNumber:true})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the table capacity"
              />
              {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>}
            </div>
          </div>




          <div className="space-y-4">

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("is_active")}
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Active</label>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
                       >
              {isSubmitting ? "Creating..." : "Create Table"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}