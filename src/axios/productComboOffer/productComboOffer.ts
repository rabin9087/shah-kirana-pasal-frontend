import { axiosProcessor, rootApi } from "..";
import { IProductComboOffer } from "./types";
const productComboOfferApi = rootApi + "/api/v1/productComboOffer";

export const createProductComboOffer = async(data: IProductComboOffer) => {
  try {
    const response = await axiosProcessor({
    method: "post",
    url: `${productComboOfferApi}`,
    isPrivate: true,
    obj: data,
    });
    
    return response.status
  } catch (error) {
    throw new Error("Failed to update product");
  }
};

export const getAllProductComboOffer = async() => {
  try {
    const response = await axiosProcessor({
    method: "get",
    url: `${productComboOfferApi}`,
    isPrivate: true,
    });
    
    return response.productComboOffers
  } catch (error) {
    throw new Error("Failed to update product");
  }
};