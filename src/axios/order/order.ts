import { axiosProcessor, rootApi } from "..";
import { IOrder } from "./types";
const orderApi = rootApi + "/api/v1/order";

export const createOrder = async(data: IOrder) => {
  try {
    const response = await axiosProcessor({
    method: "post",
    url: `${orderApi}/new-order`,
    isPrivate: false,
    obj: data,
    });
    
    return response.order
  } catch (error) {
    throw new Error("Failed to update product");
  }
};

export const getOrders = async() => {
  try {
    const response = await axiosProcessor({
    method: "get",
    url: `${orderApi}` + "/all-orders",
    isPrivate: true,
    // refreshToken: true,
    });
    
    return response
  } catch (error) {
    throw new Error("Failed to update product");
  }
};

export const getAOrdersByDate = async(date: string) => {
  try {
    const response = await axiosProcessor({
    method: "get",
    url: `${orderApi}` + "/orders/" + date,
    isPrivate: true,
    });
    
    return response
  } catch (error) {
    throw new Error("Failed to update product");
  }
};

export const updateAOrder = async(_id: string, data: object) => {
  try {
    const response = await axiosProcessor({
    method: "patch",
    url: `${orderApi}` + "/update/" + _id,
    isPrivate: true,
    obj: data
    });
    
    return response
  } catch (error) {
    throw new Error("Failed to update product");
  }
};


