import { axiosProcessor, rootApi } from "..";
import { IProductTypes } from "@/types";
const productApi = rootApi + "/api/v1/product";

export const createProduct = async(data: FormData) => {
  try {
    const response = await axiosProcessor({
    method: "post",
    url: `${productApi}`,
    isPrivate: false,
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
    isPrivate: false,
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
    isPrivate: false,
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
    isPrivate: false,
    obj: data,
  });
};

export const updateAProductThumbnail= (_id: string, data: object) => {
  return axiosProcessor({
    method: "patch",
    url: `${productApi}/thumbnail/${_id}`,
    isPrivate: false,
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
    isPrivate: false,
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
    // if (response.status === "success") { return response.product as IProductTypes }
    // if (response.message === "Product Not Found!") {
    //   return response.message as string
    // }

    // throw new Error("Unexpected response status");
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
    // if (response.status === "success") { return response.product as IProductTypes }
    // if (response.message === "Product Not Found!") {
    //   return response.message as string
    // }

    // throw new Error("Unexpected response status");
  } catch (error) {
      throw new Error("Failed to fetch products");
  }
};