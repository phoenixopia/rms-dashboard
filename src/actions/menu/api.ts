"use server";

import { BackendResponse, RestaurantsResponse } from "@/types";
import api, { BASEURL } from "../api";
import { getAuthToken } from "@/auth/auth";
import { createRestaurantSchema } from "@/schemas/schemas";
import { headers } from "next/headers";





export const getAllMenu = async (
  page: number = 1,
  limit: number = 10,
)=> {
  const url = `${BASEURL}/menu/list-menu?page=${page}&limit=${limit}`;
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

export async function createMenu(data: any) {

  try {
    const authToken = await getAuthToken();
     
    const response = await api.post("/menu/create-menu",data, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    

    return { success: true, message: "Menu created successfully!" };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to create menu.",
    };
  }
}

export async function updateMenu(id: string, data: any) {
    const authToken = await getAuthToken();
 
  try {
    const response = await fetch(`${BASEURL}/menu/update-menu`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify(data),
    });
   
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating menu:', error);
    return { success: false, message: 'Failed to update menu' };
  }
}

export async function deleteMenu(data:any){

  try {
    const authToken = await getAuthToken();
     
    const response = await api.delete(`/menu/delete-menu/${data}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
 
   
    return { success: true, message: "Menu deleted successfully!" };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to delete menu.",
    };
  }
}



export const getAllMenuCategory = async (
  page: number = 1,
  limit: number = 10,
)=> {
  const url = `${BASEURL}/menu/list-menu-category?page=${page}&limit=${limit}`;
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


export const getAllOfMenuCategory = async (
  page: number = 1,
  limit: number = 10,
)=> {
  const url = `${BASEURL}/menu/list-menu-category?page=${page}&limit=10000000000`;
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




export async function createMenuCategory(data: any) {

  try {
    const authToken = await getAuthToken();
    
    const response = await api.post("/menu/create-menu-category",data, {
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

export async function updateMenuCategory(formData: any,itemId:any) {


  try {
    const authToken = await getAuthToken();

    const response = await api.put(`/menu/update-menu-category/${itemId}`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
  
    return {
      success: true,
      data: response.data,
      message: "Menu category updated successfully",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to update menu item",
    };
  }
}

export async function deleteMenuCategory(id: string) {
    const authToken = await getAuthToken();

  try {

        const response = await api.delete(`${BASEURL}/menu/delete-menu-category/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
 
    return { success: true, message: "Menu Category Deleted successfully!" };

  } catch (error) {
    console.error("Failed to delete menu category:", error);
    return { success: false, message: "Failed to delete menu category" };
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

export const getAllMenuItemsFilter = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  menu_category_id?: string,
  branch_id?: string
) => {
  let url = `${BASEURL}/menu/list-all-menu-item?page=${page}&limit=${limit}`;
  
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  if (menu_category_id) {
    url += `&menu_category_id=${menu_category_id}`;
  }
  if (branch_id) {
    url += `&branch_id=${branch_id}`;
  }

  const authToken = await getAuthToken();

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch menu items: ${response.statusText}`);
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
