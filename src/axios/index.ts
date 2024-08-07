import { IAxiosProcessParams, TAxiosProcessor } from "@/types";
import axios from "axios";
export const rootApi = !import.meta.env.PROD
  ? "http://192.168.20.5:8080"
  : import.meta.env.VITE_ROOT_API;

export const getAccessJWt = () => {
  return sessionStorage.getItem("accessJWT");
};
export const getRefreshJWT = () => {
  return localStorage.getItem("refreshJWT");
};
export const axiosProcessor = async ({
  method,
  url,
  obj,
  isPrivate,
  refreshToken,
  params,
}: IAxiosProcessParams): TAxiosProcessor => {
  const token = refreshToken ? getRefreshJWT() : getAccessJWt();
  const headers = {
    Authorization: isPrivate ? token : null,
  };
  try {
    const { data } = await axios({
      method,
      url,
      data: obj,
      headers,
      params
    });
    return data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return error.response.data;
  }
};
