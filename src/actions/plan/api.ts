import { BASEURL } from "../api";
import { getAuthToken } from "@/auth/auth";
import { CreatePlanValues } from "@/schemas/schemas";
import { Plan, RequestResponse } from "@/types/plan";

export async function fetchPlansServer(
  page = 1,
  limit = 10,
): Promise<{
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  plans: Plan[];
}> {
  const url = `${BASEURL}/plan/get-all?page=${page}&limit=${limit}`;
  const authToken = await getAuthToken();

  if (!authToken) {
    throw new Error("Authentication token not found.");
  }

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch plans: ${res.statusText}`);
  }

  const result: RequestResponse = await res.json();

  return result.data;
}

export async function createPlan(data: CreatePlanValues) {
  const authToken = await getAuthToken();

  if (!authToken) {
    throw new Error("Authentication token not found.");
  }
  const res = await fetch(`${BASEURL}/plan/create-plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create plan");
  }

  return res.json();
}

export async function updatePlan(id: string, data: CreatePlanValues) {
  const authToken = await getAuthToken();

  if (!authToken) {
    throw new Error("Authentication token not found.");
  }
  const res = await fetch(`${BASEURL}/plan/update-plan${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update plan");
  }

  return res.json();
}
