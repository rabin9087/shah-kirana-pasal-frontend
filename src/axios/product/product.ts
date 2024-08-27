import { ProductSchema } from "@/pages/product/formValidation";
import { axiosProcessor, rootApi } from "..";
import { IProductTypes } from "@/types";
const productApi = rootApi + "/api/v1/product";

export const createProduct = async(data: ProductSchema) => {
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

export const updateProduct = async(data: ProductSchema) => {
  try {
     const response = await axiosProcessor({
    method: "put",
    url: `${productApi}/${data._id}`,
    isPrivate: false,
    obj: data,
     });
    return response.product
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
