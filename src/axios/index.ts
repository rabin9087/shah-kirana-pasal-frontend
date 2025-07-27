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
  selectedShop,
  params,
}: IAxiosProcessParams & { selectedShop?: { name?: string } }): Promise<TAxiosProcessor> => {

  const requestData = {
      ...obj,
      ...(selectedShop?.name && { shopId: selectedShop.name }),
    };
  try {
    // Get the appropriate token
    const token = refreshToken ? getRefreshJWT() : getAccessJWT();
    const headers: Record<string, string> = {
      "Content-Type": obj instanceof FormData ? "multipart/form-data" : "application/json; charset=UTF-8",
    };

    if (isPrivate && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Make API request using axiosInstance
    const { data } = await axiosInstance({
      method,
      url,
      data: requestData,
      headers,
      params,
    });

    return data;
  } catch (error: any) {
    return error.response?.data || { status: "error", message: "Something went wrong!" };
  }
};
