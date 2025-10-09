"use client";
import PlanForm from "@/components/dashboard/plan/PlanForm";
import { createPlan } from "@/actions/plan/api";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { CreatePlanValues } from "@/schemas/schemas";
import { toast } from "sonner";

export default function CreatePlanPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

const handleCreate = async (values: CreatePlanValues) => {
  setLoading(true);
  try {
    await createPlan(values);
    router.push("/dashboard/superadmin/plan");
  } catch (err: unknown) {
    // Narrow unknown to Error or fallback string
    if (err instanceof Error) {
      toast.error(err.message);
    } else if (typeof err === "string") {
      toast.error(err);
    } else {
      toast.error("An unexpected error occurred");
    }
  } finally {
    setLoading(false);
  }
};


  return <PlanForm onSubmit={handleCreate} isLoading={loading} />;
}
