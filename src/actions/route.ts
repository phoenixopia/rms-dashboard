import api from "./api";

export const loginApi = async (payload: {
  emailOrPhone: string;
  password: string;
  signupMethod: "email" | "phone_number";
}) => {
  try {
    const res = await api.post("/auth/login", payload);
    console.log("Result", res);
    return { success: true, data: res.data.data };
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message || "Login failed",
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
