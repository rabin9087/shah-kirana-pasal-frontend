import { IAxiosProcessParams, TAxiosProcessor } from "@/types/index";
import axios from "axios";

export const rootApi = import.meta.env.PROD
  ? import.meta.env.VITE_PROD_API
  : import.meta.env.VITE_DEV_API;

  export const storeName = import.meta.env.VITE_STORE_NAME;
  export const storeSlogan = import.meta.env.VITE_STORE_SLOGAN;

export const getAccessJWT = () => sessionStorage.getItem("accessJWT");
export const getRefreshJWT = () => localStorage.getItem("refreshJWT");


export const axiosInstance = axios.create({
  baseURL: rootApi,
});

export const axiosProcessor = async ({
  method,
  url,
  obj,
  isPrivate,
  refreshToken,
  params,
}: IAxiosProcessParams): Promise<TAxiosProcessor> => {

  const requestData = {
      ...obj,

    };
  try {
    // Get the appropriate token
    const token = refreshToken ? getRefreshJWT() : getAccessJWT();
    
     const headers: Record<string, string> = {};

    // CRITICAL FIX: Don't set Content-Type for FormData - let the browser set it with boundary
    if (!(obj instanceof FormData)) {
      headers["Content-Type"] = "application/json; charset=UTF-8";
    }

    if (isPrivate && token) {
      headers.Authorization = `Bearer ${token}`;
    }

     const requestPayload = obj instanceof FormData ? obj : requestData;
    // Make API request using axiosInstance
    const { data } = await axiosInstance({
      method,
      url,
      data: requestPayload,
      headers,
      params,
    });

    return data;
  } catch (error: any) {
    return error.response?.data || { status: "error", message: "Something went wrong!" };
  }
};
