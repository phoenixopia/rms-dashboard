"use server";

import { BackendResponse, RestaurantsResponse } from "@/types";
import api, { BASEURL } from "../api";
import { getAuthToken } from "@/auth/auth";
import { createRestaurantSchema } from "@/schemas/schemas";
import { headers } from "next/headers";

export const getAllRestaurantsWithSubscriptions = async (
  page: number = 1,
  limit: number = 10,
): Promise<RestaurantsResponse> => {
  const url = `${BASEURL}/restaurant/all-registered-restaurants?page=${page}&limit=${limit}`;

  const authToken = await getAuthToken();

  if (!authToken) {
    throw new Error("Authentication token not found.");
  }

  // console.log("Token", authToken);

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch restaurants: ${response.statusText}`);
  }

  const data: BackendResponse = await response.json();

  // console.log("data", data.data);

  return data.data;
};

export async function createRestaurant(formData: FormData) {
  const validatedFields = createRestaurantSchema.safeParse({
    restaurant_name: formData.get("restaurant_name"),
    restaurant_admin_id: formData.get("restaurant_admin_id"),
    language: formData.get("language"),
    theme: formData.get("theme"),
    primary_color: formData.get("primary_color"),
    rtl_enabled:
      formData.get("rtl_enabled") === "true" ||
      formData.get("rtl_enabled") === "on",
  });

  console.log("Restaurant Create Data", validatedFields.data);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check the form.",
    };
  }

  const { ...rest } = validatedFields.data;

  try {
    const authToken = await getAuthToken();

    // console.log("Rest", rest);

    const response = await api.post("/restaurant/register", rest, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    return {
      success: true,
      data: response.data,
      message: "Restaurant created successfully",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Something went wrong",
    };
  }
}
