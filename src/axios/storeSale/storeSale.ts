import { IStoreSale } from "@/pages/store/types";
import { axiosProcessor, rootApi } from "..";
const storeSaleAPI = rootApi + "/api/v1/storeSale";

export const createStoreSale = async(data: IStoreSale) => {
  try {
    const response = await axiosProcessor({
    method: "post",
    url: `${storeSaleAPI}/new-storeSale`,
    isPrivate: true,
    obj: data,
    });
    
    return response.storeSale
  } catch (error) {
    throw new Error("Failed to update product");
  }
};