import { BackendAdminResponse, UsersResponse } from "@/types";
import api, { BASEURL } from "../api";
import { getAuthToken } from "@/auth/auth";
import { createRestaurantAdminSchema } from "@/schemas/schemas";

export const getAllCreatedUsers = async (
  page: number = 1,
  limit: number = 10,
): Promise<BackendAdminResponse> => {
  const url = `${BASEURL}/user/get-all-users?page=${page}&limit=${limit}`;
  const authToken = await getAuthToken();

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }

  const data: BackendAdminResponse = await response.json();
  return data;
};

export async function createRestaurantAdminAction(
  prevState: any,
  formData: FormData,
) {
  const parsed = createRestaurantAdminSchema.safeParse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email") || "",
    phone_number: formData.get("phone_number") || "",
    password: formData.get("password"),
    creatorMode: formData.get("creatorMode"),
    role_id: formData.get("role_id"),
    // restaurant_id: formData.get("restaurant_id") || undefined,
  });

  console.log("AdminData", parsed.data);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Validation failed.",
    };
  }

  try {
    const authToken = await getAuthToken();

    await api.post("/user/create/restaurant-admin", parsed.data, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    return { success: true, message: "Admin created successfully!" };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to create admin.",
    };
  }
}
