import { IStoreSale } from "@/pages/store/types";
import { axiosProcessor, rootApi } from "..";
const storeSaleAPI = rootApi + "/api/v1/storeSales";

export const createStoreSales = async(data: IStoreSale) => {
  try {
    const response = await axiosProcessor({
    method: "post",
    url: `${storeSaleAPI}/new-storeSale`,
    isPrivate: true,
    obj: data,
    });
    
    return response.storeSales as IStoreSale;
  } catch (error) {
    throw new Error("Failed to update product");
  }
};

export const allStoreSales = async() => {
  try {
    const response = await axiosProcessor({
    method: "get",
    url: `${storeSaleAPI}/allStoreSales`,
    isPrivate: true,
    });
    
    return response.storeSales as IStoreSale[] 
  } catch (error) {
    throw new Error("Failed to update product");
  }
};

export const dailyStoreSales = async () => {
  try {
    const response = await axiosProcessor({
    method: "get",
    url: `${storeSaleAPI}/dailyStoreSales`,
    isPrivate: true,
    });
    
    return response.storeSales as IStoreSale[] 
  } catch (error) {
    throw new Error("Failed to update product");
  }
};