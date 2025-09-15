"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { createSubscription } from "@/actions/susbscriptions/api";
import { Button } from "@/components/ui/button";

export default function SubscriptionForm({ allPlansList, onSuccess }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [planId, setPlanId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = async () => {
    if (!planId) {
      toast.error("Please select a subscription plan first.");
      return;
    }

    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      toast.error("Please select a receipt image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("plan_id", planId);
    formData.append("receipt", file);

    try {
      setIsSubmitting(true);
      const response = await createSubscription(formData);

      if (response?.success) {
        toast.success("Subscription receipt uploaded successfully.");
        onSuccess?.(); 
      } else {
        toast.error(response?.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error("Failed to upload receipt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Receipt</h1>

        <div className="space-y-6">
          {allPlansList?.map((plan: any, index: number) => (
            <div
              key={index}
              onClick={() => setPlanId(plan?.id)}
              className={`cursor-pointer border p-4 rounded-md transition ${
                plan?.id === planId
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <DetailCard
                label="Plan Detail"
                value={plan?.name}
                billing_cycle={plan?.billing_cycle}
                price={plan?.price}
                PlanLimits={plan?.PlanLimits}
              />
            </div>
          ))}

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Upload Receipt Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
          </div>

          <Button
            onClick={handleImageUpload}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Uploading..." : "Upload Receipt"}
          </Button>
        </div>
      </div>
    </div>
  );
}

const DetailCard = ({
  label,
  value,
  billing_cycle,
  price,
  PlanLimits,
}: any) => (
  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg shadow-sm">
    <p className="text-sm text-gray-500 dark:text-gray-400 py-2">{label}</p>
    <p className="font-medium text-gray-800 text-[0.9rem] dark:text-gray-200 capitalize">
      Plan Name: {value}
    </p>
    <p className="font-medium text-gray-800 text-[0.9rem] dark:text-gray-200 capitalize">
      Billing Cycle: {billing_cycle}
    </p>
    <p className="font-medium text-gray-800 text-[0.9rem] dark:text-gray-200 capitalize">
      Price: {price}
    </p>

    <p className="font-bold text-gray-800 text-sm mt-4 dark:text-gray-200">
      Plan Limits:
    </p>
    {PlanLimits?.map((limit: any, idx: number) => (
      <div
        key={limit?.id || idx}
        className="bg-gray-100 p-3 rounded mt-2 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300"
      >
        <div>
          <strong>Key:</strong> {limit?.key}
        </div>
        <div>
          <strong>Description:</strong> {limit?.description}
        </div>
        <div>
          <strong>Value:</strong> {limit?.value}
        </div>
      </div>
    ))}
  </div>
);
