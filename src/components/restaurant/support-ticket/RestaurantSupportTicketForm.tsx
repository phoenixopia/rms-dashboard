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
import { createSupportTicket } from "@/actions/support-ticket/api";
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.string().min(1, "Proirity is required"),

});

type SupportTicketFormValues = z.infer<typeof schema>;

export default function RestaurantSupportTicketForm(onSuccess:any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branches,setBranches]=useState<any[]>([])
  const router=useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SupportTicketFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
       title: "",
      description: "",
      priority:""
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
    console.log(data,'data for creating support ticket')
    setIsSubmitting(true);
    try {
        const res = await createSupportTicket(data);
      
           if (res.success) {
             toast.success("Restaurant support ticket created successfully");
             router.push("/dashboard/restaurant/support-ticket")
           } else {
             toast.error(res.message || "Failed to save restaurant support ticket");
           }
     
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  let priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 dark:text-gray-800">Create Support Ticket</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         
        <div>
        <label>Priority</label>
        <Select
          value={watch("priority") || ""}
          onValueChange={(val) => setValue("priority", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions?.map((priority,index) => (
              <SelectItem key={index} value={priority.value}>
                {priority.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

        
      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Title *</label>
              <input
                {...register("title")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1  dark:text-white">Description *</label>
              <textarea
                {...register("description")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>
          </div>




 

          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
                       >
              {isSubmitting ? "Creating..." : "Create Support Ticket"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}