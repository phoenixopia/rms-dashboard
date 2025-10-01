import React from 'react'
import { BackendAdminResponse, UsersResponse } from "@/types";
import api, { BASEURL } from "../api";
import { getAuthToken } from "@/auth/auth";
import { createRestaurantAdminSchema } from "@/schemas/schemas";

export const  getAllMenuItems = async (category_id?:any,branch_id?:string)=> {
  
    if(category_id!==undefined){
    var url = `${BASEURL}/menu/list-all-menu-item?menu_category_id=${category_id}&limit=99999999`;
    }
    else{
    var url = `${BASEURL}/menu/list-all-menu-item?limit=99999999`;
    }
    if(branch_id){
        url += `&branch_id=${branch_id}`;
    }
    const authToken = await getAuthToken();

    const response = await fetch(url,{
        cache:"no-store",
        headers:{
            'Content-Type':"application/json",
            Authorization:`Bearer ${authToken}`
        },
    });
    if(!response.ok){
    throw new Error(`Failed to fetch menu items: ${response.statusText}`);
    }
    const data = await response.json()
    console.log(data, "response from get all menu items");
    
    return data;
}

