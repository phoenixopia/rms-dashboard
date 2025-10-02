"use server";

import { BackendResponse, RestaurantsResponse } from "@/types";
import api, { BASEURL } from "../api";
import { getAuthToken } from "@/auth/auth";
import { createRestaurantSchema } from "@/schemas/schemas";
import { headers } from "next/headers";

export const getAllActivityLogs = async (
  page: number = 1,
  limit: number = 10,
)=> {
  const url = `${BASEURL}/activity-log/view-activity-logs?page=${page}&limit=${limit}`;
  const authToken = await getAuthToken();

  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch activity log data: ${response.statusText}`);
  }
   
  const data = await response.json();
  
  return data;
};