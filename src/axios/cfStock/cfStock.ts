import { axiosProcessor, rootApi } from "..";
import { ProductTypeStock } from "./types";
const stockApi = rootApi + "/api/v1/stock";

export const createStock = async(data: ProductTypeStock) => {
  try {
    const response = await axiosProcessor({
    method: "post",
    url: `${stockApi}`,
    isPrivate: true,
    obj: data,
    });
    
    return response.stock
  } catch (error) {
    throw new Error("Failed to create dues");
  }
};

export const createManyStock = async(data: ProductTypeStock[]) => {
  try {
    const response = await axiosProcessor({
    method: "post",
    url: `${stockApi}/bulkStock`,
    isPrivate: true,
    obj: data,
    });
    
    return response.stocks
  } catch (error) {
    throw new Error("Failed to create dues");
  }
};

export const getStocksBySKU = async(sku: string) => {
  try {
    const response = await axiosProcessor({
    method: "get",
    url: `${stockApi}/sku/${sku}`,
    isPrivate: true,
    });
    return response.stocks
  } catch (error) {
    throw new Error("Failed to create dues");
  }
};

export const getStocksByLocation = async(location: string) => {
  try {
    const response = await axiosProcessor({
    method: "get",
    url: `${stockApi}/location/${location}`,
    isPrivate: true,
    });
    
    return response.stocks
  } catch (error) {
    throw new Error("Failed to create dues");
  }
};

export const getStocksByIdentifier = async(identifier: string) => {
  try {
    const response = await axiosProcessor({
    method: "get",
    url: `${stockApi}/identifier/${identifier}`,
    isPrivate: true,
    });
    
    return response.stock
  } catch (error) {
    throw new Error("Failed to create dues");
  }
};

export const UpdateStocksByIdentifier = async(payload: object) => {
  try {
    const response = await axiosProcessor({
    method: "patch",
    url: `${stockApi}/identifier}`,
    isPrivate: true,
    obj: payload
    });
    
    return response.stock
  } catch (error) {
    throw new Error("Failed to create dues");
  }
};