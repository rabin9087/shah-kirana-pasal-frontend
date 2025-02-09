import { IAxiosProcessParams, TAxiosProcessor } from "@/types";
import axios from "axios";
export const rootApi = import.meta.env.PROD
  ? import.meta.env.VITE_PROD_API
  : import.meta.env.VITE_DEV_API;

export const getAccessJWt = () => {
  return sessionStorage.getItem("accessJWT");
};
export const getRefreshJWT = () => { 
  return localStorage.getItem("refreshJWT");
};

export const axiosInstance = axios.create({
    baseURL: rootApi,
    headers: { "Content-type": "application/json; charset = UTF-8" }
})

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
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjA0ODE0NTI5MjAiLCJpYXQiOjE3Mzg3Mzg1MDksImV4cCI6MTc0MDAzNDUwOX0.jYV9wiM43-DZEJVf-PUEjqMH8QE-XWkohzEvrzXUsZM"