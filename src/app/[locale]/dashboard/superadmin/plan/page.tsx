import { fetchPlansServer } from "@/actions/plan/api";
import PlanList from "@/components/dashboard/plan/PlanList";
import { PlansResponse } from "@/types/plan";
import React from "react";

export default async function PlanPage() {
  let data: PlansResponse | null = null;
  let error: string | null = null;

  try {
    data = await fetchPlansServer();
  } catch (err: any) {
    error = err.message || "Failed to fetch plans.";
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="p-4 text-center">No plans available.</div>;
  }

  return (
    <div className="container mx-auto py-5">
      <h1 className="mb-4 text-2xl font-bold">Plans</h1>
      <PlanList plansData={data} />
    </div>
  );
}
