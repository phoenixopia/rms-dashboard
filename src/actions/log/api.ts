"use server";

import { LogBackResponse } from "@/types/activity";
import { BASEURL } from "../api";
import { getAuthToken } from "@/auth/auth";

export const getActivityLogs = async (
  page: number = 1,
  limit: number = 10,
): Promise<LogBackResponse> => {
  const url = `${BASEURL}/activity-log/view-whole-activity-logs?page=${page}&limit=${limit}`;

  const authToken = await getAuthToken();

  if (!authToken) {
    throw new Error("Authentication token not found.");
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });

  console.log(response, "Activity Log response body");

  if (!response.ok) {
    throw new Error(`Failed to fetch Activity Logs: ${response.statusText}`);
  }

  return await response.json();
};
