// app/plans/[id]/edit/page.tsx
"use client";
import PlanForm from "@/components/dashboard/plan/PlanForm";
import { updatePlan } from "@/actions/plan/api";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { CreatePlanValues } from "@/schemas/schemas";

export default function EditPlanPage() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<CreatePlanValues | null>(null);
  const router = useRouter();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    fetch(`/api/plans/${params.id}`)
      .then((res) => res.json())
      .then((data) => setPlan(data));
  }, [params.id]);

  const handleUpdate = async (values: CreatePlanValues) => {
    setLoading(true);
    try {
      await updatePlan(params.id, values);
      router.push("/plans");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!plan) return <p>Loading...</p>;

  return (
    <PlanForm
      defaultValues={plan}
      onSubmit={handleUpdate}
      isLoading={loading}
    />
  );
}
