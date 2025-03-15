import { axiosProcessor, rootApi } from "..";
import { IProductTypes } from "@/types";
const productApi = rootApi + "/api/v1/product";

export const createProduct = async(data: FormData) => {
  try {
    const response = await axiosProcessor({
    method: "post",
    url: `${productApi}`,
    isPrivate: true,
    obj: data,
    });
    
    return response.status
  } catch (error) {
    throw new Error("Failed to update product");
  }
};

export const updateProduct = async(data: FormData, _id: string) => {
  try {
     const response = await axiosProcessor({
    method: "put",
    url: `${productApi}/${_id}`,
    isPrivate: true,
    obj: data,
     });
    return response 
  } catch (error) {
    throw new Error("Failed to update product");
  }
};

export const updateAProductBySKU = async(data: object, sku: string) => {
  try {
     const response = await axiosProcessor({
    method: "put",
    url: `${productApi}/${sku}`,
    isPrivate: true,
    obj: data,
     });
    return response 
  } catch (error) {
    throw new Error("Failed to update product");
  }
};

export const updateAProductStatus= (_id: string, data: object) => {
  return axiosProcessor({
    method: "patch",
    url: `${productApi}/${_id}`,
    isPrivate: true,
    obj: data,
  });
};

export const updateAProductThumbnail= (_id: string, data: object) => {
  return axiosProcessor({
    method: "patch",
    url: `${productApi}/thumbnail/${_id}`,
    isPrivate: true,
    obj: data,
  });
};

export const getAllProducts = async () => {
  try {
    const response = await axiosProcessor({
    method: "get",
    url: `${productApi}`,
    isPrivate: false,
  });
  return response.products || [];
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
  
};

export const getAllProductsByCategory = async(slug: string) => {

  try {
    const response = await axiosProcessor({
    method: "get",
    url: `${productApi}/category/${slug}`,
    isPrivate: false,
    });
    return response.products || [];
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
};

export const deleteAProduct = async(_id: string) => {
  try {
     const response = await axiosProcessor({
    method: "delete",
    url: `${productApi}/${_id}`,
    isPrivate: true,
     });
    return response.status
  } catch (error) {
    throw new Error("Failed to update product");
  }
};

export const getAProduct = async({ ...data }: { [key: string]: any }) => {
  try {
    const response = await axiosProcessor({
      method: "get",
      url: `${productApi}` + '/q',
      isPrivate: false,
      obj: data,
      params: {...data}
    });
    return response.product as IProductTypes
  } catch (error) {
      throw new Error("Failed to fetch products");
  }
};

export const getAProductBySKU = async(sku: string) => {
  try {
    const response = await axiosProcessor({
      method: "get",
      url: `${productApi}` + `/sku_value/${sku}`,
      isPrivate: true,
    });
    return response.product as IProductTypes
  } catch (error) {
      throw new Error("Failed to fetch products");
  }
};