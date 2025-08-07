import {
  Permission,
  PermissionsApiResponse,
  RoleData,
  RoleResponse,
  SingleRoleResponse,
} from "@/types";
import api, { BASEURL } from "../api";
import { getAuthToken } from "@/auth/auth";
import { createRoleFormSchema, RoleFormValues } from "@/schemas/schemas";

export const getAllPermissions = async (): Promise<Permission[]> => {
  const url = `${BASEURL}/rbac/permissions?limit=1000`;

  const authToken = await getAuthToken();

  if (!authToken) {
    throw new Error("Authentication token not found.");
  }

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

  const data: PermissionsApiResponse = await response.json();
  return data.data.permissions;
};

export const getRoleById = async (roleId: string): Promise<RoleData> => {
  const url = `${BASEURL}/rbac/roles/${roleId}`;

  const authToken = await getAuthToken();

  if (!authToken) {
    throw new Error("Authentication token not found.");
  }

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

  const data: SingleRoleResponse = await response.json();
  return data.data;
};

export const getAllRoles = async (): Promise<RoleResponse> => {
  const url = `${BASEURL}/rbac/roles`;

  const authToken = await getAuthToken();

  if (!authToken) {
    throw new Error("Authentication token not found.");
  }

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

  const data: RoleResponse = await response.json();
  return data;
};

export async function createRole(formData: RoleFormValues) {
  const validatedFields = createRoleFormSchema.safeParse({
    name: formData.name,
    description: formData.description,
    permissions: formData.permissions,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed.",
    };
  }

  try {
    const authToken = await getAuthToken();

    await api.post("rbac/create-role", validatedFields.data, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    return { success: true, message: "Role created successfully!" };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to create role.",
    };
  }
}

export async function updateRole(formData: RoleFormValues, roleId: string) {
  const validatedFields = createRoleFormSchema.safeParse({
    name: formData.name,
    description: formData.description,
    permissions: formData.permissions,
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed.",
    };
  }

  try {
    const authToken = await getAuthToken();

    await api.put(`rbac/update-role/${roleId}`, validatedFields.data, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    return { success: true, message: "Role updated successfully!" };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to create role.",
    };
  }
}
