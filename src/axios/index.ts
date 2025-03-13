import { IAxiosProcessParams, TAxiosProcessor } from "@/types";
import axios from "axios";

export const rootApi = import.meta.env.PROD
  ? import.meta.env.VITE_PROD_API
  : import.meta.env.VITE_DEV_API;

export const getAccessJWT = () => sessionStorage.getItem("accessJWT");
export const getRefreshJWT = () => localStorage.getItem("refreshJWT");

export const axiosInstance = axios.create({
  baseURL: rootApi,
  headers: { "Content-Type": "application/json; charset=UTF-8" },
});

export const axiosProcessor = async ({
  method,
  url,
  obj,
  isPrivate,
  refreshToken,
  params,
}: IAxiosProcessParams): Promise<TAxiosProcessor> => {
  try {
    // Get the appropriate token
    const token = refreshToken ? getRefreshJWT() : getAccessJWT();
    const headers: Record<string, string> = {};

    if (isPrivate && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Make API request using axiosInstance
    const { data } = await axiosInstance({
      method,
      url,
      data: obj,
      headers,
      params,
    });

    return data;
  } catch (error: any) {
    return error.response?.data || { status: "error", message: "Something went wrong!" };
  }
};
