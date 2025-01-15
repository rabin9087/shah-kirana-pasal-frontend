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
    url: `${orderApi}`,
    isPrivate: false,

    });
    
    return response.order
  } catch (error) {
    throw new Error("Failed to update product");
  }
};