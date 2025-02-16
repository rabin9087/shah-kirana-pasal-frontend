import { createUserParams, forgetPasswordParams, newPasswordParams, otp_PasswordParams } from "@/types";
import { axiosProcessor, rootApi } from "..";
import { IUpdateCartToUserTypes } from "@/pages/addToCart";
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

export const forgetPassword = (data: forgetPasswordParams) => {
  return axiosProcessor({
    method: "post",
    url: `${userApi}/forget-password`,
    isPrivate: false,
    obj: data,
  });
};

export const otp_PasswordVerify = (data: otp_PasswordParams) => {
  return axiosProcessor({
    method: "post",
    url: `${userApi}/otp-verify`,
    isPrivate: false,
    obj: data,
  });
};

export const update_Forget_Password = (data: newPasswordParams) => {
  return axiosProcessor({
    method: "post",
    url: `${userApi}/new-password`,
    isPrivate: false,
    obj: data,
  });
};

export const logoutUser = () => {
  const obj = {
    method: "get",
    url: userApi + "/logout",
    isPrivate: true,
    refreshToken: true,
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
    refreshToken: true
  });
};

export const getAUser = async (phone: string) => {   
  try {
    const response = await axiosProcessor({
    method: "get",
    url: `${userApi}` + "/userDetails/" + phone,
    isPrivate: true,
    });
    
    return response.user
  } catch (error) {
    throw new Error("Failed to update product");
  } 
};

export const updateCartInUser = (phone: string, cart: IUpdateCartToUserTypes[]) => {
  return axiosProcessor({
    method: "patch",
    url: userApi + "/cart",
    isPrivate: true,
    refreshToken: true,
    obj: {cart, phone},
  });
};

export const updateCartHistoryInUser = (phone: string, items: IUpdateCartToUserTypes[], amount: number) => {
  return axiosProcessor({
    method: "patch",
    url: userApi + "/cartHistory",
    isPrivate: true,
    refreshToken: true,
    obj: {cartHistory: {items}, phone, amount: amount.toFixed(2)},
  });
};

// cartHistory

export const getAllUsers = async() => {
  const res = await axiosProcessor({
    method: "get",
    url: userApi + "/all",
    isPrivate: true,
    // refreshToken: true
  });
  return res
};

export const updateUserProfile = (data: FormData) => {
  return axiosProcessor({
    method: "patch",
    url: userApi+ "/profile",
    isPrivate: true,
    obj: data,
    // refreshToken: true
  });
};

export const updateAUser = (phone: string, data: object) => {
  return axiosProcessor({
    method: "put",
    url: userApi+ `/${phone}`,
    isPrivate: true,
    refreshToken: true,
    obj: data,
    // refreshToken: true
  });
};