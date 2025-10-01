"use server";

import { BackendResponse, RestaurantsResponse } from "@/types";
import api, { BASEURL } from "../api";
import { getAuthToken } from "@/auth/auth";
import { createRestaurantSchema } from "@/schemas/schemas";
import { headers } from "next/headers";
   
export const getAllTransactions = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    search?: string;
    status?: string;
    branch_id?: string;
    start_date?: string;
    end_date?: string;
  }
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });


  if (filters?.search) params.append('search', filters.search);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.branch_id) params.append('branch_id', filters.branch_id);
  if (filters?.start_date) params.append('startDate', filters.start_date);
  if (filters?.end_date) params.append('endDate', filters.end_date);

  const url = `${BASEURL}/transaction/get-all?${params.toString()}`;
  const authToken = await getAuthToken();

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch transaction data: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
};

export const getStatTransactions = async () => {




  const url = `${BASEURL}/transaction/get-all?page=1`;
  const authToken = await getAuthToken();

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch transaction data: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
};