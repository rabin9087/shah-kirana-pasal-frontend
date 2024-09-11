import { axiosProcessor, rootApi } from "..";
import { IOrder } from "./types";
const orderApi = rootApi + "/api/v1/order";

export const createOrder = async(data: IOrder) => {
  try {
    const response = await axiosProcessor({
    method: "post",
    url: `${orderApi}`,
    isPrivate: false,
    obj: data,
    });
    
    return response.order
  } catch (error) {
    throw new Error("Failed to update product");
  }
};