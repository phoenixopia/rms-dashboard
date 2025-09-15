"use server";

import { BackendResponse, RestaurantsResponse } from "@/types";
import api, { BASEURL } from "../api";
import { getAuthToken } from "@/auth/auth";
import { createRestaurantSchema } from "@/schemas/schemas";
import { headers } from "next/headers";




export const getAllSocialMedia = async (
  page: number = 1,
  limit: number = 10,
)=> {
  const url = `${BASEURL}/social-media/all-videos?page=${page}&limit=${limit}`;
  const authToken = await getAuthToken();

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch subscriptions: ${response.statusText}`);
  }
   
  const data = await response.json();
  
  return data;
};







export async function createSocialMedia(data: any) {

  try {
    const authToken = await getAuthToken();
    
    const response = await api.post("/social-media/upload-video",data, {
      headers: { "Authorization": `Bearer ${authToken}` },
    });
   console.log(response,'response after social media create successfuly')

    return { success: true, message: "Social media post created successfully!" };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to create social media post.",
    };
  }
}




export const deleteSocialPosts = async (id: string) => {

    const authToken = await getAuthToken();

  try {
    const res = await fetch(`${BASEURL}/social-media/delete-video/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to delete social posts:", error);
    return { success: false, message: "Failed to delete social posts" };
  }
};


export async function updateSocialMedia(data: any,id:any) {
  console.log(id,'id to be updated')
  try {
    const authToken = await getAuthToken();
    
    const response = await api.post(`/social-media/update-video/${id}`,data, {
      headers: { "Authorization": `Bearer ${authToken}` },
    });
   console.log(response,'response after social media create successfuly')

    return { success: true, message: "Social media post created successfully!" };
  } catch (err: any) {
    return {
      success: false,
      message: err?.response?.data?.message || "Failed to update social media post.",
    };
  }
}