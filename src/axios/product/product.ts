import { ProductSchema } from "@/pages/product/formValidation";
import { axiosProcessor, rootApi } from "..";
const productApi = rootApi + "/api/v1/product";

export const createProduct= (data: ProductSchema) => {
  return axiosProcessor({
    method: "post",
    url: `${productApi}`,
    isPrivate: false,
    obj: data,
  });
};

export const updateProduct= (data: ProductSchema) => {
  return axiosProcessor({
    method: "put",
    url: `${productApi}/${data._id}`,
    isPrivate: false,
    obj: data,
  });
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

export const getAllProductsByCategory = (slug: string) => {
  console.log(slug)
  return axiosProcessor({
    method: "get",
    url: `${productApi}/category/${slug}`,
    isPrivate: false,
  });
};

export const getAProduct= ({...data}: { [key: string]: any }) => {
  return axiosProcessor({
    method: "get",
    url: `${productApi}` + '/q',
    isPrivate: false,
    obj: data,
    params: {...data}
  });
};
