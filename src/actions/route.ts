import { BackendAdminLoginResponse } from "@/types";
import api from "./api";

export const loginApi = async (payload: {
  emailOrPhone: string;
  password: string;
  signupMethod: "email" | "phone_number";
}) => {
  try {
    const res = await api.post<BackendAdminLoginResponse>(
      "/auth/login",
      payload,
    );

    
    const requiresPasswordChange = res.data.data?.requiresPasswordChange;

    return {
      success: true,
      data: res.data,
      token: res.data.token,
      requiresPasswordChange: requiresPasswordChange,
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || "Login failed",
    };
  }
};

export const changePasswordApi = async (payload: {
  userId: string;
  newPassword: string;
}) => {
  try {

    const res = await api.post(
      `/auth/change-temp-password/${payload.userId}`,
      payload,
    );
    return { success: true, data: res.data };
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || "Password update failed",
    };
  }
};

export const getApi = (url: string) =>
  api.get(url).then((res) => res.data.data);
export const postApi = (url: string, data: any) =>
  api.post(url, data).then((res) => res.data.data);
export const putApi = (url: string, data: any) =>
  api.put(url, data).then((res) => res.data.data);
export const deleteApi = (url: string) =>
  api.delete(url).then((res) => res.data.data);
