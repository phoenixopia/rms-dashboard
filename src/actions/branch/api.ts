"use server";

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

export const getAllRoles = async (): Promise<RoleData[]> => {
  const url = `${BASEURL}/rbac/all-roles`;

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
  return data.data.roles;
};


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
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to create role.",
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
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to create role.",
    };
  }
}


export async function createBranch(data: any) {

    
  try {
    const authToken = await getAuthToken();
     
    const response = await api.post("/restaurant/branches/create-branch",data, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    return { success: true, message: "Branch created successfully!" };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to create branch.",
    };
  }
}

export async function updateBranch(data: any,id:any) {

  try {
    const authToken = await getAuthToken();
     
    const response = await api.put(`/restaurant/update-branch/${id}`,data, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
     if (!response?.data?.success) {
      return { success: false, message: response?.data?.message || "Failed to  updated branch!" } 
     }


    return { success: true, message: "Branch updated successfully!" };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to update branch.",
    };
  }
}


export const deleteBranch = async (id: string) => {

    const authToken = await getAuthToken();

  try {
    const res = await fetch(`${BASEURL}/restaurant/branches/${id}`, {
      headers:{ Authorization: `Bearer ${authToken}` },
      method: "DELETE",
    });



    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to delete the branch:", error);
    return { success: false, message: "Failed to delete the branch" };
  }
};
export const getAllBranches = async () => {
  const url = `${BASEURL}/restaurant/get-all-branches`;

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
    throw new Error(`Failed to fetch restaurants branches: ${response.statusText}`);
  }

  const data:any = await response.json();
  

  return data.data;
};


export async function updateRole(formData: RoleFormValues, roleId: string) {
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
