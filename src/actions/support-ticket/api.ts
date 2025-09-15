"use server";

import { BackendResponse, RestaurantsResponse } from "@/types";
import api, { BASEURL } from "../api";
import { getAuthToken } from "@/auth/auth";
import { createRestaurantSchema } from "@/schemas/schemas";
import { headers } from "next/headers";









export const getAllSupportTickets = async (
  page: number = 1,
  limit: number = 10,
    search?: string,
  is_active?: any,
  branch_id?: string
)=> {

     const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append('search', search);
    if (is_active) params.append('is_active', is_active);
    if (branch_id) params.append('branch_id', branch_id);
  const url = `${BASEURL}/support-ticket/list-all-ticket?${params.toString()}`;
  const authToken = await getAuthToken();

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch support ticket: ${response.statusText}`);
  }
   
  const data = await response.json();
  
  return data;
};


export const getAllMenuCateringRequests = async (
  page: number = 1,
  limit: number = 10,
)=> {
  const url = `${BASEURL}/catering/get-catering-request?page=${page}&limit=${limit}`;
  const authToken = await getAuthToken();

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch catering: ${response.statusText}`);
  }
   
  const data = await response.json();
  
  return data;
};

export const getAllMenuCategoryByBranch = async (
  branchId:any
)=> {
  const url = `${BASEURL}/menu/list-menu-category?page=1&branch_id=${branchId}&limit=1000000000000`;
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
   
  const data = await response.json();
  
  return data;
};




export async function createSupportTicket(data: any) {
  console.log(data,'data to create support ticket')

  try {
    const authToken = await getAuthToken();
    
    const response = await api.post("/support-ticket/create-support-ticket ",data, {
      headers: { Authorization: `Bearer ${authToken}` },
    });


    return { success: true, message: "Restaurant support ticket created successfully!" };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to create restaurant ticket support.",
    };
  }
}

export async function updateTable(formData: any,itemId:any) {

  console.log(formData,'formData to update tables')
  try {
    const authToken = await getAuthToken();

    const response = await api.put(`/table/update-table/${itemId}`, formData, {
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
       console.log(response,'response after updating the tables')
    return {
      success: true,
      data: response.data,
      message: "Restaurant table updated successfully",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to update restaurant table",
    };
  }
}


export const deleteTable = async (id: string) => {

    const authToken = await getAuthToken();

  try {
    const res = await fetch(`${BASEURL}/table/delete-table/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to delete restaurant table:", error);
    return { success: false, message: "Failed to delete restaurant table" };
  }
};



export const getAllMenuCategoryList = async (
  page: number = 1,
  limit: number = 10,
)=> {
  const url = `${BASEURL}/menu/list-menu-category?page=${page}&limit=100000000000000000`;
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
   
  const data = await response.json();
  
  return data;
};


export const getAllMenuTags = async (
  page: number = 1,
  limit: number = 10,
) => {
  const url = `${BASEURL}/menu/menu-category-tags/list?page=${page}&limit=100000000000000`;
  const authToken = await getAuthToken();

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch menu tags: ${response.statusText}`);
  }
 
  const data: any = await response.json();
  return data;
};


export const getAllMenuCategoryItems = async (
  page: number = 1,
  limit: number = 10,
)=> {
  const url = `${BASEURL}/menu/menu-category-tags/list?page=${page}&limit=${limit}`;
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
   
  const data = await response.json();
  
  return data;
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








export const getAllMenuItems = async (
  page: number = 1,
  limit: number = 10,
)=> {
  const url = `${BASEURL}/menu/list-all-menu-item?page=${page}&limit=${limit}`;
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
   
  const data = await response.json();
  
  return data;
};

export async function createMenuItem(formData: FormData) {
  // const validatedFields = {
  //   name: formData.get("name"),
  //   description: formData.get("description"),
  //   unit_price: parseFloat(formData.get("unit_price") as string),
  //   // image: formData.get("image"),
  //   is_active:
  //     formData.get("is_active") === "true" || formData.get("is_active") === "on",
  //   seasonal:
  //     formData.get("seasonal") === "true" || formData.get("seasonal") === "on",
  //   menu_category_id: formData.get("menu_category_id"),
  // };

  try {
    const authToken = await getAuthToken();

    const response = await api.post("/menu/create-menu-item", formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    return {
      success: true,
      data: response.data,
      message: "Menu item created successfully",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to create menu item",
    };
  }
}

export async function createMenuItemImage(formData:FormData,itemId:any){

    try {
    const authToken = await getAuthToken();

    const response = await api.put(`/menu/upload-image/${itemId}`,formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        // "Content-Type": "application/json",
      },
    });
  
    return {
      success: true,
      data: response.data,
      message: "Menu item image created successfully",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to create menu item image",
    };
  }

}

export async function updateMenuItem(data: any,itemId:any) {



  try {
    const authToken = await getAuthToken();

    const response = await api.put(`/menu/update-menu-item/${itemId}`, data, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
 
    return {
      success: true,
      data: response.data,
      message: "Menu item updated successfully",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to update menu item",
    };
  }
}


export const deleteMenuItem = async (id: string) => {
    const authToken = await getAuthToken();
 
  try {
    const res = await fetch(`${BASEURL}/menu/delete-menu-item/${id}`, {
      method: "DELETE",
         headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to delete item:", error);
    return { success: false, message: "Failed to delete item" };
  }
};
