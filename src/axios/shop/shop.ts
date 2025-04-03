import { axiosProcessor, rootApi } from "..";
const shopApi = rootApi + "/api/v1/shop";

export const createShop = async(data: FormData) => {
  try {
    const response = await axiosProcessor({
    method: "post",
    url: `${shopApi}`,
    isPrivate: false,
    obj: data,
    });
    
    return response.shop
  } catch (error) {
    throw new Error("Failed to update product");
  }
};