'use server'

import {
  Permission,
  PermissionsApiResponse,
  RoleData,
  RoleResponse,
  RoleTag,
  RoleTagResponse,
  SingleRoleResponse,
} from "@/types";
import api, { BASEURL } from "../api";
import { getAuthToken } from "@/auth/auth";
import { createRoleFormSchema, RoleFormValues } from "@/schemas/schemas";

export const getAllPermissions = async (): Promise<Permission[]> => {
  const url = `${BASEURL}/rbac/all-permission?limit=1000`;

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

export const getAllRestuarantPermissions = async (): Promise<Permission[]> => {
  const url = `${BASEURL}/rbac/get-my-own?limit=1000`;

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
export const getAllRoleTags = async (): Promise<RoleTag[]> => {
  const url = `${BASEURL}/rbac/all-role-tags?limit=1000`;

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

  const data: RoleTagResponse = await response.json();
  return data.data;
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

export const getAllRoles = async () => {
  const url = `${BASEURL}/rbac/all-roles?page=10000`;

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

  const data: any = await response.json();
  return data;
};

export async function deleteRoles(data:any){
  const url = `${BASEURL}/rbac/delete-role/${data}`;

 

  try {
    const authToken = await getAuthToken();
       const response = await fetch(`${url}`, {
      method: 'DELETE',
      headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    });

    if (!response.ok) {
      return { success: false, message: "Failed to delete the role!" };
    }
    return { success: true, message: "Role deleted successfully!" };
    } catch (err: unknown) {
    const e = err as any; // temporarily cast to any
    return {
      success: false,
      message: e?.response?.data?.message || "Failed to delete role.",
    };
  }
}





export async function createRoleRestuarant(formData: any) {
  const validatedFields = {
    name: formData.name,
    description: formData.description,
    permissionIds: formData.permissionIds,
  };
  


  try {
    const authToken = await getAuthToken();

    const response =await api.post("rbac/create-role", 
      validatedFields, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
 

    return { success: true, message: "Role created successfully!" };
  } catch (err: unknown) {
    const e = err as any; // temporarily cast to any
    return {
      success: false,
      message: e?.response?.data?.message || "Failed to create role.",
    };
  }
}


export async function createRole(formData: RoleFormValues) {
  const validatedFields = createRoleFormSchema.safeParse({
    name: formData.name,
    description: formData.description,
    role_tag_id: formData.role_tag_id,
    permissionIds: formData.permissionIds,
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
  } catch (err: unknown) {
    const e = err as any; // temporarily cast to any
    return {
      success: false,
      message: e?.response?.data?.message || "Failed to create admin.",
    };
  }
}

export async function updateRole(formData: RoleFormValues, roleId: string) {



  try {
    const authToken = await getAuthToken();

    await api.put(`rbac/update-role/${roleId}`, formData, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    return { success: true, message: "Role updated successfully!" };
  } catch (err: unknown) {
    const e = err as any; // temporarily cast to any
    return {
      success: false,
      message: e?.response?.data?.message || "Failed to create admin.",
    };
  }
}
