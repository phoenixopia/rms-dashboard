import { BackendAdminResponse, UsersResponse } from "@/types";
import api, { BASEURL } from "../api";
import { getAuthToken } from "@/auth/auth";
import { createRestaurantAdminSchema } from "@/schemas/schemas";
import { table } from "console";

export const getAllOrders = async (
  page: number = 1,
  limit: number = 5,
) => {
  const url = `${BASEURL}/kds/get-all-orders?page=${page}&limit=${limit}`;
  const authToken = await getAuthToken();

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error for get all order----------' + response.statusText);
    return { success: false, error: response.statusText, details: errorText };
  }

  const data: any = await response.json();
  return data;
}



export const getAllBranches = async () => {
  const url = `${BASEURL}/restaurant/get-all-branches`;
  const authToken = await getAuthToken();

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error for get all branches----------' + response.statusText);
    return { success: false, error: response.statusText, details: errorText };
  }

  const data: any = await response.json();
  return data;
}



export const getAlltables = async (
  {page = 1,
  limit = 10,
  branch_id}:{page?:number, limit?:number, branch_id?:string}
) => {
  let url = `${BASEURL}/table/get-all-tables?is_active=true`;
  if(branch_id) {
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
    const errorText = await response.text();
    console.error('Error for get all order----------' + response.statusText);
    return { success: false, error: response.statusText, details: errorText };
  }

  const data: any = await response.json();
  return data;
}






export async function createOrder({table_number,items,order_type,branch_id="20bbd69a-6016-4fef-8d7e-9978c79e1e2c",total_price}:{total_price:number, table_number?:string, items: Array<number>, order_type?:string, branch_id?:string}) {
  const url = `${BASEURL}/kds/create-order`;
  const authToken = await getAuthToken();
  var post_body={"table_id":table_number, "items":items, "type":order_type, "branch_id":branch_id,"total_price":total_price};
  
  // const
   
  if(!table_number){
    delete post_body.table_number
  }
  if(!branch_id){
    delete post_body.branch_id
  }
  // You can adjust the body content based on your API requirements
  const result = await fetch(url,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${authToken}`
    },
    body:JSON.stringify(post_body)
  });
  if(!result.ok){
    throw new Error(`Failed to create order: ${result.statusText}`);
  }
  const data = await result.json();
  return data;
}


export async function getOrderById(order_id:string){
  const baseURL = typeof window !== 'undefined' ? '' : process.env.BASEURL;
  const url = `${BASEURL}/kds/get-order-byId/${order_id}`;
  const authToken = await getAuthToken();

  const response = await fetch(url,{
    
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  })
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error for get order----------' + response.statusText);
    return { success: false, error: response.statusText, details: errorText };
  }

  const data: any = await response.json();
  return data;
}


export async function updatePaymentStatus(order_id:string){
  const url = `${BASEURL}/kds/update-payment-status/${order_id}`;
  const authToken = await getAuthToken();

  var patch_body={"payment_status":"Paid"};

  const result = await fetch(url, {
    cache: "no-store",
    method:"PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body:JSON.stringify(patch_body)
  });
  
  if(!result.ok){
    throw new Error(`Failed to update payment status: ${result.statusText}`);
  }
  const data = await result.json();
  return data;
}


export async function updateOrderStatus(order_id:string,order_status:string){
  const url = `${BASEURL}/kds/update-order-status/${order_id}`;
  const authToken = await getAuthToken();

  var patch_body={"status":order_status};

  const result = await fetch(url, {
    cache: "no-store",
    method:"PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body:JSON.stringify(patch_body)
  });
  
  if(!result.ok){
    throw new Error(`Failed to update order status: ${result.statusText}`);
  }
  const data = await result.json();
  return data;
}



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


export async function createRestaurantStaffAction(
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

  // console.log("AdminData", parsed.data);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Validation failed.",
    };
  }

  try {
    const authToken = await getAuthToken();

    await api.post("/user/create/staff", parsed.data, {
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