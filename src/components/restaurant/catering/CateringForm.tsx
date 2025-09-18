"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { createCatering } from "@/actions/catering/api";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  menu_summary: z.string().min(1, "Menu summary is required"),
  base_price: z.number().min(1, 'Base price is required'),
  min_guest_count: z.number().min(1, "Minimum guest count required"),
  max_guest_count: z.number().min(1, "Maximum guest count required"),
  min_advance_days: z.number().min(1, "Minimum advance days required"),
  prepayment_percentage: z.number().min(1, "Prepayment percentage required"),
  include_service: z.boolean().default(false).optional(),
  delivery_available: z.boolean().default(false).optional(),
  service_area_description: z.string().optional(),
  contact_person: z.string().min(1, "Contact person name is required"),
  contact_info: z.string()
    .min(13, "Phone number must be 13 characters including +")
    .max(13, "Phone number must be 13 characters including +")
    .refine((val) => val.startsWith('+2519') || val.startsWith('+2517'), {
      message: "Phone number must start with +2519 or +2517"
    }),
  is_active: z.boolean().default(true).optional(),
});

type CateringFormValues = z.infer<typeof schema>;

export default function CateringForm(onSuccess:any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      title: "",
      description: "",
      menu_summary: "",
      base_price: undefined,
      min_guest_count: undefined,
      max_guest_count: undefined,
      min_advance_days: undefined,
      prepayment_percentage: undefined,
      include_service: false,
      delivery_available: false,
      service_area_description: "",
      contact_person: "",
      contact_info: "",
      is_active: true,
    },
  });

  const deliveryAvailable = watch("delivery_available");

  const onSubmit = async (data: any) => {

    setIsSubmitting(true);
    try {
        const res = await createCatering(data);
           if (res.success) {
             toast.success("Catering saved successfully");
             router.refresh()
             onSuccess();
           } else {
             toast.error(res.message || "Failed to save menu category");
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Catering Service</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              {...register("title")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Catering Service Title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your catering service"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Menu Summary *</label>
            <textarea
              {...register("menu_summary")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide a summary of the menu options"
            />
            {errors.menu_summary && <p className="mt-1 text-sm text-red-600">{errors.menu_summary.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (ETB) *</label>
              <input
                type="number"
                {...register("base_price", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
              {errors.base_price && <p className="mt-1 text-sm text-red-600">{errors.base_price.message}</p>}
            </div>

     
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prepayment Percentage *</label>
              <div className="flex items-center">
                <input
                  type="number"
                  {...register("prepayment_percentage", { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="30"
                />
                <span className="ml-2 text-gray-500">%</span>
              </div>
              {errors.prepayment_percentage && <p className="mt-1 text-sm text-red-600">{errors.prepayment_percentage.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Guests *</label>
              <input
                type="number"
                {...register("min_guest_count", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
              />
              {errors.min_guest_count && <p className="mt-1 text-sm text-red-600">{errors.min_guest_count.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests *</label>
              <input
                type="number"
                {...register("max_guest_count", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100"
              />
              {errors.max_guest_count && <p className="mt-1 text-sm text-red-600">{errors.max_guest_count.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Advance Days *</label>
              <input
                type="number"
                {...register("min_advance_days", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="3"
              />
              {errors.min_advance_days && <p className="mt-1 text-sm text-red-600">{errors.min_advance_days.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label>
              <input
                {...register("contact_person")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full Name"
              />
              {errors.contact_person && <p className="mt-1 text-sm text-red-600">{errors.contact_person.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                {...register("contact_info")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+251912345678"
              />
              {errors.contact_info && <p className="mt-1 text-sm text-red-600">{errors.contact_info.message}</p>}
              <p className="mt-1 text-xs text-gray-500">Must start with +2519 or +2517</p>
            </div>
          </div>


          {deliveryAvailable && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Area Description</label>
              <textarea
                {...register("service_area_description")}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the areas where you provide delivery service"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("include_service")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Include service staff</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("delivery_available")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Delivery available</label>
            </div>

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
              {isSubmitting ? "Creating..." : "Create Catering Service"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}