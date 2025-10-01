"use server";
import { BASEURL } from "../api";
import { getAuthToken } from "@/auth/auth";


export const updateBasicInfo = async (id: string, data:any) => {
  const authToken = await getAuthToken();
    
  const response = await fetch(`${BASEURL}/restaurant/update-basic-info`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update basic information");
  }

  return response.json();
};

export const uploadLogoImage = async (formData: FormData) => {
  const authToken = await getAuthToken();
  
  const response = await fetch(`${BASEURL}/restaurant/upload-logo-image`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload logo/image");
  }

  return response.json();
};


export const addContactInfo = async (data: {
  module_type: "restaurant" | "branch";
  module_id: string;
  type: string;
  value: string;
  is_primary: boolean;
}) => {
  const authToken = await getAuthToken();
  
  const response = await fetch(`${BASEURL}/restaurant/add-contact-info`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to add contact info");
  }

  return response.json();
};

export const getAllContactInfo = async (params?: {
  module_type?: string;
  search_value?: string;
  page?: number;
  limit?: number;
}) => {
  const authToken = await getAuthToken();
  const queryParams = new URLSearchParams();
  
  if (params?.module_type) queryParams.append("module_type", params.module_type);
  if (params?.search_value) queryParams.append("search_value", params.search_value);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());

  // const url = `${BASEURL}/restaurant/contact-info?${queryParams.toString()}`;
  
  const url = `${BASEURL}/restaurant/contact-info`;

  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch contact info");
  }

  return response.json();
};

export const getContactInfoById = async (id: string) => {
  const authToken = await getAuthToken();
  
  const response = await fetch(`${BASEURL}/restaurant/get-byId/${id}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch contact info");
  }

  return response.json();
};

export const updateContactInfo = async (id: string, data: {
  type?: string;
  value?: string;
  is_primary?: boolean;
}) => {
  const authToken = await getAuthToken();
  
  const response = await fetch(`${BASEURL}/restaurant/update-contact-info/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update contact info");
  }

  return response.json();
};

export const setPrimaryContact = async (id: string) => {
  const authToken = await getAuthToken();
  
  const response = await fetch(`${BASEURL}/restaurant/set-primary-contact/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to set primary contact");
  }

  return response.json();
};

export const deleteContactInfo = async (id: string) => {
  const authToken = await getAuthToken();
  
  const response = await fetch(`${BASEURL}/restaurant/delete-contact-info/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete contact info");
  }

  return response.json();
};


const BANK_NAMES = [
  "Commercial Bank of Ethiopia",
  "Awash International Bank",
  "Dashen Bank",
  "Bank of Abyssinia",
  "Cooperative Bank of Oromia",
  "Berhan International Bank",
  "Nib International Bank",
  "Hibret Bank",
  "Bunna International Bank",
  "Wegagen Bank",
  "Abay Bank",
  "Zemen Bank",
  "Oromia International Bank",
  "Enat Bank",
  "Hijra Bank",
  "Siinqee Bank",
  "Ahadu Bank",
  "Tsehay Bank"
] as const;

export type BankName = typeof BANK_NAMES[number];

export const createBankAccount = async (data: {
  bank_name: BankName;
  account_number: string;
  account_name: string;
  is_default: boolean;
  is_active: boolean;
  branch_id?: string;
}) => {
  const authToken = await getAuthToken();
  
  const response = await fetch(`${BASEURL}/restaurant/create-bank-account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create bank account");
  }

  return response.json();
};

export const updateBankAccount = async (id: string, data:any) => {
  const authToken = await getAuthToken();
  
  const response = await fetch(`${BASEURL}/restaurant/update-bank-account/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update bank account");
  }

  return response.json();
};

export const getAllBankAccounts = async () => {
  const authToken = await getAuthToken();
  
  const response = await fetch(`${BASEURL}/restaurant/get-bank-info`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch bank accounts");
  }

  return response.json();
};

export const getBankAccountById = async (id: string) => {
  const authToken = await getAuthToken();
  
  const response = await fetch(`${BASEURL}/restaurant/get-bank-byId/${id}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch bank account");
  }

  return response.json();
};

export const deleteBankAccount = async (id: string) => {
  const authToken = await getAuthToken();
  
  const response = await fetch(`${BASEURL}/restaurant/delet-bank-account/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete bank account");
  }

  return response.json();
};

export const setDefaultBankAccount = async (id: string) => {
  const authToken = await getAuthToken();
  
  const response = await fetch(`${BASEURL}/restaurant/set-default-bank-account/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to set default bank account");
  }

  return response.json();
};


export const getBasicInfoSettings = async () => {
  const authToken = await getAuthToken();
  
  const response = await fetch(`${BASEURL}/restaurant/get-my-restaurant`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch basic info settings");
  }

  return response.json();
};

export const getChargeSettings = async () => {
  const authToken = await getAuthToken();
  
  const response = await fetch(`${BASEURL}/restaurant/charge-settings`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch charge settings");
  }

  return response.json();
};

export const createOrUpdateChargeSettings = async (data: {
  service_charge_fee: number;
  package_charge_fee: number;
  delivery_fee_type: "fixed" | "dynamic";
  delivery_fee_fixed?: number;
  delivery_fee_dynamic?: {
    starting_fee: number;
    price_per_meter: number;
    minimum_fee: number;
  };
  dine_in_fee_type: "fixed" | "dynamic";
  dine_in_fee_fixed?: number;
  dine_in_fee_dynamic?: {
    price_per_guest: number;
    price_per_hour: number;
    minimum_fee: number;
  };
}) => {
  const authToken = await getAuthToken();
  
  const response = await fetch(`${BASEURL}/restaurant/create-update-charge-setting`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update charge settings");
  }

  return response.json();
};

export const deleteChargeSettings = async () => {
  const authToken = await getAuthToken();
  
  const response = await fetch(`${BASEURL}/restaurant/delete-charge-settings`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete charge settings");
  }

  return response.json();
};