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
    url: `${orderApi}` + "/date=" + date,
    isPrivate: true,
    });
    
    return response.orders
  } catch (error) {
    throw new Error("Failed to update product");
  }
};

export const getAOrder = async(orderNumber: string) => {
  try {
    const response = await axiosProcessor({
    method: "get",
    url: `${orderApi}` + "/orderNumber=" + orderNumber,
    isPrivate: true,
    });
    return response.order
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

export const updateMultipleOrders = async (data: object) => {
  try {
    const response = await axiosProcessor({
    method: "patch",
    url: `${orderApi}` + "/updateMultiple",
    isPrivate: true,
    obj: data
    });
    
    return response
  } catch (error) {
    throw new Error("Failed to update product");
  }
};


