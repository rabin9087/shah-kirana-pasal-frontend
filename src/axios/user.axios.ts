import { createUserParams } from "@/types";
import { axiosProcessor, getAccessJWt, getRefreshJWT, rootApi } from ".";
const userApi = rootApi + "/api/v1/user";

export const createUser = (data: createUserParams) => {
  return axiosProcessor({
    method: "post",
    url: `${userApi}/sign-up`,
    isPrivate: false,
    obj: data,
  });
};
export const createAdmin = (data: createUserParams) => {
  return axiosProcessor({
    method: "post",
    url: `${userApi}/sign-up/admin`,
    isPrivate: true,
    obj: data,
  });
};
export const logoutUser = () => {
  const obj = {
    method: "post",
    url: userApi + "/logout",
    obj: {
      accessJWT: getAccessJWt(),
      refreshJWT: getRefreshJWT(),
    },
  };
  return axiosProcessor(obj);
};
export const getNewAccessJWT = () => {
  //refreshtoken is sent to get access token
  const obj = {
    method: "get",
    url: userApi + "/get-accessjwt",
    isPrivate: true,
    refreshToken: true,
  };
  return axiosProcessor(obj);
};

export const loginUser = (data: { email_phone: string; password: string }) => {
  return axiosProcessor({
    method: "post",
    url: userApi + "/login",
    isPrivate: false,
    obj: data,
  });
};

export const getUser = () => {
  return axiosProcessor({
    method: "get",
    url: userApi,
    isPrivate: true,
  });
};
