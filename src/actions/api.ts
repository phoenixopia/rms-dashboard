import axios from "axios";

export const BASEURL = process.env.NEXT_PUBLIC_API_BASE;
const api = axios.create({
  baseURL: BASEURL,
  withCredentials: true,
});

export default api;
