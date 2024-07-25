import { IAxiosProcessParams, TAxiosProcessor } from "@/types";
import axios from "axios";
export const rootApi = !import.meta.env.PROD
  ? "http://localhost:8080"
  : import.meta.env.VITE_ROOTSERVER;

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
    });
    return data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return error.response.data;
  }
};
