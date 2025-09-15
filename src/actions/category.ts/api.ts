import React from 'react'
import { BackendAdminResponse, UsersResponse } from "@/types";
import api, { BASEURL } from "../api";
import { getAuthToken } from "@/auth/auth";
import { createRestaurantAdminSchema } from "@/schemas/schemas";

export  async function getAllCategories({branch_id}:{branch_id?:string}){ {
    const page = 1;
    const number = 10;
    const authToken = await getAuthToken();
    let url = `${BASEURL}/menu/list-menu-category?page=${page}`;
    if(branch_id){
        url += `&branch_id=${branch_id}`;
    }
    const response = await fetch(url,{
        cache:"no-store",
        headers:{
            'Content-Type':"application/json",
            Authorization:`Bearer ${authToken}`
        },
    });
    if(!response.ok){
    throw new Error(`Failed to fetch categories: ${response}`);
    }
    console.log(response, "response from get all categories");
    const data = await response.json()
    return data;
}
}

